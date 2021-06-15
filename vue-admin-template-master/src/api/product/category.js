import request from '@/utils/request'

export default {
  // 获取所有的1级分类列表数据
  // GET /admin/product/getCategory1
  // getCategory1
  getCategory1(){
    return request.get('/admin/product/getCategory1')
  },


  // 根据1级id获取某个1级分类下所有的二级分类列表
  // GET /admin/product/getCategory2/{category1Id}
  // getCategory2
  getCategory2(category1Id){
    return request.get(`/admin/product/getCategory2/${category1Id}`)
  },
  

  // 根据某个2级id获取某个二级分类下所有的三级分类列表
  // GET /admin/product/getCategory3/{category2Id }
  // getCategory3
  getCategory3(category2Id){
    return request.get(`/admin/product/getCategory3/${category2Id }`)
  }

}


