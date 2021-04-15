
import Vue from 'vue'
import Router from 'vue-router'

import DaHuo from '@/pages/dahuo/index'
import MianLiao from '@/pages/mianliao/index'
import KaiFa from '@/pages/kaifa/index'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/dahuo', component: DaHuo, name: '大货' },
    { path: '/mianliao', component: MianLiao, name: '面料' },
    { path: '/kaifa', component: KaiFa, name: '开发' },
    { path: '/', component: DaHuo, name: '' }
    // { path: '*', redirect: { path: '/404' } }
  ]
})

/*
 * [路由守卫]
 */
// router.beforeEach((to, from, next) => {
//
// })
export default router
