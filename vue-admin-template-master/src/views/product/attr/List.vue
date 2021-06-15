<template>
  <div>
    <el-card>
      <CategorySelector @changeCategory="changeCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>
    <!-- 第一个card当中是三级联动，第二个card是属性列表相关的 -->
    <el-card style="margin-top: 20px">
      <!-- 这个里面放的是列表页的页面 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="showAddDiv"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column label="序号" type="index" align="center" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表" width="width">
            <!-- 遍历的是每个属性当中的属性值列表 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="showUpdateDiv(row)"
              ></HintButton>

              <el-popconfirm :title="`你确认删除${row.attrName}吗？`" @onConfirm="deleteAttr(row)">
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowList">
        <!-- 这个里面放的是添加或者修改的页面 -->
        <!-- 这里面是添加或者修改的页面 -->
        <el-form :model="attrForm" :inline="true">
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowList = true">取消</el-button>

        <el-table
          :data="attrForm.attrValueList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-if="row.isEdit"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
                size="mini"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block; width: 100%; height: 100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定要删除${row.valueName}吗？`"
                @onConfirm="attrForm.attrValueList.splice($index, 1)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" :disabled="attrForm.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 保存子组件传递过来的id 一会发请求使用
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],

      isShowList: true, //控制第二个card显示的是添加还是列表

      attrForm: {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        // categoryId: this.category3Id,  //这样不行，在data当中不能使用this
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    changeCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId;
        //一级被选中，子组件传递过来1级id，并且还要让父组件把数据清空
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level === 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.attrList = [];
      } else {
        this.category3Id = categoryId;
        // 三级id被选中，父组件当中是要发请求获取属性列表的
        //发请求获取属性列表数据
        this.getAttrList();
      }
    },
    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
    // 点击添加按钮切换到添加的页面
    showAddDiv() {
      this.isShowList = false;
      // 清空收集的对象
      // 完成收集的对象剩余的收集操作
      this.attrForm = {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: "string",
          // },
        ],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 点击添加属性值按钮
    addAttrValue() {
      //我们可以给属性值列表当中添加一个空的对象，保证表格当中首先先出现一行
      this.attrForm.attrValueList.push({
        // 添加属性也好  修改属性也罢 都有可能添加属性值
        // 添加属性值的时候，属性值对象当中属性的id就是attrId，
        attrId: this.attrForm.id, //这个属性说的是属性值所属属性的id，如果是添加属性，这个id是没有的，如果是修改属性，这个id是有的
        valueName: "", //我现在只是添加了一个空的对象，属性都还没有呢，只是在占位,什么时候这个属性值有值，得让用户自己输入，输入了就有值
        isEdit: true, //添加属性值的时候，我们属性值对象标识数据直接就是编辑模式
      });

      // 自动获取焦点的逻辑  新添加属性值，input要自动获取焦点
      //新添加的属性值是属性值列表当中的最后一项
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },

    // 点击修改按钮切换到修改的页面
    showUpdateDiv(row) {
      this.isShowList = false;
      //使用浅拷贝让修改的数据和列表展示的数据不是同一个
      // this.attrForm = {...row}
      this.attrForm = cloneDeep(row); //必须深拷贝

      //修改属性的时候，也是每个属性值都要有自己的模式标识数据
      this.attrForm.attrValueList.forEach((item) => {
        // item.isEdit = false
        // 不能用上面的写法，因为这是在后期给响应式对象添加新的属性
        // 只有在数据初始化阶段（beforeCreate 和 created之间初始化的对象，对象当中属性才是响应式的数据）
        // 此时点击按钮给响应式对象添加新的属性数据，不是响应式的数据，这样会导致后期添加了以后页面不变化
        // 如果后期添加的属性要响应式  必须使用 Vue.set 或者是 vm.$set才能让其成为响应式数据
        this.$set(item, "isEdit", false);
      });
    },

    // input失去焦点或者input回车之后切换为span
    toLook(row) {
      //在input变为span之前，我们需要校验用户输入的数据合法性
      //1、用户输入的数据不能为空
      let valueName = row.valueName;
      if (valueName.trim() === "") {
        this.$message.info("输入的属性值名称不能为空");
        row.valueName = ""; //清空输入框不合法的数据
        return;
      }
      //2、用户输入的数据不能和已有的其它属性值名称重复
      //判断输入的数据和其它的属性值名称数据是不是重复,得除去自身，判断和其它的是不是相同
      let isRepeat = this.attrForm.attrValueList.some((item) => {
        if (item !== row) {
          // 除去自身之后，有一个达到return的条件，那么就返回true
          return item.valueName === valueName;
        }
      });

      if (isRepeat) {
        this.$message.info("输入的属性值名称不能重复");
        row.valueName = ""; //清空输入框不合法的数据
        return;
      }

      // 这里可以直接点操作，因为添加的时候已经使用$set，变为响应式属性了
      row.isEdit = false; //直接变为span有点欠考虑
    },

    //span点击之后，切换为input
    toEdit(row, index) {
      row.isEdit = true;

      // 自动获取焦点的功能,根据index就知道是哪个input要获取焦点。并且这个index刚好就是对应的input的ref值
      // 为何this.$refs[index]是undefined
      // 因为我们获取这个节点获取的太快啦
      // 上面我们把row.isEdit = true改完之后，由于dom元素是通过vif才开始创建，紧接着你就开始获取这个元素
      // 此时我的input还没创建好，所以你获取到的就是undefined

      //$nextTick 代表在页面的最近一次更新完成之后执行回调

      this.$nextTick(() => {
        //等待页面最近更新完成之后再去获取input进行获取焦点
        this.$refs[index].focus();
      });

      // this.$nextTick 和 updated 区别
      // this.$nextTick 页面的最近一次更新完成之后执行回调,一次就完了
      // updated  只要页面有数据更新 就会执行
    },
    //保存
    async save() {
      //获取收集的参数
      let attr = this.attrForm;
      //整理参数  (因为我们收集的参数 里面东西不一定是和请求需要的一样)
      // 1、如果属性当中的属性值有空串的我们得去除掉
      // 2、请求的时候得把不需要的属性值对象当中的属性数据去除掉，比如属性值当中的isEdit

      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName !== "") {
          delete item.isEdit; //过滤的同，如果属性值对象的属性名称不为空串，就去除它的isEdit属性
          return true;
        }
      });
      // 3、当属性当中属性值的列表是空的时候，代表没有属性值，不发请求
      if (attr.attrValueList.length === 0) {
        this.$message.info("属性必须有属性值");
        return;
      }

      //发请求
      try {
        //成功干啥
        await this.$API.attr.addOrUpdate(attr);
        //1、提示
        this.$message.success("保存成功");
        //2、返回到列表页
        this.isShowList = true;
        //3、重新获取属性列表数据
        this.getAttrList();
      } catch (error) {
        //失败干啥
        this.$message.error("保存失败");
      }
    },
    //删除属性
    async deleteAttr(row){
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('删除成功')
        this.getAttrList()
      } catch (error) {
        this.$message.error('删除失败')
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
