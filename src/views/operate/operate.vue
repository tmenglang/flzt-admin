<template>
  <div class="app-container">
    <div class="filter-container">
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
        label="设备编码">
      </el-table-column>
      <el-table-column
        prop="device_name" 
        label="设备名称">
      </el-table-column>
      <el-table-column
        prop="device_type" 
        label="设备类型">
        <template slot-scope="scope">
          <span>{{ device_type[scope.row.device_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="device_model" 
        label="设备型号">
        <template slot-scope="scope">
          <span>{{ device_model[scope.row.device_model] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="device_state" 
        label="设备状态">
        <template slot-scope="scope">
          <span>{{ device_state[scope.row.device_state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="所属公司">
      </el-table-column>
      <el-table-column
        prop="addr" 
        label="地址">
      </el-table-column>
      <el-table-column
        prop="num" 
        label="当前数量">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
            <div style="white-space:nowrap;">
              <el-link type="primary" @click="handleDetail(scope.row)">详情</el-link>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-row>
        <el-col :span="12"><div>货柜名称：{{device_dialog_name}}</div></el-col>
        <el-col :span="12"><div>货柜编号：{{device_dialog_code}}</div></el-col>
      </el-row>
      <el-table :data="temp || []">
        <el-table-column property="sku_id" label="SKUID"></el-table-column>
        <el-table-column property="pic_url" label="商品图片">
          <template slot-scope="scope">
            <el-image 
            style="width: 50px; height: 50px"
            :src="scope.row.pic_url" 
            :preview-src-list="[scope.row.pic_url]">
          </el-image>
          </template>
        </el-table-column>
        <el-table-column property="goods_name" label="商品名称"></el-table-column>
        <el-table-column property="price" label="销售价"></el-table-column>
        <el-table-column property="now_count" label="库存"></el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { merchantList } from '@/api/merchant'
import { deviceList, deviceSelect } from '@/api/device'
import { stocksList, stocksDetails } from '@/api/operate'
import Pagination from '@/components/Pagination'
export default {
  name: 'Operate',
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
        device_code: ''
      },
      company_id_format: [],
      device_format: [],
      device_type: null,
      device_state: null,
      device_model: null,
      temp: null,
      dialogFormVisible: false,
      device_dialog_name: '',
      device_dialog_code: '',
      dialogStatus: '',
      textMap: {
        update: '库存详情',
        create: ''
      },
      dialogPvVisible: false
    }
  },
  created() {
    this.getFormat();
  },
  methods: {
    getFormat() {
      deviceSelect({}).then(res => {
        this.device_type = res.data.device_type;
        this.device_state = res.data.device_state;
        this.device_model = res.data.device_model;
        this.getList()
      });
    },
    getSelect() {
      this.listLoading = true;
      merchantList({
        page_size: 100,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      }).then(res => {
        let d = [];
        res.data.list.forEach(v => {
          d.push({label: v.company_name, value: v.id});
        });
        this.company_format = d;
        this.getDevice();
      });
    },
    getDevice() {
      let params = {
        page_size: 100,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      if (this.searchQuery.company_id !== '') {
        params.search = JSON.stringify({company_id: this.searchQuery.company_id});
      };
      deviceList(params).then(res => {
        let d = [];
        res.data.list.forEach(v => {
          d.push({label: v.device_name, value: v.device_code});
        });
        this.device_format = d;
        this.getList();
      });
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      stocksList(data).then(res => {
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
    handleDetail(row) {
      this.device_dialog_name = row.device_name;
      this.device_dialog_code = row.device_code;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      stocksDetails({device_code: row.device_code}).then(res => {
        this.temp = res.data;
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
        company_id: '',
        device_code: ''
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
      stocksList(data).then(res => {
        this.downloadLoading = false;
        var alink = document.createElement("a");
        alink.href = res;
        alink.click();
      });
    },
    handleRemove(row) {
      console.log(row);
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