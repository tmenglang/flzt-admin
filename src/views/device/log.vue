<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchQuery.device_code" placeholder="货柜名称/货柜编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.device_state" placeholder="消息状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in device_state_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.start_time"
        type="date"
        placeholder="开始时间">
      </el-date-picker>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.end_time"
        type="date"
        placeholder="结束时间">
      </el-date-picker>
      
      <el-button class="filter-item" type="primary" @click="handleFilter">
        筛选
      </el-button>
      <el-button class="filter-item" type="default" @click="handleReset">
        重置
      </el-button>
      <el-button :loading="downloadLoading" class="filter-item" type="default" @click="handleDownload">
        导出
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px; float: right;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button> -->
    </div>
    <el-table
      :data="tableData"
      border  
      v-loading="listLoading" 
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="device_code" 
        label="货柜编号">
      </el-table-column>
      <el-table-column
        prop="device_name" 
        label="货柜名称">
      </el-table-column>
      <el-table-column
        prop="comapny_name" 
        label="所属商家">
      </el-table-column>
      <el-table-column
        prop="send_type" 
        label="上报/下发类型">
      </el-table-column>
      <el-table-column
        prop="msg_type" 
        label="消息类型">
      </el-table-column>
      <el-table-column
        prop="device_state" 
        label="消息状态">
        <template slot-scope="scope">
          <span>{{ device_state[scope.row.device_state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="error" 
        label="异常原因">
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div>
        {{temp}}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deviceLog } from '@/api/device'
import Pagination from '@/components/Pagination'
export default {
  name: 'Log',
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
        device_code: '',
        device_state: '',
        start_time: '',
        end_time: ''
      },
      device_state: {
        1: '正常',
        0: '异常'
      },
      device_state_format: [{value: 1, label: '正常'}, {value: 0, label: '异常'}],
      temp: {
        id: undefined,
        company_id: '',
        device_name: '',
        device_type: '',
        device_model: '',
        device_state: '',
        location: '',
        is_online: '',
        pay_type: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '日志详情'
      }
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
      deviceLog(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
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
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      this.searchQuery = {
        device_code: '',
        device_state: '',
        start_time: '',
        end_time: ''
      };
      this.getList();
    },
    handleDownload() {
      this.downloadLoading = true
      let data = Object.assign({}, this.listQuery);
      data.search = JSON.stringify(this.searchQuery);
      data.download = 1;
      deviceLog(data).then(res => {
        this.downloadLoading = false;
        var alink = document.createElement("a");
        alink.href = res;
        alink.click();
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
  #qrcode {
    width: 240px;
    height: 240px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #ccc;
    padding: 20px;
    margin: 20px auto;
  }
</style>