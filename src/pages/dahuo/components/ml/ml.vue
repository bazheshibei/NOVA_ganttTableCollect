
<!-- 面料 -->

<template>
  <div class="comBox" ref="page">

    <div class="topBtnLine">
      <div>
        <el-button type="primary" size="mini" @click="advancedQuery">高级查询</el-button>
        <el-button type="primary" size="mini" @click="f5">刷新</el-button>
        <el-button type="primary" size="mini" :disabled="!item_gantt_id" @click="edit">编辑</el-button>
      </div>
      <div>
        <el-button type="primary" size="mini" plain @click="toExport">导出</el-button>
        <el-button type="primary" size="mini" plain :disabled="!helpText" @click="dialogVisible_help = true">帮助</el-button>
      </div>
    </div>

    <!-- 表格组件 -->
    <com-table :style="tableStyle" :tableHeight="tableHeight" :f5Tof5="f5Tof5" style="padding-right: 30px;"></com-table>

    <!-- 分页 -->
    <div class="paginationBox" ref="bottomBox">
      <el-pagination class="comPagination" :page-size="rownum" :page-sizes="[10, 20, 30, 50, 100]" :total="pageCount" :current-page="pagenum"
        layout="prev, pager, next, total, jumper, sizes" prev-text="上一页" next-text="下一页"
        @size-change="pageChange('rownum', $event)" @current-change="pageChange('pagenum', $event)"
      >
      </el-pagination>
    </div>
    <!-- /分页 -->

    <!-- 高级查询 -->
    <com-advancedQuery></com-advancedQuery>

    <!-- 弹出层：帮助 -->
    <el-dialog class="helpComDialog" title="帮助" :visible.sync="dialogVisible_help" width="95%">
      <p v-html="helpText"></p>
    </el-dialog>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import ComTable from './components/table.vue' //                 表格组件
