
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
  display: flex !important;
  justify-content: center !important;
}
.comCell {
  text-align: left !important;
}
.comCell > p {
  white-space: nowrap !important;
}
</style>
