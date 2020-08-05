// 组装模块并导出 store

import Vue from 'vue'
import Vuex from 'vuex'
/* 模块 */
import Dh from './modules/dh.js' // 大货
import Ml from './modules/ml.js' // 面料
import Gc from './modules/gc.js' // 大货
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    Dh, Ml, Gc
  },

  state: {
    active: '大货甘特表汇总'
  },

  getters: {},

  mutations: {
    /**
     * [保存数据]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    saveData(state, params) {
      const { module, name, obj } = params
      if (module) {
        state[module][name] = obj
      } else {
        state[name] = obj
      }
    },
    /**
     * [添加数据]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    assignData(state, params) {
      const { name, obj, module } = params
      if (module) {
        const data = state[module][name] || {}
        state[module][name] = Object.assign({}, data, obj)
      } else {
        const data = state[name] || {}
        state[name] = Object.assign({}, data, obj)
      }
    }
  },

  actions: {}
})

export default store