import ComAdvancedQuery from './components/advancedQuery.vue' // 高级查询
export default {
  components: { ComTable, ComAdvancedQuery },
  data() {
    return {
      tableHeight: 0,
      tableStyle: {},
      f5Tof5: 0, // 两个刷新联动
      /* 弹出层 */
      dialogVisible: false, // 是否显示弹出层
      dialogVisible_help: false, //   是否显示弹出层：帮助
      itemGanttSummary: [], // 甘特表类型数组
      audit_status: 1, //      1提交审核，2撤销审核
      radio: '', //            多选时提交的节点
      input: '' //             撤销说明
    }
  },
  created() {
    /** 计算：表格高度 **/
    this._countHeight()
    /** 请求：甘特表帮助按钮 **/
    this.$store.dispatch('DhMl/A_getHelpText')
  },
  computed: {
    ...mapState('DhMl', ['pagenum', 'rownum', 'pageCount', 'item_id', 'item_gantt_id', 'item_gantt_detail_id', 'helpText'])
  },
  methods: {
    /**
     * [导出]
     */
    toExport() {
      /** 请求：表格基础数据 **/
      this.$store.dispatch('DhMl/A_tableData', { path2: '&isExport=1' })
    },
    /**
     * [编辑]
     */
    edit() {
      const that = this
      /* 保存到本地缓存 */
      const { item_id, item_gantt_id, item_gantt_detail_id } = this
      localStorage.setItem('NOVA_reject', JSON.stringify({ item_id, item_gantt_id, item_gantt_detail_id }))
      /* win 方法打开页面 */
      // const url = window.location.origin + '/nova/pages/itemganttsummary/itemGanttSummaryUpdate.html'
      const url = window.location.origin + '/nova/itemGanttSummaryShowAction.do?action=getItemSummaryMl&item_id=' + item_id
      // eslint-disable-next-line
      // win({ title: '编辑', width: 1500, height: 600, url, param: {}, fn() { that.f5(false) } })
      // eslint-disable-next-line
      updateWin({ title: '编辑', width: 1500, height: 600, url, param: { item_id }, onClose() {}, fn() { that.f5(false) } })
    },
    /**
     * [高级查询]
     */
    advancedQuery() {
      this.$store.commit('saveData', { name: 'isDialog', obj: true, module: 'DhMl' })
    },
    /**
     * [刷新]
     * @param {[Boolean]} reset 是否重置分页
     */
    f5(reset = true) {
      if (reset) {
        this.$store.commit('saveData', { module: 'DhMl', name: 'pagenum', obj: 1 })
        this.$store.commit('saveData', { module: 'DhMl', name: 'rownum', obj: 10 })
        this.$store.commit('saveData', { module: 'DhMl', name: 'pageCount', obj: 0 })
      }
      this.$store.commit('saveData', { module: 'DhMl', name: 'item_id', obj: '' })
      this.$store.commit('saveData', { module: 'DhMl', name: 'item_gantt_id', obj: '' })
      this.$store.commit('saveData', { module: 'DhMl', name: 'item_gantt_detail_id', obj: '' })
      /** 发起请求 **/
      this._request()
    },
    /**
     * [分页切换]
     * @param {[String]} name 属性名
     * @param {[Int]}    val  属性值
     */
    pageChange(name, val) {
      /** 保存数据 **/
      this.$store.commit('saveData', { module: 'DhMl', name, obj: val })
      if (name === 'rownum') {
        this.$store.commit('saveData', { module: 'DhMl', name: 'pagenum', obj: 1 })
      }
      /** 发起请求 **/
      this._request()
    },
    /**
     * [发起请求]
     */
    _request() {
      /* 重置折叠数据 */
      this.$store.commit('saveData', { module: 'DhMl', name: 'tableData_2', obj: {} })
      /* 两个刷新联动 */
      this.f5Tof5 += 1
      /** 请求：表格基础数据 **/
      this.$store.dispatch('DhMl/A_tableData', { that: this })
    },
    /**
     * [计算：表格高度]
     */
    _countHeight() {
      const that = this
      let i = 0
      const timer = setInterval(function () {
        if (Object.keys(that.$refs).length) {
          const { page, bottomBox } = that.$refs
          if (page.clientHeight && bottomBox.clientHeight) {
            const num = page.clientHeight - bottomBox.clientHeight - 40
            that.tableStyle = { height: num + 'px' }
            that.tableHeight = num
            clearInterval(timer)
          }
        }
        if (i > 500) {
          clearInterval(timer)
        }
        i++
      }, 100)
    }
  }
}
</script>

<style scoped>
.comBox {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

/*** 顶部按钮 ***/
.topBtnLine {
  width: calc(100% - 30px);
  height: 40px;
  margin-right: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/*** 分页 ***/
.paginationBox {
  height: 34px;
  margin: 0 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/*** 弹出层 ***/
.dialogLine {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.dialogLine:last-child {
  margin-bottom: 0;
}
.dialogLine > span {
  white-space: nowrap;
}
</style>

<style>
.helpComDialog > .el-dialog {
  border-radius: 15px !important;
  overflow: hidden;
}
.helpComDialog > .el-dialog > .el-dialog__header {
  padding: 10px 20px !important;
  background: #77a3d3 !important;
}
.helpComDialog > .el-dialog > .el-dialog__header > .el-dialog__title {
  color: #ffffff !important;
  font-size: 14px !important;
}
.helpComDialog > .el-dialog > .el-dialog__header > .el-dialog__headerbtn {
  top: 15px !important;
}
.helpComDialog > .el-dialog > .el-dialog__header > .el-dialog__headerbtn > .el-dialog__close {
  color: #000000 !important;
}
.helpComDialog > .el-dialog > .el-dialog__body {
  padding: 20px !important;
}
.helpComDialog > .el-dialog > .el-dialog__body > p {
  max-height: 500px !important;
  overflow-y: auto !important;
}
</style>
