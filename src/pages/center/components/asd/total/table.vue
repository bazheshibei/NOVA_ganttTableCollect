
<!-- 表格模块 -->

<template>
  <div>

    <el-table :data="tableData" size="mini" border
      :row-style="rowStyle" :cell-style="cellStyle" :header-cell-style="headerStyle"
    >
      <el-table-column prop="date" label="日期" fixed></el-table-column>
      <div v-for="(item, index) in selectArr" :key="item.word">
        <!-- 展示选中的表头 -->
        <div v-for="(val) in item.options[1].options" :key="val.label"
           v-if="arrIncludes(val.label, searchLabel[item.word])"
        >
          <el-table-column :label="val.label" :column-key="index + ''" min-width="100">
            <template slot="header" slot-scope="scope">
              <!-- <div class="whiteFont">
                <span>{{val.label}}</span>
              </div> -->
              <el-popover placement="top" width="250" trigger="click">
                <el-input clearable v-model="searchObj[val.value]" placeholder="多个查询空格分隔" @clear="clear(val.value)" @change="change(val.value, $event)"></el-input>
                <div class="thText whiteFont" :class="searchObj[val.value] ? 'thActive' : ''" slot="reference">
                  {{val.label}}<span>&nbsp;<i class="el-icon-search"></i></span>
                </div>
              </el-popover>
            </template>
            <template slot-scope="scope">
              <div class="ComTableCell">
                <span>{{scope.row[val.value]}}</span>
              </div>
            </template>
          </el-table-column>
        </div>
      </div>
    </el-table>

    <el-table class="countTable" :data="[{}]" size="mini" border :show-header="false">
      <el-table-column fixed>
        <template slot-scope="scope"></template>
      </el-table-column>
      <div v-for="(item) in selectArr" :key="item.word">
        <!-- 展示选中的表头 -->
        <div v-for="(val) in item.options[1].options" :key="val.label"
           v-if="arrIncludes(val.label, searchLabel[item.word])"
        >
          <el-table-column min-width="100">
            <template slot-scope="scope">
              <el-tag class="countBtn" size="mini" @click="count(val)">合计</el-tag>
              &nbsp;{{countObj[val.label] || ''}}
            </template>
          </el-table-column>
        </div>
      </div>
    </el-table>

    <p style="display: none;">{{searchLabel}}</p>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  created() {},
  data() {
    return {
      searchObj: {}, // 表头搜索
      countObj: {}, //  合计
      colorArr: ['#FF695E', '#FF851B', '#2ECC40', '#54C8FF', '#A291FB', '#DC73FF', '#FF8EDF', '#D67C1C']
      // colorObj: {
      //   DHXG_1: '#FF695E',
      //   KFXG: '#FF851B',
      //   SJXG: '#2ECC40',
      //   HDXX: '#54C8FF',
      //   WWJGCXG: '#A291FB',
      //   DHXG_2: '#DC73FF',
      //   DHCGXG: '#FF8EDF',
      //   DHYHXG: '#D67C1C'
      // }
    }
  },
  computed: {
    ...mapState(['tableData']),
    /**
     * [下拉框数据]
     */
    selectArr() {
      const arr = this.$store.state.selectArr
      if (arr.length) {
        // console.log('arr ----- ', arr)
        return arr
      } else {
        return []
      }
    },
    /**
     * [选中的表头名称]
     */
    searchLabel() {
      const obj = this.$store.state.searchLabel || {}
      return Object.keys(obj) ? obj : {}
    }
  },
  methods: {
    /**
     * [表头：清空输入框]
     * @param {[String]} name 字段名
     */
    clear(name) {
      this.searchObj[name] = ''
    },
    /**
     * [表头：改变值]
     * @param {[String]} key   属性名
     * @param {[String]} value 属性值
     */
    change(key, value) {
      const obj = { [key]: value.trim() }
      this.$store.commit('assignData', { name: 'searchHeader', obj })
    },
    /**
     * [合计]
     * @param {[Object]} val 列信息（属性名）
     */
    count(val) {
      const { countObj } = this
      countObj[val.label] = 1
      this.countObj = Object.assign({}, countObj)
    },
    /**
     * [改变样式：隔行变色]
     */
    rowStyle({ row, rowIndex }) {
      if (row.style_id % 2 === 1) {
        return { background: 'oldlace' }
      }
    },
    /**
     * [改变样式：单元格]
     * @param {[Object]} row         数据：行
     * @param {[Object]} column      数据：列
     * @param {[Int]}    rowIndex    索引：行
     * @param {[Int]}    columnIndex 索引：列
     */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      // return { background: this.colorObj[column.columnKey] }
    },
    /**
     * [改变样式：表头]
     * @param {[Object]} row         数据：所有列
     * @param {[Object]} column      数据：此列
     * @param {[Int]}    rowIndex    索引：行
     * @param {[Int]}    columnIndex 索引：列
     */
    headerStyle({ row, column, rowIndex, columnIndex }) {
      return { background: this.colorArr[parseInt(column.columnKey) % 8] }
    },
    /**
     * [兼容IE11：数组includes]
     * @param  {[String]}  str 关键字
     * @param  {[Array]}   arr 数组
     * @return {[Boolean]}     true || false
     */
    arrIncludes(str, arr = []) {
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
.whiteFont {
  color: #ffffff;
  flex: 1;
}
.countTable {
  margin-top: -1px;
}
.countBtn {
  margin: 4px 0;
  cursor: pointer;
}
</style>
