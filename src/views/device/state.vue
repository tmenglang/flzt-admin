<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="mb10">
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
                <el-date-picker
                    style="width: 150px" 
                    class="vm" 
                    v-model="searchQuery.start_time"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="异常开始时间">
                </el-date-picker>
                <el-date-picker
                    style="width: 150px" 
                    class="vm" 
                    v-model="searchQuery.end_time"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="异常结束时间">
                </el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="mb10">
                <el-select v-model="searchQuery.is_online" placeholder="在线状态" clearable style="width: 150px" class="filter-item">
                    <el-option v-for="(item, index) in is_online" :key="index" :label="item" :value="item" />
                </el-select>
                <el-select v-model="searchQuery.door_state" placeholder="门状态" clearable style="width: 150px" class="filter-item">
                    <el-option v-for="(item, index) in door_state_format" :key="index" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="searchQuery.door_state" placeholder="锁状态" clearable style="width: 150px" class="filter-item">
                    <el-option v-for="(item, index) in door_state_format" :key="index" :label="item.label" :value="item.value" />
                </el-select>
                <el-select v-model="searchQuery.net_state" placeholder="信号状态" clearable style="width: 150px" class="filter-item">
                    <el-option v-for="(item, index) in net_state_format" :key="index" :label="item.label" :value="item.value" />
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
        </el-col>
      </el-row>
      
      
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
        prop="device_type" 
        label="设备检测类型">
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
        prop="location" 
        label="地址">
      </el-table-column>
      <el-table-column
        prop="temperature" 
        label="温度">
      </el-table-column>
      <el-table-column
        prop="door_state" 
        label="门状态">
        <template slot-scope="scope">
          <span>{{ door_state[scope.row.door_state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lock_state" 
        label="锁状态">
        <template slot-scope="scope">
          <span>{{ lock_state[scope.row.lock_state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="net_state" 
        label="信号状态">
        <template slot-scope="scope">
          <span>{{ net_state[scope.row.net_state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_online" 
        label="在线状态">
        <template slot-scope="scope">
          <span>{{ is_online[scope.row.is_online] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="net_info" 
        label="网络信息">
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="130">
        <template slot-scope="scope">
            <div style="white-space:nowrap;">
              <el-link type="primary" @click="handleDetail(scope.row)">明细</el-link>
              <el-link type="primary" @click="openLock(scope.row)">开锁</el-link>
              <el-link type="primary" @click="onloadDevice(scope.row)">重启</el-link>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { deviceList, deviceState, deviceSelect, deviceOperate } from '@/api/device'
import { merchantList } from '@/api/merchant'
import Pagination from '@/components/Pagination'
export default {
  name: 'State',
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
        company_id: '',
        door_state: '',
        lock_state: '',
        net_state: '',
        is_online: '',
        start_time: '',
        end_time: ''
      },
      device_type: [],
      device_state: [],
      is_online: [],
      pay_type: [],
      device_format: [],
      device_model: [],
      device_type_format: [],
      device_state_format: [],
      device_model_format: [],
      is_online_format: [],
      pay_type_format: [],
      options: [],
      door_state: {
          0: '关',
          1: '开'
      },
      door_state_format: [
          {value: 0, label: '关'},
          {value: 1, label: '开'}
      ],
      lock_state: {
          0: '关',
          1: '开'
      },
      lock_state_format: [
          {value: 0, label: '关'},
          {value: 1, label: '开'}
      ],
      net_state: {
          0: '无',
          1: '弱',
          2: '中',
          3: '强'
      },
      net_state_format: [
          {value: 0, label: '无'},
          {value: 1, label: '弱'},
          {value: 2, label: '中'},
          {value: 3, label: '强'}
      ],
    }
  },
  created() {
    this.getSelect();
  },
  methods: {
    getSelect() {
      this.listLoading = true;
      deviceSelect({}).then(res => {
        let d = [];
        let s = [];
        let m = [];
        let i = [];
        let p = [];
        if (!res.data.device_type) {
          res.data.device_type = {
            1: "静态单门柜",
            2: "静态双门柜"
          }
        }
        for (let i in res.data.device_type) {
          d.push({label: res.data.device_type[i], value: parseInt(i)});
        }
        for (let i in res.data.device_state) {
          s.push({label: res.data.device_state[i], value: parseInt(i)});
        }
        for (let i in res.data.device_model) {
          m.push({label: res.data.device_model[i], value: parseInt(i)});
        }
        res.data.is_online.forEach((v, k) => {
          i.push({label: v, value: k});
        });
        res.data.pay_type.forEach((v, k) => {
          p.push({label: v, value: k});
        });
        this.device_type_format = d;
        this.device_state_format = s;
        this.device_model_format = m;
        this.is_online_format = i;
        this.pay_type_format = p;
        this.device_type = res.data.device_type;
        this.device_state = res.data.device_state;
        this.device_model = res.data.device_model;
        this.is_online = res.data.is_online;
        this.pay_type = res.data.pay_type;
        this.getList()
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
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      deviceState(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    
    handleDetail(row) {
      this.$router.push({path:'/device/trouble',query:{device_code:row.device_code}});
    },
    openLock(row) {
      this.$confirm('确定要对该设备进行开锁操作么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          op_type: 1,
          device_code: row.device_code
        };
        deviceOperate(data).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        });
      }).catch(() => {
        //       
      });
    },
    onloadDevice(row) {
      this.$confirm('确定要对该设备进行重启操作么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {
          op_type: 2,
          device_code: row.device_code
        };
        deviceOperate(data).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
        });
      }).catch(() => {
        //       
      });
    },
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      this.searchQuery =  {
        device_code: '',
        company_id: '',
        door_state: '',
        lock_state: '',
        net_state: '',
        is_online: '',
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
      deviceState(data).then(res => {
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
  .mb10 {
      padding-bottom: 10px;
  }
  .el-link.el-link--primary {
    margin-right: 10px;
  }
</style>