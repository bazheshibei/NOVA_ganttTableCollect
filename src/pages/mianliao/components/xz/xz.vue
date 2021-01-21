
<!-- 选择面料项目页面 -->

<template>
  <div class="comBox" ref="page">

    <div class="topBtnLine">
      <div>
        <el-button type="primary" size="mini" @click="advancedQuery">高级查询</el-button>
        <el-button type="primary" size="mini" @click="f5">刷新</el-button>
        <el-button type="primary" size="mini" :disabled="!ids.length" @click="submit">确认</el-button>
      </div>
    </div>

    <!-- 表格组件 -->
    <com-table :style="tableStyle" :tableHeight="tableHeight"></com-table>

    <!-- 分页 -->
    <div class="paginationBox" ref="bottomBox">
      <el-pagination class="comPagination" :page-size="rownum" :page-sizes="[20, 30, 50, 100]" :total="pageCount" :current-page="pagenum"
        layout="prev, pager, next, total, jumper, sizes" prev-text="上一页" next-text="下一页"
        @size-change="pageChange('rownum', $event)" @current-change="pageChange('pagenum', $event)"
      >
      </el-pagination>
    </div>
    <!-- /分页 -->

    <!-- 高级查询 -->
    <com-advancedQuery></com-advancedQuery>

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
      tableStyle: {}
    }
  },
  created() {
    /** 计算：表格高度 **/
    this._countHeight()
  },
  computed: {
    ...mapState('MlXz', ['pagenum', 'rownum', 'pageCount', 'ids'])
  },
  methods: {
    /**
     * [确认]
     */
    submit() {
      const { ids } = this
      localStorage.setItem('NOVA_mianliao_choose_submit', JSON.stringify({ itemids: ids }))
      try {
        // eslint-disable-next-line
        father.getMaterialItemGantt(ids, 1)
      } catch (err) {
        //
      }
      // eslint-disable-next-line
      dg.close()
    },
    /**
     * [高级查询]
     */
    advancedQuery() {
      this.$store.commit('saveData', { name: 'isDialog', obj: true, module: 'MlXz' })
    },
    /**
     * [刷新]
     * @param {[Boolean]} reset 是否重置分页
     */
    f5(reset = true) {
      if (reset) {
        this.$store.commit('saveData', { module: 'MlXz', name: 'pagenum', obj: 1 })
        this.$store.commit('saveData', { module: 'MlXz', name: 'rownum', obj: 20 })
        this.$store.commit('saveData', { module: 'MlXz', name: 'pageCount', obj: 0 })
      }
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
      this.$store.commit('saveData', { module: 'MlXz', name, obj: val })
      if (name === 'rownum') {
        this.$store.commit('saveData', { module: 'MlXz', name: 'pagenum', obj: 1 })
      }
      /** 发起请求 **/
      this._request()
    },
    /**
     * [发起请求]
     */
    _request() {
      /** 请求：表格基础数据 **/
      this.$store.dispatch('MlXz/A_tableData')
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
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
