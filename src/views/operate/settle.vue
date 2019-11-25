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
        :remote-method="remoteMethod2"
        :loading="selectLoading">
        <el-option
          v-for="item in device_format"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="searchQuery.manage_user" placeholder="理货员" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-date-picker
        style="width: 150px" 
        class="vm" 
        v-model="searchQuery.start_time"
        type="date"
        placeholder="开始时间">
      </el-date-picker>
      <el-date-picker
        style="width: 150px" 
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
    <el-table
      :data="tableData"
      border  
      v-loading="listLoading" 
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="id" 
        label="理货单">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="公司名称">
      </el-table-column>
      <el-table-column
        prop="device_code" 
        label="设备编号">
      </el-table-column>
      <el-table-column
        prop="device_name" 
        label="设备名字">
      </el-table-column>
      <el-table-column
        prop="manage_user" 
        label="理货员">
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="理货时间">
      </el-table-column>
      <el-table-column
        prop="up_sku_num" 
        label="上架sku数量">
      </el-table-column>
      <el-table-column
        prop="up_goods_num" 
        label="上架商品数量">
      </el-table-column>
      <el-table-column
        prop="down_sku_num" 
        label="下架sku数量">
      </el-table-column>
      <el-table-column
        prop="down_goods_num" 
        label="下架商品数量">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" custom-class="myDialog">
      <h3>理货前</h3>
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
      <h3>理货后</h3>
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
      <h3>理货商品</h3>
      <el-table border :data="temp ? temp.goods_details : []">
        <el-table-column property="sku_id" label="商品品类id"></el-table-column>
        <el-table-column property="goods_name" label="商品名称"></el-table-column>
        <el-table-column property="action" label="操作"></el-table-column>
        <el-table-column property="num" label="数量"></el-table-column>
        <el-table-column property="create_time" label="创建时间"></el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { manageList, manageDetails } from '@/api/operate'
import { deviceList } from '@/api/device'
import Pagination from '@/components/Pagination'
export default {
  name: 'Settle',
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
        device_code: '',
        manage_user: '',
        start_time: '',
        end_time: ''
      },
      device_format: [],
      temp: null,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '理货详情',
        create: ''
      },
      dialogPvVisible: false
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getSelect() {
      deviceList({
        page_size: 100,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      }).then(res => {
        let list = [];
        res.data.list.forEach(v => {
          list.push({label: v.device_name, value: v.device_code});
        });
        this.device_format = list;
        this.getList()
      });
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      manageList(this.listQuery).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
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
    resetTemp() {
      this.temp = null
    },
    handleDetail(row) {
      this.resetTemp();
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      manageDetails({operation_id: row.operation_id}).then(res => {
        this.temp = res.data;
      });
    },
    handleReset() {
      this.listQuery = {
        page_size: 20,
        page_index: 1,
        order_by: '',
        order_type: 'desc',
        name: '',
        bar_code: '',
        sku_type: '',
        device_type: ''
      };
      this.searchQuery = {
        device_code: '',
        manage_user: '',
        start_time: '',
        end_time: ''
      };
      this.getList()
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
      manageList(this.listQuery).then(res => {
        this.downloadLoading = false;
        var alink = document.createElement("a");
        alink.href = res;
        alink.download = '设备列表'; //图片名
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
  .image-size {
    width: 120px;
    height: 90px;
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