
/**
 * [大货模块]
 */
import Api from '@/config/api'
import Tool from '../tool.js'
import { Message, MessageBox } from 'element-ui'

const Dh = {
  namespaced: true,
  state: {
    loadingPage: false, // 分页：页面
    loading: {}, //        分页：折叠部分
    /* 提交 / 撤销审核 / 节点变更 */
    item_gantt_id: '', //  项目甘特表主键id
    item_id: '', //        项目ID
    /* 高级查询 */
    isDialog: false, //    是否显示
    filter_data: [], //    搜索值
    /* 表格数据：外部 */
    tableData_1: [], //    表格数据
    tableNodes: [], //     表格节点
    disabledChange: {}, // 禁止：批量节点变更 { id: true }
    /* 表格数据：内部 */
    tableData_2: {}, //    内部节点（列）
    node_name: '', //      搜索：节点名称
    status: '', //         搜索：节点状态
    /* 分页：外部 */
    pagenum: 1, //         页数
    rownum: 10, //         每页条数
    pageCount: 0, //       总条数
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
    A_tableData({ state }, { that }) {
      const res = JSON.parse(localStorage.getItem('大货汇总'))
      const { data, nums, title, yjts } = res
      /* 给数据添加属性 */
      const list = Tool.mapData(data, yjts, 'nodes')
      console.log('list ----- ', res)
      /* 赋值 */
      state.tableData_1 = list //  表格数据
      state.pageCount = nums //    总条数
      state.tableNodes = title //  列：表格外层
      state.loadingPage = false // 隐藏加载动画
      /** 计算：表格高度 **/
      that._countHeight()

      // const { pagenum, rownum, loadingPage, filter_data } = state
      // if (!loadingPage) {
      //   state.loadingPage = true
      //   /* 发起请求 */
      //   const name = '统计列表'
      //   const obj = {
      //     filter_data: JSON.stringify(filter_data),
      //     type: 1,
      //     page: parseInt(pagenum) - 1,
      //     num: rownum,
      //     empid: '965BAD8F4EF5C14CE4F607E77D30B9B5'
      //   }
      //   const suc = function (res) {
      //     localStorage.setItem('大货汇总', JSON.stringify(res))
      //     const { data, nums, title, yjts } = res
      //     /* 给数据添加属性 */
      //     const list = Tool.mapData(data, yjts, 'nodes')
      //     /* 赋值 */
      //     state.tableData_1 = list //  表格数据
      //     state.pageCount = nums //    总条数
      //     state.tableNodes = title //  列：表格外层
      //     state.loadingPage = false // 隐藏加载动画
      //     /** 计算：表格高度 **/
      //     that._countHeight()
      //   }
      //   Api({ name, obj, suc })
      // }
    },
    /**
     * [请求：表格折叠数据]
     * @param {[Object]} row 当前展开行的数据
     */
    A_tableOtherData({ state }, { row }) {
      const { item_gantt_id, index } = row
      const { pagenum, rownum } = state.pageObj[index]
      const { node_name, status } = state
      const empid = '965BAD8F4EF5C14CE4F607E77D30B9B5'
      /* 发起请求 */
      const name = '节点列表'
      const obj = { item_gantt_id, page: parseInt(pagenum) - 1, num: rownum, status, node_name, empid }
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
      }
      Api({ name, obj, suc })
    },
    /**
     * [请求：审核前验证]
     */
    A_beforeSubmitAudit({ state }, { audit_status, that }) {
      // const { item_gantt_id } = state
      const item_gantt_id = '8a8a8062735528fc0173557b338f008b'
      const gantt_type = 1
      /* ----- 发起请求 ----- */
      const name = '审核前验证'
      const obj = { item_gantt_id, gantt_type, audit_status }
      const suc = function (res) {
        console.log(res)
        const { status, msg = '', data: { itemGanttSummary = [] } } = res
        if (status === 0) {
          Message.error(msg)
        } else if (!itemGanttSummary.length) {
          Message.error('无满足条件的数据！')
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
        console.log('提交审核 ----- ', res)
        /** 刷新 **/
        that.f5()
      }
      const loading = '提交审核中...'
      Api({ name, obj, suc, loading })
    },
    /**
     * [请求：撤销审核]
     */
    A_goBackAudit({ state }, { params, that }) {
      const name = '撤销审核'
      const obj = params
      const suc = function (res) {
        console.log('撤销审核 ----- ', res)
        /** 刷新 **/
        that.f5()
      }
      const loading = '撤销审核中...'
      Api({ name, obj, suc, loading })
    },
    /**
     * [请求：节点变更前验证]
     */
    A_beforBatchAdjusmentItemGantt({ state }, { item_gantt_id, item_id, that }) {
      const res = JSON.parse(localStorage.getItem('大货甘特表汇总发起变更前验证'))
      console.log('大货甘特表汇总发起变更前验证 ----- ', res)
      const { data = [] } = res
      const list = []
      let message = ''
      let goTo = false
      if (data.length === 1 && !data[0].message) {
        /* ----- 1条，直接跳转 ----- */
        const obj = data[0]
        localStorage.setItem('NOVA_ItemNodeAdjustmentHtml', JSON.stringify(Object.assign({}, obj, { page_type: 'add', item_id, item_gantt_id, gantt_type: 1 })))
        // ① 保存到本地缓存，  ② win 方法打开页面
        return
      } else if (data.length === 1 && data[0].message) {
        /* ----- 未审核通过，提示message ----- */
        const { message } = data[0]
        Message.error(message)
        state.disabledChange = Object.assign({}, state.disabledChange, { [item_gantt_id]: true })
        return
      } else {
        data.forEach(function (item) {
          if (item.message) {
            message = item.message // 记录：message
          }
          if (item.message && !item.item_gantt_detail_id) {
            goTo = true // 提示一秒，延迟后win方法打开新页面
          } else {
            list.push(item)
          }
        })
      }
      if (goTo) {
        /* ----- 提示一秒，延迟后win方法打开新页面 ----- */
        MessageBox.confirm(message, '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const obj = list[0]
          localStorage.setItem('NOVA_ItemNodeAdjustmentHtml', JSON.stringify(Object.assign({}, obj, { page_type: 'add', item_id, item_gantt_id, gantt_type: 1 })))
          // ① 保存到本地缓存，  ② win 方法打开页面
        }).catch(() => {})
      } else {
        /* ----- 多选一  提示message ----- */
        that.changeList = list
        that.dialogVisible_change = true
        that.messageChange = message
      }

      // const name = '大货甘特表汇总发起变更前验证'
      // const obj = { item_gantt_id }
      // // const obj = { item_gantt_id: '8a8a8062735528fc0173557b338f008b' }
      // const suc = function (res) {
      //   localStorage.setItem('大货甘特表汇总发起变更前验证', JSON.stringify(res))
      //   console.log('大货甘特表汇总发起变更前验证 ----- ', res)
      // }
      // Api({ name, obj, suc })
    }
  }
}

export default Dh
