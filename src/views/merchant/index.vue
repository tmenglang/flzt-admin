<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="24">
        <el-col :span="24">
          <div class="mb10">
            <el-input v-model.trim="searchQuery.company_name" placeholder="商家名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model.trim="searchQuery.create_operator" placeholder="创建人" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        label="财务模式">
        <template slot-scope="scope">
          <span>{{ ledger_type[scope.row.ledger_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remarks" 
        label="备注">
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <div style="white-space:nowrap;">
            <el-link type="primary" @click="handleUpdate(scope.row)">编辑</el-link>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 90%; margin-left:50px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商家名称" prop="company_name">
              <el-input v-model.trim="temp.company_name" placeholder="请输入商家名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="row-bg">
            <el-form-item label="身份证号" prop="card_id">
              <el-input v-model.trim="temp.card_id" placeholder="请输入身份证号" />
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
            :action="uplink"
            list-type="picture-card" 
            :on-preview="handlePictureCardPreview"
            :on-success="handlePicSuccess" 
            accept=".jpg,.jpeg,.png,.bmp,.JPG,.JPEG,.BMP" 
            :file-list="fileList"
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
            :action="uplink"
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
        <el-form-item label="备注" prop="remarks">
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
              <el-input v-model="temp.alipay_account" placeholder="请输入支付宝账户" />
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
        <el-button @click="cancelOp()">
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
    var validatePhone = (rule, value, callback) => {
      if (value) {
        var regx = /^1[345789]\d{9}$/;
        if (!regx.test(value)) {
          callback(new Error("请输入正确手机号!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validateCard = (rule, value, callback) => {
      if (value) {
        var regx = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        if (!regx.test(value)) {
          callback(new Error("请输入正确的身份证号码!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validateTel = (rule, value, callback) => {
      if (value) {
        var regx = /0\d{2,3}-\d{7,8}/;
        if (!regx.test(value)) {
          callback(new Error("请输入正确的客服电话!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var validateNum = (rule, value, callback) => {
      if (value) {
        var regx = /^(0|[1-9][0-9]*)(\.\d+)?$/;
        if (!regx.test(value)) {
          callback(new Error("请输入正确的数字！"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    
    return {
      uplink: 'https://portal.fsylit.com/file/upload',
      // uplink: 'https://testportal.fsylit.com/file/upload',
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
      merchantType: [{label: '企业', value: 1}, {label: '个体户', value: 2}],
      ledger_type: {
        0: '关闭',
        1: '分账',
        2: '提现',
      },
      merchantLedger: [{label: '关闭', value: 0}, {label: '分账', value: 1}, {label: '提现', value: 2}],
      merchantTrade: [
        {value: 'A', label: '农、林、牧、渔业'},
        {value: 'B', label: '采矿业'},
        {value: 'C', label: '制造业'},
        {value: 'D', label: '电力、热力、燃气及水生产和供应业'},
        {value: 'E', label: '建筑业'},
        {value: 'F', label: '批发和零售业'},
        {value: 'G', label: '交通运输、仓储和邮政业'},
        {value: 'H', label: '住宿和餐饮业'},
        {value: 'I', label: '信息传输、软件和技术服务业'},
        {value: 'J', label: '金融业K 房地产业'},
        {value: 'L', label: '租赁和商务服务业'},
        {value: 'M', label: '科学研究和技术服务业'},
        {value: 'N', label: '水利、环境和公共设施管理业'},
        {value: 'O', label: '居民服务、修理和其他服务业'},
        {value: 'P', label: '教育'},
        {value: 'Q', label: '卫生和社会工作'},
        {value: 'R', label: '文化、体育和娱乐业'},
        {value: 'S', label: '公共管理、社会保障和社会组织'},
        {value: 'T', label: '国际组织'}
      ],
      temp: {
        id: undefined,
        company_name: '',
        phone: '',
        addr: '',
        state: '',
        link_user: '',
        remarks: '',
        card_id: '',
        type: '',
        trade: '',
        identity_pic1: '',
        identity_pic2: '',
        logo_pic: '',
        link_email: '',
        service_tel: '',
        ledger_type: '',
        ratio: '',
        wechat_account: '',
        wechat_user: '',
        wechat_period: '',
        alipay_account: '',
        alipay_user: '',
        alipay_bank: '',
        alipay_period: '',
        cash_bank: '',
        cash_bankid: '',
        cash_user: ''
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
        company_name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: ['blur', 'change'] }],
        link_email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        card_id: [{validator: validateCard, trigger: ['blur', 'change']}],
        service_tel: [{validator: validateTel, trigger: ['blur', 'change']}],
        ratio: [{validator: validateNum, trigger: ['blur', 'change']}]
      },
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      picList: [],
      fileList: []
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
    cancelOp() {
      this.dialogFormVisible = false;
      this.resetTemp();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        company_name: '',
        phone: '',
        addr: '',
        state: '',
        link_user: '',
        remarks: '',
        type: '',
        trade: '',
        card_id: '',
        identity_pic1: '',
        identity_pic2: '',
        logo_pic: '',
        link_email: '',
        service_tel: '',
        ledger_type: '',
        ratio: '',
        wechat_account: '',
        wechat_user: '',
        wechat_period: '',
        alipay_account: '',
        alipay_user: '',
        alipay_bank: '',
        alipay_period: '',
        cash_bank: '',
        cash_bankid: '',
        cash_user: ''
      }
      this.picList = this.fileList = [];
      this.imageUrl = '';
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    
    createData() {
      console.log(1);
      this.$refs['dataForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.btnLoading = true;
          this.temp.id = '' // mock a id
          this.temp.identity_pic1 = this.picList[0];
          this.temp.identity_pic2 = this.picList[1] || '';
          this.temp.logo_pic = this.imageUrl;
          createMerchant(this.temp).then(() => {
            this.btnLoading = false;
            this.getList();
            this.dialogFormVisible = false
            this.resetTemp();
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
      this.imageUrl = row.logo_pic;
      this.fileList = [{name: '图片1', url: row.identity_pic1}]
      this.picList = [row.identity_pic1];
      if (row.identity_pic2) {
        this.fileList[1] = {name: '图片2', url: row.identity_pic2};
        this.picList[1] = row.identity_pic2;
      }
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
            card_id: this.temp.card_id,
            remarks: this.temp.remarks,
            type: this.temp.type,
            trade: this.temp.trade,
            identity_pic1: this.picList[0],
            identity_pic2: this.picList[1],
            logo_pic: this.imageUrl,
            link_email: this.temp.link_email,
            service_tel: this.temp.service_tel,
            ledger_type: this.temp.ledger_type,
            ratio: this.temp.ratio,
            wechat_account: this.temp.wechat_account,
            wechat_user: this.temp.wechat_user,
            wechat_period: this.temp.wechat_period,
            alipay_account: this.temp.alipay_account,
            alipay_user: this.temp.alipay_user,
            alipay_bank: this.temp.alipay_bank,
            alipay_period: this.temp.alipay_period,
            cash_bank: this.temp.cash_bank,
            cash_bankid: this.temp.cash_bankid,
            cash_user: this.temp.cash_user
          }
          this.btnLoading = true;
          updateMerchant(tempData).then(() => {
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
          if (v.response) {
            l.push(v.response.data.file_path);
          } else {
            l.push(v.url);
          }
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
      this.imageUrl = file.response.data.file_path;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('上传Logo图片大小不能超过 2MB!');
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
  .fr {
    float: right;
  }
  .mb10 {
    padding-bottom: 10px;
  }
  .row-bg {
    padding: 0 10px;
  }
  .myDialog .el-dialog__body {
    padding: 10px 20px;
  }
  .myDialog h3 {
    margin: 10px 0;
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