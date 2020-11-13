
const Tool = {}

/**
 * [处理表格数据]
 * @param {[Array]}  list 表格数组
 * @param {[String]} yjts 预警时间
 * @param {[String]} name 子属性名称
 */
Tool.mapData = function (list, yjts, name = '') {
  const that = this
  /* 当前日期 */
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
  const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  const now = new Date(`${year}-${month}-${day}`).getTime() // 毫秒数
  /* 循环数据 */
  list.map(function (item, index) {
    const { actual_enddate } = item
    const completeTime = typeof actual_enddate === 'string' && actual_enddate ? new Date(actual_enddate).getTime() : now
    item.index = index
    if (name) {
      let arr = []
      /* 处理子属性 */
      if (item[name] && item[name] !== null && item[name].length) {
        arr = item[name]
      }
      arr.map(function (val) {
        return that._map(val, completeTime, yjts)
      })
      return arr
    } else {
      /* 处理自身 */
      return that._map(item, completeTime, yjts)
    }
  })
  return list
}

/**
 * [处理节点]
 * @param  {[Object]} item         节点
 * @param  {[Int]}    completeTime 毫秒数（完成时间 || 当前时间）
 * @param  {[String]} yjts         预警时间
 * @return {[Object]} item         添加属性后的节点
 */
Tool._map = function (item, completeTime, yjts) {
  /* ----- 延期/剩余天数 ----- */
  const num = (completeTime - new Date(item.plan_enddate).getTime()) / (1000 * 60 * 60 * 24) // 超期天数：当前日期 - 计划日期
  if (num > 0) {
    item.timeText = `<span style="color: red;">${isNaN(num) ? '/' : num}</span>` // 延期天数
  } else {
    item.timeText = `<span>${isNaN(num) ? '/' : Math.abs(num)}</span>` // 剩余天数
  }
  /* ----- 节点状态 && 预警状态 ----- */
  if (item.actual_enddate !== null && item.actual_enddate) {
    /* 节点状态：完成 */
    item.wancheng = true
    if (num < 0) {
      item.nodeTypeText = `<span style="color: #67C23A;">提前完成</span>`
    } else if (num === 0) {
      item.nodeTypeText = `<span style="color: #67C23A;">完成</span>`
    } else if (num > 0) {
      item.nodeTypeText = `<span style="color: #E6A23C;">超期完成</span>`
    }
    /* 预警状态：完成 -> 正常 */
    item.warningText = '<span>正常</span>'
  } else {
    /* 节点状态：未完成 */
    item.wancheng = false
    if (num > 0) {
      item.nodeTypeText = `<span style="color: #F56C6C;">超期未完成</span>`
      /* 预警状态：超期未完成 -> 常预警 */
      item.warningText = '<span style="color: #F56C6C;">预警</span>'
      item.is_show_warning = true
    } else if (num <= 0) {
      item.nodeTypeText = `<span style="color: #909399;">未完成</span>`
      /* 预警状态：未完成 -> 倒计时预警 */
      if (yjts && num >= parseInt(Math.abs(yjts))) {
        item.warningText = '<span style="color: #F56C6C;">预警</span>' // 倒计时预警：超期天数 >= 预警时间
        item.is_show_warning = true
      } else {
        item.warningText = '<span>正常</span>' // 倒计时预警：超期天数 < 预警时间 || 没有预警时间
      }
    } else {
      item.warningText = ''
      item.is_show_warning = false
    }
  }
  return item
}

export default Tool
