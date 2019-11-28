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
      <!-- <el-button :loading="downloadLoading" class="filter-item" type="default" @click="handleDownload">
        导出
      </el-button> -->
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
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">查看</el-button>
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 80%; margin-left:50px;">
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="素材名称" prop="ad_name">
          <el-input v-model="temp.ad_name" placeholder="请输入素材名称" />
        </el-form-item>
        <el-form-item label="素材名称" prop="start_time">
          <el-date-picker
            v-model="temp.start_time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="广告播放间隔" prop="pic_show_time">
          <el-input v-model="temp.pic_show_time" placeholder="" />
        </el-form-item>
        <el-divider content-position="left">投放信息</el-divider>
        <el-form-item label="投放位置" prop="channel">
          <el-radio-group v-model="temp.channel">
            <el-radio :label="1">小程序-banner</el-radio>
            <el-radio :label="2">小程序-首页展示</el-radio>
            <el-radio :label="3">小程序-开门页面展示</el-radio>
            <el-radio :label="4">小程序-关门页面展示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择素材">
          <el-transfer v-model="temp.material_ids" :data="materialList"></el-transfer>
        </el-form-item>
        <el-divider content-position="left">选择投放设备</el-divider>
        <el-row>
          <el-col :span="6"><div><el-button type="primary" plain style="margin-right: 20px;" @click="selectDeviceAll()">全选</el-button>已选 {{selectedAmount}} </div></el-col>
          <el-col :span="18"><div style="text-align: right;"><el-input v-model="deviceSearchQuery.device_code" placeholder="货柜编号" style="width: 300px;" /><el-button type="primary" @click="getDeviceList()">确 定</el-button></div></el-col>
        </el-row>
        <el-table
          :data="deviceData"
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
    <el-dialog
      title="加入我的商品"
      :visible.sync="centerDialogVisible">
      <el-form ref="addForm" :rules="add_rules" :model="temp2" label-position="left" label-width="100px" style="width: 80%; margin-left:50px;">
        <el-row>
          <el-col :span="6"><div class="grid-content"><img :src="temp2.pic1" alt="" width="100" height="100"></div></el-col>
          <el-col :span="18">
            <div class="grid-content">{{temp2.name}}</div>
            <div class="grid-content">条形码：{{temp2.bar_code}}</div>
          </el-col>
        </el-row>
        <el-form-item label="成本价" prop="cost">
          <el-input v-model="temp2.cost" placeholder="请输入成本价" />
        </el-form-item>
        <el-form-item label="销售价" prop="price">
          <el-input v-model="temp2.price" placeholder="请输入销售价" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addToGoods()">应用</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { adList, adUpdate, materialList } from '@/api/material'
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
      state: ["待上线", "已上线", "已下线"],
      state_format: [{label: '待上线', value: 0}, {label: '已上线', value: 1}, {label: '已下线', value: 2}],
      channel: {
          0: '小程序',
          1: '机顶屏',
          2: '刷脸屏'
      },
      channel_format: [{label: '小程序', value: 0}, {label: '机顶屏', value: 1}, {label: '刷脸屏', value: 2}],
      materialList: [],
      temp: {
        id: undefined,
        name: '',
        type: '',
        channel: '',
        url: ''
      },
      temp2: {
        sku_id: '',
        price: '',
        cost: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑素材',
        create: '新增素材'
      },
      dialogPvVisible: false,
      deviceData: [],
      selectedAmount: 0,
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
        device_code: ''
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入条形码', trigger: 'blur' }]
      },
      add_rules: {
        cost: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
        price: [{ required: true, message: '请输入销售价', trigger: 'blur' }]
      },
      skutype_list: [],
      centerDialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      picList: []
    }
  },
  created() {
    this.getMaterialList();
    this.getList();
    this.getDeviceList();
  },
  methods: {
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
    selectDeviceAll() {
      this.selectedAmount = this.device_total;
    },
    selectDevice() {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectedAmount = val.length;
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      adList(data).then(res => {
        this.listLoading = false;
        let list = res.data.list;
        if (list.length) {
          list.forEach(v => {
            v.srcList = [];
            v.pic1 && v.srcList.push(v.pic1);
            v.pic2 && v.srcList.push(v.pic2);
            v.pic3 && v.srcList.push(v.pic3);
          });
        }
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
          _data.push({key: v.id, label: v.name});
        });
        this.materialList = _data;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        type: '',
        channel: '',
        url: ''
      }
    },
    resetTemp2() {
      this.temp2 = {
        sku_id: '',
        cost: '',
        price: ''
      }
    },
    changeChild(id) {
      this.temp.sku_child_type = '';
      let c = [];
      this.sku_type.forEach(v => {
        if (v.id == id) {
          if (v.child_list.length) {
            v.child_list.forEach(k => {
              c.push({label: k.name, value: k.id});
            });
          }
        }
      });
      this.sku_child_format = c;
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
          //this.temp.id = '' // mock a id
          if (this.picList.length) {
            this.temp.pic1 = this.picList[0];
            this.temp.pic2 = this.picList[1] || '';
            this.temp.pic3 = this.picList[2] || '';
          }
          this.btnLoading = true;
          skuUpdate(this.temp).then(() => {
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
      this.temp2 = Object.assign({}, row) // copy obj
      this.temp2.sku_id = row.id;
      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    addToGoods() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          const tempData = {
            goods_name: this.temp2.name,
            sku_id: this.temp2.sku_id,
            cost: this.temp2.cost,
            price: this.temp2.price
          }
          this.btnLoading = true;
          goodsUpdate(tempData).then(() => {
            this.btnLoading = false;
            this.getList();
            this.centerDialogVisible = false;
            this.$notify({
              title: '提示',
              message: '添加成功',
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
    handleDownload() {
      this.downloadLoading = true
    },
    setPicList(fileList) {
      let l = [];
      if (fileList.length) {
        fileList.forEach(v => {
          l.push(v.response.data.file_path);
        });
      }
      this.picList = l;
    },
    handlePicSuccess(res, file, fileList) {
      this.setPicList(fileList);
    },
    handleRemove(file, fileList) {
      this.setPicList(fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
  .img {
    width: 50px;
    height: 50px;
  }
  .fr {
    float: right;
  } 
  .grid-content {
    line-height: 32px;
  }
</style>