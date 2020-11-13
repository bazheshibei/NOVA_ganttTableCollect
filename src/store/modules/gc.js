
/**
 * [工厂模块]
 */
import Api from '@/config/api'
import Tool from '../tool.js'
import { MessageBox } from 'element-ui'

const Gc = {
  namespaced: true,
  state: {
    loadingPage: false, //       分页：页面
    loading: {}, //              分页：折叠部分
    /* 编辑 / 提交 / 撤销审核 / 节点变更 / 帮助 */
    item_id: '', //              项目ID
    item_gantt_id: '', //        项目甘特表主键id
    item_gantt_detail_id: '', // 甘特表明细主键id
    isChangeNodes: false, //     是否可以批量变更节点
    isEdit: false, //            是否可以编辑
    helpText: '', //             帮助文字
    /* 高级查询 */
    isDialog: false, //          是否显示
    filter_data: [], //          搜索值
    /* 表格数据：外部 */
    tableData_1: [], //          表格数据
    tableNodes: [], //           表格节点
    disabledChange: {}, //       禁止：批量节点变更 { id: true }
    /* 表格数据：内部 */
    tableData_2: {}, //          内部节点（列）
    node_name: '', //            搜索：节点名称
    status: '', //               搜索：节点状态
    /* 分页：外部 */
    pagenum: 1, //               页数
    rownum: 10, //               每页条数
    pageCount: 0, //             总条数
    /* 分页：内部 */
    pageObj: {}
  },

  /* 方法 */
  mutations: {},

  /* 计算属性 */
  getters: {},

  /* 异步操作 */
  actions: {
    /**
     * [请求：表格基础数据]
     */
    A_tableData({ state }) {
      const { pagenum, rownum, loadingPage, filter_data } = state
      if (!loadingPage) {
        state.loadingPage = true
        // const empid = '965BAD8F4EF5C14CE4F607E77D30B9B5'
        /* 发起请求 */
        const name = '统计列表'
        const obj = { filter_data: JSON.stringify(filter_data), type: 3, page: parseInt(pagenum) - 1, num: rownum, empid: '' }
        const suc = function (res) {
          const { data, nums, title, yjts } = res
          /* 给数据添加属性 */
          const list = Tool.mapData(data, yjts, 'nodes')
          /* 赋值 */
          state.tableData_1 = list //  表格数据
          state.pageCount = nums //    总条数
          state.tableNodes = title //  列：表格外层
          state.loadingPage = false // 隐藏加载动画
        }
        Api({ name, obj, suc })
      }
    },
    /**
     * [请求：表格折叠数据]
     * @param {[Object]} row 当前展开行的数据
     */
    A_tableOtherData({ state }, { row }) {
      const { item_gantt_id, index } = row
      const { pagenum, rownum } = state.pageObj[index]
      const { node_name, status } = state
      // const empid = '965BAD8F4EF5C14CE4F607E77D30B9B5'
      /* 发起请求 */
      const name = '节点列表'
      const obj = { item_gantt_id, page: parseInt(pagenum) - 1, num: rownum, status, node_name, empid: '' }
      const suc = function (res) {
        const { data, nums } = res
        const { tableData_2, loading } = state
        /* 给数据添加属性 */
        const { yjts } = state
        const list = Tool.mapData(data, yjts)
        /* 赋值 */
        tableData_2[index] = list
        loading[index] = false
        state.tableData_2 = Object.assign({}, tableData_2)
        state.loading = Object.assign({}, loading)
        state.pageObj[index].pageCount = nums
        /* 重置搜索条件 */
        state.node_name = ''
        state.status = ''
      }
      const err = function () {
        /* 关闭：加载动画 */
        const { loading } = state
        loading[index] = false
        state.loading = Object.assign({}, loading)
        /* 重置搜索条件 */
        state.node_name = ''
        state.status = ''
      }
      Api({ name, obj, suc, err })
    },
    /**
     * [请求：审核前验证]
     */
    A_beforeSubmitAudit({ state }, { audit_status, that }) {
      const { item_gantt_id } = state
      const gantt_type = 3
      /* ----- 发起请求 ----- */
      const name = '审核前验证'
      const obj = { item_gantt_id, gantt_type, audit_status }
      const suc = function (res) {
        const { data, msg, status } = res
        const { itemGanttSummary = [] } = data === null ? {} : data
        if (String(status) === '0') {
          MessageBox({ title: '数据异常', message: msg, type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
        } else if (!itemGanttSummary.length) {
          MessageBox({ title: '数据异常', message: '无满足条件的数据！', type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
        } else {
          that.beforeSubmit_1(itemGanttSummary, audit_status)
        }
      }
      const loading = '验证项目信息中...'
      Api({ name, obj, suc, loading })
    },
    /**
     * [请求：提交审核]
     */
    A_submitAudit({ state }, { params, that }) {
      const name = '提交审核'
      const obj = params
      const suc = function (res) {
        const { msg, status } = res
        if (String(status) === '0') {
          MessageBox({ title: '数据异常', message: msg, type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
        } else {
          /** 刷新 **/
          that.f5(false)
        }
      }
      Api({ name, obj, suc })
    },
    /**
     * [请求：撤销审核]
     */
    A_goBackAudit({ state }, { params, that }) {
      const name = '撤销审核'
      const obj = params
      const suc = function (res) {
        const { msg, status } = res
        if (String(status) === '0') {
          MessageBox({ title: '数据异常', message: msg, type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
        } else {
          /** 刷新 **/
          that.f5(false)
        }
      }
      Api({ name, obj, suc })
    },
    /**
     * [请求：节点变更前验证]
     */
    A_beforBatchAdjusmentItemGantt({ state }, { item_gantt_id, item_id, that }) {
      const name = '大货甘特表汇总发起变更前验证'
      const obj = { item_gantt_id }
      // const obj = { item_gantt_id: '8a8a8062735528fc0173557b338f008b' }
      const suc = function (res) {
        // localStorage.setItem('大货甘特表汇总发起变更前验证', JSON.stringify(res))
        // console.log('大货甘特表汇总发起变更前验证 ----- ', res)
        const { data = [], msg, status } = res
        const list = []
        let goTo = false
        if (String(status) === '0') {
          MessageBox({ title: '数据异常', message: msg, type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
        } else if (!data.length) {
          MessageBox({ title: '数据异常', message: '此项目不能批量变更节点', type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
          state.disabledChange = Object.assign({}, state.disabledChange, { [item_gantt_id]: true })
          return
        } else if (data.length === 1 && !data[0].message) {
          /* ----- 情况 ①：1条，直接跳转 ----- */
          /* 保存到本地缓存 */
          const obj = data[0]
          localStorage.setItem('NOVA_ItemNodeAdjustmentHtml', JSON.stringify(Object.assign({}, obj, { page_type: 'add', item_id, item_gantt_id, gantt_type: 3 })))
          /* win 方法打开页面 */
          const url = window.location.origin + '/nova/pages/itemnodeadjustment/itemNodeBatchAdjustment.html'
          // eslint-disable-next-line
          win({ title: '批量变更节点', width: 1500, height: 600, url, param: {}, fn() { that.f5(false) } })
          return
        } else if (data.length === 1 && data[0].message) {
          /* ----- 情况 ②：未审核通过，提示message ----- */
          const { message } = data[0]
          MessageBox({ title: '数据异常', message, type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
          state.disabledChange = Object.assign({}, state.disabledChange, { [item_gantt_id]: true })
          return
        } else {
          data.forEach(function (item) {
            if (item.message && !item.item_gantt_detail_id) {
              goTo = true // 通往 ③
            } else {
              list.push(item) // ④ 添加信息
            }
          })
        }
        if (goTo) {
          /* ----- 情况 ③：win方法打开新页面 ----- */
          /* 保存到本地缓存 */
          let obj = {}
          data.forEach(function (item) {
            if (item.item_gantt_detail_id) {
              obj = item
            }
          })
          localStorage.setItem('NOVA_ItemNodeAdjustmentHtml', JSON.stringify(Object.assign({}, obj, { page_type: 'add', item_id, item_gantt_id, gantt_type: 3 })))
          /* win 方法打开页面 */
          const url = window.location.origin + '/nova/pages/itemnodeadjustment/itemNodeBatchAdjustment.html'
          // eslint-disable-next-line
          win({ title: '批量变更节点', width: 1500, height: 600, url, param: {}, fn() { that.f5(false) } })
        } else {
          /* ----- 情况 ④：多选一  提示message ----- */
          that.changeList = list
          that.dialogVisible_change = true
        }
      }
      Api({ name, obj, suc })
    },
    /**
     * [请求：节点完成前验证]
     */
    A_testItemNodeStatus({ state }, { item_id, item_node_id, completion_method, index, that }) {
      const name = '节点完成前验证'
      const obj = { item_node_id }
      const suc = function (res) {
        let url = window.location.origin + '/nova'
        let param = {}
        const { data, msg, status } = res
        const { action, node_complete_id, url: path } = data === null ? {} : data
        if (String(status) === '0') {
          MessageBox({ title: '数据异常', message: msg, type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
        } else {
          if (action === 'showAdd') {
            param = { item_node_id, item_id, complete_mode: completion_method } // 项目节点id, 项目id, 完成方式 1手动完成，2业务关联完成
            url = url + path + `?action=${action}&item_node_id=${item_node_id}&item_id=${item_id}&complete_mode=${completion_method}`
          } else {
            param = { id: node_complete_id } // 完成记录主键id
            url = url + path + `?action=${action}&id=${node_complete_id}`
          }
          // eslint-disable-next-line
          updateWin({ title: '完成节点', width: 1700, height: 700, url, param, onClose() {}, fn() { that.f5(false) } })
        }
        /* 关闭：加载动画 */
        state.loading[index] = false
      }
      const err = function () {
        /* 关闭：加载动画 */
        state.loading[index] = false
      }
      Api({ name, obj, suc, err })
    },
    /**
     * [请求：单独变更节点前验证]
     */
    A_adjustmentNodeTest({ state }, { that, item_id, item_node_id }) {
      const name = '单独变更节点前验证'
      const obj = { item_node_id, type: 2 }
      const suc = function (res) {
        const { data, msg, status } = res
        const { is_quote, item_gantt_id, item_gantt_detail_id } = data === null ? {} : data
        if (String(status) === '0') {
          MessageBox({ title: '数据异常', message: msg, type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
        } else if (is_quote === 1) {
          MessageBox({ title: '数据异常', message: '此节点被引用，不能变更', type: 'warning', closeOnClickModal: false, closeOnPressEscape: false })
        } else {
          const url = window.location.origin + `/nova/itemNodeAdjustmentShowAction.do?action=showAdd&item_id=${item_id}&item_node_id=${item_node_id}&adjustment_type=2&item_gantt_id=${item_gantt_id}&item_gantt_detail_id=${item_gantt_detail_id}&gantt_type=3`
          const param = { item_id, item_node_id, adjustment_type: 2, item_gantt_id, item_gantt_detail_id, gantt_type: 3 }
          // eslint-disable-next-line
          updateWin({ title: '变更节点', width: 1500, height: 600, url, param, onClose(data) {}, fn(data) { that.f5(false) } })
        }
      }
      const loading = '验证中...'
      Api({ name, obj, suc, loading })
    },
    /**
     * [请求：甘特表帮助按钮]
     */
    A_getHelpText({ state }) {
      const name = '甘特表帮助按钮'
      const obj = { help_page_url: 'DHGCGTBHZ' }
      const method = 'get'
      const suc = function (res) {
        state.helpText = res.data.help_page_text
      }
      Api({ name, obj, method, suc })
    }
    //
  }
}

export default Gc
