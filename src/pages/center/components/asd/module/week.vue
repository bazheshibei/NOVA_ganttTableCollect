
<!-- 本周待办 -->
<template>
  <com-white-box :title="'本周待办'" v-loading="loading">

    <template slot="f5">
      <i class="el-icon-refresh f5" @click="f5"></i>
    </template>

    <template slot="title">
      <span style="cursor: pointer; font-size: 12px;" @click="A_showAdd_1">待办中心</span>
    </template>

    <div class="contentBox">
      <div class="li" v-for="(item, index) in list" :key="'list_' + index">
        <div class="liNum">
          <span>{{item.num}}</span>
          <span class="liNumText">待办</span>
        </div>
        <div class="liText">
          <span class="liName">{{item.name}}</span>
          <p class="liTextCenter" v-html="item.str"></p>
        </div>
      </div>
    </div>

  </com-white-box>
</template>

<script>
import Api from '@/config/api'
import ComWhiteBox from '../whiteBox' // 白色容器
export default {
  components: { ComWhiteBox },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  created() {
    this.A_needToBeDealtWithNode()
  },
  methods: {
    /**
     * [请求：待办中心]
     */
    A_showAdd_1() {
      const host = window.location.origin + '/nova/'
      // eslint-disable-next-line
      ui("open", {
        title: '待办中心',
        url: host + 'pages/itemnode/itemNodeNeedlist.jsp',
        onClose: function () {}
      })
    },
    /**
     * [请求：待办业务]
     */
    A_needToBeDealtWithNode(show = false) {
      /* 加载中...：显示 */
      this.loading = show
      const that = this
      const name = '待办已办业务列表'
      const obj = {
        employeeid: '',
        // employeeid: '965BAD8F4EF5C14CE4F607E77D30B9B5',
        iscomplete: 0,
        condition: [],
        pageindex: 1,
        pagesize: 10,
        isweek: 1,
        type: 1
      }
      const suc = function (res) {
        /* 加载中...：关闭 */
        if (show) {
          that.loading = false
        }
        const arr = []
        /* 组装：单条数据 */
        for (let i = 0; i < res.length; i++) {
          const obj = {}
          const item = res[i]
          obj.num = item.itemInfo.needsize //   待办数量
          obj.name = item.itemInfo.item_name // 待办事件名称
          const strArr = []
          /* 组装：结点 */
          for (let j = 0; j < item.itemNode.length; j++) {
            const val = item.itemNode[j]
            const { actual_enddate, plan_enddate } = val
            if (actual_enddate) {
              /* 已完成 */
              const timeArr_actual = actual_enddate.split('-') // 实际完成时间数组
              const actual = new Date(timeArr_actual[0], parseInt(timeArr_actual[1]) - 1, timeArr_actual[2]).getTime()
              const timeArr_plan = plan_enddate.split('-') // 计划完成时间数组
              const plan = new Date(timeArr_plan[0], parseInt(timeArr_plan[1]) - 1, timeArr_plan[2]).getTime()
              const day = parseInt((actual - plan) / 1000 / 60 / 60 / 24) // 实际结束时间 - 计划结束时间
              if (day > 0) {
                const dayStr = `${val.node_name}（超期${day}天完成）`
                strArr.push(`<span style="color: #67C23A;">${dayStr}</span>`)
              } else if (day < 0) {
                const dayStr = `${val.node_name}（提前${day}天完成）`
                strArr.push(`<span style="color: #67C23A;">${dayStr}</span>`)
              } else {
                const dayStr = `${val.node_name}`
                strArr.push(`<span style="color: #67C23A;">${dayStr}</span>`)
              }
            } else {
              /* 未完成 */
              // 计划日期在本周一之前，算延期
              // 其他黑色
              const d = new Date()
              const now = new Date(d.getFullYear(), d.getMonth(), d.getDate()) // 今天
              const nowGetTime = now.getTime() //                                 今天：毫秒数
              const nowWeek = now.getDay() //                                     今天：周几
              const limitTime = nowGetTime - (nowWeek * 1000 * 60 * 60 * 24) //   上周日：毫秒数

              const timeArr_plan = plan_enddate.split('-') // 计划完成时间数组
              const plan = new Date(timeArr_plan[0], parseInt(timeArr_plan[1]) - 1, timeArr_plan[2]).getTime()
              const day = parseInt((plan - limitTime) / 1000 / 60 / 60 / 24) // 计划结束时间 - 上周日
              if (day < 0) {
                const dayStr = `${val.node_name}（超时${day * -1}天）`
                strArr.push(`<span style="color: #F56C6C;">${dayStr}</span>`)
              } else {
                const dayStr = `${val.node_name}`
                strArr.push(`<span>${dayStr}</span>`)
              }
            }
          }
          obj.str = `<p>${strArr.join(' > ')}</p>` // 结点字符串
          arr.push(obj)
        }
        that.list = arr
      }
      Api({ name, obj, suc })
    },
    /**
     * [刷新]
     */
    f5() {
      this.list = []
      this.A_needToBeDealtWithNode(true)
    }
  }
}
</script>

<style scoped>
.contentBox {
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid #DCDFE6;
}

.li {
  display: flex;
  align-items: center;
}

/*** 待办图标 ***/
.liNum { /* 数字 */
  width: 40px;
  height: 40px;
  color: white;
  font-size: 16px;
  line-height: 16px;
  background: #67C23A;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.liNumText { /* 待办 */
  font-size: 10px;
  line-height: 10px;
  margin-top: 1px;
}

/*** 待办文字 ***/
.liText {
  color: #606266;
  font-size: 12px;
  line-height: 16px;
  margin-left: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #E4E7ED;
  display: flex;
  align-items: center;
  flex: 1;
}
.li:last-child > .liText {
  border-bottom: 0;
}
.liName { /* 项目名称 */
  width: 100px;
  min-width: 100px;
}
.liTextCenter {
  color: #909399;
  /* margin-left: 40px; */
  flex: 1;
}
.liTextCenterSpan {
  color: #409EFF;
}
</style>
