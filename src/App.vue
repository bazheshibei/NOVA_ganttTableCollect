<template>
  <div id="app" v-if="isShow">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isShow: false
    }
  },
  created() {
    const { item_id = '', plant_order_id = '', type = '1' } = JSON.parse(localStorage.getItem('ganttitemid') || '{}')
    const textObj = { 1: '大货甘特表汇总', 3: '大货工厂甘特表汇总', 4: '开发甘特表汇总' }
    this.$store.commit('saveData', { name: 'active', obj: textObj[type] })
    this.$store.commit('saveData', { name: 'item_id', obj: item_id })
    this.$store.commit('saveData', { name: 'plant_order_id', obj: plant_order_id })
    localStorage.removeItem('ganttitemid')
    this.isShow = true
  }
}
</script>

<style>
@import './assets/css/base.css';
#app {
  -webkit-font-smoothing: antialiased; /* 抗锯齿 */
  -moz-osx-font-smoothing: grayscale;
  overflow: hidden;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

/*** 表头输入内容 ***/
.thActive {
  color: #000000;
}
.thText {
  text-align: center;
  line-height: 14px;
  padding-top: 4px;
}
</style>
