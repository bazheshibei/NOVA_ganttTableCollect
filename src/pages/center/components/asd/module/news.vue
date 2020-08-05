
<!-- 消息中心 -->
<template>
  <com-white-box :title="'消息中心'" v-loading="loading">

    <template slot="f5">
      <i class="el-icon-refresh f5" @click="f5"></i>
    </template>

    <template slot="title">
      <span style="cursor: pointer; font-size: 12px;" @click="A_showAdd_0">查看更多</span>
    </template>

    <!-- 顶部 tab -->
    <com-top-tab :active="active" :list="tabs" @changeTab="changeTab"></com-top-tab>
    <!-- /顶部 tab -->

    <el-table class="newsTable" :data="listObj[active]" border>
      <!-- 一 -->
      <el-table-column fixed>
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input v-model="search[active].msg_content" clearable placeholder="多个查询空格分隔" @clear="clear('msg_content')" @change="select"></el-input>
            <div class="thText" :class="search[active].msg_content ? 'thActive' : ''" slot="reference" style="flex: 1;">
              消息内容<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <p v-on:dblclick="dblclick(scope.row.index)">{{scope.row.msg_content}}</p>
        </template>
      </el-table-column>
      <!-- 二 -->
      <el-table-column width="80" align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input v-model="search[active].sendor" clearable placeholder="多个查询空格分隔" @clear="clear('sendor')" @change="select"></el-input>
            <div class="thText" :class="search[active].sendor ? 'thActive' : ''" slot="reference" style="flex: 1;">
              发送人<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <p>{{scope.row.sendor}}</p>
        </template>
      </el-table-column>
      <!-- 三 -->
      <el-table-column label="发送时间" width="100" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.send_time.split(' ')[0]}}</p>
          <p>{{scope.row.send_time.split(' ')[1]}}</p>
        </template>
      </el-table-column>
      <!-- 四 -->
      <el-table-column width="90" align="center">
        <template slot="header" slot-scope="scope">
          <el-popover placement="top" width="250" trigger="click">
            <el-input v-model="search[active].read_sign" clearable placeholder="多个查询空格分隔" @clear="clear('read_sign')" @change="select"></el-input>
            <div class="thText" :class="search[active].read_sign ? 'thActive' : ''" slot="reference" style="flex: 1;">
              阅读标记<span>&nbsp;<i class="el-icon-search"></i></span>
            </div>
          </el-popover>
        </template>
        <template slot-scope="scope">
          <p :style="{ color: text.read_sign_color[scope.row.read_sign]}">
            {{text.read_sign[scope.row.read_sign]}}
          </p>
        </template>
      </el-table-column>
      <!-- 五 -->
      <!-- width="160" -->
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot="header" slot-scope="scope">
          <div class="thText" slot="reference" style="flex: 1;">操作</div>
        </template>
        <template slot-scope="scope">
          <!-- <el-button class="newsBtn" type="primary" size="mini" plain disabled v-if="scope.row.handle_result === 1" @click="handleClick(scope.row)">
            待处理
          </el-button>
          <el-button class="newsBtn" type="primary" size="mini" plain disabled v-else-if="scope.row.handle_result === 2" @click="handleClick(scope.row)">
            已处理
          </el-button> -->
          <el-button class="newsBtn" type="primary" size="mini" v-if="scope.row.is_reply === 0" @click="A_showAdd_1(scope.row.index)">
            回复消息
          </el-button>
          <el-button class="newsBtn" type="primary" size="mini" v-else-if="scope.row.is_reply === 1" @click="A_showAdd_2(scope.row.index)">
            查看回复
          </el-button>
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
      tabs: { '全部': '0', '今日消息': '0', '待阅读': '0' }, // 三个页签 && 默认数量
      pageObj: { //                                          三个页签：对应的分页数据
        /* 总条数 每页数量 当前页数 */
        '全部': { count: 0, size: 10, page: 1 },
        '今日消息': { count: 0, size: 10, page: 1 },
        '待阅读': { count: 0, size: 10, page: 1 }
      },
      listObj: { '全部': [], '今日消息': [], '待阅读': [] }, // 三个页签：对应的数据列表
      search: { //                                           三个页签：对应的搜索对象
        '全部': { msg_content: '', sendor: '', read_sign: '' },
        '今日消息': { msg_content: '', sendor: '', read_sign: '' },
        '待阅读': { msg_content: '', sendor: '', read_sign: '' }
      },
      active: '全部', //                                      当前激活的页签
      tabType: { '全部': 1, '今日消息': 2, '待阅读': 3 }, //    请求时，页签对应的值
      text: { //                                             表格内：阅读标记对应的文字
        read_sign: { 0: '未读', 1: '已读' },
        read_sign_color: { 0: '#F56C6C', 1: '#909399' },
        api_read_sign: { '未读': 0, '已读': 1 }
      }
    }
  },
  created() {
    const { tabs } = this
    /* 循环请求：所有页签内容 */
    for (const x in tabs) {
      this.A_getMsgList(x)
    }
  },
  methods: {
    /**
     * [请求：查看更多]
     */
    A_showAdd_0() {
      const host = window.location.origin + '/nova/'
      // eslint-disable-next-line
      ui("open", {
        title: '查看更多',
        url: host + 'pages/msginfo/msgInfolist.jsp',
        onClose: function () {}
      })
    },
    /**
     * [请求：回复消息]
     */
    A_showAdd_1(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active } = that
      const item = listObj[active][index]
      const { msg_id } = item
      /* 发起请求 */
      // eslint-disable-next-line
      updateWin({
        url: host + 'msgReplyShowAction.do?action=showAdd',
        param: { id: msg_id },
        width: 1100,
        height: 550,
        title: '回复消息',
        fn: function () {
          /* 修改：回复 || 查看 */
          that.listObj[active][index].is_reply = 1
          // that.A_getMsgList(that.active, true)
        }
      })
      /* 修改：阅读标记 */
      that.listObj[active][index].read_sign = 1
    },
    /**
     * [请求：查看回复]
     */
    A_showAdd_2(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active } = that
      const item = listObj[active][index]
      const { msg_id } = item
      /* 发起请求 */
      // eslint-disable-next-line
      updateWin({
        url: host + 'msgInfoShowAction.do?action=showView',
        param: { id: msg_id },
        width: 1100,
        height: 550,
        title: '查看回复',
        fn: function () {}
      })
    },
    /**
     * [双击查看]
     */
    dblclick(index) {
      const that = this
      const host = window.location.origin + '/nova/'
      const { listObj, active } = that
      const item = listObj[active][index]
      const { msg_id } = item
      /* 发起请求 */
      // eslint-disable-next-line
      updateWin({
        url: host + 'msgInfoShowAction.do?action=showView',
        param: { id: msg_id },
        width: 1100,
        height: 550,
        title: '查看消息',
        fn: function () {}
      })
    },
    /**
     * [请求：消息中心]
     * 请求分页时，页数 -1
     */
    A_getMsgList(tab, show = false) {
      /* 加载中...：显示 */
      this.loading = show
      const that = this
      const { tabType, search, text, pageObj } = this
      /* 整理搜索对象 */
      const searchObj = {}
      for (const x in search[tab]) {
        const item = search[tab][x].trim()
        if (item) {
          if (x === 'read_sign') {
            if (text.api_read_sign[item] || text.api_read_sign[item] === 0) {
              searchObj[x] = text.api_read_sign[item]
            } else {
              searchObj[x] = item
            }
          } else {
            searchObj[x] = item
          }
        }
      }
      // searchObj['today_time'] = that.todayTime() // 今日时间
      /* 整理分页对象 */
      const start = parseInt(pageObj[tab].page) - 1
      const page = pageObj[tab].size
      /* 发起请求 */
      const name = '消息中心'
      const obj = {
        type: tabType[tab], //                              页签
        emp_id: '', //      当前登录用户的ID
        // emp_id: 'c29b68101a3b4bca950419495520d555',
        condition: encodeURI(JSON.stringify(searchObj)), // 搜索条件
        start, //                                           页码
        page //                                             每页条数
      }
      const suc = function (res) {
        /* 加载中...：关闭 */
        if (show) {
          that.loading = false
        }
        /* tab 数字标记 */
        that.tabs[tab] = parseInt(res.count.num)
        /* 分页数据 */
        const pageObj = {
          count: parseInt(res.count.num),
          size: parseInt(res.page),
          page: parseInt(res.start) + 1
        }
        that.pageObj[tab] = pageObj
        /* 表格数据 */
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].index = i
        }
        that.listObj[tab] = res.data || []
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
      this.A_getMsgList(active, true)
    },
    /**
     * [已办理]
     * @param {[Object]} row 当前行信息
     */
    handleClick(row) {
      // console.log(row)
    },
    /**
     * [切换每页展示条数]
     */
    handleSizeChange(val) {
      const { pageObj, active } = this
      pageObj[active].size = val
      this.A_getMsgList(active, true)
    },
    /**
     * [切换分页]
     */
    handleCurrentChange(val) {
      const { pageObj, active } = this
      pageObj[active].page = val
      this.A_getMsgList(active, true)
    },
    /**
     * [刷新]
     */
    f5() {
      const { pageObj, listObj, search, tabs } = this
      /* 重置 */
      for (const x in pageObj) {
        pageObj[x] = { count: 0, size: 10, page: 1 }
      }
      for (const x in listObj) {
        listObj[x] = []
      }
      for (const x in search) {
        search[x] = { msg_content: '', sendor: '', read_sign: '' }
      }
      this.pageObj = pageObj
      this.listObj = listObj
      this.search = search
      this.active = '全部'
      /* 循环请求：所有页签内容 */
      for (const x in tabs) {
        this.A_getMsgList(x, true)
      }
    },
    /**
     * [返回时间]
     */
    todayTime() {
      const d = new Date()
      const year = d.getFullYear()
      const month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      const date = d.getDate()
      return `${year}-${month}-${date} 00:00:00`
    }
  }
}
</script>

<style scoped>
/*** 分页 ***/
.paginationBox {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>

<style>
.newsBtn {
  font-size: 10px !important;
  padding: 4px 8px !important;
}
</style>
