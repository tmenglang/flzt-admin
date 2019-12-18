<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model.trim="searchQuery.id" placeholder="SKUID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model.trim="searchQuery.name" placeholder="商品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      
      <el-select v-model="searchQuery.device_type" placeholder="设备类型" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in device_type_format" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="searchQuery.state" placeholder="商品状态" clearable style="width: 120px" class="filter-item">
        <el-option v-for="item in state_format" :key="item.value" :label="item.label" :value="item.value" />
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
    <el-table
      :data="tableData"
      v-loading="listLoading" 
      border  
      style="width: 100%; margin-top: 20px;">
      <el-table-column
        prop="id" 
        label="SKUID">
      </el-table-column>
      <el-table-column
        prop="name" 
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="pic1" 
        label="商品图片">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.pic1" class="img" /> -->
          <el-image 
            style="width: 50px; height: 50px"
            :src="scope.row.pic1" 
            :preview-src-list="scope.row.srcList">
          </el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="pic2" 
        label="陈列图片">
        <template slot-scope="scope">
          <img :src="scope.row.pic2" class="img" />
        </template>
      </el-table-column> -->
      <el-table-column
        prop="sku_type_name" 
        label="一级分类">
        <!-- <template slot-scope="scope">
          <span>{{ sku_type[scope.row.sku_type] }}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="sku_child_type_name" 
        label="二级分类">
      </el-table-column>
      <el-table-column
        prop="device_type" 
        label="设备类型">
        <template slot-scope="scope">
          <span>{{ device_type[scope.row.device_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="bar_code" 
        label="条形码">
      </el-table-column>
      <el-table-column
        prop="label" 
        label="模型标识">
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
        prop="stete" 
        label="状态">
        <template slot-scope="scope">
          <span>{{ state[scope.row.state] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div style="white-space:wrap;">
            <el-button
            size="mini"
            @click="handleAdd(scope.row)" :disabled="scope.row.state == 1">加入我的商品</el-button>
            <el-button
            size="mini"
            @click="handleUpdate(scope.row)">编辑</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pages-wrap">
      <pagination class="fr" v-show="total>0" :total="total" :page.sync="listQuery.page_index" :limit.sync="listQuery.page_size" @pagination="getList" />
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px" custom-class="myDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 90%; margin-left:50px;">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="条形码" prop="bar_code">
          <el-input v-model="temp.bar_code" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品图片">
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
        <el-form-item label="一级分类" prop="sku_type">
          <el-select v-model="temp.sku_type" class="filter-item" placeholder="请选择" @change="changeChild(temp.sku_type)">
            <el-option v-for="item in sku_type_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="sku_child_type">
          <el-select v-model="temp.sku_child_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in sku_child_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型" prop="device_type">
          <el-select v-model="temp.device_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in device_type_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="模型标识" prop="label">
          <el-input v-model="temp.label" placeholder="请输入模型标识" />
        </el-form-item>
        <el-form-item label="商品支持层次" prop="layer_type">
          <el-select v-model="temp.layer_type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in layer_format" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="建议零售价" prop="price">
          <el-input v-model="temp.price" placeholder="请输入零售价" />
        </el-form-item>
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
import { skuSelect, skuList, skuUpdate, goodsUpdate, skutypeList } from '@/api/goods'
import Pagination from '@/components/Pagination'
export default {
  name: 'Sku',
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
        id: '',
        state: '',
        device_type: ''
      },
      state: ["未加入", "已加入"],
      state_format: [{label: '未加入', value: 0}, {label: '已加入', value: 1}],
      device_type: [],
      sku_type: [],
      device_type_format: [],
      sku_type_format: [],
      sku_child_format: [],
      layer_format: [{label: '全部层支持', value: 0}, {label: '仅支持第一层', value: 1}, {label: '第一层除外', value: 2}],
      temp: {
        //id: undefined,
        name: '',
        pic1: '',
        pic2: '',
        pic3: '',
        sku_type: '',
        sku_child_type: '',
        bar_code: '',
        label: '',
        device_type: '',
        layer_type: '',
        price: ''
      },
      temp2: {
        sku_id: '',
        price: '',
        cost: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商品',
        create: '新增商品'
      },
      dialogPvVisible: false,
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        bar_code: [{ required: true, message: '请输入条形码', trigger: 'blur' }],
        sku_type: [{ required: true, message: '请选择商品一级分类', trigger: 'change' }],
        sku_child_type: [{ required: true, message: '请选择商品二级分类', trigger: 'change' }],
        device_type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      add_rules: {
        cost: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
        price: [{ required: true, message: '请输入销售价', trigger: 'blur' }]
      },
      skutype_list: [],
      centerDialogVisible: false,
      dialogImageUrl: '',
      dialogVisible: false,
      picList: [],
      fileList: []
    }
  },
  created() {
    this.getSelect();
  },
  methods: {
    getSelect() {
      skuSelect({}).then(res => {
        let d = [];
        let s = [];
        for (var i in res.data.device_type) {
          d.push({label: res.data.device_type[i], value: parseInt(i)});
        }
        console.log(d)
        this.device_type_format = d;
        this.device_type = res.data.device_type;
        this.getskuType()
        
      });
    },
    getskuType() {
      skutypeList({
        page_size: 100,
        page_index: 1,
        order_by: '',
        order_type: 'desc'
      }).then(res => {
        let s = [];
        let c = [];
        let list = res.data.list;
        this.sku_type = list;
        for (var i in list) {
          s.push({label: list[i].name, value: list[i].id});
        }
        this.sku_type_format = s;
        if (list[0].child_list.length) {
          list[0].child_list.forEach(v => {
            c.push({label: v.name, value: v.id});
          });
        }
        this.sku_child_format = c;
        this.getList()
      });
    },
    getList() {
      this.listLoading = true;
      let data = this.listQuery;
      data.search = JSON.stringify(this.searchQuery);
      skuList(data).then(res => {
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
    resetTemp() {
      this.temp = {
        name: '',
        pic1: '',
        pic2: '',
        pic3: '',
        sku_type: '',
        sku_child_type: '',
        bar_code: '',
        label: '',
        device_type: '',
        layer_type: '',
        price: ''
      }
      this.picList = this.fileList = [];
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
      this.resetTemp()
      this.fileList = [{name: '图片1', url: row.pic1}];
      this.picList = [row.pic1];
      if (row.pic2) {
        this.fileList[1] = {name: '图片2', url: row.pic2};
        this.picList[1] = row.pic2;
      }
      if (row.pic3) {
        this.fileList[2] = {name: '图片3', url: row.pic3};
        this.picList[2] = row.pic3;
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
          let data = {
            id: this.temp.id,
            name: this.temp.name,
            pic1: this.picList[0],
            pic2: this.picList[1] || '',
            pic3: this.picList[2] || '',
            sku_type: this.temp.sku_type,
            sku_child_type: this.temp.sku_child_type,
            bar_code: this.temp.bar_code,
            label: this.temp.label,
            device_type: this.temp.device_type,
            layer_type: this.temp.layer_type,
            price: this.temp.price,
          }
          this.btnLoading = true;
          skuUpdate(data).then(() => {
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
    handleAdd(row) {
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
        name: '',
        id: '',
        state: '',
        device_type: ''
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
      console.log(fileList);
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
  .myDialog .el-dialog__body {
    padding: 10px 20px;
  }
  .myDialog h3 {
    margin: 10px 0;
  }
</style>