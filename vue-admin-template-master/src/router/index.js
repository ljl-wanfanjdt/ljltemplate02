import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

//包含所有的用户都能操作的路由，也就是不需要权限就能操作的路由
//常量路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
]


  
  //是根据用户返回的权限数据信息决定是否注册这个路由，这个路由不是常量路由

//页面所有异步路由，需要根据权限数据来从这个路由数组当中过滤出用户所拥有的异步路由
export const allAsyncRoutes = [
  //权限数据管理相关的路由
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: { 
      title: '权限管理', 
      icon: 'el-icon-lock' 
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: { 
          title: '用户管理', 
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: { 
          title: '角色管理', 
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: { 
          title: '菜单管理',
        },
      },
    ]
  },
  //商品管理相关的路由,不是常量路由
  {
    path:'/product',
    component:Layout,  //首先得显示一级路由组件
    name:'Product',
    redirect: '/product/trademark/list',
    meta:{title: '商品管理', icon: 'el-icon-s-shop'},
    children:[
      {
        path:'trademark/list',
        component: () => import('@/views/product/trademark/List'),
        name:'Trademark',
        meta:{title: '品牌管理'}
      },
      {
        path:'attr/list',
        component: () => import('@/views/product/attr/List'),
        name:'Attr',
        meta:{title: '属性管理'}
      },
      {
        path:'sku/list',
        component: () => import('@/views/product/sku/List'),
        name:'Sku',
        meta:{title: 'sku管理'}
      },
      {
        path:'spu/list',
        component: () => import('@/views/product/spu/List'),
        name:'Spu',
        meta:{title: 'spu管理'}
      },
    ]
  },
  //测试相关的异步路由
  
  {
      path:'/test',
      component:Layout,  //首先得显示一级路由组件
      name:'Test',
      redirect: '/test/test1/list',
      meta:{title: '测试管理', icon: 'el-icon-edit'},
      children:[
        {
          path:'test1/list',
          component: () => import('@/views/test/test1/List'),
          name:'Test1',
          meta:{title: '测试111'}
        },
        {
          path:'test2/list',
          component: () => import('@/views/test/test2/List'),
          name:'Test2',
          meta:{title: '测试222'}
        }
      ]
  }
  
]

//任意路由，用户随意输入的非法路由路由，全部都会转到404路由界面
//注册这个路由的时候，一定要放在最后面注册
export const anyRoute = { path: '*', redirect: '/404', hidden: true }




const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
