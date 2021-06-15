import request from '@/utils/request'

export default {
  //每个接口请求函数就是这个对象当中的一个方法
  // DELETE /admin/product/baseTrademark/remove/{id}  //根据id删除某个品牌
  // 删除BaseTrademark
  delete(id){
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },
  

  // POST /admin/product/baseTrademark/save   //添加新的品牌
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update  //修改品牌
  // 修改BaseTrademark
  // 增加品牌和修改品牌 最终都需要传递这样一个对象 请求体参数
  // {
  //   "id": 0,   // 以后增加新的品牌是不需要id的  而修改一个品牌是需要id的
  //   "logoUrl": "string",
  //   "tmName": "string"
  // }

  addOrUpdate(trademark){
    //根据id来决定这个请求函数是添加还是修改
    if(trademark.id){
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else{
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
  },

  // GET /admin/product/baseTrademark/{page}/{limit} //获取品牌的分页列表 查
  // 分页列表
  getPageList(page,limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },


  ///GET admin/product/baseTrademark/getTrademarkList   获取所有的品牌列表
  getList(){
    return request.get('admin/product/baseTrademark/getTrademarkList')
  }




}

// import * as $API from 'trademark.js' 如果这样写只能把品牌相关的接口拿到



// // {
  // default:{}
// }

//默认暴露 最终暴露出去是个什么东西     对象
// export default 100
// 默认暴露出去的对象  是以default为属性，default后面的值为值的对象
// {
//   default:100
// }

// 默认暴露的引入方式
// 完整写法  import {default as a } from './xxx.js'
// 从这里我们可以看到默认暴露出来的一定是对象，否则凭啥解构
// 但是这样的写法太复杂了，所以简化为下面写法
// import a from './xxx.js'   a = 100

//案例
// export default {
//   a:1,
//   b:2
// }
//最终暴露出去是
// {
//   default:{
//       a:1,
//       b:2
//   }
// }
// import {default as obj} from 'xxx.js'
// import obj  from 'xxx.js'









//部分暴露 最终暴露出去是个什么东西     对象
// export let a = 100
// export const obj = {a:1}
// 文件最终暴露出去也是一个对象，这个对象会自动添加
// {
//   a,
//   obj
// }

//引入的时候  
// import {a} from 'xxx.js'
// import {obj} from 'xxx.js'


//整体暴露 最终暴露出去是个什么东西     对象
// let a = 100
// const obj = {a:1}
// export {
//   a,
//   obj
// }
//整体暴露出去 export后面是啥就是啥  整体暴露出去也一定是对象
// import {a} from 'xxx.js'



//总结：
// 无论是哪种方式暴露，我们一定要清除暴露出去的都是对象
// 只不过这个对象是怎么形成的不同
// 默认暴露是一个对象  default为属性 default后面值为值的一个对象  只能写一次
// 部分暴露是一个对象  它是最终暴露出去的时候把所有暴露的变量自动封装到对象当中
// 整体暴露是一个对象  这个对象是我们自己需要写的，把所有的需要暴露的变量写到我们的对象当中

// 无论是哪种方式 想要直接拿到暴露出去的对象
// import  * as $API form 'xxx.js'

