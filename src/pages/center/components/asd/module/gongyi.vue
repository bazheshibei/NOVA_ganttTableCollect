
<!-- 工艺岗 -->
<template>
  <com-white-box :title="'跟进项目技术工艺--技术工艺岗'" :hidden="true" v-loading="loading">

    <template slot="f5">
      <i class="el-icon-refresh f5" @click="f5"></i>
    </template>

    <!-- 顶部 tab -->
    <com-top-tab :active="active" :list="tabs" @changeTab="changeTab"></com-top-tab>
    <!-- /顶部 tab -->

    <el-table class="el-table" :data="listObj[active]" border>
      <!-- 一 -->
      <el-table-column width="150">
        <template slot="header" slot-scope="scope">
          <div class="thText" slot="reference" style="flex: 1;">快速通道</div>
        </template>
        <template slot-scope="scope">
          <p class="itemBtn" @click="A_showAdd_1(scope.row.index)">查看工艺单</p>
          <p class="itemBtn" @click="A_showAdd_2(scope.row.index)">查看工艺单变更记录</p>
          <p class="itemBtn" @click="A_showAdd_3(scope.row.index)">录入/变更工艺单</p>
        </template>
      </el-table-column>
      <!-- 二 -->
      <el-table-column prop="item_name" width="100" align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input v-model="search[active].item_name" clearable placeholder="多个查询空格分隔" @clear="clear('item_name')" @change="select"></el-input>
            <div class="thText" :class="search[active].item_name ? 'thActive' : ''" slot="reference" style="flex: 1;">
              项目名称<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 二点五 -->
      <!-- <el-table-column prop="product_id_info" width="200" align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input v-model="search[active].item_msg" clearable placeholder="多个查询空格分隔" @clear="clear('item_msg')" @change="select"></el-input>
            <div class="thText" :class="search[active].item_msg ? 'thActive' : ''" slot="reference" style="flex: 1;">
              项目信息<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column prop="product_id_info" width="200" align="center" label="项目信息"></el-table-column>
      <!-- 三 -->
      <el-table-column label="工艺阶段" width="120" align="center">
        <template slot-scope="scope">
          <p>{{text.create_type[scope.row.create_type]}}</p>
        </template>
      </el-table-column>
      <!-- 四 -->
      <el-table-column label="版本数（最近更新）" width="150" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.bbs}}</p>
          <p>{{scope.row.max_create_time}}</p>
        </template>
      </el-table-column>
      <!-- 循环：自定义列 -->
      <el-table-column v-for="(item, index) in nodeMapList[active]" :key="'column_' + index" :label="item.node_name" width="160">
        <template slot-scope="scope">
          <div class="" v-if="scope.row['item_node_id_' + item.node_id]">
            <p>计划日期：{{scope.row['plan_enddate_' + item.node_id] || '--'}}</p>
            <p>完成日期：{{scope.row['actual_enddate_' + item.node_id] || '--'}}</p>
            <p>完成状态：<span :style="{ color: scope.row['timeColor_' + item.node_id] }">{{scope.row['timeText_' + item.node_id]}}</span></p>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="paginationBox">
      <el-pagination class="comPagination" :page-size="pageObj[active].size" :page-sizes="[10, 20, 30]" :total="pageObj[active].count" :current-page="pageObj[active].page"
        layout="prev, pager, next, total, jumper, sizes" prev-text="上一页" next-text="下一页"
        @size-change="handleSizeChange" @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <!-- /分页 -->

  </com-white-box>
</template>

