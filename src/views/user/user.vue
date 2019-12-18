<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="searchQuery.uid" placeholder="用户ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model.trim="searchQuery.phone" placeholder="手机号号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        prop="uid" 
        label="用户id">
      </el-table-column>
      <el-table-column
        prop="pic_url" 
        label="头像">
        <template slot-scope="scope">、
          <el-image 
            style="width: 50px; height: 50px"
            :src="scope.row.pic_url">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="name" 
        label="名称">
      </el-table-column>
      <el-table-column
        prop="sex" 
        label="性别">
      </el-table-column>
      <el-table-column
        prop="phone" 
        label="电话">
      </el-table-column>
      <el-table-column
        prop="country" 
        label="国家">
      </el-table-column>
      <el-table-column
        prop="province" 
        label="省份">
      </el-table-column>
      <el-table-column
        prop="city" 
        label="城市">
      </el-table-column>
      <el-table-column
        prop="is_fellow" 
        label="是否关注公众号">
      </el-table-column>
      <el-table-column
        prop="last_buy_time" 
        label="最近一次购买时间">
      </el-table-column>
      <el-table-column
        prop="total_buy" 
        label="购买总额">
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>
  </div>
</template>

<script>
import { consumerList } from '@/api/user'
import Pagination from '@/components/Pagination'
export default {
  name: 'User',
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
        uid: '',
        phone: ''
      },
      sex: {
        1: '男',
        2: '女'
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      let data = Object.assign({}, this.listQuery);
      data.search = JSON.stringify(this.searchQuery);
      
      consumerList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
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
        device_state: '',
        start_time: '',
        end_time: ''
      };
      this.getList();
    },
    handleDownload() {
      this.downloadLoading = true
      let data = Object.assign({}, this.listQuery);
      data.search = JSON.stringify(this.searchQuery);
      data.download = 1;
      consumerList(data).then(res => {
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