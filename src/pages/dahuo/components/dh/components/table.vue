
<!-- 表格：大货 -->

<template>

  <div>

    <el-table v-for="tNum in tableNum" :key="'table_' + tNum" v-if="tNum === tableNum"
      class="pageComTable" :data="tableData_1" border :max-height="tableHeight" :highlight-current-row="true"
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
      <!-- 项目名称 -->
      <el-table-column prop="item_name" min-width="120">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_1" v-model="tableHeader.item_name" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('item_name')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_1')">
              项目名称<span>&nbsp;<i class="el-icon-search" :class="tableHeader.item_name ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 项目季节 -->
      <el-table-column prop="season_name" width="120">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_2" v-model="tableHeader.season_name" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('season_name')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_2')">
              项目季节<span>&nbsp;<i class="el-icon-search" :class="tableHeader.season_name ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 服装品类 -->
      <el-table-column prop="type_name" width="120">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_3" v-model="tableHeader.type_name" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('type_name')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_3')">
              服装品类<span>&nbsp;<i class="el-icon-search" :class="tableHeader.type_name ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 款式名称 -->
      <el-table-column prop="style_name" width="120">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_4" v-model="tableHeader.style_name" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('style_name')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_4')">
              款式名称<span>&nbsp;<i class="el-icon-search" :class="tableHeader.style_name ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 业务组 -->
      <el-table-column prop="group_name" width="120">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_5" v-model="tableHeader.group_name" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('group_name')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_5')">
              业务组<span>&nbsp;<i class="el-icon-search" :class="tableHeader.group_name ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 投产前审核状态 -->
      <el-table-column width="100">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_6" v-model="tableHeader.tcq" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('tcq')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_6')">
              投产前审核状态<span>&nbsp;<i class="el-icon-search" :class="tableHeader.tcq ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          {{scope.row.tcq || '未提报'}}
        </template>
      </el-table-column>
      <!-- 变更状态 -->
      <el-table-column width="100">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_7" v-model="tableHeader.audit_result_content" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('audit_result_content')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_7')">
              变更状态<span>&nbsp;<i class="el-icon-search" :class="tableHeader.audit_result_content ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          {{scope.row.audit_result_content || '无变更'}}
        </template>
      </el-table-column>
      <!-- 排产审核状态 -->
      <el-table-column width="100">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_8" v-model="tableHeader.pc" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('pc')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_8')">
              排产审核状态<span>&nbsp;<i class="el-icon-search" :class="tableHeader.pc ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          {{scope.row.pc || '未提报'}}
        </template>
      </el-table-column>
      <!-- 提报人 -->
      <el-table-column prop="reporter" width="100">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_9" v-model="tableHeader.reporter" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('reporter')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_9')">
              提报人<span>&nbsp;<i class="el-icon-search" :class="tableHeader.reporter ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 创建时间 -->
      <el-table-column width="100">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_10" v-model="tableHeader.report_time" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('report_time')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_10')">
              创建时间<span>&nbsp;<i class="el-icon-search" :class="tableHeader.report_time ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <p v-if="scope.row.report_time">
            {{scope.row.report_time === null || scope.row.report_time === '' ? '' : scope.row.report_time.split(' ')[0]}}
          </p>
          <p v-if="scope.row.report_time">
            {{scope.row.report_time === null || scope.row.report_time === '' ? '' : scope.row.report_time.split(' ')[1]}}
          </p>
        </template>
      </el-table-column>
      <!-- 下单时间 -->
      <el-table-column prop="order_time" width="100">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_11" v-model="tableHeader.order_time" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('order_time')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_11')">
              下单时间<span>&nbsp;<i class="el-icon-search" :class="tableHeader.order_time ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 客人交期 -->
      <el-table-column prop="deliver_date" width="100">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input ref="input_12" v-model="tableHeader.deliver_date" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear('deliver_date')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('input_12')">
              客人交期<span>&nbsp;<i class="el-icon-search" :class="tableHeader.deliver_date ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- ***** 岗位 ***** -->
      <el-table-column v-for="(businesspost, businesspostKey) in businesspost" :key="'businesspost_' + businesspostKey" align="center" width="140">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input :ref="'business_' + businesspostKey" v-model="businessObj[businesspost.business_post_id]" clearable  size="mini" placeholder="多个查询空格分隔" @clear="clear(businesspost.business_post_id, 'businessObj')" @change="select"></el-input>
            <div class="thText" slot="reference" style="flex: 1;" @click="tableHeaderClick('business_' + businesspostKey)">
              {{businesspost.post_name}}<span>&nbsp;<i class="el-icon-search" :class="businessObj[businesspost.business_post_id] ? 'thActive' : ''"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          {{scope.row['business_' + businesspost.business_post_id]}}
        </template>
      </el-table-column>
      <!-- ***** 节点列 ***** -->
      <el-table-column v-for="(node, nodeKey) in tableNodes" :key="'node_' + nodeKey" :column-key="node.node_code" align="center" width="140">
        <template slot="header" slot-scope="scope">
          <p>{{node.node_name}}</p>
          <p>{{node.shouldCompNum}}({{node.conpleteNum}})</p>
        </template>
        <template slot-scope="scope">
          <div class="comCellBox" v-for="(item, index) in scope.row.nodes" :key="nodeKey + '_' + index" :title="scope.row.item_name">
            <div class="comCell" v-if="item.node_code === node.node_code">
              <p>
                计划：{{item.plan_enddate === null || item.plan_enddate === '' ? '--' : item.plan_enddate.split(' ')[0]}}
              </p>
              <p>
                实际：{{item.actual_enddate === null || item.actual_enddate === '' ? '--' : item.actual_enddate.split(' ')[0]}}
              </p>
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
import ComTable2 from './table2.vue' // 表格：大货_折叠部分
export default {
  props: ['tableHeight'],
  components: { ComTable2 },
  created() {
    if (!this.tableData_1.length) {
      /** 请求：表格基础数据 **/
      this.$store.dispatch('DhDh/A_tableData')
    }
  },
  data() {
    return {
      showIndex: [],
      tableHeader: {}, // 表头查询对象
      businessObj: {} //  岗位查询对象
    }
  },
  computed: {
    ...mapState('DhDh', ['tableData_1', 'tableData_2', 'tableNodes', 'pageObj', 'loading', 'businesspost', 'tableNum'])
  },
  methods: {
    /**
     * [表头查询：点击表头，input自动聚焦]
     * @param {[Int]} index 索引
     */
    tableHeaderClick(index) {
      const that = this
      setTimeout(function () {
        if (that.$refs[index] instanceof Array) {
          that.$refs[index][0].focus()
        } else {
          that.$refs[index].focus()
        }
      }, 100)
    },
    /**
     * [表头查询：清空输入框]
     * @param {[String]} name        字段名
     * @param {[String]} tableHeader 数据名称
     */
    clear(name, dataName = 'tableHeader') {
      this[dataName][name] = ''
    },
    /**
     * [表头查询：搜索]
     */
    select() {
      const { tableHeader, businessObj } = this
      const obj_1 = this._returnSelectData(tableHeader)
      const obj_2 = this._returnSelectData(businessObj)
      /* 重置分页 */
      this.$store.commit('saveData', { module: 'DhDh', name: 'pagenum', obj: 1 })
      this.$store.commit('saveData', { module: 'DhDh', name: 'rownum', obj: 10 })
      this.$store.commit('saveData', { module: 'DhDh', name: 'pageCount', obj: 0 })
      /* 重置折叠数据 */
      this.$store.commit('saveData', { module: 'DhDh', name: 'tableData_2', obj: {} })
      /* 保存表头数据 */
      this.$store.commit('saveData', { module: 'DhDh', name: 'tableHeader', obj: obj_1 })
      this.$store.commit('saveData', { module: 'DhDh', name: 'businessObj', obj: obj_2 })
      /** 查询 **/
      this.$store.dispatch('DhDh/A_tableData', { asd: 'asd' })
    },
    /**
     * [处理搜索条件]
     * @param  {[Object]} data 搜索对象
     * @return {[Object]} obj  剔除空项的条件对象
     */
    _returnSelectData(data) {
      const obj = {}
      for (const x in data) {
        const item = data[x]
        if (item) {
          obj[x] = item.trim()
        }
      }
      return obj
    },
    /**
     * [表格相关：单元格样式]
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
     * [表格相关：点击某一行]
     * @param {[Object]} row    行
     * @param {[Object]} column 列
     * @param {[Object]} event  事件
     */
    rowClick(row, column, event) {
      // console.log('点击某一行 ----- ', row)
      const { item_id, item_gantt_id, item_gantt_detail_id, tcq, pc, tcq_type, pc_type } = row
      let isEdit = false
      if (tcq_type === '1' || tcq_type === '4' || tcq_type === '5') { // 草稿 驳回 撤销
        isEdit = true
      }
      if (pc_type === '1' || pc_type === '4' || pc_type === '5') {
        isEdit = true
      }
      this.$store.commit('saveData', { name: 'item_id', obj: item_id, module: 'DhDh' })
      this.$store.commit('saveData', { name: 'item_gantt_id', obj: item_gantt_id, module: 'DhDh' })
      this.$store.commit('saveData', { name: 'item_gantt_detail_id', obj: item_gantt_detail_id, module: 'DhDh' })
      this.$store.commit('saveData', { name: 'isChangeNodes', obj: (pc === '审核通过' || tcq === '审核通过'), module: 'DhDh' })
      this.$store.commit('saveData', { name: 'isEdit', obj: isEdit, module: 'DhDh' })
      this.$store.commit('saveData', { name: 'tableRow_1', obj: row, module: 'DhDh' })
      /* 展示折叠内容 */
      this.showMore(row)
    },
    /**
     * [表格相关：展示折叠内容]
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
        this.$store.dispatch('DhDh/A_tableOtherData', { row })
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
