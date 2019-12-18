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
      <el-select v-model="searchQuery.error_type" placeholder="请选择故障类型" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in error_type_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.start_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="上报开始时间">
      </el-date-picker>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.end_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="上报结束时间">
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
        prop="create_time" 
        label="上报时间">
      </el-table-column>
      <el-table-column
        prop="error_time" 
        label="故障时长（s）">
      </el-table-column>
      <el-table-column
        prop="error_type" 
        label="故障类型">
      </el-table-column>
      <el-table-column
        prop="details" 
        label="故障详情">
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { deviceList, deviceError } from '@/api/device'
import { dictInfo } from '@/api/material'
import Pagination from '@/components/Pagination'
export default {
  name: 'Trouble',
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
        device_code: '',
        error_type: '',
        start_time: '',
        end_time: ''
      },
      selectLoading: false,
      device_format: [],
      error_type: {},
      error_type_format: []
    }
  },
  created() {
    this.searchQuery.device_code = this.$route.query.device_code ? this.$route.query.device_code : '';
    this.getDictInfo();
    this.getList();
  },
  methods: {
    getDictInfo() {
      let that = this;
      dictInfo().then(res => {
        let di = res.data;
        this.error_type = di.device_abnormal_type;
        let list = [];
        for (let i in di.device_abnormal_type) {
          list.push({label: di.device_abnormal_type[i], value: parseInt(i)});
        }
        this.error_type_format = list;
        that.getList();
      });
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      deviceError(data).then(res => {
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
      deviceError(data).then(res => {
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