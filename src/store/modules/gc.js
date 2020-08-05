
/**
 * [工厂模块]
 */
import Api from '@/config/api'
import Tool from '../tool.js'
import { Message } from 'element-ui'

const Gc = {
  namespaced: true,
  state: {
    loadingPage: false, // 分页：页面
    loading: {}, //        分页：折叠部分
    /* 提交 / 撤销审核 */
    item_gantt_id: '', //  项目甘特表主键id
    item_id: '', //        项目ID
    /* 高级查询 */
    isDialog: false, //    是否显示
    filter_data: [], //    搜索值
    /* 表格数据：外部 */
    tableData_1: [], //    表格数据
    tableNodes: [], //     表格节点
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
      const { pagenum, rownum, loadingPage, filter_data } = state
      if (!loadingPage) {
        state.loadingPage = true
        /* 发起请求 */
        const name = '统计列表'
        const obj = {
          filter_data: JSON.stringify(filter_data),
          type: 3,
          page: parseInt(pagenum) - 1,
          num: rownum,
          empid: '965BAD8F4EF5C14CE4F607E77D30B9B5'
        }
        const suc = function (res) {
          const { data, nums, title, yjts } = res
          /* 给数据添加属性 */
          const list = Tool.mapData(data, yjts, 'nodes')
          /* 赋值 */
          state.tableData_1 = list //  表格数据
          state.pageCount = nums //    总条数
          state.tableNodes = title //  列：表格外层
          state.loadingPage = false // 隐藏加载动画
          /** 计算：表格高度 **/
          that._countHeight()
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
      const { item_gantt_id } = state
      const gantt_type = 3
      /* ----- 发起请求 ----- */
      const name = '审核前验证'
      const obj = { item_gantt_id, gantt_type, audit_status }
      const suc = function (res) {
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
        /** 刷新 **/
        that.f5()
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
        /** 刷新 **/
        that.f5()
      }
      Api({ name, obj, suc })
    }
  }
}

export default Gc
