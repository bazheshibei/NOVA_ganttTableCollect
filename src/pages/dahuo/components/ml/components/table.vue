
<!-- 表格：面料 -->

<template>
  <div>

    <el-table :data="tableData_1" border :max-height="tableHeight" :highlight-current-row="true"
      row-key="index" :expand-row-keys="showIndex" :cell-style="cellStyle" @expand-change="showMore" @row-click="rowClick"
    >
      <!-- 折叠内容 -->
      <el-table-column type="expand" width="30">
        <template slot-scope="props">
          <com-table2 :row="props.row"></com-table2>
        </template>
      </el-table-column>
      <!-- 固定列 -->
      <el-table-column width="45">
        <template slot-scope="scope">
          {{scope.row.index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="item_name" min-width="120"></el-table-column>
      <el-table-column label="项目季节" prop="season_name" width="120"></el-table-column>
      <el-table-column label="服装品类" prop="type_name" width="120"></el-table-column>
      <el-table-column label="款式名称" prop="style_name" width="120"></el-table-column>
      <el-table-column label="业务组" prop="group_name" width="120"></el-table-column>
      <el-table-column label="物料名称" prop="material_name" width="220"></el-table-column>
      <el-table-column label="物料颜色" prop="color_name" width="120"></el-table-column>
      <el-table-column label="提报人" prop="reporter" width="100"></el-table-column>
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
      <el-table-column label="下单时间" prop="order_time" width="100"></el-table-column>
      <el-table-column label="客人交期" prop="deliver_date" width="100"></el-table-column>
      <!-- 节点列 -->
      <el-table-column v-for="(node, nodeKey) in tableNodes" :key="'node_' + nodeKey" :label="node.node_name" :column-key="node.node_code" align="center" width="140">
        <template slot-scope="scope">
          <div class="comCellBox" v-for="(item, index) in scope.row.nodes" :key="nodeKey + '_' + index" :title="scope.row.item_name">
            <div class="comCell" v-if="item.node_code === node.node_code">
            <p>
              计划：{{item.plan_enddate === null || item.plan_enddate === '' ? '--' : item.plan_enddate.split(' ')[0]}}
            </p>
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

<style scoped>

</style>

<script>
import { mapState } from 'vuex'
import ComTable2 from './table2.vue' // 表格：面料_折叠部分
export default {
  props: ['tableHeight'],
  components: { ComTable2 },
  created() {
    if (!this.tableData_1.length) {
      /** 请求：表格基础数据 **/
      this.$store.dispatch('DhMl/A_tableData')
    }
  },
  data() {
    return {
      showIndex: []
    }
  },
  computed: {
    ...mapState('DhMl', ['tableData_1', 'tableData_2', 'tableNodes', 'pageObj', 'loading'])
  },
  methods: {
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
    },
    /**
     * [点击某一行]
     * @param {[Object]} row    行
     * @param {[Object]} column 列
     * @param {[Object]} event  事件
     */
    rowClick(row, column, event) {
      const { item_id, item_gantt_id, item_gantt_detail_id } = row
      this.$store.commit('saveData', { name: 'item_id', obj: item_id, module: 'DhMl' })
      this.$store.commit('saveData', { name: 'item_gantt_id', obj: item_gantt_id, module: 'DhMl' })
      this.$store.commit('saveData', { name: 'item_gantt_detail_id', obj: item_gantt_detail_id, module: 'DhMl' })
      /* 展示折叠内容 */
      this.showMore(row)
    },
    /**
     * [展示折叠内容]
     * @param {[Object]} row 当前展开行的数据
     */
    showMore(row) {
      /* 给折叠表格添加分页信息 */
      const { pageObj, tableData_2, loading } = this
      const { index } = row
      /* 首次展开当前行 */
      if (!pageObj[index]) {
        pageObj[index] = { pagenum: 1, rownum: 100, pageCount: 0 }
      }
      if (!tableData_2[index]) {
        loading[index] = true
        /** 请求：表格折叠数据 **/
        this.$store.dispatch('DhMl/A_tableOtherData', { row })
      }
      /* 显示 || 隐藏 */
      if (this.showIndex.length && this.showIndex[0] === index) {
        this.showIndex = []
      } else {
        this.showIndex = [index]
      }
    }
    //
  }
}
</script>
