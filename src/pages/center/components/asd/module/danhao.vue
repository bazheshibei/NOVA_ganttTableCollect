
<!-- 单耗岗 -->
<template>
  <com-white-box :title="'跟进物料单耗--技术单耗岗'" :hidden="true" v-loading="loading">

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
          <p class="itemBtn" @click="A_showAdd_1(scope.row.index)">查看物料清单</p>
          <p class="itemBtn" @click="A_showAdd_2(scope.row.index)">查看物料单耗变更记录</p>
          <p class="itemBtn" @click="A_showAdd_3(scope.row.index)">核算单耗</p>
        </template>
      </el-table-column>
      <!-- 二 -->
      <el-table-column prop="item_name" width="100" align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input v-model="search[active].conitemname" clearable placeholder="多个查询空格分隔" @clear="clear('conitemname')" @change="select"></el-input>
            <div class="thText" :class="search[active].conitemname ? 'thActive' : ''" slot="reference" style="flex: 1;">
              项目名称<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 三-->
      <el-table-column prop="material_name" width="200" align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input v-model="search[active].conmaterialname" clearable placeholder="多个查询空格分隔" @clear="clear('conmaterialname')" @change="select"></el-input>
            <div class="thText" :class="search[active].conmaterialname ? 'thActive' : ''" slot="reference" style="flex: 1;">
              物料名称<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!-- 四 -->
      <!-- <el-table-column prop="item_info" width="200" align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input v-model="search[active].conitemdata" clearable placeholder="多个查询空格分隔" @clear="clear('conitemdata')" @change="select"></el-input>
            <div class="thText" :class="search[active].conitemdata ? 'thActive' : ''" slot="reference" style="flex: 1;">
              项目信息<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column prop="item_info" width="200" align="center" label="项目信息"></el-table-column>
      <!-- 五 -->
      <el-table-column prop="unit_consumption" label="单耗" width="60" align="center"></el-table-column>
      <!-- 六 -->
      <el-table-column label="单耗阶段" width="100" align="center">
        <template slot-scope="scope">
          <p>{{text.unit_stage[scope.row.unit_stage] || '未核算'}}</p>
        </template>
      </el-table-column>
      <!-- 七 -->
      <el-table-column label="最近核定" width="150" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.account_num">
            {{scope.row.account_num}}
            <span v-if="scope.row.count_stage_num">（{{scope.row.count_stage_num}}）</span>
          </p>
          <p>{{scope.row.account_time || '未核算'}}</p>
        </template>
      </el-table-column>
      <!-- 循环：自定义列 -->
      <el-table-column v-for="(item, index) in nodeMapList[active]" :key="'column_' + index" :label="item.node_name" width="160">
        <template slot-scope="scope">
          <div class="" v-if="scope.row[item.node_id]">
            <p>计划日期：{{scope.row[item.node_id].plan_enddate || '--'}}</p>
            <p>完成日期：{{scope.row[item.node_id].actual_enddate || '--'}}</p>
            <p>完成状态：<span :style="{ color: scope.row[item.node_id].timeColor }">{{scope.row[item.node_id].timeText}}</span></p>
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
      tabs: { '大货项目': '0', '开发项目': '0' }, //      页签 && 默认数量
      pageObj: { //                                    页签：对应的分页数据
        /* 总条数 每页数量 当前页数 */
        '大货项目': { count: 0, size: 10, page: 1 },
        '开发项目': { count: 0, size: 10, page: 1 }
      },
      listObj: { '大货项目': [], '开发项目': [] }, //     页签：对应的数据列表
      search: { //                                     页签：对应的搜索对象
        '大货项目': { conitemname: '', conitemdata: '', conmaterialname: '' },
        '开发项目': { conitemname: '', conitemdata: '', conmaterialname: '' }
      },
      active: '大货项目', //                             当前激活的页签
      tabType: { '大货项目': 'dh', '开发项目': 'kf' }, // 请求时，页签对应的值
      text: { //                                       表格内：阅读标记对应的文字
        unit_stage: { 1: '报价阶段', 2: '订料单耗', 3: '确认单耗', 4: '裁剪单耗', 5: '实际单耗' }
      },
      nodeMapList: { '大货项目': [], '开发项目': [] } //  自定义表格列
    }
  },
  created() {
    const { tabs } = this
    /* 循环请求：所有页签内容 */
    for (const x in tabs) {
      this.A_getUnitConsumPtion(x)
    }
  },
  methods: {
    /**
     * [请求：查看物料清单]
     * @param {[Int]} index 表格数据索引
     */
    A_showAdd_1(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active, tabType } = that
      const item = listObj[active][index]
      const { item_id, style_id, custom_id } = item
      const item_type = tabType[active]
      /* 发起请求 */
      // eslint-disable-next-line
      updateWin({
        title: '款式物料清单',
        width: 1700,
        height: 700,
        url: `${host}styleBomShowAction.do?action=showAdd&id=${item_id}&pagetype=finally&item_type=${item_type}&style_id=${style_id}&showview=true&onleviewtype=true`,
        param: { item_type, style_id, custom_id },
        onClose() {},
        fn() {}
      })
    },
    /**
     * [请求：查看物料单耗变更记录]
     * @param {[Int]} index 表格数据索引
     */
    A_showAdd_2(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active } = that
      const item = listObj[active][index]
      const { style_id, item_id, item_name, material_name: name } = item
      const material_name = encodeURI(name)
      /* 发起请求 */
      // eslint-disable-next-line
      ui("open", {
        title: '物料单耗变更记录',
        url: `${host}pages/unitconsumptionaccount/unitConsumptionAccountlist.jsp?style_id=${style_id}&item_id=${item_id}&item_name=${item_name}&material_name=${material_name}`,
        // url: host + 'pages/unitconsumptionaccount/unitConsumptionAccountlist.jsp',
        param: { style_id, item_id, item_name: item_name, material_name },
        onClose: function () {}
      })
    },
    /**
     * [请求：核算单耗]
     * @param {[Int]} index 表格数据索引
     */
    A_showAdd_3(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active, tabType } = that
      const item = listObj[active][index]
      const { item_id, style_id, style_bom_detail_id, style_bom_detail_key } = item
      const item_type = tabType[active]
      /* 发起请求 */
      const param = { item_id, style_bom_detail_id, style_bom_detail_key, item_type, style_id }
      // eslint-disable-next-line
      updateWin({
        title: '技术单耗核算',
        url: host + 'unitConsumptionAccountShowAction.ndo?action=showAdd',
        width: 1800,
        height: 1000,
        param,
        onClose() {},
        fn() {
          /** 请求：技术单耗岗 **/
          that.A_getUnitConsumPtion(active, true)
        }
      })
    },
    /**
     * [请求：技术单耗岗]
     * @param {[String]} tab  当前页签
     * @param {Boolean}  show 是否显示加载动画
     * 请求分页时，页数 -1
     */
    A_getUnitConsumPtion(tab, show = false) {
      /* 加载中...：显示 */
      this.loading = show
      const that = this
      const { tabType, search, pageObj } = this
      /* 整理搜索对象 */
      const { conitemname, conitemdata, conmaterialname } = search[tab]
      /* 整理分页对象 */
      const pageindex = parseInt(pageObj[tab].page) - 1
      const pagesize = pageObj[tab].size
      /* 发起请求 */
      const name = '技术单耗岗'
      const obj = {
        item_type: tabType[tab], //                       页签
        userid: '', // 当前登录用户的ID
        // userid: '965BAD8F4EF5C14CE4F607E77D30B9B5', // 当前登录用户的ID
        conitemname: conitemname.trim(), //               查询：项目名称
        conitemdata: conitemdata.trim(), //               查询：项目信息
        conmaterialname: conmaterialname.trim(), //       查询：物料名称
        pageindex, //                                     页码
        pagesize, //                                      每页条数
        type: 1
      }
      const suc = function (res) {
        /* 加载中...：关闭 */
        if (show) {
          that.loading = false
        }
        /* tab 数字标记 */
        that.tabs[tab] = parseInt(res.count)
        /* 分页数据 */
        that.pageObj[tab].count = parseInt(res.count)
        /* 整理：项目信息对象 */
        const { itemDataMapList } = res
        const list = []
        if (itemDataMapList) {
          const itemDataMapObj = {}
          for (let i = 0; i < itemDataMapList.length; i++) {
            const item = itemDataMapList[i]
            const arr = [item.group_name, item.item_season, item.type_name, item.series_name]
            itemDataMapObj[item.style_id + '_info'] = arr.join(' > ')
            itemDataMapObj[item.style_id + '_name'] = item.item_name
            itemDataMapObj[item.style_id + '_style_id'] = item.style_id
            itemDataMapObj[item.style_id] = item
          }
          /* 整理：表格自定义列 */
          that.nodeMapList[tab] = res.nodeMapList
          /* 整理：表格数据 */
          const { styleBomDetailMapList } = res
          for (let i = 0; i < styleBomDetailMapList.length; i++) {
            const item = styleBomDetailMapList[i]
            item['index'] = i
            item.item_name = itemDataMapObj[item.style_id + '_name'] //    项目名称
            item.item_info = itemDataMapObj[item.style_id + '_info'] //    项目信息
            item.style_id = itemDataMapObj[item.style_id + '_style_id'] // 款式id
            item.custom_id = itemDataMapObj[item.style_id].custom_id
            // item.product = itemDataMapObj[item.style_id] //             项目信息完整对象
            const arr = itemDataMapObj[item.style_id].itemNodeMap
            const d = new Date()
            const now = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
            for (let j = 0; j < arr.length; j++) {
              const val = arr[j]
              if (val.is_complete === 1) {
                val.timeText = '完成'
                val.timeColor = '#67C23A'
              } else if (val.is_complete === 2) {
                val.timeText = '超期完成'
                val.timeColor = '#E6A23C'
              } else {
                const timeArr = val.plan_enddate.split('-')
                const end = new Date(timeArr[0], parseInt(timeArr[1]) - 1, timeArr[2]).getTime()
                const day = parseInt((parseInt(end) - parseInt(now)) / 1000 / 60 / 60 / 24) // 计划结束时间 - 当前时间
                if (day > 0) {
                  val.timeText = '未完成'
                  val.timeColor = '#909399'
                } else {
                  val.timeText = '超期未完成'
                  val.timeColor = '#F56C6C'
                }
              }
              item[val.node_id] = val
            }
            list.push(item)
          }
        }
        that.listObj[tab] = list
        /*  */
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
      const { active } = this
      this.search[active][name] = ''
    },
    /**
     * [搜索]
     */
    select() {
      const { pageObj, active } = this
      pageObj[active].page = 1
      this.A_getUnitConsumPtion(active, true)
    },
    /**
     * [切换每页展示条数]
     */
    handleSizeChange(val) {
      const { pageObj, active } = this
      pageObj[active].size = val
      this.A_getUnitConsumPtion(active, true)
    },
    /**
     * [切换分页]
     */
    handleCurrentChange(val) {
      const { pageObj, active } = this
      pageObj[active].page = val
      this.A_getUnitConsumPtion(active, true)
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
        search[x] = { conitemname: '', conitemdata: '', conmaterialname: '' }
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
        this.A_getUnitConsumPtion(x, true)
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
