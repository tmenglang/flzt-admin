<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchQuery.device_name" placeholder="货柜名称/货柜编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      <!-- <el-select v-model="searchQuery.pay_type" placeholder="付款方式" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in pay_type" :key="item" :label="item" :value="item" />
      </el-select> -->
      
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
        prop="company_name" 
        label="所属商家">
      </el-table-column>
      <el-table-column
        prop="location" 
        label="地址">
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
          <el-button
            size="mini"
            @click="downloadImg(scope.row)">下载二维码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-form-item label="货柜名称" prop="device_name">
          <el-input v-model="temp.device_name" placeholder="请输入货柜名称" />
        </el-form-item>
        <el-form-item label="所属商家" prop="company_id">
          <el-select
            style="width: 200px"
            v-model="temp.company_id"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商家名称"
            :remote-method="remoteMethod2"
            :loading="selectLoading">
            <el-option
              v-for="item in company_id_format"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="device_type">
          <el-select v-model="temp.device_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in device_type_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备型号" prop="device_model">
          <el-select v-model="temp.device_model" class="filter-item" placeholder="请选择">
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
          <el-select v-model="temp.province" class="filter-item" placeholder="请选择省" style="width: 120px">
            <el-option v-for="item in province_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="temp.city" class="filter-item" placeholder="请选择市" style="width: 120px">
            <el-option v-for="item in city_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="temp.area" class="filter-item" placeholder="请选择区" style="width: 120px">
            <el-option v-for="item in area_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select v-model="temp.province" class="filter-item" placeholder="请选择街道" style="width: 120px">
            <el-option v-for="item in street_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
      title="下载二维码"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
      <!-- <div id="qrcode" ref="qrcode"></div> -->
      <!-- <div id="qrcode"><el-image :src="device_img" style="width: 200px; height: 200px;"></el-image></div> -->
      <div id="qrcode">{{ device_img }}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="downs">下载</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deviceList, createDevice, updateDevice, deviceSelect, fileQrcode } from '@/api/device'
import { merchantList } from '@/api/merchant'
import Pagination from '@/components/Pagination'
import QRCode from 'qrcodejs2'
export default {
  name: 'Device',
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
        company_id: '',
        device_model: '',
        device_type: '',
        device_state: '',
        is_online: ''
        //pay_type: ''
      },
      device_type: [],
      device_state: [],
      is_online: [],
      pay_type: [],
      device_model: [],
      device_type_format: [],
      device_state_format: [],
      device_model_format: [],
      is_online_format: [],
      pay_type_format: [],
      company_id_format: [],
      options: [],
      province_format: [{value: 1, label: '广东'}],
      city_format: [{value: 1, label: '深圳'}],
      area_format: [{value: 1, label: '南山区'}],
      street_format: [{value: 1, label: '前海街道'}],
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
        update: '编辑货柜',
        create: '新增货柜'
      },
      dialogPvVisible: false,
      rules: {
        device_name: [{ required: true, message: '请输入货柜名称', trigger: 'blur' }],
        company_id: [{ required: true, message: '抢选择所属商家', trigger: 'change' }],
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
    this.getMerchant();
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
    getMerchant() {
      let params = {
        page_size: 1000,
        page_index: 1,
        order_by: '',
        order_type: 'desc',
      };
      merchantList(params).then(res => {
        let r = [];
        res.data.list.forEach(v => {
          r.push({label: v.company_name, value: v.id});
        });
        this.company_id_format = r;
        this.getSelect();
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
    remoteMethod2(query) {
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
            list.push({label: v.company_name, value: parseInt(v.id)});
          });
          this.company_id_format = list;
        });
      } else {
        this.company_id_format = [];
      }
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
        company_id: '',
        device_name: '',
        device_type: '',
        device_model: '',
        device_state: '',
        location: '',
        is_online: '',
        pay_type: ''
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
          this.temp.id = '' // mock a id
          this.btnLoading = true;
          createDevice(this.temp).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
            company_id: this.temp.company_id,
            device_name: this.temp.device_name,
            device_type: this.temp.device_type,
            device_model: this.temp.device_model,
            device_state: this.temp.device_state,
            is_online: this.temp.is_online,
            location: this.temp.location,
            pay_type: this.temp.pay_type
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
            })
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
        company_id: '',
        device_model: '',
        device_type: '',
        device_state: '',
        is_online: ''
        //pay_type: ''
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
    downloadImg(item) {
      //this.centerDialogVisible = true;
      // if (!this.qrcodeObj) {
      //   setTimeout(() => {
      //     this.qrcodeObj = new QRCode('qrcode', {
      //         width: 200, //图像宽度
      //         height: 200, //图像高度
      //         colorDark : "#000000", //前景色
      //         colorLight : "#ffffff", //背景色
      //         typeNumber:4, 
      //         correctLevel : QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      //     });
      //     this.qrCode('device_code=' + item.device_code);
      //   }, 500);
      // } else {
      //   this.qrCode('device_code=' + item.device_code);
      // }
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
    // qrCode (url) {
      
    //     this.qrcodeObj.clear() //清除二维码 
    //     this.qrcodeObj.makeCode(url) //生成另一个新的二维码
      
    // },
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