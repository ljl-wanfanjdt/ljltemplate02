import request from '@/utils/request'

export default {
  //根据选中三级分类后获取平台属性列表
  // GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  // attrInfoList
  getList(category1Id,category2Id,category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  //根据id删除某个平台属性
  // DELETE /admin/product/deleteAttr/{attrId}
  // deleteAttr
  delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },

  // 添加或者修改属性
  // POST /admin/product/saveAttrInfo
  // {
  //   "attrName": "string",
  //   "attrValueList": [
  //     {
  //       "attrId": 0,
  //       "id": 0,
  //       "valueName": "string"
  //     }
  //   ],
  //   "categoryId": 0,
  //   "categoryLevel": 0,
  //   "id": 0
  // }
  addOrUpdate(attr){
    return request.post('/admin/product/saveAttrInfo',attr)
  }



   //根据id获取某个属性，属性值的列表，这里不用
  // GET /admin/product/getAttrValueList/{attrId}
  // getAttrValueList
}