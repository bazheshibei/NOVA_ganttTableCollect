
<!-- 白色容器 -->
<template>
  <div class="whiteBox">
    <div class="whiteBoxTitle">
      <span class="titleText">
        {{title}}
        <slot name="f5"></slot>
      </span>

      <slot name="title"></slot>

      <!-- 收起 -->
      <div class="hidden" v-if="hidden">
        <p v-show="showHidden" @click="showHidden = !showHidden">
          <i class="el-icon-arrow-up"></i>
          <span>收起</span>
        </p>
        <p v-show="!showHidden" @click="showHidden = !showHidden">
          <i class="el-icon-arrow-down"></i>
          <span>展开</span>
        </p>
      </div>
      <!-- /收起 -->
    </div>

    <!-- 内容 -->
    <div class="whiteBoxContent" v-show="showHidden">
      <slot></slot>
    </div>
    <!-- /内容 -->

  </div>
</template>

<script>
export default {
  props: ['title', 'hidden'],
  data() {
    return {
      showHidden: true // 显示收起
    }
  }
}
</script>

<style scoped>
.whiteBox {
  width: calc(100% - 40px);
  padding: 15px 15px;
  background: #ffffff;
  flex: 1;
}
.whiteBoxTitle {
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.whiteBoxContent {
  margin-top: 10px;
  flex: 1;
}
.titleText {
  font-weight: bold;
}
.hidden { /* 收起 */
  color: #409EFF;
}
p {
  margin: 0;
}
</style>
