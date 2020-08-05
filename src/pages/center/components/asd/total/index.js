// 组装模块并导出 store

import Vue from 'vue'
import Vuex from 'vuex'
import SelectArr from '../pages/center/components/selectArr'
import List from '../pages/center/components/list'
// import Api from '@/config/api'
/* 模块 */
// import UserInfo from './modules/userInfo' //     用户信息
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    // UserInfo, Shop, Menu, Table, Order, Beforehand, Music
  },

  state: {
    tableData: [], //      表格数据
    tableSignArr: [], //   表格签名数组  [用于下拉框选项变更后，生成新的表格]
    lastSearchVal: {}, //  上次搜索：大类
    lastSearchText: '', // 上次搜索：input
    selectArr: [], //      下拉框数据
    searchVal: {}, //      选中：大类
    searchLabel: {}, //    选中：表头名称
    searchText: '', //     搜索：input
    searchHeader: {} //    搜索：表头
  },

  getters: {
    /**
     * [删除线指标]
     * 跟此值相冲突的大类，标记删除线
     */
    deleteType: state => {
      const { selectArr, searchLabel } = state
      let deleteType = 'asd'
      for (const x in searchLabel) {
        if (searchLabel[x].length) {
          for (let i = 0; i < selectArr.length; i++) {
            // 下拉框有此属性 && 下拉框的属性与大类属性名相匹配
            if (selectArr[i].deleteType && selectArr[i].word === x) {
              deleteType = selectArr[i].deleteType // 记录第一个属性
              break
            }
          }
        }
        if (deleteType !== 'asd') {
          break
        }
      }
      return deleteType
    },
    /**
     * [是否需要：搜索]
     */
    isSearch: (state, getter) => {
      return (getter.changeSelect || getter.changeInput || getter.changeHeader)
    },
    /**
     * [是否变化：大类]
     */
    changeSelect: state => {
      let selectStatus = false
      const { searchVal, lastSearchVal } = state
      const arr = []
      const last = []
      for (const x in searchVal) {
        if (searchVal[x].length) {
          arr.push(x)
        }
      }
      for (const x in lastSearchVal) {
        if (lastSearchVal[x].length) {
          last.push(x)
        }
      }
      const str = arr.sort().join(',') // 将有值的下拉框的属性名拼成字符串
      const lastStr = last.sort().join(',') // 将有值的下拉框的属性名拼成字符串
      if (str !== lastStr) {
        selectStatus = true // 此时选中大类字符串 vs 上次搜索时大类字符串
      }
      return selectStatus
    },
    /**
     * [是否变化：input]
     */
    changeInput: state => {
      let inputStatus = false
      const { searchText, lastSearchText } = state
      if (searchText !== lastSearchText) {
        inputStatus = true // 此时input值 vs 上次搜索时input值
      }
      return inputStatus
    },
    /**
     * [是否变化：表头]
     */
    changeHeader: state => {
      let headerStatus = false
      const { searchHeader } = state
      for (const x in searchHeader) {
        if (searchHeader[x]) {
          headerStatus = true
          break
        }
      }
      return headerStatus
    },
    /**
     * [表头签名]
     */
    tableSign: state => {
      const str = JSON.stringify(state.searchLabel)
      state.tableSignArr.push(str)
      return str
    }
  },

  mutations: {
    /**
     * [保存数据]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    saveData(state, params) {
      const { name, obj } = params
      state[name] = obj
    },
    /**
     * [添加数据]
     * @param {[String]} name 属性名
     * @param {[Object]} obj  属性值
     */
    assignData(state, params) {
      const { name, obj } = params
      const data = state[name] || {}
      state[name] = Object.assign({}, data, obj)
    },
    /**
     * [首页模拟请求：1秒后赋值]
     */
    asd(state, params) {
      const { name } = params
      if (name === 'selectArr') {
        state[name] = SelectArr

        /**
         * [处理数据]
         */
        const { base, DHXG_1, KFXG, SJXG, HDXX, WWJGCXG, DHXG_2, DHCGXG, DHYHXG } = List
        /* 各模块数组构成的数组 */
        const listArr = [base, DHXG_1, KFXG, SJXG, HDXX, WWJGCXG, DHXG_2, DHCGXG, DHYHXG]

        const moduleArr = [] // [moduleObj_1, moduleObj_2, moduleObj_3]
        const numArr = {} //    各 style_id 最大条数  { style_id_1: 1, style_id_2: 2, style_id_3: 3 }
        for (let i = 0; i < listArr.length; i++) {
          const item = listArr[i] // 单个模块数据
          /* 整理数据 */
          const moduleObj = {} //    { style_id_1: [], style_id_2: [], style_id_3: [] }
          for (let j = 0; j < item.length; j++) {
            const val = item[j] // 单条数据
            if (!moduleObj[val.style_id]) {
              moduleObj[val.style_id] = []
            }
            moduleObj[val.style_id].push(val)
          }
          moduleArr.push(moduleObj)
          /* 统计：各 style_id 最大条数 */
          for (const x in moduleObj) {
            const length = moduleObj[x].length
            const num = numArr[x] || 0
            if (length > num) {
              numArr[x] = length
            }
          }
        }
        const arr = []
        /* 循环：大条（按 style_id 划分） */
        for (const x in numArr) {
          /* 循环：各大条内有多少行内容 */
          for (let i = 0; i < numArr[x]; i++) {
            let line = {}
            /* 循环：模块 */
            for (let m = 0; m < moduleArr.length; m++) {
              const item = moduleArr[m] // 单个模块  同：moduleObj
              if (item[x]) {
                const obj = item[x][i] || {}
                line = Object.assign({}, line, obj)
              }
            }
            arr.push(line)
          }
        }
        // console.log(' ----- ', moduleArr, numArr)
        /**
         * [处理数据]
         */

        state['tableData'] = arr
      } else if (name === 'searchLabel') {
        state[name] = JSON.parse(localStorage.getItem('NOVA_total_searchLabel'))
      }
    }
  },

  actions: {
    /**
     * [搜索]
     */
    search({ state }, params) {
      const { that } = params
      const { searchVal, searchLabel, searchText } = that
      // console.log(' ----- 值 -----', searchVal)
      // console.log(' ----- 表头 -----', searchLabel)
      // console.log(' ----- input -----', searchText)
      /** ----- 成功后 ----- **/
      /* 记录数据 */
      state.lastSearchVal = Object.assign({}, searchVal)
      state.searchLabel = Object.assign({}, searchLabel)
      state.lastSearchText = searchText
      /* 本地缓存 */
      localStorage.setItem('NOVA_total_searchVal', JSON.stringify(searchVal))
      localStorage.setItem('NOVA_total_searchLabel', JSON.stringify(searchLabel))
      localStorage.setItem('NOVA_total_searchText', searchText)
    }
  }
})

/**
 * 数据结构：大类
 */
// const searchVal = {
//   DHXG_1: ['attr1', 'attr2'], // [val_1, val_2]
//   KFXG: []
// }

/**
 * 数据结构：表头
 */
// const searchLabel = {
//   DHXG_1: ['大货相关_1', '大货相关_2'], // [label_1, label_2]
//   KFXG: []
// }

export default store
