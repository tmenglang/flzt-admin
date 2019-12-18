<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        style="width: 200px"
        v-model.trim="searchQuery.company_id"
        filterable
        remote
        reserve-keyword
        placeholder="请输入商家名称"
        :remote-method="remoteMethod"
        :loading="selectLoading">
        <el-option
          v-for="item in company_id_format"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select
        style="width: 200px"
        v-model="searchQuery.device_code"
        filterable
        remote
        reserve-keyword
        placeholder="请输入货柜名称"
        :remote-method="remoteMethod2"
        :loading="selectLoading">
        <el-option
          v-for="item in device_format"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
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
      @sort-change="changeSort"
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
        prop="person_price" 
        sortable
        :sort-orders="['ascending', 'descending', null]"
        label="客单价">
      </el-table-column>
      <el-table-column
        prop="goods_num" 
        sortable
        :sort-orders="['ascending', 'descending', null]"
        label="销售量">
      </el-table-column>
      <el-table-column
        prop="cost" 
        sortable
        :sort-orders="['ascending', 'descending', null]"
        label="成本">
      </el-table-column>
      <el-table-column
        prop="sale" 
        sortable
        :sort-orders="['ascending', 'descending', null]"
        label="销售额">
      </el-table-column>
      <el-table-column
        prop="profit" 
        sortable
        :sort-orders="['ascending', 'descending', null]"
        label="毛利">
      </el-table-column>
      <el-table-column
        prop="discount" 
        sortable
        :sort-orders="['ascending', 'descending', null]"
        label="优惠金额">
      </el-table-column>
      <el-table-column
        prop="payment" 
        sortable
        :sort-orders="['ascending', 'descending', null]"
        label="实际金额">
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { merchantList } from '@/api/merchant'
import { deviceList } from '@/api/device'
import { saleDevice } from '@/api/data'
import Pagination from '@/components/Pagination'
export default {
  name: 'DataDevice',
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
        company_id: '',
        device_code: '',
        start_time: '',
        end_time: ''
      },
      company_id_format: [],
      device_format: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 从后台获取数据,重新排序
    changeSort (val) {
      console.log(val) // column: {…} order: "ascending" prop: "date"
      switch (val.order) {
        case 'ascending':
          this.listQuery.order_by = val.prop;
          this.listQuery.order_type = 'asc';
          break;
        case 'descending':
          this.listQuery.order_by = val.prop;
          this.listQuery.order_type = 'desc';
          break;
        default:
          this.listQuery.order_by = '';
          this.listQuery.order_type = 'desc';
      }
      this.listQuery.page_index = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      saleDevice(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
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
          this.company_id_format = list;
        });
      } else {
        this.company_id_format = [];
      }
    },
    remoteMethod2(query) {
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
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      this.searchQuery = {
        company_id: '',
        device_code: '',
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
      saleDevice(data).then(res => {
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