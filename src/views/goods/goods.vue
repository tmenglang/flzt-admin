<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchQuery.sku_id" placeholder="SKUID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-input v-model="searchQuery.bar_code" placeholder="条形码" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-input v-model="searchQuery.goods_name" placeholder="商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="searchQuery.create_operator" placeholder="添加人" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.device_type" placeholder="设备类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in device_type_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" @click="handleFilter">
        筛选
      </el-button>
      <el-button class="filter-item" type="default" @click="handleReset">
        重置
      </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="default" @click="handleDownload">
        导出
      </el-button> -->
    </div>
    <el-table
      :data="tableData"
      border  
      v-loading="listLoading" 
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="sku_id" 
        label="SKUID">
      </el-table-column>
      <el-table-column
        prop="goods_name" 
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="bar_code" 
        label="条形码">
      </el-table-column>
      <el-table-column
        prop="pic1" 
        label="商品图片">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.pic_url" class="img" /> -->
          <el-image 
            style="width: 50px; height: 50px"
            :src="scope.row.pic1" 
            :preview-src-list="scope.row.srcList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="sku_type_name" 
        label="一级分类">
      </el-table-column>
      <el-table-column
        prop="sku_child_type_name" 
        label="二级分类">
      </el-table-column>
      <el-table-column
        prop="device_type" 
        label="设备类型">
        <template slot-scope="scope">
          <span>{{ device_type[scope.row.device_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cost" 
        label="成本价格">
      </el-table-column>
      <el-table-column
        prop="price" 
        label="销售价">
      </el-table-column>
      <el-table-column
        prop="create_operator" 
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="添加时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleRemove(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-row>
          <el-col :span="6">
            <div class="grid-content"><img :src="temp.pic_url" width="100" height="100"></div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content">
              <p>{{temp.goods_name}}</p>
              <p>条形码：{{temp.bar_code}}</p>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="成本价" prop="cost">
          <el-input v-model="temp.cost" placeholder="请输入成本价" />
        </el-form-item>
        <el-form-item label="销售价" prop="price">
          <el-input v-model="temp.price" placeholder="请输入销售价" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { skuSelect, goodsList, goodsUpdate } from '@/api/goods'
import Pagination from '@/components/Pagination'
export default {
  name: 'Goods',
  components: { Pagination },
  data() {
    let checkNum = (rule,value,callback) => {
      if(isNaN(value)) {
          callback(new Error('请输入数字值'))
      } else {
          if(value < 0) {
              callback(new Error('金额不能小于0'))
          } else if(value == 0){
              callback(new Error('金额不能为0'))
          }else {
              callback()
          }
      }
    }
    return {
      btnLoading: false,
      tableData: [],
      tableKey: 0,
      total: 0,
      downloadLoading: false,
      listLoading: true,
      listQuery: {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      },
      searchQuery: {
        sku_id: '',
        // bar_code: '',
        goods_name: '',
        device_type: '',
        create_operator: ''
      },
      device_type: [],
      device_type_format: [],
      temp: {
        id: undefined,
        goods_name: '',
        shop_id: '',
        price: '',
        cost: '',
        sku_id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商品',
        create: '新增商品'
      },
      dialogPvVisible: false,
      rules: {
        price: [
          { required: true, message: '请输入销售价', trigger: 'blur' },
          { validator: checkNum, trigger: "blur" }
        ],
        cost: [
          { required: true, message: '请输入成本价', trigger: 'blur' }, 
          { validator: checkNum, trigger: "blur" }
        ]
      },
    }
  },
  created() {
    this.getSelect();
  },
  methods: {
    getSelect() {
      skuSelect({}).then(res => {
        let d = [];
        for (var i in res.data.device_type) {
          d.push({label: res.data.device_type[i], value: i});
        }
        this.device_type_format = d;
        this.device_type = res.data.device_type;
        this.getList()
      });
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      goodsList(data).then(res => {
        this.listLoading = false;
        let list = res.data.list;
        if (list.length) {
          list.forEach(v => {
            v.srcList = [];
            v.pic1 && v.srcList.push(v.pic1);
            v.pic2 && v.srcList.push(v.pic2);
            v.pic3 && v.srcList.push(v.pic3);
          });
        }
        this.tableData = list;
        this.total = res.data.total;
      });
    },
    
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            id: this.temp.id,
            goods_name: this.temp.name,
            sku_id: this.temp.sku_id,
            cost: this.temp.cost,
            price: this.temp.price
          }
          this.btnLoading = true;
          goodsUpdate(tempData).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      this.searchQuery = {
        sku_id: '',
        bar_code: '',
        name: '',
        device_type: '',
        create_operator: '',
      }
      this.getList();
    },
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
    },
    handleRemove(row) {
      this.$confirm('是否删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = {
          id: row.id,
          state: 0
        }
        goodsUpdate(tempData).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.$notify({
            title: '提示',
            message: '更新成功',
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
                 
      });
      
    }
  }
}
</script>
<style>
  .vm {
    vertical-align: top;
  }
  .pages-wrap {
    margin: 10px 0;
  }
  .fr {
    float: right;
  }
  .img {
    width: 50px;
    height: 50px;
  }
</style>