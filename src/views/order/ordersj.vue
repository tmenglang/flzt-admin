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
              placeholder="开始时间">
            </el-date-picker>
            <el-date-picker
              style="width: 200px" 
              class="vm" 
              v-model="searchQuery.end_time"
              type="date"
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
        prop="operation_id" 
        label="开门单号">
      </el-table-column>
      <el-table-column
        prop="order_title" 
        label="订单信息">
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
      <el-table-column
        prop="state" 
        label="订单状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
      <h3>订单信息</h3>
      <el-row>
        <el-col :span="8"><div class="lh30">订单号：{{temp ? temp.order_no : ''}}</div></el-col>
        <el-col :span="8"><div class="lh30">开门单号：{{temp ? temp.operation_id : ''}}</div></el-col>
        <el-col :span="8"><div class="lh30">微信订单号：{{temp ? temp.pay_info.transaction_id : ''}}</div></el-col>
      </el-row>
      <el-row>
        <el-col :span="4"><div class="lh30">订单金额：{{temp ? temp.total_cost : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">商品数：{{temp ? temp.goods_num : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">状态：{{temp ? state[temp.state] : ''}}</div></el-col>
        <el-col :span="4"><div class="lh30">优惠金额：{{temp ? temp.discount : ''}}</div></el-col>
        <el-col :span="4" v-if="temp && temp.repair"><div class="lh30">补扣金额：{{temp ? temp.repair.repair_money : ''}}</div></el-col>
        <el-col :span="4" v-if="temp && temp.refund"><div class="lh30">退款金额：{{temp ? (temp.refund.refund_fee / 100).toFixed(2) : ''}}</div></el-col>
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
      <h3 v-if="temp && temp.refund_repair.length">订单关联操作</h3>
      <el-table v-if="temp && temp.refund_repair.length" border :data="temp ? temp.refund_repair : []">
        <el-table-column property="create_time" label="操作时间"></el-table-column>
        <el-table-column property="is_rr" label="调整类型"></el-table-column>
        <el-table-column property="sku_id" label="SKUID"></el-table-column>
        <el-table-column property="goods_name" label="商品名称"></el-table-column>
        <el-table-column property="sku_type_name" label="品类"></el-table-column>
        <el-table-column property="cost" label="成本"></el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
        <el-table-column property="num" label="数量"></el-table-column>
        <el-table-column property="discount" label="优惠金额"></el-table-column>
        <el-table-column property="pay_money" label="实付金额"></el-table-column>
      </el-table>
      <h3>订单关联商品</h3>
      <el-table border :data="temp ? temp.goods_details : []">
        <el-table-column property="sku_id" label="SKUID"></el-table-column>
        <el-table-column property="goods_name" label="商品名称"></el-table-column>
        <el-table-column property="sku_type_name" label="品类"></el-table-column>
        <el-table-column property="cost" label="成本"></el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
        <el-table-column property="num" label="数量"></el-table-column>
        <el-table-column property="discount" label="优惠金额"></el-table-column>
        <el-table-column property="pay_money" label="实付金额"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { orderList, orderDetails, repairDeal, refundDeal } from '@/api/order'
import { dictInfo } from '@/api/material'
import { deviceList } from '@/api/device'
import Pagination from '@/components/Pagination'
export default {
  name: 'OrderSJ',
  components: { Pagination },
  data() {
    return {
      order_state: '',
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
        device_code: '',
        order_no: '',
        // uid: '',
        phone: '',
        state: '',
        start_time: '',
        end_time: ''
      },
      state: {},
      state_format: [],
      device_format: [],
      temp: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '订单明细',
        create: ''
      },
      dialogPvVisible: false,
      multipleSelection: [],
    }
  },
  created() {
    this.getSelect();
  },
  methods: {
    getSelect() {
      dictInfo().then(res => {
        this.state = res.data.dict_order_state;
        let d = [];
        for (let i in res.data.dict_order_state) {
          d.push({label: res.data.dict_order_state[i], value: parseInt(i)});
        }
        this.state_format = d;
        this.getList()
      });
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
      orderList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    handleDetail(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      orderDetails({order_no: row.order_no}).then(res => {
        this.order_state = res.data.state;
        if (this.order_state == 1) {
          this.opDefault = true;
        }
        this.temp = res.data;
        let refund_repair = [];
        if (res.data.refund) {
          let list = res.data.refund.goods_details;
          list.forEach(v => {
            v.is_rr = '退款';
            v.create_time = res.data.refund.create_time;
          });
          refund_repair = refund_repair.concat(list);
        }
        if (res.data.repair) {
          let list = res.data.repair.goods_details;
          list.forEach(v => {
            v.is_rr = '补扣';
            v.create_time = res.data.repair.create_time;
          });
          refund_repair = refund_repair.concat(list);
        }
        this.temp.refund_repair = refund_repair;
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
      orderList(data).then(res => {
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
  .mb10 {
    padding-bottom: 10px;
  }
  .image-size {
    width: 200px;
    height: 150px;
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