
<!-- 搜索模块 -->

<template>
  <div class="comBox">

    <div class="searchBox" v-for="(item, index) in selectArr" :key="'searchBox_' + index">
      <div class="searchName" :style="(item.deleteType && item.deleteType !== deleteType && deleteType !== 'asd') ? 'text-decoration: line-through;' : ''">
        {{item.name}}：
      </div>
      <!-- 搜索框 -->
      <el-select class="comSelect" v-model="searchVal[item.word]" filterable multiple collapse-tags placeholder="请选择" size="mini"
        @change="selectChange(item.word, $event, index)" ref="select"
      >
        <!-- 搜索分组 -->
        <el-option-group v-for="group in item.options" :key="group.label" :label="group.label">
          <!-- 选项 -->
          <el-option class="comSelectOptions" v-for="(val, key) in group.options" :key="'options_' + key" :label="val.label" :value="val.value"></el-option>
        </el-option-group>
      </el-select>
    </div>

    <div class="searchBox">
      <div class="searchName">项目名称：</div>
      <el-input size="mini" v-model="inputVal" placeholder="请输入项目名称" @input="input"></el-input>
    </div>

    <div class="searchBox">
      <el-button type="primary" size="mini" :plain="!isSearch" @click="submit">查询</el-button>
      <el-button type="primary" size="mini" plain @click="reset">重置</el-button>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      inputVal: '' // input输入值
    }
  },
  created() {
    /* 提取上次的数据 */
    const searchVal = JSON.parse(localStorage.getItem('NOVA_total_searchVal')) || {}
    const searchLabel = JSON.parse(localStorage.getItem('NOVA_total_searchLabel')) || {}
    const searchText = localStorage.getItem('NOVA_total_searchText') || ''
    /** 保存数据 **/
    this.$store.commit('saveData', { name: 'searchVal', obj: searchVal })
    this.$store.commit('saveData', { name: 'searchLabel', obj: searchLabel })
    this.$store.commit('saveData', { name: 'searchText', obj: searchText })
    this.$store.commit('saveData', { name: 'lastSearchVal', obj: Object.assign({}, searchVal) })
    this.$store.commit('saveData', { name: 'lastSearchText', obj: searchText })
    /* 赋值 */
    this.inputVal = searchText
  },
  computed: {
    /* ['下拉框数据', '选中：大类', '选中：表头名称', '搜索：input'] */
    ...mapState(['selectArr', 'searchVal', 'searchLabel', 'searchText']),
    /* 是否需要：搜索, 删除线指标 */
    ...mapGetters(['isSearch', 'deleteType'])
  },
  methods: {
    /**
     * [输入搜索文字]
     */
    input(event) {
      this.$store.commit('saveData', { name: 'searchText', obj: event })
    },
    /**
     * [查询]
     */
    submit() {
      /** 搜索 **/
      this.$store.dispatch('search', { that: this })
    },
    /**
     * [重置]
     */
    reset() {
      this.$store.commit('saveData', { name: 'searchVal', obj: {} })
      this.$store.commit('saveData', { name: 'searchLabel', obj: {} })
      this.$store.commit('saveData', { name: 'searchText', obj: '' })
    },
    /**
     * [下拉框改变值]
     * @param {[String]} word  属性名
     * @param {[Array]}  event 事件返回值
     * @param {[Int]}    index 组件索引
     */
    selectChange(word, event, index) {
      const options = this.selectArr[index].options[1].options // 当前下拉框：全部选项
      if (this.arrIncludes(-1, event)) {
        /* 全选 */
        const val = []
        const label = []
        for (let i = 0; i < options.length; i++) {
          const item = options[i]
          val.push(item.value) //   值
          label.push(item.label) // 属性名
        }
        this.$store.commit('assignData', { name: 'searchVal', obj: { [word]: val } })
        this.$store.commit('assignData', { name: 'searchLabel', obj: { [word]: label } })
        this.selectBlur(index) // 下拉框失焦
      } else if (this.arrIncludes(-2, event)) {
        /* 反选 */
        const selectArr = this.searchVal[word] // 数组：选中的值
        const arr = []
        const label = []
        for (let i = 0; i < options.length; i++) {
          const item = options[i]
          if (!this.arrIncludes(item.value, selectArr)) {
            arr.push(item.value) //   值
            label.push(item.label) // 属性名
          }
        }
        this.$store.commit('assignData', { name: 'searchVal', obj: { [word]: arr } })
        this.$store.commit('assignData', { name: 'searchLabel', obj: { [word]: label } })
        this.selectBlur(index) // 下拉框失焦
      } else if (this.arrIncludes(-3, event)) {
        /* 全不选 */
        this.$store.commit('assignData', { name: 'searchVal', obj: { [word]: [] } })
        this.$store.commit('assignData', { name: 'searchLabel', obj: { [word]: [] } })
        this.selectBlur(index) // 下拉框失焦
      } else {
        /* 点击选项 */
        const label = []
        for (let i = 0; i < options.length; i++) {
          const item = options[i]
          if (this.arrIncludes(item.value, event)) {
            label.push(item.label)
          }
        }
        this.$store.commit('assignData', { name: 'searchLabel', obj: { [word]: label } })
      }
    },
    /**
     * [下拉框失焦]
     * @param {[Int]} index 组件索引
     */
    selectBlur(index) {
      const that = this
      setTimeout(function () {
        that.$refs.select[index].blur()
      }, 0)
    },
    /**
     * [兼容IE11：数组includes]
     * @param  {[String]}  str 关键字
     * @param  {[Array]}   arr 数组
     * @return {[Boolean]}     true || false
     */
    arrIncludes(str, arr) {
      let status = false
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === str) {
          status = true
        }
      }
      return status
    }
  }
}
</script>

<style scoped>
.comBox {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}

.searchBox { /* 单个组件块 */
  width: 280px;
  font-size: 12px;
  margin: 10px 10px 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.searchName { /* 单个 label */
  width: 100px;
  min-width: 100px;
  text-align: right;
}
.comSelect { /* 下拉框组件 */
  flex: 1;
}
</style>

<style>
.comSelectOptions { /* 单个选项 */
  height: 25px !important;
  font-size: 12px !important;
  line-height: 25px !important;
  padding: 0 10px !important;
}
.el-select-group__wrap { /* 分组间距 */
  padding-bottom: 16px !important;
}
.el-select-group__wrap:not(:last-of-type)::after { /* 分割线：选项分组间 */
  left: 10px !important;
  right: 10px !important;
  bottom: 8px !important;
}
</style>
