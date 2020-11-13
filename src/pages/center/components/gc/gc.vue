
<!-- 工厂 -->

<template>
  <div class="comBox" ref="page">

    <div class="topBtnLine">
      <div>
        <el-button type="primary" size="mini" @click="advancedQuery">高级查询</el-button>
        <el-button type="primary" size="mini" @click="f5">刷新</el-button>
        <el-button type="primary" size="mini" :disabled="!item_gantt_id || !isEdit">编辑</el-button>
        <el-button type="primary" size="mini" :disabled="!item_gantt_id" @click="beforeSubmit(1)">提交审核</el-button>
        <el-button type="primary" size="mini" :disabled="!item_gantt_id" @click="beforeSubmit(2)">撤销审核</el-button>
        <!-- <el-button type="primary" size="mini" :disabled="!item_gantt_id || disabledChange[item_gantt_id] || !isChangeNodes" @click="nodeChange">批量变更节点</el-button> -->

        <el-dropdown size="mini" trigger="click" @command="dropdown">
          <el-button type="primary" size="mini">
            变更相关<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="nodeChange" :disabled="!item_gantt_id || disabledChange[item_gantt_id] || !isChangeNodes">批量变更节点</el-dropdown-item>
            <el-dropdown-item command="history">历史变更记录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-button type="primary" size="mini" plain>导出</el-button>
        <el-button type="primary" size="mini" plain :disabled="!helpText" @click="dialogVisible_help = true">帮助</el-button>
      </div>
    </div>

    <!-- 表格组件 -->
    <com-table :style="tableStyle" :tableHeight="tableHeight" style="padding-right: 30px;"></com-table>

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

    <!-- 弹出层：提交/撤销选节点 || 填写撤销说明 -->
    <el-dialog :visible.sync="dialogVisible_submit" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="dialogLine" v-if="itemGanttSummary.length > 1">
        <span>{{{ '1': '提交', '2': '撤销' }[audit_status]}}节点：</span>
        <el-radio v-for="(item, index) in itemGanttSummary" :key="'radio_' + index" v-model="radio" :label="index">{{{ '1': '投产前节点', '2': '预排产节点' }[item.gantt_detail_type]}}</el-radio>
      </div>
      <div class="dialogLine" v-if="String(audit_status) === '2'">
        <span>撤销说明：</span>
        <el-input size="mini" placeholder="请填写撤销说明" v-model="input"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible_submit = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogSubmit">
          {{{ '1': '提交审核', '2': '撤销审核' }[audit_status]}}
        </el-button>
      </span>
    </el-dialog>

    <!-- 弹出层：批量变更节点 -->
    <el-dialog :visible.sync="dialogVisible_change" width="40%" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="dialogLine">
        <el-radio v-for="(item, index) in changeList" :key="'change_' + index" v-model="radioChange" :label="index" >
          {{{ '1': '投产前节点', '2': '排产节点' }[item.gantt_detail_type]}}
        </el-radio>
      </div>
      <p>{{changeList[radioChange] ? changeList[radioChange].message : ''}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible_change = false">取 消</el-button>
        <el-button size="mini" type="primary" :disabled="changeList[radioChange] && changeList[radioChange].message ? true : false" @click="dialogChange">继 续</el-button>
      </span>
    </el-dialog>

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
      /* 弹出层 */
      dialogVisible_submit: false, // 是否显示弹出层
      dialogVisible_change: false, // 是否显示弹出层：批量变更节点
      dialogVisible_help: false, //   是否显示弹出层：帮助
      changeList: [], //              批量变更节点：选项
      radioChange: '', //             批量变更节点：绑定值
      itemGanttSummary: [], //        甘特表类型数组
      audit_status: 1, //             1提交审核，2撤销审核
      radio: '', //                   多选时提交的节点
      input: '' //                    撤销说明
    }
  },
  created() {
    /** 计算：表格高度 **/
    this._countHeight()
    /** 请求：甘特表帮助按钮 **/
    this.$store.dispatch('Gc/A_getHelpText')
  },
  computed: {
    ...mapState('Gc', ['pagenum', 'rownum', 'pageCount', 'item_id', 'item_gantt_id', 'item_gantt_detail_id', 'disabledChange', 'isChangeNodes', 'isEdit', 'helpText'])
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
     * [下拉菜单]
     * @param {[String]} name 触发的事件名称
     */
    dropdown(name) {
      this[name]()
    },
    /**
     * [节点变更]
     */
    nodeChange() {
      const { item_gantt_id = '', item_id = '' } = this
      /** 请求：节点变更前验证 **/
      this.$store.dispatch('Gc/A_beforBatchAdjusmentItemGantt', { item_gantt_id, item_id, that: this })
    },
    /**
     * [历史变更记录]
     */
    history() {
      console.log('历史变更记录')
    },
    /**
     * [审核操作前的验证]
     * @param {[Int]} audit_status 1提交审核，2撤销审核
     */
    beforeSubmit(audit_status) {
      this.$store.dispatch('Gc/A_beforeSubmitAudit', { audit_status, that: this })
    },
    /**
     * [审核操作前的验证：返回值]
     * @param {[Array]} itemGanttSummary 甘特表类型数组
     * @param {[Int]}   audit_status     1提交审核，2撤销审核
     */
    beforeSubmit_1(itemGanttSummary, audit_status) {
      if (itemGanttSummary.length === 1 && audit_status === 1) {
        /* ----- 不需要弹出层 ----- */
        const { item_gantt_detail_id = '', item_gantt_id = '' } = itemGanttSummary[0]
        const obj = { item_gantt_detail_id, item_gantt_id }
        /** 提交 / 撤销审核 **/
        this.submitApi(obj, audit_status)
      } else if (itemGanttSummary.length > 1 || audit_status === 2) {
        /* ----- 弹出层操作 ----- */
        this.itemGanttSummary = itemGanttSummary
        this.audit_status = audit_status
        this.dialogVisible_submit = true
      }
    },
    /**
     * [弹出层：确认]
     */
    dialogSubmit() {
      const { itemGanttSummary, audit_status, radio, input } = this
      /* ----- 验证 ----- */
      const errArr = []
      if (itemGanttSummary.length > 1 && radio === '') {
        errArr.push('选择节点')
      }
      if (audit_status === 2 && input === '') {
        errArr.push('填写撤销说明')
      }
      if (errArr.length) {
        this.$message.error(`请 ${errArr.join('、')}！`)
        return
      }
      /* ----- 提交 ----- */
      const data = itemGanttSummary.length > 1 ? itemGanttSummary[radio] : itemGanttSummary[0]
      const { item_gantt_detail_id = '', item_gantt_id = '' } = data || {}
      const obj = { item_gantt_detail_id, item_gantt_id, audit_remark: audit_status === 2 ? input : '' }
      /** 提交 / 撤销审核 **/
      this.submitApi(obj, audit_status)
    },
    /**
     * [提交 / 撤销审核]
     * @param {[Object]} params      传给接口的参数
     * @param {[Int]}   audit_status 1提交审核，2撤销审核
     */
    submitApi(params, audit_status) {
      if (audit_status === 1) {
        this.$store.dispatch('Gc/A_submitAudit', { params, that: this })
      } else if (audit_status === 2) {
        this.$store.dispatch('Gc/A_goBackAudit', { params, that: this })
      }
      /* 关闭弹出层 */
      this.dialogVisible_submit = false
    },
    /**
     * [批量变更节点]
     */
    dialogChange() {
      /* 保存到本地缓存 */
      const { item_id, item_gantt_id, changeList, radioChange } = this
      const obj = changeList[radioChange]
      localStorage.setItem('NOVA_ItemNodeAdjustmentHtml', JSON.stringify(Object.assign({}, obj, { page_type: 'add', item_id, item_gantt_id, gantt_type: 1 })))
      /* win 方法打开页面 */
      const url = window.location.origin + '/nova/pages/itemnodeadjustment/itemNodeBatchAdjustment.html'
      // eslint-disable-next-line
      win({ title: '批量变更节点', width: 1500, height: 600, url, param: {}, fn() { that.f5(false) } })
      /* 关闭弹出层 */
      this.dialogVisible_change = false
    },
    /**
     * [高级查询]
     */
    advancedQuery() {
      this.$store.commit('saveData', { name: 'isDialog', obj: true, module: 'Gc' })
    },
    /**
     * [刷新]
     * @param {[Boolean]} reset 是否重置分页
     */
    f5(reset = true) {
      if (reset) {
        this.$store.commit('saveData', { module: 'Gc', name: 'pagenum', obj: 1 })
        this.$store.commit('saveData', { module: 'Gc', name: 'rownum', obj: 10 })
        this.$store.commit('saveData', { module: 'Gc', name: 'pageCount', obj: 0 })
      }
      this.$store.commit('saveData', { module: 'Gc', name: 'item_id', obj: '' })
      this.$store.commit('saveData', { module: 'Gc', name: 'item_gantt_id', obj: '' })
      this.$store.commit('saveData', { module: 'Gc', name: 'item_gantt_detail_id', obj: '' })
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
      this.$store.commit('saveData', { module: 'Gc', name, obj: val })
      /** 发起请求 **/
      this._request()
    },
    /**
     * [发起请求]
     */
    _request() {
      /** 请求：表格基础数据 **/
      this.$store.dispatch('Gc/A_tableData')
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
