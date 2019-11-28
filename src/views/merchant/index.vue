<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="mb10">
            <el-input v-model="searchQuery.company_name" placeholder="商家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="searchQuery.create_operator" placeholder="创建人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
          </div>
          <div>
            <el-select v-model="searchQuery.state" placeholder="商家状态" clearable style="width: 150px" class="filter-item">
              <el-option v-for="(item, index) in merchantState" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="searchQuery.type" placeholder="主体类型" clearable style="width: 150px" class="filter-item">
              <el-option v-for="(item, index) in merchantType" :key="index" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="searchQuery.ledger_type" placeholder="财务模式" clearable style="width: 150px" class="filter-item">
              <el-option v-for="(item, index) in merchantLedger" :key="index" :label="item.label" :value="item.value" />
            </el-select>
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
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      v-loading="listLoading"
      border  
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="id" 
        label="商家编号">
      </el-table-column>
      <el-table-column
        prop="company_name" 
        label="商家名称">
      </el-table-column>
      <el-table-column
        prop="state" 
        label="商家状态">
        <template slot-scope="scope">
          <span>{{ stateFormat[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type" 
        label="商家类型">
        <template slot-scope="scope">
          <span>{{ type[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="addr" 
        label="地址">
      </el-table-column>
      <el-table-column
        prop="link_user" 
        label="联系人">
      </el-table-column>
      <el-table-column
        prop="phone" 
        label="联系方式">
      </el-table-column>
      <el-table-column
        prop="create_operator" 
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="create_time" 
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="ledger_type" 
        label="商家类型">
        <template slot-scope="scope">
          <span>{{ ledger_type[scope.row.ledger_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remarks" 
        label="备注">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="company_name">
              <el-input v-model="temp.company_name" placeholder="请输入商家名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="row-bg">
            <el-form-item label="身份证号" prop="card_id">
              <el-input v-model="temp.card_id" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家状态" prop="state">
              <el-select v-model="temp.state" class="filter-item" placeholder="请选择">
                <el-option v-for="(item, index) in merchantState" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="row-bg">
            <el-form-item label="商家类型" prop="type">
              <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
                <el-option v-for="(item, index) in merchantType" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商家行业" prop="trade">
          <el-select v-model="temp.trade" class="filter-item" placeholder="请选择">
            <el-option v-for="(item, index) in merchantTrade" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="营业执照">
          <el-upload
            action="https://portal.fsylit.com/file/upload"
            list-type="picture-card" 
            :on-preview="handlePictureCardPreview"
            :on-success="handlePicSuccess" 
            accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.BMP" 
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="商家logo">
          <el-upload
            class="avatar-uploader"
            action="https://portal.fsylit.com/file/upload"
            accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.BMP" 
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
          <el-input v-model="temp.addr" placeholder="请输入商家地址" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系人" prop="link_user">
              <el-input v-model="temp.link_user" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="row-bg">
            <el-form-item label="联系邮箱" prop="link_email">
              <el-input v-model="temp.link_email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model="temp.phone" placeholder="请输入联系方式" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="row-bg">
            <el-form-item label="客服电话" prop="service_tel">
              <el-input v-model="temp.service_tel" placeholder="请输入客服电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="temp.remarks" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
        </el-form-item>
        <el-divider content-position="left">财务信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="财务模式" prop="ledger_type">
              <el-select v-model="temp.ledger_type" class="filter-item" placeholder="请选择">
                <el-option v-for="(item, index) in merchantLedger" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="分账比例" prop="ratio">
              <el-input v-model="temp.ratio" placeholder="请输入分账比例" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信账户" prop="wechat_account">
              <el-input v-model="temp.wechat_account" placeholder="请输入微信账户" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信收款人姓名" prop="wechat_user">
              <el-input v-model="temp.wechat_user" placeholder="请输入微信收款人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="微信分账周期" prop="wechat_period">
              <el-input v-model="temp.wechat_period" placeholder="请输入微信分账周期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付宝账户" prop="alipay_account">
              <el-input v-model="temp.wechat_period" placeholder="请输入支付宝账户" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付宝账户" prop="alipay_user">
              <el-input v-model="temp.alipay_user" placeholder="支付宝收款人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付宝开户支行" prop="alipay_bank">
              <el-input v-model="temp.alipay_bank" placeholder="请输入支付宝开户支行" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="支付宝分账周期" prop="alipay_period">
              <el-input v-model="temp.alipay_period" placeholder="请输入支付宝分账周期" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行卡开户支行" prop="cash_bank">
              <el-input v-model="temp.cash_bank" placeholder="请输入银行卡开户支行" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行卡号" prop="cash_bankid">
              <el-input v-model="temp.cash_bankid" placeholder="银行卡号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="银行卡收款人姓名" prop="cash_user">
              <el-input v-model="temp.cash_user" placeholder="银行卡收款人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
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

  </div>
</template>

<script>
import { merchantList, createMerchant, updateMerchant } from '@/api/merchant'
import Pagination from '@/components/Pagination'
export default {
  name: 'MerchantIndex',
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
        company_name: '',
        create_operator: '',
        start_time: '',
        end_time: '',
        state: '',
        type: '',
        ledger_type: ''
      },
      merchantState: [{label: '运营中', value: 1}, {label: '已关闭', value: 0}],
      stateFormat: {
        1: '运营中',
        0: '已关闭'
      },
      type: {
        1: '企业',
        2: '个体户'
      },
      merchantType: [{label: '企业', value: 1}, {label: '个体户', value: 1}],
      ledger_type: {
        0: '关闭',
        1: '分账',
        2: '提现',
      },
      merchantLedger: [{label: '关闭', value: 0}, {label: '分账', value: 1}, {label: '提现', value: 2}],
      merchantTrade: [],
      temp: {
        id: undefined,
        company_name: '',
        phone: '',
        addr: '',
        state: '',
        link_user: '',
        remarks: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商家',
        create: '新增商家'
      },
      dialogPvVisible: false,
      rules: {
        state: [{ required: true, message: '请选择商家状态', trigger: 'change' }],
        company_name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }]
      },
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      picList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      merchantList(data).then(res => {
        this.listLoading = false;
        this.tableData = res.data.list;
        this.total = res.data.total;
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        company_name: '',
        phone: '',
        addr: '',
        state: '',
        link_user: '',
        remarks: ''
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
          this.btnLoading = true;
          this.temp.id = '' // mock a id
          createMerchant(this.temp).then(() => {
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
            company_name: this.temp.company_name,
            phone: this.temp.phone,
            addr: this.temp.addr,
            state: this.temp.state,
            link_user: this.temp.link_user,
            remarks: this.temp.remarks
          }
          this.btnLoading = true;
          updateMerchant(tempData).then(() => {
            this.btnLoading = false;
            this.getList();
            // for (const v of this.tableData) {
            //   if (v.id === this.temp.id) {
            //     const index = this.tableData.indexOf(v)
            //     this.tableData.splice(index, 1, this.temp)
            //     break
            //   }
            // }
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
      this.searchQuery = {
        company_name: '',
        create_operator: '',
        start_time: '',
        end_time: '',
        state: ''
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
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
  .mb10 {
    padding-bottom: 10px;
  }
  .row-bg {
    padding: 0 10px;
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
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>