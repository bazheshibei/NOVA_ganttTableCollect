
<!-- 甘特表汇总 -->

<template>
  <div class="pageBox" v-on:scroll="pageScroll" ref="page" v-loading="dh_loading || ml_loading || gc_loading" element-loading-text="数据加载中...">
    <el-tabs class="comTabs" type="border-card" @tab-click="toggleTab">

      <el-tab-pane class="tab" label="大货甘特表汇总">
        <com-dh v-if="active === '大货甘特表汇总' || dh.length"></com-dh>
      </el-tab-pane>

      <el-tab-pane class="tab" label="大货面料甘特表汇总">
        <com-ml v-if="active === '大货面料甘特表汇总' || ml.length"></com-ml>
      </el-tab-pane>

      <el-tab-pane class="tab" label="大货工厂甘特表汇总">
        <com-gc v-if="active === '大货工厂甘特表汇总' || gc.length"></com-gc>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ComDh from './components/dh/dh.vue' // 大货
import ComMl from './components/ml/ml.vue' // 面料
import ComGc from './components/gc/gc.vue' // 工厂
export default {
  components: { ComDh, ComMl, ComGc },
  data() {
    return {
      scrollTop: 0,
      tabs: ['大货甘特表汇总', '大货面料甘特表汇总', '大货工厂甘特表汇总']
    }
  },
  created() {
    try {
      /* 平台方法 */
      // eslint-disable-next-line
      dg.removeBtn('cancel')
      // eslint-disable-next-line
      dg.removeBtn('saveAndAdd')
      // eslint-disable-next-line
      dg.removeBtn('saveAndClose')
      // eslint-disable-next-line
      dg.removeBtn('saveNoClose')
    } catch (err) {
      //
    }
  },
  computed: {
    ...mapState(['active']),
    ...mapState('Dh', { dh: state => state.tableData_1, dh_loading: state => state.loadingPage }),
    ...mapState('Ml', { ml: state => state.tableData_1, ml_loading: state => state.loadingPage }),
    ...mapState('Gc', { gc: state => state.tableData_1, gc_loading: state => state.loadingPage })
  },
  methods: {
    /**
     * [切换：汇总表]
     */
    toggleTab(event) {
      this.$store.commit('saveData', { name: 'active', obj: event.label })
    },
    /**
     * [页面滚动事件]
     */
    pageScroll(event) {
      const newNum = event.target.scrollTop
      const oldNum = this.scrollTop
      if (Math.abs(newNum - oldNum) < 300) {
        this.scrollTop = event.target.scrollTop
        this.$refs.page.scrollTop = newNum
      } else {
        this.$refs.page.scrollTop = oldNum
      }
    }
  }
}
</script>

<style scoped>
.pageBox {
  width: 100%;
  height: 100%;
  font-size: 12px;
  background: #ffffff;
  overflow-y: auto;
}

.comTabs {
  height: calc(100% - 2px);
}
.tab {
  width: 100%;
  height: 100%;
}
</style>

<style>
/*** 单元格：计划、实际、状态 ***/
.comCellBox {
  display: flex;
  justify-content: center;
}
.comCell {
  text-align: left;
}
.comCell > p {
  white-space: nowrap;
}

/*** tabs ***/
.comTabs {
  border: 0 !important;
  box-shadow: none !important;
}
.comTabs .el-tabs__item { /* tab 顶部 */
  height: 30px !important;
  line-height: 30px !important;
  font-size: 12px !important;
  padding: 0 10px !important;
}
.comTabs .el-tabs__content { /* tab 内容 */
  padding: 0 !important;
  position: absolute;
  top: 30px;
  bottom: 0;
  left: 0;
  right: 0;
}

/*** 模块刷新 ***/
.f5 {
  color: #909399;
  cursor: pointer;
  padding: 0 6px;
}

/*** 表格字体 ***/
.el-table {
  font-size: 12px !important;
}
/*** 重置表头单元格 ***/
.el-table > div th, .el-table > div th > .cell {
  padding: 0 !important;
}
.el-table > div th > .cell .thText {
  padding: 5px 10px;
}
th > .cell, th > .cell .thText {
  text-align: center;
}
/*** 表头输入内容 ***/
.thActive {
  color: #000000 !important;
  /* color: #ffffff;
  background: #409EFF; */
}
/*** 单元格 ***/
td {
  padding: 0 !important;
}
.cell p {
  line-height: 16px !important;
  margin: 4px 0 !important;
}
td > .cell {
  text-align: center;
}

/*** 搜索 ***/
.el-popover {
  padding: 6px;
}
.el-popover > div > input {
  height: 26px;
  font-size: 12px !important;
  display: flex;
  align-items: center;
}
.el-popover > div > .el-input__suffix { /* input 中删除按钮 */
  margin-top: -6px;
}

/*** 下拉框 ***/
.comSelectOptions { /* 单个选项 */
  height: 25px !important;
  font-size: 12px !important;
  line-height: 25px !important;
  padding: 0 10px !important;
}

/*** 分页 ***/
.comPagination {
  padding: 0;
}
.comPagination > .el-pagination__sizes { /* 总条数 */
  margin: 0 0 0 30px;
}
.comPagination > .el-pagination__sizes > .el-select > .el-input--suffix { /* 总条数 */
  margin-right: 0;
}
</style>
