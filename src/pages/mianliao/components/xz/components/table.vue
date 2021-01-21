
<!-- 选择面料项目页面 [表格] -->

<template>
  <div>

    <el-table class="pageComTable" :data="tableData_1" border
      :max-height="tableHeight" :highlight-current-row="true" :cell-style="cellStyle" @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="35"></el-table-column>
      <el-table-column width="45">
        <template slot-scope="scope">
          {{scope.row.index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="item_name" min-width="120"></el-table-column>
      <el-table-column label="项目类型" prop="material_item_type" min-width="120"></el-table-column>
      <el-table-column label="跟进人" prop="material_follow_employeename" min-width="120"></el-table-column>
      <el-table-column label="面料名称" prop="material_describe" min-width="120"></el-table-column>
      <el-table-column label="审核状态" prop="audit_status" min-width="100"></el-table-column>
      <el-table-column label="提报人" prop="reporter" min-width="100"></el-table-column>
      <el-table-column label="创建时间" width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.report_time">
            {{scope.row.report_time === null || scope.row.report_time === '' ? '' : scope.row.report_time.split(' ')[0]}}
          </p>
          <p v-if="scope.row.report_time">
            {{scope.row.report_time === null || scope.row.report_time === '' ? '' : scope.row.report_time.split(' ')[1]}}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="面料下达日期" prop="matter_release_time" min-width="100"></el-table-column>
      <!-- 节点列 -->
      <el-table-column v-for="(node, nodeKey) in tableNodes" :key="'node_' + nodeKey" :label="node.node_name" :column-key="node.node_code" align="center" width="140">
        <template slot-scope="scope">
          <div class="comCellBox" v-for="(item, index) in scope.row.nodes" :key="nodeKey + '_' + index" :title="scope.row.item_name">
            <div class="comCell" v-if="item.node_code === node.node_code">
              <p>计划：{{item.plan_enddate === null || item.plan_enddate === '' ? '--' : item.plan_enddate.split(' ')[0]}}</p>
              <p>实际：{{item.actual_enddate === null || item.actual_enddate === '' ? '--' : item.actual_enddate.split(' ')[0]}}</p>
              <p>
                状态：<span v-html="item.nodeTypeText"></span>
                <i class="el-icon-warning" v-if="item.is_show_warning" style="color: #F56C6C;"></i>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: ['tableHeight'],
  created() {
    if (!this.tableData_1.length) {
      /** 请求：表格基础数据 **/
      this.$store.dispatch('MlXz/A_tableData')
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('MlXz', ['tableData_1', 'tableNodes'])
  },
  methods: {
    /**
     * [选中项目]
     * @param {Array} list 选中的项目数组
     */
    handleSelectionChange(list = []) {
      const arr = []
      list.forEach(function (item) {
        arr.push(item.item_id)
      })
      this.$store.commit('saveData', { name: 'ids', obj: arr.join(','), module: 'MlXz' })
    },
    /**
     * [单元格样式]
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 2) {
        return { color: '#2e6e9e', fontWeight: 'bold', background: '#dfeffc url(itemGanttSummaryShow/images/ui-bg_glass_85_dfeffc_1x400.png) 100% 100% repeat-x' }
      }
      if (column.columnKey) {
        for (let i = 0; i < row.nodes.length; i++) {
          const { node_code, is_show_warning } = row.nodes[i]
          if (node_code === column.columnKey && is_show_warning) {
            return { background: '#dfeffc url(itemGanttSummaryShow/images/ui-bg_glass_85_dfeffc_1x400.png) 100% 100% repeat-x' }
          }
        }
      }
    }
    //
  }
}
</script>

<style>
.el-table-column--selection > .cell {
  padding: 0 !important;
}
</style>
