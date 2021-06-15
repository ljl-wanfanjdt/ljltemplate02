const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  buttons: state => state.user.buttons,
  routes: state => state.user.routes, //这个就是我们要的所有的用户留有数组
}
export default getters
