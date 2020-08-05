
<!-- 顶部 tab -->
<template>
  <el-radio-group class="topTab" size="small" v-model="active2" @change="change">
    <el-radio-button size="mini" v-for="(item, index) in list" :key="'list_' + index" :label="index">
      <span>{{index}}</span>
      <!-- <span class="asd">999</span> -->
      <span class="point" :class="active2 === index ? 'active' : 'none'">{{item}}</span>
    </el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  props: ['list', 'active'],
  data() {
    return {
      active2: ''
    }
  },
  created() {
    if (this.active) {
      this.active2 = this.active
    }
  },
  watch: {
    active(newVal, oldVal) {
      this.active2 = newVal
    }
  },
  methods: {
    /**
     * [切换页签]
     */
    change(e) {
      this.$emit('changeTab', e)
    }
  }
}
</script>

<style scoped>
.topTab {
  margin-bottom: -1px;
}
.point {
  font-size: 10px;
  line-height: 10px;
  margin-left: 3px;
  padding: 0 5px;
  border-radius: 100px;
}
.active {
  color: #409EFF;
  background: #ffffff;
}
.none {
  color: #ffffff;
  background: #409EFF;
}
</style>

<style>
/*** 修改选中、未选时的背景色 ***/
.topTab > .el-radio-button > .el-radio-button__inner {
  font-size: 12px !important;
  padding: 8px 8px !important;
  background: #ecf2fe;
}
.topTab > .el-radio-button.is-active > .el-radio-button__inner {
  background: #409EFF;
}
/*** 顶部标签，左下角跟右下角不用圆角，跟表格重合 ***/
.topTab > .el-radio-button:first-child > .el-radio-button__inner {
  border-bottom-left-radius: 0;
}
.topTab > .el-radio-button:last-child > .el-radio-button__inner {
  border-bottom-right-radius: 0;
}
</style>
