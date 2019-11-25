<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.shop_name" placeholder="门店名称/门店编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      
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
        prop="shop_id" 
        label="门店编号">
      </el-table-column>
      <el-table-column
        prop="shop_name" 
        label="门店名称">
      </el-table-column>
      <el-table-column
        prop="company_id" 
        label="商家编号">
      </el-table-column>
      <el-table-column
        prop="device_num" 
        label="货柜数量">
      </el-table-column>
      <el-table-column
        prop="state" 
        label="状态">
        <template slot-scope="scope">
          <span>{{ stateFormat[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="addr" 
        label="地址">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="门店名称" prop="shop_name">
          <el-input v-model="temp.shop_name" placeholder="请输入门店名称" />
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="temp.addr" placeholder="请输入门店地址" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create' ? createData() : updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { merchantList, shopList, shopUpdate } from '@/api/merchant'
import Pagination from '@/components/Pagination'
export default {
  name: 'Shop',
  components: { Pagination },
  data() {
    return {
      tableData: [],
      tableKey: 0,
      total: 0,
      downloadLoading: false,
      listLoading: true,
      listQuery: {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc',
        shop_name: ''
      },
      merchantState: [{label: '营业中', value: 1}, {label: '已关闭', value: 0}],
      stateFormat: {
        1: '营业中',
        0: '已关闭'
      },
      temp: {
        id: undefined,
        shop_name: '',
        addr: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑门店',
        create: '新增门店'
      },
      dialogPvVisible: false,
      rules: {
        shop_name: [{ required: true, message: '请选择门店名称', trigger: 'blur' }],
        addr: [{ required: true, message: '请输入门店地址', trigger: 'blur' }]
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      shopList(this.listQuery).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        shop_name: '',
        addr: ''
      }
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
          this.temp.id = '' // mock a id
          shopUpdate(this.temp).then(() => {
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
          const tempData = Object.assign({}, this.temp)
          shopUpdate(tempData).then(() => {
            for (const v of this.tableData) {
              if (v.id === this.temp.id) {
                const index = this.tableData.indexOf(v)
                this.tableData.splice(index, 1, this.temp)
                break
              }
            }
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
        order_type: 'desc',
        shop_name: ''
      };
      this.getList();
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
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
</style>