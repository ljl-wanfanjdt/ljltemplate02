<template>
  <div>
    <el-form :model="skuForm" label-width="100px">
      <el-form-item label="SPU 名称"> {{ spu.spuName }} </el-form-item>

      <el-form-item label="SKU 名称">
        <el-input v-model="skuForm.skuName" placeholder="SKU 名称"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          v-model="skuForm.price"
          placeholder="SKU 价格"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input
          v-model="skuForm.weight"
          placeholder="SKU 重量"
          type="number"
        ></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          v-model="skuForm.skuDesc"
          placeholder="SKU 规格描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrList"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="100px">
          <el-form-item
            :label="spuSaleAttr.saleAttrName"
            v-for="(spuSaleAttr, index) in spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <el-select v-model="spuSaleAttr.spuAttrIdValueId" placeholder="请选择">
              <el-option
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
                v-for="(
                  spuSaleAttrValue, index
                ) in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table :data="spuImageList" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" v-if="row.isDefault === '0'" @click="setDefault(row)">设为默认</el-button>
              <el-tag v-else type="success">默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuForm: {
        // 父组件传过来
        tmId: "",
        category3Id: "",
        spuId:'',  //这个id是告诉后台给哪个spu添加sku


        //v-model直接收集
        price: "",
        weight: "",
        skuName: "",
        skuDesc: "",

        //要通过代码去收集的
        skuDefaultImg: "",

        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },

      spu: {},
      //存储三个初始化获取的动态数据
      attrList: [],
      spuSaleAttrList: [],
      spuImageList: [],   //用来展示所有的图片列表


      checkedImageList:[] //这个是用来收集图片的列表
    };
  },
  methods: {
    //初始化请求获取动态显示的数据
    async initAddSkuFormData(row, category1Id, category2Id) {
      this.spu = row; //先把传递过来的spu保存，后期展示需要
      //根据三级分类id获取平台属性的分页列表
      //http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      const promise1 = this.$API.attr.getList(
        category1Id,
        category2Id,
        row.category3Id
      );
      //获取指定SPU的id对应的销售属性列表
      //http://localhost:9529/dev-api/admin/product/spuSaleAttrList/4
      const promise2 = this.$API.sku.getSpuSaleAttrList(row.id);
      //获取指定SPU的id对应的图片列表
      //http://localhost:9529/dev-api/admin/product/spuImageList/4
      const promise3 = this.$API.sku.getSpuImageList(row.id);

      const result = await Promise.all([promise1, promise2, promise3]);
      this.attrList = result[0].data;
      this.spuSaleAttrList = result[1].data;
      let spuImageList = result[2].data;
      //为了实现默认图片功能，每个图片里面我们都去添加一个isDefault属性
      spuImageList.forEach(item => item.isDefault = '0')
      this.spuImageList = spuImageList
    },

    //收集图片选中或者取消的回调
    handleSelectionChange(val) {
      // console.log(val)
      this.checkedImageList = val //收集图片列表到选中的图片数组当中，不是我们原始展示的数组
    },

    //设置默认图片
    setDefault(row){
      //排它设置默认图片
      this.spuImageList.forEach(item => item.isDefault = '0')
      row.isDefault = '1'
      //一旦设置完默认图片，赶紧把默认图片的路径收集到位
      this.skuForm.skuDefaultImg = row.imgUrl
    },
    //保存sku
    async save(){
      //1、获取收集的参数
      let {skuForm,spu,attrList,spuSaleAttrList,checkedImageList} = this
      //2、整理参数
      //整理父组件传过来的
      skuForm.tmId = spu.tmId
      skuForm.category3Id = spu.category3Id
      skuForm.spuId = spu.id
      //整理图片列表
      skuForm.skuImageList = checkedImageList.map(item => {
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
      //要求的结构
      // {
      //   imgName: "string",
      //   imgUrl: "string",
      //   isDefault: "string",
      //   spuImgId: 0,
      // },

      //我们的结构
      // id:12
      // imgName:"7155bba4c363065f.jpg"
      // imgUrl:"http://47.93.148.192:8080/group1/M00/00/02/rBHu8l-rgfWAVRWzAABUiOmA0ic932.jpg"
      // isDefault:"0"
      // spuId:3
      //整理平台属性和销售属性
      skuForm.skuAttrValueList = attrList.reduce((prev,item) => {
        if(item.attrIdValueId){
          let [attrId,valueId] = item.attrIdValueId.split(':')
          let obj = {
            attrId,
            valueId
          }
          prev.push(obj)
        }
        return prev
      },[])

      skuForm.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
        if(item.spuAttrIdValueId){
          let [saleAttrId,saleAttrValueId] = item.spuAttrIdValueId.split(':')
          let obj = {
            saleAttrId,
            saleAttrValueId
          }
          prev.push(obj)
        }
        return prev
      },[])

      //3、发请求
      try {
        //4、成功
        await this.$API.sku.addUpdate(skuForm)
        //1、提示
        this.$message.success('保存sku成功')
        //2、返回列表页,也以后，不需要让父组件再发请求获取spu的列表数据，因此简单了
        this.$emit('update:visible',false)
        //3、重置当前data的数据
        this.resetData()
      } catch (error) {
        //5、失败
        this.$message.error('保存sku失败')
      }
    },
    //重置data的数据
    resetData(){
      this.skuForm =  {
        tmId: "",
        category3Id: "",
        spuId:'',  //这个id是告诉后台给哪个spu添加sku
        price: "",
        weight: "",
        skuName: "",
        skuDesc: "",
        skuDefaultImg: "",
        skuAttrValueList: [ ],
        skuImageList: [],
        skuSaleAttrValueList: [],
      }
      this.spu = {}
      this.attrList = []
      this.spuSaleAttrList = []
      this.spuImageList = []   //用来展示所有的图片列表
      this.checkedImageList = [] //这个是用来收集图片的列表
    },
    //取消sku操作
    cancel(){
      //返回到spu列表页
      this.$emit('update:visible',false)
      //重置data数据
      this.resetData()
    }
  },
};
</script>

