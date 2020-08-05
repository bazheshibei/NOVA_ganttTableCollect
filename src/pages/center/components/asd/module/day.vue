
<!-- 日程记录 -->
<template>
  <com-white-box :title="'日程记录'" v-loading="loading">

    <template slot="f5">
      <i class="el-icon-refresh f5" @click="f5"></i>
    </template>

    <div class="contentBox">
      <span style="display: none;">{{toggleMonth}}</span>

      <div class="leftBox">
        <el-calendar class="comCalendar" :first-day-of-week="7" ref="asd">
          <template slot="dateCell" slot-scope="{date, data}">
            <div class="day" :class="data.isSelected ? 'is-selected' : ''" @click="chooseDay(data.day)">
              {{ data.day.split('-')[2] }}
              <!-- <span class="point" v-if="timeArr.includes(data.day)"></span> -->
              <span class="point" v-if="arrIncludes(data.day, timeArr)"></span>
            </div>
          </template>
        </el-calendar>
      </div>

      <div class="rightBox" v-show="list[today] && list[today].length">
        <p>{{today}} 日程规划</p>
        <ul class="listUl">
          <li class="listLi" v-for="(item, index) in list[today]" :key="'list_' + index">
            <p>{{item.time}}</p>
            <p>{{item.title}}</p>
            <p>{{item.content}}</p>
          </li>
        </ul>
        <div class="triangle"></div>
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
      status: false,
      starttime: '', // 本月：第一天
      endtime: '', //   本月：最后一天
      today: '', //     本月：今天
      timeArr: [], //   日期数组：用于标记是否有日程
      list: {}
    }
  },
  created() {
    const d = new Date()
    const nowYear = d.getFullYear() //                                当前年份
    const nowMonth = d.getMonth() //                                  当前月份：3月 => 索引值 2
    const nowDay = d.getDate() //                                     当前日
    const next = new Date(nowYear, nowMonth + 1, 1).getTime() //      下月一号的毫秒值
    const lastDay = new Date(next - 1000 * 60 * 60 * 24).getDate() // 本月最后一天
    /* 设置本月起始日期 */
    const strMonth = String(nowMonth + 1).length === 1 ? '0' + (nowMonth + 1) : nowMonth + 1
    const strLastDay = String(lastDay).length === 1 ? '0' + lastDay : lastDay
    this.starttime = `${nowYear}-${strMonth}-01` //          本月：第一天
    this.endtime = `${nowYear}-${strMonth}-${strLastDay}` // 本月：最后一天
    this.today = `${nowYear}-${strMonth}-${nowDay}` //       本月：今天
    /** 请求：本月日程 **/
    this.thisMonth()
  },
  methods: {
    /**
     * [请求：本月日程]
     */
    thisMonth(show = false) {
      /* 加载中...：显示 */
      this.loading = show
      const that = this
      const { starttime, endtime } = that
      /* 请求 */
      const name = '日程列表'
      const obj = {
        userid: '',
        // userid: '965BAD8F4EF5C14CE4F607E77D30B9B5', // 测试用
        starttime,
        endtime,
        type: 1 // 正式用
      }
      const suc = function (res) {
        /* 加载中...：关闭 */
        if (show) {
          that.loading = false
        }
        const timeArr = [] // 日期数组
        const list = {} //    日期作为索引的列表
        for (let i = 0; i < res.length; i++) {
          const item = res[i]
          timeArr.push(item.date)
          list[item.date] = item.data
        }
        that.timeArr = timeArr
        that.list = list
        that.status = true
      }
      Api({ name, obj, suc })
    },
    /**
     * [选中日期]
     */
    chooseDay(day) {
      const that = this
      const { today } = that
      that.today = day
      /* 切换到其他月份 */
      if (today.slice(0, -3) !== day.slice(0, -3)) {
        const arr = day.split('-')
        const nowYear = arr[0] //                当前年份
        const nowMonth = parseInt(arr[1]) - 1 // 当前月份：3月 => 索引值 2
        const next = new Date(nowYear, nowMonth + 1, 1).getTime() //      下月一号的毫秒值
        const lastDay = new Date(next - 1000 * 60 * 60 * 24).getDate() // 本月最后一天
        /* 设置本月起始日期 */
        const strMonth = String(nowMonth).length === 1 ? '0' + (nowMonth + 1) : nowMonth + 1
        const strLastDay = String(lastDay).length === 1 ? '0' + lastDay : lastDay
        that.starttime = `${nowYear}-${strMonth}-01` //          本月：第一天
        that.endtime = `${nowYear}-${strMonth}-${strLastDay}` // 本月：最后一天
        /** 请求：本月日程 **/
        that.thisMonth(true)
      }
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
    },
    /**
     * [刷新]
     */
    f5() {
      /* 重置数据 */
      this.status = false
      this.timeArr = []
      this.list = {}
      /* 生命周期 */
      const d = new Date()
      const nowYear = d.getFullYear() //                                当前年份
      const nowMonth = d.getMonth() //                                  当前月份：3月 => 索引值 2
      const nowDay = d.getDate() //                                     当前日
      const next = new Date(nowYear, nowMonth + 1, 1).getTime() //      下月一号的毫秒值
      const lastDay = new Date(next - 1000 * 60 * 60 * 24).getDate() // 本月最后一天
      /* 设置本月起始日期 */
      const strMonth = String(nowMonth + 1).length === 1 ? '0' + (nowMonth + 1) : nowMonth + 1
      const strLastDay = String(lastDay).length === 1 ? '0' + lastDay : lastDay
      this.starttime = `${nowYear}-${strMonth}-01` //          本月：第一天
      this.endtime = `${nowYear}-${strMonth}-${strLastDay}` // 本月：最后一天
      this.today = `${nowYear}-${strMonth}-${nowDay}` //       本月：今天
      /** 请求：本月日程 **/
      this.thisMonth(true)
    }
  },
  computed: {
    /* 切换月份时，执行选择当月1号时的事件 */
    toggleMonth() {
      if (this.status) {
        const month = this.today.split('-')[1]
        const event = this.$children[0].$children[0].curMonthDatePrefix
        if (month !== event.split('-')[1]) {
          this.chooseDay(event + '-01')
        }
        return ''
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
.contentBox {
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid #DCDFE6;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.leftBox { /* 左侧容器 */
  width: 50%;
}
.rightBox { /* 右侧容器 */
  font-size: 12px;
  margin: 52px 0 0 0px;
  padding: 20px;
  background: #ecf2fe;
  border-radius: 6px;
  flex: 1;
  position: relative;
}
.listUl { /* 列表 */
  max-height: 280px;
  color: #606266;
  padding: 0 18px;
  overflow-y: auto;
}
.listLi { /* 单条备注 */
  line-height: 18px;
  padding: 6px 0;
  border-bottom: 1px solid #E4E7ED;
}
.listUl > .listLi:last-child {
  border-bottom: 0;
}
.triangle {
  width: 15px;
  height: 15px;
  background: #ecf2fe;
  position: absolute;
  top: 35px;
  left: -13px;
  clip-path: polygon(100% 0, 0 50%, 100% 100%, 100% 0);
}

/*** 日历 ***/
.is-selected {
  color: #409EFF;
  background: #ecf2fe;
}
.day {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.point { /* 日期下的标记 */
  width: 6px;
  height: 6px;
  background: #409EFF;
  border-radius: 50%;
  position: absolute;
  bottom: 8px;
  right: calc(50% - 3px);
}
</style>

<style>
/*** 日历样式 ***/
.comCalendar {
  font-size: 12px !important;
}
.comCalendar  .el-calendar__button-group {
  /* display: none; */
}
.comCalendar > .el-calendar__body {
  padding-bottom: 15px;
}
.comCalendar > .el-calendar__body > .el-calendar-table > tbody > tr > td > .el-calendar-day {
  height: 50px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
