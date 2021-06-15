<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline" :disabled="!isShowList">
      <el-form-item label="一级分类">
        <!-- 选中哪个项，最终我们手机的是选中的分类的id -->
        <el-select v-model="cForm.category1Id" placeholder="请选择" @change="changeCategory1">
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="changeCategory2">
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="changeCategory3">
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  props:['isShowList'],
  data() {
    return {
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      category1List: [],
      category2List: [],
      category3List: [],
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    // 一上来获取所有的一级分类
    async getCategory1List() {
      const result = await this.$API.category.getCategory1();
      if (result.code === 200) {
        this.category1List = result.data;
      }
    },

    //根据选中的1级分类id获取这个一级分类的所有二级分类列表
    async changeCategory1(category1Id){
      // 从新选择1级分类，23级所有的东西都要重新清空
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''
      this.category2List = []
      this.category3List = []

      this.$emit('changeCategory',{categoryId:category1Id,level:1})

      const result = await this.$API.category.getCategory2(category1Id);
      if (result.code === 200) {
        this.category2List = result.data;
      }
    },
    //根据选中的2级分类id获取这个二级分类的所有三级分类列表
    async changeCategory2(category2Id){
      // 从新选择2级分类，3级所有的东西都要重新清空
      this.cForm.category3Id = ''
      this.category3List = []

      this.$emit('changeCategory',{categoryId:category2Id,level:2})

      const result = await this.$API.category.getCategory3(category2Id);
      if (result.code === 200) {
        this.category3List = result.data;
      }
    },

    //选中三级分类的id，要做的事情
    //三级分类被选中，下面有数据了，三级分类被选中，下面是要发请求获取属性数据进行展示
    //但是，这个请求不是在当前组件发的，而是在父组件发的
    //因此我们要组件通信


    changeCategory3(category3Id){
      //组件通信把id给传递到父组件当中
      this.$emit('changeCategory',{categoryId:category3Id,level:3})
    } 

  },
};
</script>

