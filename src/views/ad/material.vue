<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchQuery.name" placeholder="素材名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      
      <el-select v-model="searchQuery.type" placeholder="素材类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in type_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchQuery.state" placeholder="素材状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in state_format" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-button class="filter-item" style="margin-left: 10px; float: right;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table
      :data="tableData"
      v-loading="listLoading" 
      border  
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="url" 
        label="素材">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.pic1" class="img" /> -->
          <el-image 
            style="width: 50px; height: 50px"
            :src="scope.row.url" 
            :preview-src-list="scope.row.srcList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="name" 
        label="素材名称">
      </el-table-column>
      <el-table-column
        prop="type" 
        label="素材类型">
        <template slot-scope="scope">
          <span>{{ type[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="channel" 
        label="投放渠道">
      </el-table-column>
      <el-table-column
        prop="state" 
        label="状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="create_operator" 
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="公司名字">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">查看</el-button>
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">通过</el-button>
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 80%; margin-left:50px;">
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入素材名称" />
        </el-form-item>
        <el-form-item label="素材类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择" @change="changeChild(temp.type)">
            <el-option v-for="item in type_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="投放位置" prop="channel">
          <el-radio-group v-model="temp.channel">
            <el-radio :label="1">小程序-banner</el-radio>
            <el-radio :label="2">小程序-首页展示</el-radio>
            <el-radio :label="3">小程序-开门页面展示</el-radio>
            <el-radio :label="4">小程序-关门页面展示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="素材">
          <el-upload
            action="https://portal.fsylit.com/file/upload"
            list-type="picture-card" 
            :on-preview="handlePictureCardPreview"
            :on-success="handlePicSuccess" 
            accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.BMP" 
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="createData()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="加入我的商品"
      :visible.sync="centerDialogVisible">
      <el-form ref="addForm" :rules="add_rules" :model="temp2" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-row>
          <el-col :span="6"><div class="grid-content"><img :src="temp2.pic1" alt="" width="100" height="100"></div></el-col>
          <el-col :span="18">
            <div class="grid-content">{{temp2.name}}</div>
            <div class="grid-content">条形码：{{temp2.bar_code}}</div>
          </el-col>
        </el-row>
        <el-form-item label="成本价" prop="cost">
          <el-input v-model="temp2.cost" placeholder="请输入成本价" />
        </el-form-item>
        <el-form-item label="销售价" prop="price">
          <el-input v-model="temp2.price" placeholder="请输入销售价" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addToGoods()">应用</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { materialList, materialUpdate } from '@/api/material'
import Pagination from '@/components/Pagination'
export default {
  name: 'Material',
  components: { Pagination },
  data() {
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
        name: '',
        type: '',
        state: ''
      },
      state: ["待审批", "已驳回", "已审批"],
      state_format: [{label: '待审批', value: 0}, {label: '已驳回', value: 1}, {label: '已审批', value: 2}],
      type: {
          0: '图片',
          1: '视频'
      },
      type_format: [{label: '图片', value: 0}, {label: '视频', value: 1}],
      temp: {
        id: undefined,
        name: '',
        type: '',
        channel: '',
        url: ''
      },
      temp2: {
        sku_id: '',
        price: '',
        cost: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑素材',
        create: '新增素材'
      },
      dialogPvVisible: false,
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入条形码', trigger: 'blur' }]
      },
      add_rules: {
        cost: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
        price: [{ required: true, message: '请输入销售价', trigger: 'blur' }]
      },
      skutype_list: [],
      centerDialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      picList: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      materialList(data).then(res => {
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        type: '',
        channel: '',
        url: ''
      }
    },
    resetTemp2() {
      this.temp2 = {
        sku_id: '',
        cost: '',
        price: ''
      }
    },
    changeChild(id) {
      this.temp.sku_child_type = '';
      let c = [];
      this.sku_type.forEach(v => {
        if (v.id == id) {
          if (v.child_list.length) {
            v.child_list.forEach(k => {
              c.push({label: k.name, value: k.id});
            });
          }
        }
      });
      this.sku_child_format = c;
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //this.temp.id = '' // mock a id
          if (this.picList.length) {
            this.temp.pic1 = this.picList[0];
            this.temp.pic2 = this.picList[1] || '';
            this.temp.pic3 = this.picList[2] || '';
          }
          this.btnLoading = true;
          skuUpdate(this.temp).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp2 = Object.assign({}, row) // copy obj
      this.temp2.sku_id = row.id;
      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    addToGoods() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            goods_name: this.temp2.name,
            sku_id: this.temp2.sku_id,
            cost: this.temp2.cost,
            price: this.temp2.price
          }
          this.btnLoading = true;
          goodsUpdate(tempData).then(() => {
            this.btnLoading = false;
            this.getList();
            this.centerDialogVisible = false;
            this.$notify({
              title: '提示',
              message: '添加成功',
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
        name: '',
        type: '',
        state: ''
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
    },
    setPicList(fileList) {
      let l = [];
      if (fileList.length) {
        fileList.forEach(v => {
          l.push(v.response.data.file_path);
        });
      }
      this.picList = l;
    },
    handlePicSuccess(res, file, fileList) {
      this.setPicList(fileList);
    },
    handleRemove(file, fileList) {
      this.setPicList(fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
  .img {
    width: 50px;
    height: 50px;
  }
  .fr {
    float: right;
  } 
  .grid-content {
    line-height: 32px;
  }
</style>