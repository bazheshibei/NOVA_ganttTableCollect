
<!-- 任务中心 -->
<template>
  <com-white-box :title="'任务中心'" v-loading="loading">

    <template slot="f5">
      <i class="el-icon-refresh f5" @click="f5"></i>
    </template>

    <!-- 顶部 tab -->
    <com-top-tab :active="'全部'" :list="tabs"></com-top-tab>
    <!-- /顶部 tab -->

  </com-white-box>
</template>

<script>
import ComWhiteBox from '../whiteBox' // 白色容器
import ComTopTab from '../topTab' //     顶部 tab
export default {
  components: { ComWhiteBox, ComTopTab },
  data() {
    return {
      loading: false,
      tabs: {
        '全部': '0',
        '今日待办': '0',
        '待阅读': '0'
      }
    }
  },
  methods: {
    /**
     * [刷新]
     */
    f5() {
      console.log('刷新')
    }
  }
}
</script>

<style scoped>
.num1 {
  color: #409EFF;
  padding: 0 4px;
  background: #ffffff;
  border-radius: 20px;
}
.num2 {
  color: #ffffff;
  padding: 0 4px;
  background: #409EFF;
  border-radius: 20px;
}
</style>
