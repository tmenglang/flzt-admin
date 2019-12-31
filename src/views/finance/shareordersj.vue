<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="searchQuery.id" placeholder="分账号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.state" placeholder="状态" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in state_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.start_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="分账开始时间">
      </el-date-picker>
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.end_time"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="分账结束时间">
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
        prop="id" 
        label="分账号">
      </el-table-column>
      <el-table-column
        prop="day_no" 
        label="分账日期">
      </el-table-column>
      <el-table-column
        prop="share_total" 
        label="分账总额">
      </el-table-column>
      <el-table-column
        prop="wx_toal" 
        label="微信总额">
      </el-table-column>
      <el-table-column
        prop="alipay_total" 
        label="支付宝总额">
      </el-table-column>
      <el-table-column
        prop="state" 
        label="分账状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="创建时间">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
            <div style="white-space:nowrap;">
            <el-link type="primary" @click="handleDetail(scope.row)">明细</el-link>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog title="分账明细" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-form ref="dataForm" label-position="left" label-width="80px" style="width: 90%; margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单号">
                <el-input v-model="deviceSearchQuery.order_no" placeholder="订单号" @keyup.enter.native="getDeviceList" />
            </el-form-item>
          </el-col>
          <el-col :span="12"><div style="text-align: right;"><el-button type="primary" :loading="downloadLoading" @click="handleDeviceDownload()">导出</el-button></div></el-col>
        </el-row>
        <el-table
          :data="deviceData"
          border  
          v-loading="deviceLoading" 
          style="width: 100%; margin-top: 20px;">
          <el-table-column
            prop="order_no" 
            label="订单号">
          </el-table-column>
          <el-table-column
            prop="order_title" 
            label="订单信息">
          </el-table-column>
          <el-table-column
            prop="device_code" 
            label="设备编号">
          </el-table-column>
          <el-table-column
            prop="device_name" 
            label="设备名字">
          </el-table-column>
          <el-table-column
            prop="uid" 
            label="用户id">
          </el-table-column>
          <el-table-column
            prop="create_time" 
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="goods_num" 
            label="商品数量">
          </el-table-column>
          <el-table-column
            prop="total_cost" 
            label="金额">
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="24">
            <pagination class="fr" v-show="device_total>0" :total="device_total" :page.sync="deviceQuery.page_index" :limit.sync="deviceQuery.page_size" @pagination="getDeviceList" />
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { shareList, shareOrder } from '@/api/finance'
import Pagination from '@/components/Pagination'
export default {
  name: 'ShareOrderSJ',
  components: { Pagination },
  data() {
    return {
      selectLoading: false,
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
        id: '',
        state: '',
        start_time: '',
        end_time: ''
      },
      state: {
          0: '分账中',
          1: '已分账'
      },
      state_format: [{value: 0, label: '分账中'}, {value: 1, label: '已分账'}],
      dialogFormVisible: false,
      deviceData: [],
      deviceKey: 0,
      device_total: 0,
      deviceLoading: true,
      deviceQuery: {
        page_size: 10,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      },
      deviceSearchQuery: {
        share_id: '',
        order_no: ''
      },
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
      shareList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
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
        id: '',
        state: '',
        start_time: '',
        end_time: ''
      };
      this.getList();
    },
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      let data = Object.assign({}, this.listQuery);
      data.search = JSON.stringify(this.searchQuery);
      data.download = 1;
      shareList(data).then(res => {
        this.downloadLoading = false;
        var alink = document.createElement("a");
        alink.href = res;
        alink.click();
      });
    },
    handleDetail(row) {
        this.deviceSearchQuery.share_id = row.id;
        this.dialogFormVisible = true
        this.getDeviceList();
    },
    getDeviceList() {
        this.deviceLoading = true;
        let data = this.deviceQuery;
        data.search = JSON.stringify(this.deviceSearchQuery);
        shareOrder(data).then(res => {
            this.deviceLoading = false;
            this.deviceData = res.data.list;
            this.device_total = res.data.total;
        });
    },
    handleDeviceDownload() {
        this.downloadLoading = true
        let data = this.deviceQuery;
        data.search = JSON.stringify(this.deviceSearchQuery);
        data.download = 1;
        shareOrder(data).then(res => {
            this.downloadLoading = false;
            var alink = document.createElement("a");
            alink.href = res;
            alink.click();
        });
    },
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
  .myDialog .el-dialog__body {
    padding: 10px 20px;
  }
  .myDialog h3 {
    margin: 10px 0;
  }
</style>