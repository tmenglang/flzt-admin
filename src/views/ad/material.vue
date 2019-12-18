<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="searchQuery.name" placeholder="素材名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      
      <el-select v-model="searchQuery.type" placeholder="素材类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in type_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchQuery.state" placeholder="素材状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in state_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
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
        prop="url" 
        label="素材">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.pic1" class="img" /> -->
          <el-image 
            style="width: 50px; height: 50px"
            :src="scope.row.url">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="name" 
        label="素材名称">
      </el-table-column>
      <el-table-column
        prop="type" 
        label="素材类型">
        <template slot-scope="scope">
          <span>{{ type[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="channel" 
        label="投放渠道">
        <template slot-scope="scope">
          <span>{{ channel[scope.row.channel] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="state" 
        label="状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="create_operator" 
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="公司名字">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="white-space:nowrap;" v-if="scope.row.state == 1">
            <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
            <el-link type="primary" @click="handleUpdate(scope.row, 2)">通过</el-link>
            <el-link type="primary" @click="handleUpdate(scope.row, 3)">驳回</el-link>
          </div>
          <div style="white-space:nowrap;" v-if="scope.row.state == 2 || scope.row.state == 3">
            <el-link type="primary" @click="handleDetail(scope.row)">查看</el-link>
            <el-link type="primary" @click="handleUpdate(scope.row, -1)">删除</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 90%; margin-left:50px;">
        <el-form-item label="素材名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入素材名称" />
        </el-form-item>
        <el-form-item label="素材类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择" @change="changeChild(temp.type)">
            <el-option v-for="item in type_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="投放位置" prop="channel">
          <el-radio-group v-model="temp.channel">
            <el-radio v-for="(value, key, index) in channel" :key="index" :label="key">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="素材">
          <el-upload
            v-if="temp.type == 1"
            class="avatar-uploader"
            accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.BMP"
            :action="uplink"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-upload
            class="avatar-uploader"
            v-if="temp.type == 2"
            accept=".mp4,.3gp,.wmv,.avi,.mpg,.mpeg,.mov"
            :action="uplink"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeVideoUpload">
            <video v-if="imageUrl" :src="imageUrl" controls="controls" class="avatar">
            您的浏览器不支持 video 标签。
            </video>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
    <el-dialog
      title="查看素材"
      :visible.sync="centerDialogVisible">
        <p v-if="temp2.state == 3" style="color: #ff0000; font-size: 14px; line-height: 40px;">驳回理由：{{temp2.check_reason}}</p>
        <el-image :src="temp2.url" v-if="temp2.type == 1" style="width: 100%;"></el-image>
        <video v-if="temp2.type == 2" :src="temp2.url" controls="controls" style="width:100%;">
        您的浏览器不支持 video 标签。
        </video>
    </el-dialog>
  </div>
</template>

<script>
import { materialList, materialUpdate, dictInfo } from '@/api/material'
import Pagination from '@/components/Pagination'
export default {
  name: 'Material',
  components: { Pagination },
  data() {
    return {
      // uplink: 'https://portal.fsylit.com/file/upload',
      uplink: 'https://testportal.fsylit.com/file/upload',
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
        name: '',
        type: '',
        state: ''
      },
      state: [],
      state_format: [],
      type: {
          1: '图片',
          2: '视频'
      },
      type_format: [{label: '图片', value: 1}, {label: '视频', value: 2}],
      channel: {},
      temp: {
        id: undefined,
        name: '',
        type: 1,
        channel: '',
        url: ''
      },
      temp2: {
        type: '',
        url: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑素材',
        create: '新增素材'
      },
      dialogPvVisible: false,
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
      imageUrl: '',
      dialogVisible: false,
      picList: []
    }
  },
  created() {
    this.getDictInfo();
  },
  methods: {
    getDictInfo() {
      dictInfo().then(res => {
        this.channel = res.data.ad_channel;
        this.state = res.data.ad_material_state;
        let p = [];
        res.data.ad_material_state.forEach((v, k) => {
          p.push({label: v, value: k});
        });
        this.state_format = p;
        this.getList();
      });
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      materialList(data).then(res => {
        this.listLoading = false;
        let list = res.data.list;
        this.tableData = list;
        this.total = res.data.total;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        type: 1,
        channel: 1,
        url: ''
      }
      this.imageUrl = '';
    },
    changeChild(type) {
      console.log(type);
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
          materialUpdate(this.temp).then(() => {
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
      this.temp2 = Object.assign({}, row) // copy obj
      this.centerDialogVisible = true
    },
    handleUpdate(row, type) {
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
          msg = '通过';
          data.state = 2;
          break;
        case 3:
          msg = '驳回';
          data.state = 3;
          break;
        default:
      }
      if (data.state == 3) {
        this.$prompt('请输入驳回理由', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          data.check_reason = value;
          materialUpdate(data).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.getList();
          });
        }).catch(() => {
          //      
        });
      } else {
        this.$confirm('确定对该素材进行' + msg + '操作么?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          materialUpdate(data).then(res => {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.getList();
          });
        }).catch(() => {
          //         
        });
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
        name: '',
        type: '',
        state: ''
      }
      this.getList()
    },
    handleFilter() {
      this.listQuery.page_index = 1
      this.getList()
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = file.response.data.file_path;
      this.temp.url = this.imageUrl;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    beforeVideoUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 200;
      if (!isLt2M) {
        this.$message.error('上传视频大小不能超过 200MB!');
      }
      return isLt2M;
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
  .myDialog .el-dialog__body {
    padding: 10px 20px;
  }
  .myDialog h3 {
    margin: 10px 0;
  }
  .el-radio {
    display: block;
    margin-bottom: 10px;
  }
  .el-link.el-link--primary {
    margin-right: 10px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>