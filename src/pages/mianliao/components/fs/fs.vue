
<!-- 面料分色甘特表计划 -->

<template>
  <div class="comBox" ref="page">

    <div class="topBtnLine">
      <div>
        <el-button type="primary" size="mini" @click="advancedQuery">高级查询</el-button>
        <el-button type="primary" size="mini" @click="f5">刷新</el-button>
        <el-button type="primary" size="mini" :disabled="!item_id || tableRow_1.audit_status === '作废'" @click="edit">编辑</el-button>
        <el-button slot="reference" type="primary" size="mini" :disabled="!item_id || tableRow_1.audit_status === '作废'" @click="dialogVisible_void = true">作废</el-button>
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

    <!-- 弹出层：确认作废 -->
    <el-dialog width="30%" :visible.sync="dialogVisible_void">
      <p>确定要作废 {{tableRow_1.item_name}} ？</p>
      <span slot="footer">
        <el-button size="mini" @click="dialogVisible_void = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="toVoid">确 定</el-button>
      </span>
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
      dialogVisible_void: false, // 是否显示弹出层：作废
      dialogVisible_help: false, // 是否显示弹出层：帮助
      itemGanttSummary: [] //       甘特表类型数组
    }
  },
  created() {
    /** 计算：表格高度 **/
    this._countHeight()
    /** 请求：甘特表帮助按钮 **/
    this.$store.dispatch('MlFs/A_getHelpText')
  },
  computed: {
    ...mapState('MlFs', ['pagenum', 'rownum', 'pageCount', 'item_id', 'item_gantt_id', 'item_gantt_detail_id', 'isEdit', 'helpText', 'tableRow_1', 'plant_order_id'])
  },
  methods: {
    /**
     * [导出]
     */
    toExport() {
      /** 请求：表格基础数据 **/
      this.$store.dispatch('MlFs/A_tableData', { path2: '&isExport=1' })
    },
    /**
     * [编辑]
     */
    edit() {
      const that = this
      const { item_id } = this
      const url = window.location.origin + '/nova/pages/itemganttsummary/itemGanttDivdMateeial.jsp'
      // eslint-disable-next-line
      updateWin({ title: '编辑', width: 1800, height: 900, url, param: { itemids: item_id }, onClose: function () {}, fn: function () { that.f5(false) } })
    },
    /**
     * [作废]
     */
    toVoid() {
      this.dialogVisible_void = false
      const { item_gantt_id } = this
      /** 请求：作废 **/
      this.$store.dispatch('MlFs/A_voidItemGantt', { item_gantt_id, that: this })
    },
    /**
     * [高级查询]
     */
    advancedQuery() {
      this.$store.commit('saveData', { name: 'isDialog', obj: true, module: 'MlFs' })
    },
    /**
     * [刷新]
     * @param {[Boolean]} reset 是否重置分页
     */
    f5(reset = true) {
      if (reset) {
        this.$store.commit('saveData', { module: 'MlFs', name: 'pagenum', obj: 1 })
        this.$store.commit('saveData', { module: 'MlFs', name: 'rownum', obj: 10 })
        this.$store.commit('saveData', { module: 'MlFs', name: 'pageCount', obj: 0 })
      }
      this.$store.commit('saveData', { module: 'MlFs', name: 'item_id', obj: '' })
      this.$store.commit('saveData', { module: 'MlFs', name: 'item_gantt_id', obj: '' })
      this.$store.commit('saveData', { module: 'MlFs', name: 'item_gantt_detail_id', obj: '' })
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
      this.$store.commit('saveData', { module: 'MlFs', name, obj: val })
      if (name === 'rownum') {
        this.$store.commit('saveData', { module: 'MlFs', name: 'pagenum', obj: 1 })
      }
      /** 发起请求 **/
      this._request()
    },
    /**
     * [发起请求]
     */
    _request() {
      /* 重置折叠数据 */
      this.$store.commit('saveData', { module: 'MlFs', name: 'tableData_2', obj: {} })
      /* 两个刷新联动 */
      this.f5Tof5 += 1
      /** 请求：表格基础数据 **/
      this.$store.dispatch('MlFs/A_tableData')
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
.el-dialog > .el-dialog__body > .dialogLine:first-child {
  margin-top: 20px;
}
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
