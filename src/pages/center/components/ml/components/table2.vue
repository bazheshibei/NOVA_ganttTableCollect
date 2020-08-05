
<!-- 表格：面料_折叠部分 -->

<template>
  <div class="tableContent">

    <!-- 按钮组 -->
    <div class="btnLine">
      <div>
        <el-button type="primary" size="mini" @click="f5">刷新</el-button>
        <el-button type="primary" size="mini"
          :disabled="String(choiceRow.completion_method) === '2' ? true : false" @click="updateWin('完成节点')"
        >
          完成节点
        </el-button>
        <el-button type="primary" size="mini" @click="updateWin('节点跟进')">节点跟进</el-button>
        <el-button type="primary" size="mini">变更节点</el-button>
        <el-button type="primary" size="mini">取消完成</el-button>
        <!-- <el-button type="primary" size="mini">调整完成比例</el-button> -->
      </div>
      <div class="searchBox">
        <el-input v-model="node_name" size="mini" placeholder="请输入节点名称"></el-input>
        <el-select v-model="status" filterable collapse-tags placeholder="请选择" size="mini">
          <el-option class="comSelectOptions" label="待完成" value="1"></el-option>
          <el-option class="comSelectOptions" label="已完成" value="2"></el-option>
          <el-option class="comSelectOptions" label="全部" value="3"></el-option>
        </el-select>
        <el-button type="primary" size="mini" plain @click="clickSearch">查询</el-button>
        <el-button type="primary" size="mini" plain @click="clickReset">重置</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData_2" border :highlight-current-row="true" v-loading="loading2" element-loading-text="数据加载中..." @row-click="rowClick">
      <el-table-column width="30">
        <template slot-scope="scope">
          {{scope.row.index + 1}}
        </template>
      </el-table-column>
      <!-- 节点名称 -->
      <el-table-column label="节点名称" prop="node_name" width="200"></el-table-column>
      <!-- 计划完成日期 -->
      <el-table-column label="计划完成日期" prop="plan_enddate" width="120"></el-table-column>
      <!-- 节点状态 -->
      <el-table-column label="节点状态" width="100">
        <template slot-scope="scope">
          <p v-html="scope.row.nodeTypeText"></p>
        </template>
      </el-table-column>
      <!-- 完成方式 -->
      <!-- <el-table-column label="完成方式" width="100">
        <template slot-scope="scope">
          {{{ 1: '手动', 2: '自动' }[scope.row.completion_method] || ''}}
        </template>
      </el-table-column> -->
      <!-- 延期/剩余天数 -->
      <el-table-column label="延期/剩余天数" width="120">
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
      <el-table-column label="实际完成日期" prop="actual_enddate"></el-table-column>
      <!-- 完成人 -->
      <el-table-column label="完成人" prop="complete_employeename"></el-table-column>
      <!-- 审核状态 -->
      <el-table-column label="审核状态">
        <template slot-scope="scope">
          {{{ 1: '完成待审核', 2: '审核通过', 3: '审核驳回' }[scope.row.audit_status] || '无需审核'}}
        </template>
      </el-table-column>
      <!-- 节点变更记录 -->
      <el-table-column label="节点变更记录">
        <template slot-scope="scope">
          <div class="comCellBox">
            <div class="comCell">
              <p v-for="(item, index) in scope.row.contents" :key="'contents_' + index">{{item}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="paginationBox">
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
export default {
  props: ['row'], // 此条数据
  data() {
    return {
      choiceRow: {}, // 选中的行
      node_name: '', // 搜索：节点名称
      status: '' //     搜索：节点状态
    }
  },
  created() {
    //
  },
  computed: {
    ...mapState('Ml', ['loading', 'pageObj']),
    ...mapState('Ml', {
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
    })
  },
  methods: {
    /**
     * [查询]
     */
    clickSearch() {
      const { node_name, status } = this
      this.$store.commit('saveData', { name: 'node_name', obj: node_name, module: 'Ml' })
      this.$store.commit('saveData', { name: 'status', obj: status, module: 'Ml' })
      /** 刷新 **/
      this.f5(true)
    },
    /**
     * [重置]
     */
    clickReset() {
      this.node_name = ''
      this.status = ''
      this.$store.commit('saveData', { name: 'node_name', obj: '', module: 'Ml' })
      this.$store.commit('saveData', { name: 'status', obj: '', module: 'Ml' })
      /** 刷新 **/
      this.f5(true)
    },
    /**
     * [打开平台页面]
     * @param {[String]} title 页面名称
     */
    updateWin(title) {
      const that = this
      const { choiceRow } = that
      // console.log(choiceRow, this.row)
      if (Object.keys(choiceRow).length) {
        const host = window.location.origin + '/nova/'
        const urlObj = {
          '节点跟进': 'nodeFollowRecordsShowAction.do?action=showAdd',
          '完成节点': 'itemNodecompleteDetailShowAction.do?action=showAdd'
        }
        let param = {}
        if (title === '节点跟进') {
          /* 节点跟进 */
          const { item_node_id } = choiceRow
          param = { item_node_id }
        } else if (title === '完成节点') {
          /* 完成节点 */
          const { item_node_id, node_name, plan_enddate, item_id } = choiceRow
          param = { item_node_id, node_name, plan_enddate, item_id, complete_mode: 1 }
        }
        // eslint-disable-next-line
        updateWin({
          title,
          url: host + urlObj[title],
          width: 1500,
          height: 600,
          param,
          onClose() {},
          fn() {
            /** 刷新：保持现在分页 **/
            that.f5(false)
          }
        })
      } else {
        /* 没选中节点 */
        this.$message({ message: '请先选择节点', type: 'warning' })
      }
    },
    /**
     * [点击某一行]
     * @param {[Object]} row    行
     * @param {[Object]} column 列
     * @param {[Object]} event  事件
     */
    rowClick(row, column, event) {
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
        this.$store.commit('assignData', { name: 'pageObj', obj: pageObj, module: 'Ml' })
      }
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
      this.$store.dispatch('Ml/A_tableOtherData', { row })
    }
  }
}
</script>

<style scoped>
/*** 折叠内容 ***/
.tableContent {
  padding: 0 30px;
  background: #fdf5e6;
}
.btnLine { /* 顶部按钮行 */
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btnLine .el-button, .btnLine .el-input, .btnLine .el-select {
  margin-top: 4px;
  margin-bottom: 4px;
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

<style>
/*** 右侧搜索区域 ***/
/* .btnLine .el-input > input, .btnLine .el-select > input {
  background: #fdf5e6 !important;
} */
/*** 分页 ***/
.table2_comPagination > .btn-prev, .table2_comPagination > .el-pager > .number, .table2_comPagination > .btn-next {
  background: #fdf5e6 !important;
}
.table2_comPagination > .el-pagination__jump > .el-input > input, .table2_comPagination > .el-pagination__sizes > .el-select > .el-input > input {
  background: #fdf5e6 !important;
}
</style>
