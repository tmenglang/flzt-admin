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
            <el-select v-model="searchQuery.type" clearable style="width: 150px" class="filter-item" placeholder="请选择异常类型">
              <el-option v-for="item in type_format" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="searchQuery.state" clearable style="width: 150px" class="filter-item" placeholder="请选择处理状态">
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
        prop="create_time" 
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="type" 
        label="异常类型">
        <template slot-scope="scope">
          <span>{{ type[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state" 
        label="处理状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operator_user" 
        label="处理人">
      </el-table-column>
      <el-table-column
        prop="operate_time" 
        label="处理时间">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope" fixed="right">
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
      <h3>异常订单详情</h3>
      <el-row>
        <el-col :span="12"><div class="lh30">异常订单号：{{temp ? temp.operation_id : ''}}</div></el-col>
        <el-col :span="12"><div class="lh30">处理状态：{{temp ? state[temp.state] : ''}}</div></el-col>
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
      <el-row style="margin: 10px 0;">
        <el-col :span="12"><h3>关联商品</h3></el-col>
        <el-col :span="12" style="text-align: right;" v-if="temp && temp.state == 0">
          <el-select
            v-model="value"
            filterable
            remote
            reserve-keyword
            placeholder="请输入商品名称"
            :remote-method="remoteMethod3"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" @click="addToList">添加</el-button>
        </el-col>
      </el-row>
      
      <el-table border :data="temp ? temp.detect_info : []" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" v-if="temp && temp.state == 0"></el-table-column>
        <el-table-column property="sku_id" label="SKUID"></el-table-column>
        <el-table-column property="goods_name" label="商品名称"></el-table-column>
        <el-table-column property="num" label="数量"></el-table-column>
        <el-table-column property="cost" label="成本"></el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer" v-if="temp && temp.state == 0">
        <el-button @click="closeDeal()">
          关闭该单
        </el-button>
        <el-button type="primary" @click="dealData()">
          确认扣款
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { abnormalList, abnormalDetails, abnormalDeal } from '@/api/order'
import { merchantList } from '@/api/merchant'
import { deviceList } from '@/api/device'
import { goodsList } from '@/api/goods'
import Pagination from '@/components/Pagination'
export default {
  name: 'Error',
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
        type: '',
        state: '',
        start_time: '',
        end_time: ''
      },
      multipleSelection: [],
      state: {
        0: '待处理',
        1: '已处理',
      },
      state_format: [{label: '待处理', value: 0}, {label: '已处理', value: 1}],
      type: {
        1: 'ai识别疑问',
        2: '开关门数据异常'
      },
      type_format: [{label: 'ai识别疑问', value: 1}, {label: '开关门数据异常', value: 2}],
      device_format: [],
      company_id_format: [],
      temp: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '异常订单详情',
        create: ''
      },
      dialogPvVisible: false,
      options: [],
      value: '',
      loading: false,
      goods_list: []
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
    remoteMethod3(query) {
      if (query !== '') {
        this.loading = true;
        let data = {
          page_size: 10,
          page_index: 1,
          order_by: '',
          order_type: 'desc',
          search: JSON.stringify({goods_name: query, company_id: this.temp.company_id})
        };
        goodsList(data).then(res => {
          this.loading = false;
          let list = [];
          this.goods_list = res.data.list;
          res.data.list.forEach(v => {
            list.push({label: v.goods_name, value: v.sku_id});
          });
          this.options = list;
        });
      } else {
        this.options = [];
      }
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      abnormalList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    handleDetail(row) {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      abnormalDetails({operation_id: row.operation_id}).then(res => {
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
        device_code: '',
        order_no: '',
        uid: '',
        company_id: '',
        state: '',
        type: '',
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
      abnormalList(data).then(res => {
        this.downloadLoading = false;
        var alink = document.createElement("a");
        alink.href = res;
        alink.click();
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //关闭该单
    closeDeal() {
      this.btnLoading = true;
      let data = {
        operation_id: this.temp.operation_id,
        deal_result: ''
      };
      this.$confirm('是否关闭该异常订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        abnormalDeal(data).then(res => {
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
    },
    dealData() {
      let data = {
        operation_id: this.temp.operation_id
      };
      let arr = [];
      // if (this.multipleSelection.length) {
      //   this.multipleSelection.forEach(v => {
      //     arr.push({goods_name: v.goods_name, sku_id: v.sku_id, num: 1});
      //   });
      // }
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
      data.deal_result = JSON.stringify(arr);
      this.$confirm('是否对该异常订单进行扣款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        abnormalDeal(data).then(res => {
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
    },
    addToList() {
      if (this.value) {
        this.goods_list.forEach(v => {
          if (v.sku_id === this.value) {
            let obj = Object.assign({}, v);
            obj.id = this.temp.detect_info.length;
            obj.num = 1;
            this.temp.detect_info.push(obj);
          }
        });
        this.value = '';
      }
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