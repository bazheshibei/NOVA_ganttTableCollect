// 组装模块并导出 store

import Vue from 'vue'
import Vuex from 'vuex'
/* 模块 */
import DhDh from './modules/dh_dh.js' // 大货：大货
import DhMl from './modules/dh_ml.js' // 大货：面料
import DhGc from './modules/dh_gc.js' // 大货：工厂
import MlMl from './modules/ml_ml.js' // 面料：面料
import MlFs from './modules/ml_fs.js' // 面料：分色
import MlXz from './modules/ml_xz.js' // 面料：选择
import KfKf from './modules/kf_kf.js' // 开发：开发
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    DhDh, DhMl, DhGc, MlMl, MlFs, MlXz, KfKf
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
