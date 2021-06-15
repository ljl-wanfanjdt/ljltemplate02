import { login, logout, getInfo } from '@/api/acl/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,allAsyncRoutes,anyRoute,constantRoutes } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'

const getDefaultState = () => {
  return {
    token: getToken(), //登录后的token存储，先从cookies当中获取，获取不到再登录第一次设置  
    name: '', //获取用户信息后存储用户的名称
    avatar: '', //获取用户信息后存储用户的头像

    roles:[],   //保存用户的角色权限信息
    buttons:[], //保存用户的按钮权限信息

    asyncRoutes:[],   //保存当前用户返回的name数组对应的异步路由数组（返回的数据是异步路由名称的数组）



    routes:[],//最终用户要使用的所有路由：包含常量路由，用户的异步路由和任意路由
  }
}


//通过返回的用户异步路由名称数组，从所有的异步路由数组当中，过滤出用户的异步路由数组
function filterAsyncRoutes(allAsyncRoutes,routeNames){
  let asyncRoutes = allAsyncRoutes.filter(item => {
    if(routeNames.indexOf(item.name) !== -1){
      //代表当前遍历的这一项路由，它的名称确实是在返回来的路由名称数组里面，那么这一项路由就要了
      if(item.children && item.children.length){
        //如果当前这个路由是有子路由的，子路由也要去过滤出用户路由名称包含的
        //过滤出子路由把原本的子路由替换掉
        item.children = filterAsyncRoutes(item.children,routeNames)
      }
      return true
    }
  })

  return asyncRoutes
}



const state = getDefaultState()


const mutations = {

  // RESET_STATE: (state) => {
  //   state.token = getToken()
  //   state.name = ''
  //   state.avatar = ''
  // },
  // 就是把state当中原来的东西全部清空
  RESET_STATE: (state) => {
    //Object.assign 方法是合并复制  是把第二个参数对象当中的属性 复制合并到第一个参数对象当中
    Object.assign(state, getDefaultState())
  },
  //登录后设置用户token  存储到state
  SET_TOKEN: (state, token) => {
    state.token = token
  },


  //获取用户信息后设置用户信息 存储到state
  SET_USERINFO(state,userInfo){
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },

  SET_ROUTES(state,asyncRoutes){
    state.asyncRoutes = asyncRoutes
    // 把常量路由和用户的异步路由还有任意路由，拼接为这个用户所有的路由数组，后期生成菜单需要这个总的路由数组
    state.routes = constantRoutes.concat(asyncRoutes,anyRoute)

    //路由器当中目前还是只有常量路由，那么我们需要动态的给路由器当中添加路由
    //动态给路由器添加路由，参数必须是符合路由配置的数组
    router.addRoutes([...asyncRoutes,anyRoute])
  }
}






const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token) //提交第一次设置token
        setToken(data.token) //存储token到cookies当中
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // async login({ commit }, userInfo){
  //   const { username, password } = userInfo
  //   const response = await login({ username: username.trim(), password: password })
  //   if(response.code === 20000){
  //     const { data } = response
  //     commit('SET_TOKEN', data.token) //提交第一次设置token
  //     setToken(data.token) //存储token到cookies当中
  //     return 'ok'
  //   }else{
  //     return Promise.reject(new Error('failed'))
  //   }
  // }
  // },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // const { name, avatar } = data
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)

        commit('SET_USERINFO',data)
        
        //data.routes返回的是这个用户所有的路由权限信息  就是所有这个用户要注册的异步路由的名称name数组
        // commit('SET_ROUTES',data.routes)

        //得把data.routes换成我们需要的路由数组


        //filterAsyncRoutes函数会把allAsyncRoutes内部原本的子路由过滤掉一部分
        //原本的子路由不在了，你拿到的是一份残缺的子路由，和上次登录的用户一样的
        //所以在过滤的时候，记得把所有的异步路由做深拷贝，然后再去操作，不会影响原有的
        
        commit('SET_ROUTES',filterAsyncRoutes(cloneDeep(allAsyncRoutes),data.routes))

        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter() //重新设置路由
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true, //命名空间  写了它 以后访问actions getters mutations 就得加上名称前缀  user/login
                    //可以让多个模块有相同的actions getters mutations   home/login
  state,
  mutations,
  actions
}

