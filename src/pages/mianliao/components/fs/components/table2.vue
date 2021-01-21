
<!-- 面料：分色 [折叠部分] -->

<template>
  <div :style="[tableContent, btnLineStyle]">

    <!-- 按钮组 -->
    <div class="btnLine" :style="btnLineStyle">
      <div>
        <el-button type="primary" size="mini" @click="clickSearch">刷新</el-button>
        <!-- 完成节点 -->
        <el-button type="primary" size="mini" :disabled="Tool._disabledComplete(choiceRow)" @click="complete">
          完成节点
        </el-button>
        <!-- 节点跟进 -->
        <el-button type="primary" size="mini" :disabled="Tool._disabledFollowUp(choiceRow)" @click="followUp">
          节点跟进
        </el-button>
        <!-- 变更节点 -->
        <el-button type="primary" size="mini" :disabled="Tool._disabledChange(choiceRow)" @click="change">
          变更节点
        </el-button>
        <!-- 取消完成 -->
        <el-button type="primary" size="mini" :disabled="Tool._disabledCancel(choiceRow)" @click="cancel">
          取消完成
        </el-button>
        <!-- 调整完成比例 [未选中 || 没有'节点完成ID' || 变更审核状态 === 变更审核中 || 提报状态  === (草稿中、审核汇总)] -->
        <el-button type="primary" size="mini" :disabled="Tool._disabledTuneUp(choiceRow)" @click="tuneUp">
          调整完成比例
        </el-button>
      </div>
      <div class="searchBox">
        <el-input v-model="node_name" size="mini" placeholder="请输入节点名称" @change="clickSearch"></el-input>
        <el-select v-model="status" filterable collapse-tags placeholder="请选择" size="mini">
          <el-option class="comSelectOptions" label="待完成" value="0"></el-option>
          <el-option class="comSelectOptions" label="已完成" value="1"></el-option>
          <el-option class="comSelectOptions" label="全部" value=""></el-option>
        </el-select>
        <div>
          <el-button type="primary" size="mini" plain @click="clickSearch">查询</el-button>
          <el-button type="primary" size="mini" plain @click="clickReset">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData_2" max-height="500" border :highlight-current-row="true" v-loading="loading2" element-loading-text="数据加载中..."
      :cell-style="cellStyle" @row-click="rowClick"
    >
      <el-table-column width="45">
        <template slot-scope="scope">
          {{scope.row.index + 1}}
        </template>
      </el-table-column>
      <!-- 节点名称 -->
      <el-table-column label="节点名称" width="150">
        <template slot-scope="scope">
          <el-popover v-if="String(scope.row.completion_method) === '2' && scope.row.wancheng && scope.row.complete_remark"
            placement="top-start" trigger="hover" :content="scope.row.complete_remark"
          >
            <span slot="reference">{{scope.row.node_name}}</span>
          </el-popover>
          <span v-else>{{scope.row.node_name}}</span>
        </template>
      </el-table-column>
      <!-- 计划完成日期 -->
      <el-table-column label="计划完成日期" prop="plan_enddate" width="100"></el-table-column>
      <!-- 审核状态 -->
      <el-table-column label="审核状态" width="100">
        <template slot-scope="scope">
          {{scope.row.audit_content || '无需审核'}}
        </template>
      </el-table-column>
      <!-- 节点状态 -->
      <el-table-column label="节点状态" width="100">
        <template slot-scope="scope">
          <p v-html="scope.row.nodeTypeText"></p>
        </template>
      </el-table-column>
      <!-- 完成方式 -->
      <el-table-column label="完成方式" width="100">
        <template slot-scope="scope">
          {{{ '1': '手动', '2': '自动', '1+2': '手动加自动' }[scope.row.completion_method] || ''}}
        </template>
      </el-table-column>
      <!-- 延期/剩余天数 -->
      <el-table-column label="延期/剩余天数" width="100">
        <template slot-scope="scope">
          <p v-html="scope.row.timeText"></p>
        </template>
      </el-table-column>
      <!-- 预警状态 -->
      <el-table-column label="预警状态" width="100">
        <template slot-scope="scope">
          <p v-html="scope.row.warningText"></p>
        </template>
      </el-table-column>
      <!-- 实际完成日期 -->
      <el-table-column label="实际完成日期" width="100">
        <template slot-scope="scope">
          <p>
            {{scope.row.actual_enddate === null || scope.row.actual_enddate === '' ? '' : scope.row.actual_enddate.split(' ')[0]}}
          </p>
        </template>
      </el-table-column>
      <!-- 完成人 -->
      <el-table-column label="完成人" prop="complete_employeename" width="100"></el-table-column>
      <!-- 确认状态 -->
      <el-table-column label="确认状态" width="100">
        <template slot-scope="scope">
          <div v-if="String(scope.row.node_audit_status) === '0'">
            <span v-if="String(scope.row.complete_confirmation) === '1'">
              需要{{scope.row.confirmation_post_name}}审核
            </span>
            <span v-else>无需审核</span>
          </div>
          <div v-else>
            {{auditText[scope.row.node_audit_status]}}
          </div>
        </template>
      </el-table-column>
      <!-- 节点变更记录 -->
      <el-table-column label="节点变更记录">
        <template slot-scope="scope">
          <div class="comCellBox">
            <div class="comCell">
              <span v-for="(item, index) in scope.row.contents" :key="'contents_' + index">{{item}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="paginationBox" :style="btnLineStyle">
      <el-pagination :disabled="loading2" class="comPagination table2_comPagination" :page-size="pageObj_2.rownum" :page-sizes="[10, 20, 30, 50, 100]" :total="pageObj_2.pageCount" :current-page="pageObj_2.pagenum"
        layout="prev, pager, next, total, jumper, sizes" prev-text="上一页" next-text="下一页"
        @size-change="pageChange('rownum', $event)" @current-change="pageChange('pagenum', $event)"
      >
      </el-pagination>
    </div>
    <!-- /分页 -->

  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tool from '@/store/tool.js'
export default {
  props: ['row'], // 此条数据
  data() {
    return {
      Tool,
      scrollLeft: 0, // 父级表格向左滑动距离
      auditText: {
        '1': '草稿中',
        '2': '完成待审核',
        '3': '审核通过',
        '4': '审核驳回',
        '5': '无需审核',
        '6': '撤销审核'
      },
      btnLineStyle: {}, // 按钮组样式
      choiceRow: {}, //    选中的行
      node_name: '', //    搜索：节点名称
      status: '' //        搜索：节点状态
    }
  },
  created() {
    const btnLineStyle = { width: (window.document.documentElement.clientWidth - 90) + 'px' }
    this.btnLineStyle = btnLineStyle
  },
  mounted() {
    const that = this
    let i = 0
    const timer = setInterval(function () {
      const obj = document.querySelector('.el-table__body-wrapper')
      if (obj) {
        obj.addEventListener('scroll', (event) => {
          that.scrollLeft = event.target.scrollLeft
        })
        clearInterval(timer)
      }
      if (i > 500) {
        clearInterval(timer)
      }
      i++
    }, 100)
  },
  computed: {
    ...mapState('MlFs', ['loading', 'pageObj']),
    ...mapState('MlFs', {
      /**
       * [表格数据：内部]
       */
      tableData_2(state) {
        const { index } = this.row
        return state.tableData_2[index] ? state.tableData_2[index] : []
      },
      /**
       * [是否显示：加载动画]
       */
      loading2(state) {
        const { index } = this.row
        return state.loading[index] ? state.loading[index] : false
      },
      /**
       * [分页：内部]
       */
      pageObj_2(state) {
        const { index } = this.row
        return state.pageObj[index]
      }
    }),
    /**
     * [组件样式：内部随外部滑动]
     */
    tableContent() {
      const { scrollLeft = 0 } = this
      return { marginLeft: `${scrollLeft + 30}px`, transitionDuration: '.2s' }
    }
  },
  methods: {
    /**
     * [完成节点]
     * @click {[choiceRow.completion_method]} 1 手动完成
     * @click {[choiceRow.item_node_id]}        选中节点
     * @click {[choiceRow.is_complete]}       0 节点未完成
     */
    complete() {
      /* 加载动画 */
      const { row: { index }, loading } = this
      loading[index] = true
      /* 发起请求 */
      const { choiceRow: { item_id, item_node_id, completion_method } } = this
      /** 请求：节点完成前验证 **/
      this.$store.dispatch('MlFs/A_testItemNodeStatus', { item_id, item_node_id, completion_method, index, that: this })
    },
    /**
     * [节点跟进]
     */
    followUp() {
      const that = this
      const { row, choiceRow } = this
      let data = choiceRow
      if (!Object.keys(choiceRow).length) {
        data = row // 没选节点，用项目信息进跟进
      }
      const { item_node_id, item_gantt_id } = data
      const url = window.location.origin + `/nova/nodeFollowRecordsShowAction.do?action=showAdd&item_node_id=${item_node_id}&item_gantt_id=${item_gantt_id}`
      const param = { item_node_id, item_gantt_id }
      // eslint-disable-next-line
      updateWin({ title: '节点跟进', url, width: 1500, height: 600, param, onClose() {}, fn() { that.f5(false) } })
    },
    /**
     * [变更节点]
     */
    change() {
      const that = this
      const { choiceRow: { item_id, item_node_id } } = this
      /** 请求：单独变更节点前验证 **/
      this.$store.dispatch('MlFs/A_adjustmentNodeTest', { that, item_id, item_node_id })
    },
    /**
     * [取消完成]
     * @click {[choiceRow.item_node_id]}    选中节点
     * @click {[choiceRow.is_complete]}  !0 节点已完成
     */
    cancel() {
      const that = this
      const { row: { business_group_id }, choiceRow: { item_node_id } } = this
      const url = window.location.origin + `/nova/itemNodeShowAction.do?action=updateNode&id=${item_node_id}&business_group_id=${business_group_id}`
      const param = { id: item_node_id, business_group_id }
      // eslint-disable-next-line
      updateWin({ title: '取消完成', width: 600, height: 200, url, param, onClose() {}, fn() { that.f5(false) } })
    },
    /**
     * [调整完成比例]
     */
    tuneUp() {
      const that = this
      const { choiceRow: { node_complete_id } } = this
      const url = window.location.origin + `/nova/itemNodecompleteDetailShowAction.do?action=showView&id=${node_complete_id}&type=1`
      const param = { id: node_complete_id, type: 1 }
      // eslint-disable-next-line
      updateWin({ title: '调整完成比例', width: 1500, height: 600, url, param, onClose(data) {}, fn(data) { that.f5(false) } })
    },
    /**
     * [查询]
     */
    clickSearch() {
      const { node_name, status } = this
      this.$store.commit('saveData', { name: 'node_name', obj: node_name, module: 'MlFs' })
      this.$store.commit('saveData', { name: 'status', obj: status, module: 'MlFs' })
      /** 刷新 **/
      this.f5(true)
    },
    /**
     * [重置]
     */
    clickReset() {
      this.node_name = ''
      this.status = ''
      this.$store.commit('saveData', { name: 'node_name', obj: '', module: 'MlFs' })
      this.$store.commit('saveData', { name: 'status', obj: '', module: 'MlFs' })
      /** 刷新 **/
      this.f5(true)
    },
    /**
     * [点击某一行]
     * @param {[Object]} row    行
     * @param {[Object]} column 列
     * @param {[Object]} event  事件
     */
    rowClick(row, column, event) {
      // console.log('选中某一行 ----- ', row)
      this.choiceRow = row
    },
    /**
     * [刷新]
     */
    f5(reset = true) {
      if (reset) {
        /* 重置分页 */
        const { row: { index }, pageObj } = this
        pageObj[index] = { pagenum: 1, rownum: 100, pageCount: 0 }
        this.$store.commit('assignData', { name: 'pageObj', obj: pageObj, module: 'MlFs' })
      }
      this.choiceRow = {}
      /** 发起请求 **/
      this._request()
    },
    /**
     * [分页切换]
     * @param {[String]} name 属性名
     * @param {[Int]}    val  属性值
     */
    pageChange(key, val) {
      const { row: { index }, pageObj } = this
      pageObj[index][key] = val
      if (key === 'rownum') {
        pageObj[index].pagenum = 1
      }
      /** 发起请求 **/
      this._request()
    },
    /**
     * [发起请求]
     */
    _request() {
      const { loading, row } = this
      const { index } = row
      loading[index] = true
      /** 请求：表格折叠数据 **/
      this.$store.dispatch('MlFs/A_tableOtherData', { row })
    },
    /**
     * [单元格样式]
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 1) {
        return { color: '#2e6e9e', fontWeight: 'bold', background: '#dfeffc url(itemGanttSummaryShow/images/ui-bg_glass_85_dfeffc_1x400.png) 100% 100% repeat-x' }
      }
    }
    //
  }
}
</script>

<style scoped>
/*** 折叠内容 ***/
.btnLine { /* 顶部按钮行 */
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.searchBox { /* 右侧搜索区域 */
  display: flex;
  flex-wrap: wrap;
}
.searchBox > .el-input, .searchBox > .el-select {
  width: 160px;
  margin-right: 10px;
}

/*** 分页 ***/
.paginationBox {
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
