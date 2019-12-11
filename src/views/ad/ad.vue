<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="searchQuery.ad_name" placeholder="广告名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="searchQuery.channel" placeholder="投放位置" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in channel_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchQuery.state" placeholder="投放状态" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in state_format" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-button class="filter-item" style="margin-left: 10px; float: right;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table
      :data="tableData"
      v-loading="listLoading" 
      border  
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="ad_name" 
        label="广告名称">
      </el-table-column>
      <el-table-column
        prop="material_num" 
        label="素材数量">
      </el-table-column>
      <el-table-column
        prop="material_size" 
        label="素材大小">
      </el-table-column>
      <el-table-column
        prop="channel" 
        label="投放渠道">
        <template slot-scope="scope">
          <span>{{ channel[scope.row.channel] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_time" 
        label="开始时间">
      </el-table-column>
      <el-table-column
        prop="end_time" 
        label="结束时间">
      </el-table-column>
      <el-table-column
        prop="state" 
        label="状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_operator" 
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="所属商家">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="white-space:nowrap;" v-if="scope.row.state == 1">
          <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
          <el-link type="primary" @click="handleUpdate(scope.row)">编辑</el-link>
          <el-link type="primary" @click="handleState(scope.row, -1)">删除</el-link>
          </div>
          <div style="white-space:nowrap;" v-if="scope.row.state == 2">
          <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
          <el-link type="primary" @click="handleUpdate(scope.row)">编辑</el-link>
          <el-link type="primary" @click="handlestate(scope.row, 3)">下线</el-link>
          </div>
          <div style="white-space:nowrap;" v-if="scope.row.state == 3">
          <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
          <el-link type="primary" @click="handleUpdate(scope.row)">编辑</el-link>
          <el-link type="primary" @click="handlestate(scope.row, 2)">下线</el-link>
          <el-link type="primary" @click="handleState(scope.row, -1)">删除</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 90%; margin-left:50px;">
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="素材名称" prop="ad_name">
          <el-input v-model="temp.ad_name" placeholder="请输入素材名称" />
        </el-form-item>
        <el-form-item label="素材名称" prop="start_time_arr">
          <el-date-picker
            v-model="temp.start_time_arr"
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="广告播放间隔" prop="pic_show_time">
          图片播放 <el-input v-model="temp.pic_show_time" placeholder="" style="width: 100px;" /> 秒后切换到下一个素材
        </el-form-item>
        <el-divider content-position="left">投放信息</el-divider>
        <el-form-item label="投放位置" prop="channel">
          <el-radio-group v-model="temp.channel">
            <el-radio v-for="(value, key, index) in channel" :key="index" :label="key">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择素材">
          <el-transfer v-model="temp.material_ids_arr" :data="materialList"></el-transfer>
        </el-form-item>
        <el-divider content-position="left">选择投放设备</el-divider>
        <el-row>
          <el-col :span="6"><div style="line-height: 40px;">已选 {{selectedAmount}} </div></el-col>
          <el-col :span="18"><div style="text-align: right;"><el-input v-model="deviceSearchQuery.device_code" placeholder="货柜编号" style="width: 300px;" /><el-button type="primary" @click="getDeviceList()">确 定</el-button></div></el-col>
        </el-row>
        <el-table
          ref="multipleTable"
          :data="deviceData"
          height="300"
          border  
          v-loading="deviceLoading" 
          @selection-change="handleSelectionChange" 
          style="width: 100%; margin-top: 10px;">
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate()">
          取消
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="dialogStatus==='create' ? createData() : createData('updata')">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="查看素材"
      :visible.sync="adMaterialDialog">
        <div v-for="(item, index) in ad_material" :key="index">
          <el-image :src="item.url" v-if="item.type == 1" style="width: 100%;"></el-image>
          <video v-if="item.type == 2" :src="item.url" controls="controls" style="width:100%;">
          您的浏览器不支持 video 标签。
          </video>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { adList, adUpdate, materialList, adMaterial, dictInfo, adDetails } from '@/api/material'
import { deviceList } from '@/api/device'
import Pagination from '@/components/Pagination'
export default {
  name: 'Ad',
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
        ad_name: '',
        channel: '',
        state: '',
        start_time: '',
        end_time: ''
      },
      state: [],
      state_format: [],
      channel_format: [{label: '小程序-banner', value: 1}, {label: '小程序-首页展示', value: 2}, {label: '小程序-开门页面展示', value: 3}, {label: '小程序-关门页面展示', value: 4}],
      channel: {},
      materialList: [],
      temp: {
        id: undefined,
        ad_name: '',
        channel: '',
        start_time_arr: [],
        pic_show_time: '',
        material_ids_arr: [],
        device_codes_arr: []
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑素材',
        create: '新增素材'
      },
      multipleSelection: [],
      dialogPvVisible: false,
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
      adMaterialDialog: false,
      ad_material: [],
      rules: {
        ad_name: [{ required: true, message: '请输入广告名称', trigger: 'blur' }],
        channel: [{ required: true, message: '请选择渠道', trigger: 'change' }],
        start_time_arr: [{ required: true, message: '请选择投放时间', trigger: 'blur' }],
        pic_show_time: [{ required: true, message: '请输入时间间隔', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getDictInfo();
  },
  methods: {
    getDictInfo() {
      dictInfo().then(res => {
        this.channel = res.data.ad_channel;
        this.state = res.data.ad_state;
        let p = [];
        let m = [];
        res.data.ad_state.forEach((v, k) => {
          p.push({label: v, value: k});
        });
        for (let i in res.data.ad_channel) {
          m.push({label: res.data.ad_channel[i], value: parseInt(i)});
        }
        this.state_format = p;
        this.channel_format = m;
        this.getMaterialList();
        this.getList();
        this.getDeviceList();
      });
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectedAmount = val.length;
      let arr = [];
      this.multipleSelection.forEach(v => {
        arr.push(v.device_code);
      });
      this.temp.device_codes_arr = arr;
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      adList(data).then(res => {
        this.listLoading = false;
        let list = res.data.list;
        this.tableData = list;
        this.total = res.data.total;
      });
    },
    getMaterialList() {
      let data = {
        page_size: 1000,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      let search = {
        name: '',
        type: '',
        state: ''
      };
      data.search = JSON.stringify(search);
      materialList(data).then(res => {
        let list = res.data.list;
        let _data = [];
        list.forEach(v => {
          _data.push({key: v.id, label: v.name, disabled: v.state == 0 ? true : false});
        });
        this.materialList = _data;
      });
    },
    cancelUpdate() {
      this.dialogFormVisible = false;
      this.resetTemp();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        ad_name: '',
        channel: '',
        start_time_arr: [],
        pic_show_time: '',
        material_ids_arr: [],
        device_codes_arr: []
      }
      this.toggleSelection();
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(updata) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //this.temp.id = '' // mock a id
          if (!this.temp.material_ids_arr.length) {
            this.$message({
              message: '请选择素材！',
              type: 'warning'
            });
            return
          }
          if (!this.temp.device_codes_arr.length) {
            this.$message({
              message: '请选择投放设备！',
              type: 'warning'
            });
            return
          }
          let data = {
            ad_name: this.temp.ad_name,
            channel: this.temp.channel,
            start_time: this.temp.start_time_arr[0],
            end_time: this.temp.start_time_arr[1],
            pic_show_time: this.temp.pic_show_time,
            material_ids: this.temp.material_ids_arr.join(','),
            device_codes: this.temp.device_codes_arr.join(',')
          };
          if (updata) {
            data.id = this.temp.id;
          }
          this.btnLoading = true;
          adUpdate(data).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: updata ? '更新成功' : '创建成功',
              type: 'success',
              duration: 2000
            });
            this.resetTemp();
          })
        }
      })
    },
    handleUpdate(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      });
      adDetails({id: row.id}).then(res => {
        let data = res.data;
        this.temp.id = data.id;
        this.temp.ad_name = data.ad_name;
        this.temp.channel = data.channel;
        this.temp.start_time_arr = [data.start_time, data.end_time];
        this.temp.pic_show_time = data.pic_show_time;
        let ml = [];
        data.material_ids.split(',').forEach(v => {
          ml.push(parseInt(v));
        });
        this.temp.material_ids_arr = ml;
        this.temp.device_code_arr = data.device_codes ? data.device_codes.split(',') : [];
        this.setMuliteData(data.device_codes);
      });
    },
    setMuliteData(str) {
      this.multipleSelection = [];
      let arr = [];
      if (str) {
        arr = str.split(',');
      }
      if (arr.length) {
        let list = []
        this.deviceData.forEach(v => {
          arr.forEach(i => {
            if (i == v.device_code) {
              list.push(v);
            }
          })
        });
        this.multipleSelection = list;
      }
      this.toggleSelection(this.multipleSelection);
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
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      };
      this.searchQuery = {
        ad_name: '',
        channel: '',
        state: '',
        start_time: '',
        end_time: ''
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
    },
    handleDetail(row) {
      let data = {
        id: row.id
      }
      adMaterial(data).then(res => {
        this.ad_material = res.data;
        this.adMaterialDialog = true;
      });
    },
    handleState(row, type) {
      let data = {
        id: row.id
      };
      let msg = '';
      switch (type) {
        case -1:
          msg = '删除';
          data.state = 0;
          break;
        case 2:
          msg = '上线';
          data.state = 2;
          break;
        case 3:
          msg = '下线';
          data.state = 3;
          break;
        default:
      }
      this.$confirm('确定对该广告进行' + msg + '操作么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adUpdate(data).then(res => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.getList();
        });
      }).catch(() => {
        //         
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
  .img {
    width: 50px;
    height: 50px;
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
  .grid-content {
    line-height: 32px;
  }
  .el-radio {
    display: block;
    margin-bottom: 10px;
  }
  .el-checkbox {
    vertical-align: top;
  }
  .el-link.el-link--primary {
    margin-right: 10px;
  }
</style>