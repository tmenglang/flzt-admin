<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="mb10">
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
            <el-input v-model.trim="searchQuery.order_no" placeholder="订单号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model.trim="searchQuery.phone" placeholder="手机号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
            <el-select v-model="searchQuery.state" clearable style="width: 150px" class="filter-item" placeholder="请选择订单状态">
              <el-option v-for="item in state_format" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>
          <div>
            <el-date-picker
              style="width: 200px" 
              class="vm" 
              v-model="searchQuery.start_time"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始时间">
            </el-date-picker>
            <el-date-picker
              style="width: 200px" 
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
        prop="order_no" 
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="order_title" 
        label="订单信息">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="商家名称">
      </el-table-column>
      <el-table-column
        prop="device_code" 
        label="货柜编号">
      </el-table-column>
      <el-table-column
        prop="device_name" 
        label="货柜名字">
      </el-table-column>
      <el-table-column
        prop="uid" 
        label="用户id">
      </el-table-column>
      <el-table-column
        prop="phone" 
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="payback_time" 
        label="支付时间">
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="申请时间">
      </el-table-column>
      <el-table-column
        prop="goods_num" 
        label="商品数量">
      </el-table-column>
      <el-table-column
        prop="total_cost" 
        label="金额">
      </el-table-column>
      <el-table-column
        prop="reject_money" 
        label="申请金额">
      </el-table-column>
      <!-- <el-table-column
        prop="refund_state" 
        label="退款状态">
        <template slot-scope="scope">
          <span>{{ refund_state[scope.row.refund_state] }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="state" 
        label="退款状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operator" 
        label="操作人">
      </el-table-column>
      <el-table-column
        prop="op_time" 
        label="操作时间">
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
      <h3>退款信息</h3>
      <el-row>
        <el-col :span="24"><div class="lh30">订单号：{{temp ? temp.order_no : ''}}</div></el-col>
      </el-row>
      <el-row v-if="temp && temp.reject_state == 0">
        <el-col :span="6"><div class="lh30">订单金额：{{temp ? temp.total_cost : ''}}</div></el-col>
        <el-col :span="6"><div class="lh30">退款金额：{{temp ? temp.reject_money : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">退款商品数：{{temp ? temp.reject_num : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">状态：{{temp ? order_state[temp.state] : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">退款状态：{{temp ? state[temp.reject_state] : ''}}</div></el-col>
      </el-row>
      <el-row v-if="temp && temp.reject_state == 1">
        <el-col :span="6"><div class="lh30">订单金额：{{temp ? temp.total_cost : ''}}</div></el-col>
        <el-col :span="6"><div class="lh30">退款金额：{{temp ? temp.reject_money : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">退款商品数：{{temp ? temp.reject_num : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">状态：{{temp ? order_state[temp.state] : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">退款状态：{{temp ? state[temp.reject_state] : ''}}</div></el-col>
      </el-row>
      <el-row v-if="temp && temp.reject_state == 2">
        <el-col :span="6"><div class="lh30">订单金额：{{temp ? temp.total_cost : ''}}</div></el-col>
        <el-col :span="6"><div class="lh30">退款金额：{{temp ? temp.reject_money : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">退款商品数：{{temp ? temp.reject_num : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">状态：{{temp ? order_state[temp.state] : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">退款状态：{{temp ? state[temp.reject_state] : ''}}</div></el-col>
      </el-row>
      <div v-if="temp && temp.pic_info.show_type == 1">
      <h3>消费前</h3>
      <el-row>
        <el-col :span="6"><div><el-image 
            class="image-size"
            :src="temp ? temp.pic_info.open_pics.pic_url_o1 : ''" 
            :preview-src-list="temp ? [temp.pic_info.open_pics.pic_url_o1] : []">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image></div></el-col>
        <el-col :span="6"><div><el-image 
            class="image-size"
            :src="temp ? temp.pic_info.open_pics.pic_url_o2 : ''" 
            :preview-src-list="temp ? [temp.pic_info.open_pics.pic_url_o2] : []">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image></div></el-col>
        <el-col :span="6"><div><el-image 
            class="image-size"
            :src="temp ? temp.pic_info.open_pics.pic_url_o3 : ''" 
            :preview-src-list="temp ? [temp.pic_info.open_pics.pic_url_o3] : []">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image></div></el-col>
        <el-col :span="6"><div><el-image 
            class="image-size"
            :src="temp ? temp.pic_info.open_pics.pic_url_o4 : ''" 
            :preview-src-list="temp ? [temp.pic_info.open_pics.pic_url_o4] : []">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image></div></el-col>
      </el-row>
      <h3>消费后</h3>
      <el-row>
        <el-col :span="6"><div><el-image 
            class="image-size"
            :src="temp ? temp.pic_info.close_pics.pic_url_c1 : ''" 
            :preview-src-list="temp ? [temp.pic_info.close_pics.pic_url_c1] : []">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image></div></el-col>
        <el-col :span="6"><div><el-image 
            class="image-size"
            :src="temp ? temp.pic_info.close_pics.pic_url_c2 : ''" 
            :preview-src-list="temp ? [temp.pic_info.close_pics.pic_url_c2] : []">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image></div></el-col>
        <el-col :span="6"><div><el-image 
            class="image-size"
            :src="temp ? temp.pic_info.close_pics.pic_url_c3 : ''" 
            :preview-src-list="temp ? [temp.pic_info.close_pics.pic_url_c3] : []">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image></div></el-col>
        <el-col :span="6"><div><el-image 
            class="image-size"
            :src="temp ? temp.pic_info.close_pics.pic_url_c4 : ''" 
            :preview-src-list="temp ? [temp.pic_info.close_pics.pic_url_c4] : []">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image></div></el-col>
      </el-row>
      </div>
      <div v-if="temp && temp.pic_info.show_type == 2">
        <h3>消费视频</h3>
        <video :src="temp ? temp.pic_info.dynamic_video : ''" controls="controls" style="width:100%;">
        您的浏览器不支持 video 标签。
        </video>
      </div>
      <h3>识别结果</h3>
      <el-row>
        <el-col :span="24"><div class="lh30">{{temp ? temp.ai_result_str : ''}}</div></el-col>
      </el-row>
      <h3>关联商品</h3>
      <el-table border :data="temp ? temp.order_details : []" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" v-if="temp && temp.reject_state == 0"></el-table-column>
        <el-table-column property="sku_id" label="SKUID"></el-table-column>
        <el-table-column property="goods_name" label="商品名称"></el-table-column>
        <el-table-column property="cost" label="成本"></el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
        <el-table-column property="num" label="数量"></el-table-column>
        <el-table-column property="reject_label" label="">
          <template slot-scope="scope">
            <span style="color:red;">{{ scope.row.reject_label == 1 ? '退' : '' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <h3>退款说明</h3>
      <div class="lh30">{{temp ? temp.reason : ''}}</div>
      <div slot="footer" class="dialog-footer" v-if="temp && temp.reject_state == 0">
        <el-button :loading="btnLoading" @click="dealData('re')">
          驳回
        </el-button>
        <el-button type="primary" :loading="btnLoading" @click="dealData()">
          确认退款
        </el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import { rejectList, rejectDetails, rejectDeal } from '@/api/order'
import { merchantList } from '@/api/merchant'
import { deviceList } from '@/api/device'
import Pagination from '@/components/Pagination'
export default {
  name: 'Reject',
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
        order_no: '',
        // uid: '',
        phone: '',
        company_id: '',
        state: '',
        start_time: '',
        end_time: ''
      },
      state: {
        0: '未处理',
        1: '已处理',
        2: '已驳回'
      },
      state_format: [{label: '未处理', value: 0}, {label: '已处理', value: 1}, {label: '已驳回', value: 2}],
      refund_state: {
        0: '未退款',
        1: '已退款'
      },
      refund_state_format: [{label: '未退款', value: 0}, {label: '已退款', value: 1}],
      order_state: ["未完成", "已支付", "退款中", "已退款"],
      device_format: [],
      company_id_format: [],
      temp: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '退款详情',
        create: ''
      },
      dialogPvVisible: false,
      multipleSelection: [],
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getSelect() {
      merchantList({
        page_size: 100,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      }).then(res => {
        let list = [];
        res.data.list.forEach(v => {
          list.push({label: v.company_name, value: v.company_id});
        });
        this.company_id_format = list;
        deviceList({
          page_size: 100,
          page_index: 1,
          order_by: '',
          order_type: 'desc'
        }).then(res2 => {
          let list2 = [];
          res2.data.list.forEach(v => {
            list2.push({label: v.device_name, value: v.device_code});
          });
          this.device_format = list2;
          this.getList()
        });
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
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      rejectList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    handleDetail(row) {
      this.temp = null;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      rejectDetails({order_no: row.order_no}).then(res => {
        this.temp = res.data.order_info;
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
        device_code: '',
        order_no: '',
        // uid: '',
        phone: '',
        company_id: '',
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
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dealData(re) {
      let data = {
        order_no: this.temp.order_no
      };
      let arr = [];
      this.btnLoading = true;
      if (!re) {
        if (this.multipleSelection.length) {
          this.multipleSelection.forEach(v => {
            let has = false;
            if (arr.length) {
              arr.forEach(k => {
                if (k.sku_id == v.sku_id) {
                  has = true;
                  k.num += 1;
                }
              });
              if (!has) {
                arr.push({goods_name: v.goods_name, sku_id: v.sku_id, num: 1});
              }
            } else {
              arr.push({goods_name: v.goods_name, sku_id: v.sku_id, num: 1});
            }
          });
        }
        data.refund_info = JSON.stringify(arr);
      }
      this.$confirm('是否对该订单进行' + (re ? '驳回' : '退款') + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rejectDeal(data).then(res => {
          this.btnLoading = false;
          this.getList();
          this.dialogFormVisible = false
          this.$notify({
            title: '提示',
            message: '处理成功',
            type: 'success',
            duration: 2000
          })
        });
      }).catch(() => {
        this.btnLoading = false;    
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
  .pic_img {
    width: 100px;
    height: 100px;
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
  .myDialog .lh30 {
    line-height: 30px;
  }
  .image-size {
    width: 200px;
    height: 150px;
  }
  .mb10 {
    padding-bottom: 10px;
  }
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 30px;
  }
</style>