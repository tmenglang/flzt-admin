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
      <el-select v-model="searchQuery.device_type" placeholder="货柜类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in device_type_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchQuery.device_model" placeholder="货柜型号" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in device_model_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchQuery.device_state" placeholder="货柜状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in device_state_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchQuery.is_online" placeholder="在线状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in is_online" :key="item" :label="item" :value="item" />
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
        label="货柜编号">
      </el-table-column>
      <el-table-column
        prop="device_name" 
        label="货柜名称">
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
        prop="is_online" 
        label="在线状态">
        <template slot-scope="scope">
          <span>{{ is_online[scope.row.is_online] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_type" 
        label="支付方式">
        <template slot-scope="scope">
          <span>{{ pay_type[scope.row.pay_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="location" 
        label="地址">
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="创建时间">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <div>
              <el-link type="primary" @click="handleUpdate(scope.row)">编辑</el-link>
              <el-link type="primary" @click="handleLook(scope.row)">二维码</el-link>
              <el-link type="primary" @click="downloadImg(scope.row)" style="margin-top: 10px;">下载二维码</el-link>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 90%; margin-left:50px;">
        <el-form-item label="货柜名称" prop="device_name">
          <el-input v-model="temp.device_name" placeholder="请输入货柜名称" />
        </el-form-item>
        <el-form-item label="设备类型" prop="device_type">
          <el-select v-model="temp.device_type" class="filter-item" disabled placeholder="请选择">
            <el-option v-for="item in device_type_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="device_model">
          <el-select v-model="temp.device_model" class="filter-item" disabled placeholder="请选择">
            <el-option v-for="item in device_model_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" prop="device_state">
          <el-select v-model="temp.device_state" class="filter-item" placeholder="请选择">
            <el-option v-for="item in device_state_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否在线" prop="is_online">
          <el-select v-model="temp.is_online" class="filter-item" placeholder="请选择">
            <el-option v-for="item in is_online_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="pay_type">
          <el-select v-model="temp.pay_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in pay_type_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="货柜地址">
          <area-select type='text' v-model='temp.selected' :data='$pcaa' :level='3' @change="bindChange"></area-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="location">
          <el-input v-model="temp.location" placeholder="请输入货柜地址" />
        </el-form-item>
        <el-form-item label="设备使用时间" prop="use_start_time">
          <el-date-picker
            style="width: 150px" 
            class="vm" 
            v-model="temp.use_start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="开始时间">
          </el-date-picker> 至
          <el-date-picker
            style="width: 150px" 
            class="vm" 
            v-model="temp.use_end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
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
    <el-dialog
      title="设备二维码"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <!-- <div id="qrcode" ref="qrcode"></div> -->
      <div id="qrcode" ref="qrcode"><el-image :src="device_img" style="width: 200px; height: 200px;"></el-image></div>
      <!-- <div id="qrcode">{{ device_img }}</div> -->
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="downs">下载</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import { deviceList, createDevice, updateDevice, deviceSelect, fileQrcode } from '@/api/device'
import { dictInfo } from '@/api/material'
import { merchantList } from '@/api/merchant'
import Pagination from '@/components/Pagination'
import QRCode from 'qrcodejs2'
export default {
  name: 'DeviceSJ',
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
        device_name: '',
        device_model: '',
        device_type: '',
        device_state: '',
        is_online: ''
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
      temp: {
        id: undefined,
        device_name: '',
        device_type: '',
        device_model: '',
        device_state: '',
        selected: [],
        location: '',
        is_online: '',
        pay_type: '',
        use_start_time: '',
        use_end_time: '',
        remarks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑货柜',
        create: '新增货柜'
      },
      dialogPvVisible: false,
      rules: {
        device_name: [{ required: true, message: '请输入货柜名称', trigger: 'blur' }],
        device_type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
        device_model: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
        device_state: [{ required: true, message: '请选择设备状态', trigger: 'change' }],
        is_online: [{ required: true, message: '请选择是否在线', trigger: 'change' }],
        pay_type: [{ required: true, message: '请选择付款方式', trigger: 'change' }]
      },
      qrcode: null,
      centerDialogVisible: false,
      device_img: ''
    }
  },
  created() {
    this.getSelect();
  },
  methods: {
    getSelect() {
      this.listLoading = true;
      dictInfo().then(res => {
        let d = [];
        let s = [];
        let m = [];
        let i = [];
        let p = [];
        for (let i in res.data.dict_device_type) {
          d.push({label: res.data.dict_device_type[i], value: parseInt(i)});
        }
        for (let i in res.data.dict_device_state) {
          s.push({label: res.data.dict_device_state[i], value: parseInt(i)});
        }
        for (let i in res.data.dict_device_model) {
          m.push({label: res.data.dict_device_model[i], value: parseInt(i)});
        }
        res.data.dict_device_online.forEach((v, k) => {
          i.push({label: v, value: k});
        });
        res.data.dict_pay_type.forEach((v, k) => {
          p.push({label: v, value: k});
        });
        this.device_type_format = d;
        this.device_state_format = s;
        this.device_model_format = m;
        this.is_online_format = i;
        this.pay_type_format = p;
        this.device_type = res.data.dict_device_type;
        this.device_state = res.data.dict_device_state;
        this.device_model = res.data.dict_device_model;
        this.is_online = res.data.dict_device_online;
        this.pay_type = res.data.dict_pay_type;
        this.getList()
      });
    },
    bindChange(e) {
      this.temp.selected = e
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      deviceList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        device_name: '',
        device_type: '',
        device_model: '',
        device_state: '',
        selected: [],
        location: '',
        is_online: '',
        pay_type: '',
        use_start_time: '',
        use_end_time: '',
        remarks: ''
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.selected = [row.province, row.city, row.area, row.street];
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            id: this.temp.id,
            device_name: this.temp.device_name,
            device_type: this.temp.device_type,
            device_model: this.temp.device_model,
            device_state: this.temp.device_state,
            is_online: this.temp.is_online,
            location: this.temp.location,
            pay_type: this.temp.pay_type,
            province: this.temp.selected[0],
            city: this.temp.selected[1],
            area: this.temp.selected[2],
            street: this.temp.selected[3],
            use_start_time: this.temp.use_start_time,
            use_end_time: this.temp.use_end_time
          }
          this.btnLoading = true;
          updateDevice(tempData).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
            this.resetTemp();
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
      this.searchQuery =  {
        device_name: '',
        device_model: '',
        device_type: '',
        device_state: '',
        is_online: ''
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
      deviceList(data).then(res => {
        this.downloadLoading = false;
        var alink = document.createElement("a");
        alink.href = res;
        alink.click();
      });
    },
    handleLook(item) {
      this.centerDialogVisible = true;
      let data = {
        device_code: item.device_code
      };
      fileQrcode(data).then(res => {
        this.device_img = res.split('src="')[1].split('" />')[0];
      });
    },
    downloadImg(item) {
      let data = {
        device_code: item.device_code
      };
      fileQrcode(data).then(res => {
        this.device_img = res;
        var alink = document.createElement("a");
        alink.href = res.split('src="')[1].split('" />')[0];
        alink.download = item.device_code; //图片名
        alink.click();
      });
    },
    downs() {
      var alink = document.createElement("a");
      alink.href = this.$refs.qrcode.children[1].src;
      alink.download = this.$refs.qrcode.title.split('=')[1]; //图片名
      alink.click();
      this.centerDialogVisible = false
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
  #qrcode {
    width: 240px;
    height: 240px;
    overflow: hidden;
    background: #fff;
    border: 1px solid #ccc;
    padding: 20px;
    margin: 20px auto;
  }
  .area-select-wrap .area-select {
    height: 40px;
  }
  .area-select .area-selected-trigger {
    line-height: 20px;
  }
  .el-link.el-link--primary {
    margin-right: 10px;
  }
</style>