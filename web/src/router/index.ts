import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import("../components/Home.vue")
const Detail = () => import("../components/Detail.vue")
const Login: any = () => import("../components/Login.vue")
const Register: any = () => import("../components/Register.vue")
const Mine = () => import("../components/Mine.vue")
const Publish = () => import("../components/Publish.vue")
const Collect = () => import("../components/Collect.vue")
const Message = () => import("../components/Message.vue")
const Sellling = () => import("../components/Selling.vue")
const Puchased = () => import("../components/Puchased.vue")
const Friends = () => import("../components/Friends.vue")
const UserHome = () => import("../components/UserHome.vue")
const ReportMgr = () => import("../components/ReportMgr.vue")

const Search = () => import("../components/Search.vue")
const SearchResult = () => import("../components/SearchResult.vue")
const SysManage = () => import("../components/SysManage.vue")


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: Home,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      // meta: {
      //   keepAlive: true, //此组件需要被缓存
      // }

    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/reportmgr',
      name: 'reportmgr',
      component: ReportMgr
    },
    {
      path: '/friends',
      name: 'friends',
      component: Friends
    },
    {
      path: '/selling',
      name: 'selling',
      component: Sellling
    },
    {
      path: '/puchased',
      name: 'puchased',
      component: Puchased
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/mine',
      name: 'mine',
      component: Mine
    },
    {
      path: '/userhome',
      name: 'userhome',
      component: UserHome
    },
    {
      path: '/sysmanage',
      name: 'sysmanage',
      component: SysManage
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/searchresult',
      name: 'searchresult',
      component: SearchResult
    },
    {
      path: '/publish',
      name: 'publish',
      component: Publish
    },
    {
      path: '/message',
      name: 'message',
      component: Message
    },
    {
      path: '/collect',
      name: 'collect',
      component: Collect
    },
    {
      path: '/detail',
      name: 'detail',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Detail
    }
  ]
})

export default router