<script>
import Api from '@/config/api'
import ComWhiteBox from '../whiteBox' // 白色容器
import ComTopTab from '../topTab' //     顶部 tab
export default {
  components: { ComWhiteBox, ComTopTab },
  data() {
    return {
      loading: false,
      tabs: { '大货项目': '0', '开发项目': '0' }, // 三个页签 && 默认数量
      pageObj: { //                                          三个页签：对应的分页数据
        /* 总条数 每页数量 当前页数 */
        '大货项目': { count: 0, size: 10, page: 1 },
        '开发项目': { count: 0, size: 10, page: 1 }
      },
      listObj: { '大货项目': [], '开发项目': [] }, // 三个页签：对应的数据列表
      search: { //                                           三个页签：对应的搜索对象
        '大货项目': { item_name: '', item_msg: '' },
        '开发项目': { item_name: '', item_msg: '' }
      },
      active: '大货项目', //                                      当前激活的页签
      tabType: { '大货项目': 'dh', '开发项目': 'kf' }, //    请求时，页签对应的值
      text: { //                                             表格内：阅读标记对应的文字
        create_type: { 1: '样品工艺', 2: '大货工艺' } // 工艺阶段
      },
      nodeMapList: { '大货项目': [], '开发项目': [] } //  自定义表格列
    }
  },
  created() {
    const { tabs } = this
    /* 循环请求：所有页签内容 */
    for (const x in tabs) {
      this.A_getStyleCraftList(x)
    }
  },
  methods: {
    /**
     * [请求：查看工艺单]
     */
    A_showAdd_1(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active } = that
      const item = listObj[active][index]
      const { product_id, style_id, item_type, item_name, style_name, is_bom_edit } = item
      /* 发起请求 */
      // eslint-disable-next-line
      updateWin({
        title: '工艺清单',
        width: 1700,
        height: 900,
        url: host + 'styleCraftShowAction.do?action=showAdd&id=' + product_id,
        param: { style_id, item_type, item_name, style_name, is_bom_edit },
        onClose() {},
        fn() {}
      })
    },
    /**
     * [请求：工艺变更记录列表]
     */
    A_showAdd_2(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active } = that
      const item = listObj[active][index]
      const { product_id, style_id, item_type } = item
      /* 发起请求 */
      // eslint-disable-next-line
      ui('open', {
        title: '工艺变更记录',
        url: host + '/styleCraftShowAction.do?action=showChangeCraftList&id=' + product_id + '&style_id=' + style_id + '&item_type=' + item_type,
        onClose: function () {}
      })
      // win({
      //   title: '工艺变更记录',
      //   width: 1400,
      //   height: 600,
      //   url: host + 'styleCraftShowAction.do?action=showChangeCraftList&id=' + product_id,
      //   param: { style_id, item_type },
      //   onClose() {},
      //   fn() {}
      // })
    },
    /**
     * [请求：工艺变更]
     */
    A_showAdd_3(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active } = that
      const item = listObj[active][index]
      const { product_id, style_id, item_type, item_name, style_name, custom_name, style_craft_id } = item
      /* 发起请求 */
      if (style_craft_id) {
        // eslint-disable-next-line
        updateWin({
          title: '工艺变更申请',
          width: 1700,
          height: 900,
          url: host + 'styleCraftShowAction.do?action=showChangeCraft&id=' + product_id,
          param: { style_id, item_type, item_name, style_name, custom_name },
          onClose() {},
          fn() {
            /** 请求：技术工艺岗 **/
            that.A_getStyleCraftList(active, true)
          }
        })
      } else {
        // eslint-disable-next-line
        updateWin({
          title: '工艺清单录入',
          width: 1700,
          height: 900,
          url: host + 'styleCraftShowAction.do?action=showAdd&id=' + product_id,
          param: { style_id, item_type, item_name, style_name, custom_name },
          onClose() {},
          fn() {
            /** 请求：技术工艺岗 **/
            that.A_getStyleCraftList(active, true)
          }
        })
      }
    },
    /**
     * [请求：技术工艺岗]
     * @param {[String]} tab  当前页签
     * @param {Boolean}  show 是否显示加载动画
     */
    A_getStyleCraftList(tab, show = false) {
      /* 加载中...：显示 */
      this.loading = show
      const that = this
      const { tabType, search, pageObj } = this
      /* 整理分页对象 */
      const start = parseInt(pageObj[tab].page)
      const page = pageObj[tab].size
      /* 整理搜索对象 */
      const { item_name, item_msg } = search[tab]
      /* 发起请求 */
      const name = '技术工艺岗'
      const obj = {
        item_type: tabType[tab], //                           页签
        emp_id: '', //        当前登录用户的ID
        // emp_id: '965BAD8F4EF5C14CE4F607E77D30B9B5', //        当前登录用户的ID
        item_name: item_name.trim(),
        item_msg: item_msg.trim(),
        start, //                                             页码
        page, //                                              每页条数
        type: 1
      }
      const suc = function (res) {
        /* 加载中...：关闭 */
        if (show) {
          that.loading = false
        }
        /* tab 数字标记 */
        that.tabs[tab] = parseInt(res.count.num)
        /* 分页数据 */
        that.pageObj[tab].count = parseInt(res.count.num)
        /* 整理：表格自定义列 */
        that.nodeMapList[tab] = res.itemNodeList
        /* 整理：表格数据 */
        const { data: itemDataMapList, itemNodeList } = res
        const list = []
        if (itemDataMapList) {
          for (let i = 0; i < itemDataMapList.length; i++) {
            const item = itemDataMapList[i]
            item['index'] = i
            /* 整理：项目信息对象 */
            const arr = [item.group_name, item.item_season, item.type_name, item.series_name]
            item['product_id_info'] = arr.join(' > ')
            item['product_id_name'] = item.item_name
            /* 整理：完成状态 */
            const d = new Date()
            const now = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
            for (let j = 0; j < itemNodeList.length; j++) {
              const id = itemNodeList[j].node_id
              if (item['is_complete_' + id]) {
                if (item['is_complete_' + id] === '1') {
                  item['timeText_' + id] = '完成'
                  item['timeColor_' + id] = '#67C23A'
                } else if (item['is_complete_' + id] === '2') {
                  item['timeText_' + id] = '超期完成'
                  item['timeColor_' + id] = '#E6A23C'
                } else {
                  const timeArr = item['plan_enddate_' + id].split('-')
                  const end = new Date(timeArr[0], parseInt(timeArr[1]) - 1, timeArr[2]).getTime()
                  const day = parseInt((parseInt(end) - parseInt(now)) / 1000 / 60 / 60 / 24) // 计划结束时间 - 当前时间
                  if (day > 0) {
                    item['timeText_' + id] = '未完成'
                    item['timeColor_' + id] = '#909399'
                  } else {
                    item['timeText_' + id] = '超期未完成'
                    item['timeColor_' + id] = '#F56C6C'
                  }
                }
              }
            }
            list.push(item)
          }
        }
        that.listObj[tab] = list
      }
      Api({ name, obj, suc })
    },
    /**
     * [切换页签]
     */
    changeTab(e) {
      this.active = e
    },
    /**
     * [清空输入框]
     * @param {[String]} name 字段名
     */
    clear(name) {
      this.search[name] = ''
    },
    /**
     * [搜索]
     */
    select() {
      const { pageObj, active } = this
      pageObj[active].page = 1
      this.A_getStyleCraftList(active, true)
    },
    /**
     * [切换每页展示条数]
     */
    handleSizeChange(val) {
      const { pageObj, active } = this
      pageObj[active].size = val
      this.A_getStyleCraftList(active, true)
    },
    /**
     * [切换分页]
     */
    handleCurrentChange(val) {
      const { pageObj, active } = this
      pageObj[active].page = val
      this.A_getStyleCraftList(active, true)
    },
    /**
     * [刷新]
     */
    f5() {
      const { pageObj, listObj, search, nodeMapList, tabs } = this
      /* 重置 */
      for (const x in pageObj) {
        pageObj[x] = { count: 0, size: 10, page: 1 }
      }
      for (const x in listObj) {
        listObj[x] = []
      }
      for (const x in search) {
        search[x] = { item_name: '', item_msg: '' }
      }
      for (const x in nodeMapList) {
        nodeMapList[x] = []
      }
      this.pageObj = pageObj
      this.listObj = listObj
      this.search = search
      this.nodeMapList = nodeMapList
      this.active = '大货项目'
      /* 循环请求：所有页签内容 */
      for (const x in tabs) {
        this.A_getStyleCraftList(x, true)
      }
    }
  }
}
</script>

<style scoped>
.itemBtn { /* 手指光标 */
  color: #606266;
  text-decoration: underline;
  cursor: pointer;
}
/*** 分页 ***/
.paginationBox {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
