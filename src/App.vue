<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
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
