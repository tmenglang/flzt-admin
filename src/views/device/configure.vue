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
        prop="create_time" 
        label="更新时间">
      </el-table-column>
      <el-table-column
        prop="device_code" 
        label="货柜编号">
      </el-table-column>
      <el-table-column
        prop="device_name" 
        label="货柜名称">
      </el-table-column>
      <el-table-column
        prop="create_operator" 
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="所属商家">
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
    
    <el-dialog title="日志详情" :visible.sync="dialogDetailVisible">
      <div class="log-detail">
        <p>设备号：{{detail.device_code}}</p>
        <p>设备名称：{{detail.device_name}}</p>
        <p>接口ip：{{detail.netIp}}</p>
        <p>接口密钥：{{detail.netKey}}</p>
        <p>心跳ip：{{detail.hostIp}}</p>
        <p>mqtt密钥：{{detail.mqttKey}}</p>
        <p>mqtt port：{{detail.port}}</p>
        <p>mqtt账户：{{detail.userName}}</p>
        <p>mqtt密码：{{detail.password}}</p>
        <p>心跳间隔：{{detail.sendHeartPackTime}}</p>
        <p>关门检测时间：{{detail.checkHardTimeClosed}}</p>
        <p>开门检测时间：{{detail.checkHardTimeOpened}}</p>
        <p>购物开门声音提示：{{detail.openDoorVoice}}</p>
        <p>购物关门声音提示：{{detail.closeDoorVoice}}</p>
        <p>理货开门声音提示：{{detail.adminOpenDoorVoice}}</p>
        <p>理货关门声音提示：{{detail.adminCloseDoorVoice}}</p>
        <p>将设备设置成无效：{{detail.deviceIsError}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetailVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择货柜" :visible.sync="dialogTableVisible">
      <el-row>
        <el-col :span="12"><div>已选 {{selectedAmount}} </div></el-col>
        <el-col :span="12"><div style="text-align: right;"><el-input v-model="deviceSearchQuery.device_code" placeholder="货柜编号" style="width: 300px;" /><el-button type="primary" @click="getDeviceList()">确 定</el-button></div></el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="deviceData"
        height="300"
        border  
        v-loading="deviceLoading" 
        @selection-change="handleSelectionChange" 
        style="width: 100%; margin-top: 20px;">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
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
          label="所属公司">
        </el-table-column>
      </el-table>
      <el-row>
        <el-col :span="24">
          <pagination class="fr" v-show="device_total>0" :total="device_total" :page.sync="deviceQuery.page_index" :limit.sync="deviceQuery.page_size" @pagination="getDeviceList" />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="selectDevice()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 90%; margin-left:50px;">
        <el-form-item label="选择货柜" prop="device_code">
          <el-button type="primary" @click="openDeviceList()">请选择货柜</el-button>
          <el-input
            type="textarea"
            :rows="2"
            class="text-area" 
            placeholder="请选择货柜"
            v-model="temp.device_code">
          </el-input>
        </el-form-item>
        <el-divider content-position="left">参数配置</el-divider>
        <el-form-item label="接口ip" prop="netIp">
          <el-input v-model="temp.netIp" placeholder="请输入接口ip" />
        </el-form-item>
        <el-form-item label="接口密钥" prop="netKey">
          <el-input v-model="temp.netKey" placeholder="请输入接口密钥" />
        </el-form-item>
        <el-form-item label="心跳ip" prop="hostIp">
          <el-input v-model="temp.hostIp" placeholder="请输入心跳ip" />
        </el-form-item>
        <el-form-item label="mqtt密钥" prop="mqttKey">
          <el-input v-model="temp.mqttKey" placeholder="请输入mqtt密钥" />
        </el-form-item>
        <el-form-item label="mqtt port" prop="port">
          <el-input v-model="temp.port" placeholder="请输入mqtt port" />
        </el-form-item>
        <el-form-item label="mqtt账户" prop="userName">
          <el-input v-model="temp.userName" placeholder="请输入mqtt账户" />
        </el-form-item>
        <el-form-item label="mqtt密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入mqtt密码" />
        </el-form-item>
        <el-form-item label="心跳间隔" prop="sendHeartPackTime">
          <el-input v-model="temp.sendHeartPackTime" placeholder="请输入心跳间隔" />
        </el-form-item>
        <el-form-item label="关门检测时间" prop="checkHardTimeClosed">
          <el-input v-model="temp.checkHardTimeClosed" placeholder="请输入关门检测时间" />
        </el-form-item>
        <el-form-item label="开门检测时间" prop="checkHardTimeOpened">
          <el-input v-model="temp.checkHardTimeOpened" placeholder="请输入开门检测时间" />
        </el-form-item>
        <el-form-item label="购物开门声音提示" prop="openDoorVoice">
          <el-input v-model="temp.openDoorVoice" placeholder="请输入购物开门声音提示" />
        </el-form-item>
        <el-form-item label="购物关门声音提示" prop="closeDoorVoice">
          <el-input v-model="temp.closeDoorVoice" placeholder="请输入购物关门声音提示" />
        </el-form-item>
        <el-form-item label="理货开门声音提示" prop="adminOpenDoorVoice">
          <el-input v-model="temp.adminOpenDoorVoice" placeholder="请输入理货开门声音提示" />
        </el-form-item>
        <el-form-item label="理货关门声音提示" prop="adminCloseDoorVoice">
          <el-input v-model="temp.adminCloseDoorVoice" placeholder="请输入理货关门声音提示" />
        </el-form-item>
        <el-form-item label="将设备设置成无效" prop="deviceIsError">
          <el-select v-model="temp.deviceIsError" placeholder="设备设置" clearable style="width: 150px" class="filter-item">
              <el-option v-for="(item, index) in deviceIsError" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="createData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deviceConf, deviceList, deviceAddconf } from '@/api/device'
import { merchantList } from '@/api/merchant'
import Pagination from '@/components/Pagination'
export default {
  name: 'Configure',
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
      dialogTableVisible: false,
      listQuery: {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      },
      searchQuery: {
        device_code: '',
        company_id: '',
        start_time: '',
        end_time: ''
      },
      deviceData: [],
      selectedAmount: 0,
      deviceKey: 0,
      device_total: 0,
      deviceLoading: true,
      deviceQuery: {
        page_size: 10000,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      },
      deviceSearchQuery: {
        device_code: ''
      },
      multipleSelection: [],
      options: [],
      detail: {},
      deviceIsError: [{value: 0, label: '无效'}, {value: 1, label: '有效'}],
      temp: {
        device_code: '',
        netIp: '',
        netKey: '',
        hostIp: '',
        mqttKey: '',
        port: '',
        userName: '',
        password: '',
        sendHeartPackTime: '',
        checkHardTimeClosed: '',
        checkHardTimeOpened: '',
        openDoorVoice: '',
        closeDoorVoice: '',
        adminOpenDoorVoice: '',
        adminCloseDoorVoice: '',
        deviceIsError: ''
      },
      dialogDetailVisible: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '配置详情',
        create: '新增配置'
      },
      rules: {
        device_code: [{ required: true, message: '请选择货柜', trigger: 'blur' }]
      },
      device_format: [],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    openDeviceList() {
      this.dialogTableVisible = true;
      if (this.device_total === 0) {
        this.getDeviceList();
      } else {
        this.toggleSelection(this.multipleSelection);
      }
    },
    getDeviceList() {
      this.deviceLoading = true;
      let data = this.deviceQuery;
      data.search = JSON.stringify(this.deviceSearchQuery);
      deviceList(data).then(res => {
        this.deviceLoading = false;
        this.deviceData = res.data.list;
        this.device_total = res.data.total;
      });
    },
    selectDevice() {
      let arr = [];
      if (this.selectedAmount > 0) {
        this.multipleSelection.forEach(v => {
          arr.push(v.device_code);
        })
        this.temp.device_code = arr.join(',');
      } else {
        this.temp.device_code = '';
      }
      this.dialogTableVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectedAmount = val.length;
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
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
      deviceConf(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    resetTemp() {
      this.temp = {
        device_code: '',
        netIp: '',
        netKey: '',
        hostIp: '',
        mqttKey: '',
        port: '',
        userName: '',
        password: '',
        sendHeartPackTime: '',
        checkHardTimeClosed: '',
        checkHardTimeOpened: '',
        openDoorVoice: '',
        closeDoorVoice: '',
        adminOpenDoorVoice: '',
        adminCloseDoorVoice: '',
        deviceIsError: ''
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
          this.btnLoading = true;
          deviceAddconf(this.temp).then(() => {
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
    handleDetail(row) {
      this.detail = Object.assign({}, row) // copy obj
      this.dialogDetailVisible = true;
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
      deviceConf(data).then(res => {
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
  .text-area .el-textarea__inner{
    margin-top: 10px;
  }
</style>