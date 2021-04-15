
<!-- 高级查询 -->

<template>
  <el-dialog class="comDialog" title="高级查询" :visible.sync="isDialog" width="60%" :before-close="handleClose">
    <!-- 内容 -->
    <el-button size="mini" type="primary" plain @click="addData">增加条件</el-button>
    <br>
    <br>
    <div class="comContentBox" :style="styleObj">
      <div class="advancedQueryBox" v-for="(item, index) in submitVal" :key="'line_' + index">
        <!-- 表头 -->
        <el-select class="com_1" size="mini" v-model="submitVal[index].typecode" @change="_proving">
          <el-option class="comSelectOptions" v-for="item in selectObj" :key="'cate_' + item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <!-- 限制 -->
        <el-select class="com_2" size="mini" v-model="submitVal[index].searchtype" @change="_proving">
          <el-option class="comSelectOptions" v-for="item in typeArr" :key="'type_' + item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <!-- 值：文本  -->
        <el-input class="com_3" v-if="valueType[submitVal[index].typecode] === 'text'"
          size="mini" :disabled="submitVal[index].searchtype === 'n' || submitVal[index].searchtype === 'nn'"
          v-model="submitVal[index].searchvalue" @change="_proving"
        ></el-input>
        <!-- 值：日期 -->
        <el-date-picker class="com_3" v-if="valueType[submitVal[index].typecode] === 'timePicker'"
          size="mini" type="date" value-format="yyyy-MM-dd" :disabled="submitVal[index].searchtype === 'n' || submitVal[index].searchtype === 'nn'"
          v-model="submitVal[index].searchvalue" @change="_proving"
        >
        </el-date-picker>
        <!-- 删除 -->
        <el-button size="mini" icon="el-icon-delete-solid" @click="deleteData(index)"></el-button>
      </div>
    </div>
    <!-- /内容 -->
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="reset">
        重置查询条件 <i class="el-icon-refresh"></i>
      </el-button>
      <el-button size="mini" type="primary" @click="search">
        查找 <i class="el-icon-search"></i>
      </el-button>
    </span>

  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      selectObj: [
        { label: '项目名称', value: 'item_name' },
        { label: '项目季节', value: 'season_name' },
        { label: '服装品类', value: 'type_name' },
        { label: '款式名称', value: 'style_name' },
        { label: '业务组', value: 'group_name' },
        { label: '审核状态', value: 'audit_status' },
        { label: '提报人', value: 'reporter' },
        { label: '创建时间', value: 'report_time' },
        { label: '下单时间', value: 'order_time' },
        { label: '客人交期', value: 'deliver_date' }
      ],
      valueType: {
        item_name: 'text',
        season_name: 'text',
        type_name: 'text',
        style_name: 'text',
        group_name: 'text',
        audit_status: 'text',
        reporter: 'text',
        report_time: 'timePicker',
        order_time: 'timePicker',
        deliver_date: 'timePicker'
      },
      typeArr: [
        { label: '包含', value: 'like' },
        { label: '不包含', value: 'nlike' },
        { label: '等于', value: 'eq' },
        { label: '不等于', value: 'ne' },
        { label: '大于', value: 'gt' },
        { label: '小于', value: 'lt' },
        { label: '大于等于', value: 'ge' },
        { label: '小于等于', value: 'le' },
        { label: '空值', value: 'n' },
        { label: '非空值', value: 'nn' }
      ],
      submitVal: [{ typecode: '', searchtype: 'like', searchvalue: '' }], // 提交时的值
      styleObj: {} // 内容容器样式
    }
  },
  created() {
    const height = document.documentElement.clientHeight - 430
    this.styleObj = { maxHeight: height + 'px', overflowY: 'auto' }
  },
  computed: {
    ...mapState('KfKf', ['isDialog'])
  },
  methods: {
    /**
     * [验证：提取可用数据]
     */
    _proving() {
      const { submitVal } = this
      const arr = []
      submitVal.forEach(function (item) {
        const { typecode, searchtype } = item
        let { searchvalue } = item
        if (typecode && searchtype) {
          if (searchtype === 'n' || searchtype === 'nn') {
            item.searchvalue = ''
            searchvalue = ''
            arr.push({ typecode, searchtype, searchvalue })
          } else if (searchvalue) {
            arr.push({ typecode, searchtype, searchvalue })
          }
        }
      })
      /* 保存有用数据 */
      this.$store.commit('saveData', { name: 'filter_data', obj: arr, module: 'KfKf' })
    },
    /**
     * [增加条件]
     */
    addData() {
      const data = { typecode: '', searchtype: 'like', searchvalue: '' }
      this.submitVal.push(data)
    },
    /**
     * [删除数据]
     * @param {[Int]} index 索引
     */
    deleteData(index) {
      this.submitVal.splice(index, 1)
      /** 验证：提取可用数据 **/
      this._proving()
    },
    /**
     * [重置]
     */
    reset() {
      this.submitVal = [{ typecode: '', searchtype: 'like', searchvalue: '' }]
      this.$store.commit('saveData', { name: 'filter_data', obj: [], module: 'KfKf' })
      /* 重置分页 */
      this.$store.commit('saveData', { module: 'KfKf', name: 'pagenum', obj: 1 })
      this.$store.commit('saveData', { module: 'KfKf', name: 'rownum', obj: 10 })
      this.$store.commit('saveData', { module: 'KfKf', name: 'pageCount', obj: 0 })
      /* 重置折叠数据 */
      this.$store.commit('saveData', { module: 'KfKf', name: 'tableData_2', obj: {} })
      /** 查询 **/
      this.$store.dispatch('KfKf/A_tableData')
    },
    /**
     * [搜索]
     */
    search() {
      /** 验证：提取可用数据 **/
      this._proving()
      /** 隐藏：高级查询 **/
      this.handleClose()
      /* 重置分页 */
      this.$store.commit('saveData', { module: 'KfKf', name: 'pagenum', obj: 1 })
      this.$store.commit('saveData', { module: 'KfKf', name: 'rownum', obj: 10 })
      this.$store.commit('saveData', { module: 'KfKf', name: 'pageCount', obj: 0 })
      /* 重置折叠数据 */
      this.$store.commit('saveData', { module: 'KfKf', name: 'tableData_2', obj: {} })
      /** 查询 **/
      this.$store.dispatch('KfKf/A_tableData')
    },
    /**
     * [隐藏：高级查询]
     */
    handleClose() {
      this.$store.commit('saveData', { name: 'isDialog', obj: false, module: 'KfKf' })
    },
    /**
     * [计算：表格高度]
     */
    _countHeight() {
      this.$emit('_countHeight')
    }
  }
}
</script>

<style scoped>
.comContentBox {
  flex: 1;
}
.advancedQueryBox {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
}
.advancedQueryBox:last-child {
  margin-bottom: 0;
}

/*** 下拉框 ***/
.com_1, .com_2, .com_3 {
  margin-right: 10px;
}
.com_1 {
  width: 120px;
}
.com_2 {
  width: 120px;
}
.com_3 {
  flex: 1;
}
</style>

<style>
.comDialog > .el-dialog > .el-dialog__body {
  padding: 10px 20px !important;
}
</style>
