
<!-- 面料 -->

<template>
  <div class="comBox" ref="page">

    <div class="topBtnLine">
      <div>
        <el-button class="topBtn" type="primary" size="mini" @click="advancedQuery">高级查询</el-button>
        <el-button class="topBtn" type="primary" size="mini" @click="f5">刷新</el-button>
        <el-button class="topBtn" type="primary" size="mini" :disabled="!item_gantt_id || !isEdit" @click="edit">编辑</el-button>
      </div>
      <div>
        <el-button class="topBtn" type="primary" size="mini" plain>导出</el-button>
        <el-button class="topBtn" type="primary" size="mini" plain :disabled="!helpText" @click="dialogVisible_help = true">帮助</el-button>
      </div>
    </div>

    <!-- 表格组件 -->
    <com-table :style="tableStyle" :tableHeight="tableHeight"></com-table>

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
    <el-dialog class="submitDialog" title="帮助" :visible.sync="dialogVisible_help" width="40%">
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
    this.$store.dispatch('Ml/A_getHelpText')
  },
  computed: {
    ...mapState('Ml', ['pagenum', 'rownum', 'pageCount', 'item_id', 'item_gantt_id', 'item_gantt_detail_id', 'isEdit', 'helpText'])
  },
  methods: {
    /**
     * [编辑]
     */
    edit() {
      const that = this
      /* 保存到本地缓存 */
      const { item_id, item_gantt_id, item_gantt_detail_id } = this
      localStorage.setItem('NOVA_reject', JSON.stringify({ item_id, item_gantt_id, item_gantt_detail_id }))
      /* win 方法打开页面 */
      const url = window.location.origin + '/nova/pages/itemganttsummary/itemGanttSummaryUpdate.html'
      // eslint-disable-next-line
      win({ title: '编辑', width: 1500, height: 600, url, param: {}, fn() { that.f5(false) } })
    },
    /**
     * [高级查询]
     */
    advancedQuery() {
      this.$store.commit('saveData', { name: 'isDialog', obj: true, module: 'Ml' })
    },
    /**
     * [刷新]
     * @param {[Boolean]} reset 是否重置分页
     */
    f5(reset = true) {
      if (reset) {
        this.$store.commit('saveData', { module: 'Ml', name: 'pagenum', obj: 1 })
        this.$store.commit('saveData', { module: 'Ml', name: 'rownum', obj: 10 })
        this.$store.commit('saveData', { module: 'Ml', name: 'pageCount', obj: 0 })
      }
      this.$store.commit('saveData', { module: 'Ml', name: 'item_id', obj: '' })
      this.$store.commit('saveData', { module: 'Ml', name: 'item_gantt_id', obj: '' })
      this.$store.commit('saveData', { module: 'Ml', name: 'item_gantt_detail_id', obj: '' })
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
      this.$store.commit('saveData', { module: 'Ml', name, obj: val })
      /** 发起请求 **/
      this._request()
    },
    /**
     * [发起请求]
     */
    _request() {
      /** 请求：表格基础数据 **/
      this.$store.dispatch('Ml/A_tableData', { that: this })
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
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.topBtn {
  margin-left: 10px;
}
.topBtn:last-child {
  margin-right: 10px;
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
/*** 弹出层 ***/
.submitDialog > .el-dialog > .el-dialog__body {
  padding: 20px !important;
}
</style>
