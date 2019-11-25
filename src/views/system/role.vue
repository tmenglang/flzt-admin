<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchQuery.role_name" placeholder="角色名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        prop="role_name" 
        label="角色">
      </el-table-column>
      <el-table-column
        prop="create_operator" 
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="创建时间">
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
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="temp.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <div class="deliverySetting">
          <div class="deliverySetting-table" v-for="(item, idx) in roleList" :key="idx">
            <div class="table-body" v-for="(pro, idx2) in item.child_menu" :key="idx2">
              <div class="first-col">
                <span
                  v-if="idx2 == 0"
                  style="display: inline-block; line-height: 30px; font-size: 15px; font-weight: 700;"
                >
                  {{ item.name }}
                </span>
              </div>
              <div class="width120">
                <span style="display: inline-block; line-height: 30px; font-size: 14px; font-weight: 700;">
                  {{ pro.name }}
                </span>
              </div>
              <div class="width265">
                <el-checkbox
                  v-for="c in pro.child_menu"
                  v-model="c.checked"
                  :label="c.name"
                  :key="c.id"
                  @change="handleChecked(c)"
                >{{c.name}}</el-checkbox>
              </div>
            </div>
          </div>
        </div>
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
import { roleUpdate, roleList, roleMenu } from '@/api/system'
import Pagination from '@/components/Pagination'
export default {
  name: 'Role',
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
        role_name: ''
      },
      temp: {
        id: undefined,
        role_name: '',
        state: 1,
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '新增角色'
      },
      dialogPvVisible: false,
      rules: {
        role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      roleList: null,
      checkedRole: []
    }
  },
  created() {
    this.getMenu();
  },
  methods: {
    //操作数据
    opreationData() {
      this.roleList.forEach(c => {
        c.child_menu.forEach(p => {
          if(p.child_menu && p.child_menu.length > 0){
            p.checked = p.child_menu.every(p => p.checked)
          }
        })
        
        if(c.child_menu && c.child_menu.length > 0){
          c.checked = c.child_menu.every(p => p.checked)
        }
      })
    },
    handleChecked(item) {
      //this.opreationData()
    },
    getMenu(id) {
      let data = {};
      if (id) {
        data.role_id = id;
      }
      data.system = 1;
      roleMenu(data).then(res => {
        let list = [{id: -1, name: '后台权限', child_menu: res.data[0]}, {id: -2, name: '小程序', child_menu: res.data[1]}];
        this.roleList = list;
        this.roleList.forEach(v => {
          v.child_menu.forEach(k => {
            if (k.child_menu.length) {
              k.child_menu.forEach(l => {
                if (l.checked == 1) {
                  l.checked = true;
                } else {
                  l.checked = false;
                }
              })
            }
          });
        });
        if (!id) {
          this.getList();
        }
      });
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      roleList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total ? res.data.total : res.data.list.length;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        role_name: ''
      }
      this.roleList.forEach(v => {
        v.child_menu.forEach(k => {
          if (k.child_menu.length) {
            k.child_menu.forEach(l => {
              l.checked = false;
            })
          }
        });
      });
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      //this.initAreaData()
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            role_name: this.temp.role_name,
            menu_ids: this.getMenuId()
          };
          this.btnLoading = true;
          roleUpdate(tempData).then(() => {
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
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.getMenu(row.id);
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getMenuId() {
      let arr = [];
      this.roleList.forEach(v => {
        v.child_menu.forEach(k => {
          if (k.child_menu.length) {
            k.child_menu.forEach(l => {
              if (l.checked) {
                arr.push(l.id);
              }
            })
          }
        });
      });
      return arr.join(',');
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            id: this.temp.id,
            role_name: this.temp.role_name,
            menu_ids: this.getMenuId()
          };
          this.btnLoading = true;
          roleUpdate(tempData).then(() => {
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
        role_name: ''
      }
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
  .el-checkbox__label {
  padding-left: 5px;
}
.first-col {
  padding-left: 20px;
  width: 120px;
}
.deliverySetting {
  padding: 20px 0;
  position: relative;
}
.deliverySetting .el-table thead tr th {
  font-size: 14px;
}
.deliverySetting .el-table tbody tr td {
  vertical-align: baseline;
}
.deliverySetting .el-table tbody tr td p {
  line-height: 30px;
}
.deliverySetting .el-table tbody tr td .el-checkbox-group {
  display: flex;
  flex-direction: column;
}
.deliverySetting .el-table tbody tr td .el-checkbox-group label {
  line-height: 30px;
  margin-left: 0;
}
.deliverySetting .deliverySetting-table {
  font-size: 14px;
  color: #333;
}
.deliverySetting .deliverySetting-table .table-head,
.deliverySetting .deliverySetting-table .table-body {
  display: flex;
  padding: 10px 0;
}
.deliverySetting .deliverySetting-table .table-head .selection,
.deliverySetting .deliverySetting-table .table-body .selection {
  /* width: 45px; */
  text-align: center;
  line-height: 36px;
}
.deliverySetting .deliverySetting-table .table-head .width120,
.deliverySetting .deliverySetting-table .table-body .width120 {
  width: 120px;
}
/* .deliverySetting .deliverySetting-table .table-head .width265,
.deliverySetting .deliverySetting-table .table-body .width265 {
  width: 265px;
} */
.deliverySetting .deliverySetting-table .table-head {
  height: 36px;
  align-items: center;
  background-color: #e7f2ff;
}
.deliverySetting .deliverySetting-table .table-body {
  border-bottom: 1px solid #e4e4e4;
  color: #666;
}
.deliverySetting .deliverySetting-table .table-body:hover {
  background-color: #f5f7fa;
}
/* .deliverySetting .deliverySetting-table .table-body .width265 {
  display: flex;
  flex-direction: column;
} */
.deliverySetting .deliverySetting-table .table-body .width265 label {
  line-height: 30px;
  margin-left: 0;
  color: #666;
  padding: 0 5px;
}
.deliverySetting .deliverySetting-table .table-body p {
  line-height: 30px;
}
.deliverySetting .deliverySetting-btn {
  /*width: 100%;*/
  height: 59px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  top: -55px;
  right: -16px;
  z-index: 100;
}
.deliverySetting .deliverySetting-btn .tabs-btn {
  min-width: 90px;
  height: 34px;
  line-height: 32px;
  padding: 0 10px;
  color: #2387f7;
  border: solid 1px #4fa2ff;
  background-color: #e7f2ff;
  cursor: pointer;
}
.deliverySetting .deliverySetting-btn .tabs-btn:nth-of-type(2) {
  margin: 0 15px;
}
.deliverySetting .deliverySetting-btn .tabs-btn input {
  border: none;
  background: transparent;
  color: inherit;
  cursor: inherit;
  outline: none;
  margin: 0;
  padding: 0;
}
.deliverySetting .deliverySetting-btn .tabs-btn:hover {
  color: #fff;
  background-color: #2387f7;
}
.deliverySetting .setDistributorDailog .el-input {
  width: 270px;
}

</style>