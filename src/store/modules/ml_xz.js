
/**
 * [面料：面料]
 */
import Api from '@/config/api'
import Tool from '../tool.js'

const MlXz = {
  namespaced: true,
  state: {
    loadingPage: false, // 分页：页面
    /* 高级查询 */
    isDialog: false, //    是否显示
    filter_data: [], //    搜索值
    /* 表格数据：外部 */
    tableData_1: [], //    表格数据
    tableNodes: [], //     表格节点
    /* 分页：外部 */
    pagenum: 1, //         页数
    rownum: 20, //         每页条数
    pageCount: 0, //       总条数
    /* 提交 */
    ids: '' //             选中的项目ID
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
      // const res = JSON.parse(localStorage.getItem('面料__分色'))
      // console.log('面料__分色', res.data)
      // const { data, nums, title, yjts } = res
      // /* 给数据添加属性 */
      // const list = Tool.mapData(data, yjts, 'nodes')
      // /* 赋值 */
      // state.tableData_1 = list //  表格数据
      // state.pageCount = nums //    总条数
      // state.tableNodes = title //  列：表格外层
      // state.loadingPage = false // 隐藏加载动画

      const { pagenum, rownum, loadingPage, filter_data } = state
      if (!loadingPage) {
        state.loadingPage = true
        // const empid = '965BAD8F4EF5C14CE4F607E77D30B9B5'
        const empid = ''
        /* 发起请求 */
        const name = '统计列表'
        const obj = { filter_data: JSON.stringify(filter_data), type: 5, page: parseInt(pagenum) - 1, num: rownum, empid }
        const suc = function (res) {
          // console.log(res)
          // localStorage.setItem('面料__面料', JSON.stringify(res))
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
    }
    //
  }
}

export default MlXz
