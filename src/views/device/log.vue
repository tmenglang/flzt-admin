<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        style="width: 200px"
        v-model="searchQuery.device_code"
        filterable
        remote
        reserve-keyword
        placeholder="请输入货柜名称"
        :remote-method="remoteMethod3"
        :loading="selectLoading">
        <el-option
          v-for="item in device_format"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="searchQuery.device_state" placeholder="消息状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in device_state_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchQuery.msg_type" placeholder="消息类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in msg_type_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.start_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="开始时间">
      </el-date-picker>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.end_time"
        type="date"
        value-format="yyyy-MM-dd"
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
        prop="company_name" 
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
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
            <div style="white-space:nowrap;">
              <el-link type="primary" @click="handleUpdate(scope.row)">详情</el-link>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="myDialog" width="1000px">
      <div>
        <p v-for="(value, key, index) in temp.details" :key="index">{{key}}: {{value}}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deviceList, deviceLog } from '@/api/device'
import { dictInfo } from '@/api/material'
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
        msg_type: '',
        start_time: '',
        end_time: ''
      },
      device_state: {
        1: '正常',
        0: '异常'
      },
      msg_type_format: [],
      device_state_format: [{value: 1, label: '正常'}, {value: 0, label: '异常'}],
      temp: {
        details: {}
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '日志详情'
      },
      device_format: [],
    }
  },
  created() {
    this.getSelect();
  },
  methods: {
    getSelect() {
      dictInfo().then(res => {
        let d = [];
        for (let i in res.data.msg_type) {
          d.push({label: res.data.msg_type[i], value: parseInt(i)});
        }
        this.msg_type_format = d;
        this.getList()
      });
    },
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
    remoteMethod3(query) {
      if (query !== '') {
        this.selectLoading = true;
        deviceList({
          page_size: 10,
          page_index: 1,
          order_by: '',
          order_type: 'desc',
          search: JSON.stringify({device_name: query})
        }).then(res => {
          this.selectLoading = false;
          let list = [];
          res.data.list.forEach(v => {
            list.push({label: v.device_name, value: v.device_code});
          });
          this.device_format = list;
        });
      } else {
        this.device_format = [];
      }
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.details = JSON.parse(row.details)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
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
        msg_type: '',
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
  .myDialog .el-dialog__body {
    padding: 10px 20px;
  }
  .myDialog h3 {
    margin: 10px 0;
  }
</style>