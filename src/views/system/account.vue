<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="searchQuery.account" placeholder="账号名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model.trim="searchQuery.user_name" placeholder="用户昵称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select
        style="width: 200px"
        v-model="searchQuery.company_id"
        filterable
        remote
        reserve-keyword
        placeholder="请输入商家名称"
        :remote-method="remoteMethod"
        :loading="selectLoading">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
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
      border  
      v-loading="listLoading" 
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="account" 
        label="账号">
      </el-table-column>
      <el-table-column
        prop="user_name" 
        label="用户昵称">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="商家">
      </el-table-column>
      <el-table-column
        prop="phone" 
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="state" 
        label="状态">
        <template slot-scope="scope">
          <span>{{ state_obj[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="role_id" 
        label="角色">
        <template slot-scope="scope">
          <span>{{ role_obj[scope.row.role_id] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div style="white-space:nowrap;">
            <el-link type="primary" @click="handleUpdate(scope.row)">编辑</el-link>
            <el-link type="primary" @click="handleDelete(scope.row)">删除</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 90%; margin-left:50px;">
        <el-form-item label="商家" prop="company_id">
          <el-select
            style="width: 200px"
            v-model="temp.company_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商家名称"
            :remote-method="remoteMethod2"
            :loading="selectLoading">
            <el-option
              v-for="item in company_id_format"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="temp.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="昵称" prop="user_name">
          <el-input v-model="temp.user_name" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="temp.state" class="filter-item" placeholder="请选择状态">
            <el-option v-for="item in state" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select v-model="temp.role_id" class="filter-item" placeholder="请选择角色">
            <el-option v-for="item in type_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="dialogStatus==='create' ? createData() : updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { userList, roleList, userUpdate } from '@/api/system'
import { merchantList } from '@/api/merchant'
import Pagination from '@/components/Pagination'
export default {
  name: 'Account',
  components: { Pagination },
  data() {
    return {
      selectLoading: false,
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
        account: '',
        user_name: '',
        company_id: ''
      },
      state: [{label: '有效', value: 1}, {label: '无效', value: 2}],
      state_obj: {
        1: '有效',
        2: '无效'
      },
      type_format: [],
      role_obj: null,
      options: [],
      company_id_format: [],
      company_id_list: [],
      temp: {
        id: undefined,
        company_id: '',
        account: '',
        phone: '',
        user_name: '',
        password: '',
        state: '',
        role_id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑账号',
        create: '新增账号'
      },
      dialogPvVisible: false,
      rules: {
        company_id: [{ required: true, message: '抢选择商家', trigger: 'change' }],
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机', trigger: 'blur' }],
        user_name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        state: [{ required: true, message: '请选择状态', trigger: 'change' }],
        role_id: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
    }
  },
  created() {
    this.getSelect();
  },
  methods: {
    getSelect() {
      merchantList({
        page_size: 100,
          page_index: 1,
          order_by: '',
          order_type: 'desc'
      }).then(res => {
        let list = [];
        res.data.list.forEach(v => {
          list.push({label: v.company_name, value: v.id});
        });
        this.company_id_format = list;
        this.company_id_list = list;
        roleList({
          page_size: 100,
          page_index: 1,
          order_by: '',
          order_type: 'desc'
        }).then(res2 => {
          let list2 = [];
          let obj = {};
          res2.data.list.forEach(v => {
            list2.push({label: v.role_name, value: v.id});
            obj[v.id] = v.role_name;
          });
          this.type_format = list2;
          this.role_obj = obj;
          this.getList()
        });
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.selectLoading = true;
        merchantList({
          page_size: 10,
          page_index: 1,
          order_by: '',
          order_type: 'desc',
          search: JSON.stringify({company_name: query})
        }).then(res => {
          this.selectLoading = false;
          let list = [];
          res.data.list.forEach(v => {
            list.push({label: v.company_name, value: v.id});
          });
          this.options = list;
        });
      } else {
        this.options = [];
      }
    },
    remoteMethod2(query) {
      if (query !== '') {
        this.selectLoading = true;
        merchantList({
          page_size: 10,
          page_index: 1,
          order_by: '',
          order_type: 'desc',
          search: JSON.stringify({company_name: query})
        }).then(res => {
          this.selectLoading = false;
          let list = [];
          res.data.list.forEach(v => {
            list.push({label: v.company_name, value: v.id});
          });
          this.company_id_format = list;
        });
      } else {
        this.company_id_format = [];
      }
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      userList(data).then(res => {
        this.listLoading = false;
        let list = res.data.list;
        if (list.length) {
          list.forEach(v => {
            v.password = '******'
          })
        }
        this.tableData = list;
        this.total = res.data.total;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        company_id: '',
        account: '',
        phone: '',
        user_name: '',
        password: '',
        state: '',
        role_id: ''
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
          this.btnLoading = true;
          userUpdate(this.temp).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          }).catch(e => {
            this.btnLoading = false;
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.company_id_format = this.company_id_list.filter(item => {
        return item.label == row.company_name;
      });
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          if (tempData.password == '******') {
            tempData.password = '';
          }
          this.btnLoading = true;
          userUpdate(tempData).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(e => {
            this.btnLoading = false;
          })
        }
      })
    },
    handleDelete(row) {
      let data = {
        id: row.id,
        state: 0
      };
      this.$confirm('确定要删除' + row.account + '用户吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        userUpdate(data).then(res => {
          this.getList();
          this.$notify({
            title: '提示',
            message: res.msg,
            type: 'success',
            duration: 2000
          })
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      
    },
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      this.searchQuery = {
        account: '',
        user_name: '',
        company_id: ''
      }
      this.getList();
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
  .el-link.el-link--primary {
    margin-right: 10px;
  }
  .myDialog .el-dialog__body {
    padding: 10px 20px;
  }
</style>