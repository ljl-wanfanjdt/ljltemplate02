import store from '@/store'

//按钮的权限字符串是早早就设置好的
//用户有这个按钮的权限，那么这个用户返回的buttons就包含这个权限字符串
//用户没有这个按钮的权限，那么这个用户返回的buttons就没有这个权限字符串


export function hasBtnPermission(str){
  let buttons = store.getters.buttons  //拿的就是当前用户所有的按钮权限数据
  return buttons.indexOf(str) !== -1
} 