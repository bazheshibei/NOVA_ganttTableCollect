
<!-- 面料甘特表汇总 -->

<template>
  <div class="pageBox" v-on:scroll="pageScroll" ref="page" v-loading="ml_loading || fs_loading" element-loading-text="数据加载中...">

    <!-- 选择面料项目页面 -->
    <el-tabs v-if="isChoose" class="comTabs" type="border-card" @tab-click="toggleTab">
      <el-tab-pane class="tab" label="面料甘特表汇总">
        <com-xz v-if="active === '面料甘特表汇总' || xz.length"></com-xz>
      </el-tab-pane>
    </el-tabs>

    <!-- 正常面料页面 -->
    <el-tabs v-else class="comTabs" type="border-card" @tab-click="toggleTab">
      <el-tab-pane class="tab" label="面料甘特表汇总">
        <com-ml v-if="active === '面料甘特表汇总' || ml.length"></com-ml>
      </el-tab-pane>
      <el-tab-pane class="tab" label="面料分色甘特表计划">
        <com-fs v-if="active === '面料分色甘特表计划' || fs.length"></com-fs>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { mapState } from 'vuex'
import ComMl from './components/ml/ml.vue' // 面料
import ComFs from './components/fs/fs.vue' // 分色
import ComXz from './components/xz/xz.vue' // 选择
export default {
  components: { ComMl, ComFs, ComXz },
  data() {
    return {
      isChoose: false, // 是否显示：选择面料项目页面
      scrollTop: 0
    }
  },
  created() {
    // localStorage.setItem('NOVA_mianliao_choose', JSON.stringify({ isChoose: true }))
    const { isChoose = false } = JSON.parse(localStorage.getItem('NOVA_mianliao_choose') || '{}')
    if (isChoose) { /* 选择面料项目页面 */
      this.isChoose = isChoose
    }
    localStorage.removeItem('NOVA_mianliao_choose')
    this.$store.commit('saveData', { name: 'active', obj: '面料甘特表汇总' })
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
    ...mapState('MlMl', { ml: state => state.tableData_1, ml_loading: state => state.loadingPage }),
    ...mapState('MlFs', { fs: state => state.tableData_1, fs_loading: state => state.loadingPage }),
    ...mapState('MlXz', { xz: state => state.tableData_1, xz_loading: state => state.loadingPage })
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
  flex: 1 !important;
}
.comCell > p {
  white-space: nowrap !important;
}
</style>
