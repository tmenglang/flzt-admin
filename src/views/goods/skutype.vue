<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchQuery.name" placeholder="分类名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" @click="handleFilter">
        筛选
      </el-button>
      <el-button class="filter-item" type="default" @click="handleReset">
        重置
      </el-button>
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="default" @click="handleDownload">
        导出
      </el-button> -->
      <el-button class="filter-item" style="margin-left: 10px; float: right;" type="primary" icon="el-icon-edit" @click="handleCreate('two')">
        新增二级分类
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px; float: right;" type="primary" icon="el-icon-edit" @click="handleCreate('')">
        新增一级分类
      </el-button>
    </div>
    <el-table
        :data="tableData"
        style="width: 100%; margin-top: 20px;" 
        row-key="id" 
        border 
        default-expand-all 
        v-loading="listLoading" 
        :tree-props="{children: 'children'}">
        <el-table-column
        prop="name"
        label="分类名称">
        </el-table-column>
        <el-table-column
        prop="id"
        label="分类编号">
        </el-table-column>
        <el-table-column
        prop="parent_id"
        label="分类等级">
            <template slot-scope="scope">
                <span>{{scope.row.parent_id == 0 ? '一级' : '二级'}}</span>
            </template>
        </el-table-column>
        <el-table-column
        prop="state"
        label="状态">
            <template slot-scope="scope">
                <span>{{state[scope.row.state]}}</span>
            </template>
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
            <!-- <el-button
                size="mini"
                @click="handleDelete(scope.row)">删除</el-button> -->
            </template>
        </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="temp.state" class="filter-item" placeholder="请选择">
            <el-option v-for="item in state_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="child" label="一级分类" prop="parent_id">
          <el-select v-model="temp.parent_id" class="filter-item" placeholder="请选择">
            <el-option v-for="item in parent_format" :key="item.value" :label="item.label" :value="item.value" />
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
import { skutypeList, skutypeUpdate } from '@/api/goods'
import Pagination from '@/components/Pagination'
export default {
  name: 'Skutype',
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
        name: ''
      },
      state: ["删除", "有效"],
      state_format: [{label: '有效', value: 1}, {label: '删除', value: 0}],
      parent_format: [],
      temp: {
        id: undefined,
        name: '',
        state: '',
        parent_id: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑分类',
        create: '新增分类'
      },
      dialogPvVisible: false,
      child: false,
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    expandAll() {
      const els = this.$el.getElementsByClassName('el-table__expand-icon')
      for (let i = 0; i < els.length; i++) {
        els[i].click()
      }
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      skutypeList(data).then(res => {
        this.listLoading = false;
        let list = res.data.list;
        let arr = [];
        list.forEach(v => {
            // if (v.child_list.length > 0) {
            //     v.hasChildren = true;
            // }
            v.children = v.child_list;
            arr.push({label: v.name, value: v.id})
        });
        this.parent_format = arr;
        this.tableData = list;
        this.total = res.data.total;
        setTimeout(() => {
          this.expandAll()
        }, 500);
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        parent_id: '',
        state: ''
      }
    },
    handleCreate(two) {
      if (two) {
          this.child = true;
      } else {
          this.child = false;
      }
      console.log(this.child);
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
          skutypeUpdate(this.temp).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.child = false;
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
      if (row.parent_id != 0) {
          this.child = true;
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          const tempData = Object.assign({}, this.temp)
          skutypeUpdate(tempData).then(() => {
            this.btnLoading = false;
            this.getList();
            this.child = false;
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
    // handleDelete(row) {
    //     console.log(row);
    // },
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      this.searchQuery = {
        name: '',
      }
      this.getList()
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
  .img {
    width: 50px;
    height: 50px;
  }
  .fr {
    float: right;
  }
</style>