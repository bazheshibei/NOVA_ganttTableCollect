// 接口

import Axios from '@/config/axios'

/**
 * [服务器地址]
 */
// const host = '/api/' //  晓东
const host = window.location.origin + '/nova/'

/**
 * [接口地址]
 */
const url = {
  '统计列表': 'itemGanttSummaryShowAction.ndo?action=gtbList',
  '节点列表': 'itemGanttSummaryShowAction.ndo?action=itemnode',
  '审核前验证': 'itemGanttSummaryShowAction.ndo?action=beforeSubmitAudit',
  '提交审核': 'itemGanttSummarySaveAction.ndo?action=submitAudit',
  '撤销审核': 'itemGanttAuditSaveAction.ndo?action=goBackAudit',
  '大货甘特表汇总发起变更前验证': 'itemNodeAdjustmentShowAction.ndo?action=beforBatchAdjusmentItemGantt',
  '节点完成前验证': 'itemNodecompleteDetailShowAction.ndo?action=testItemNodeStatus',
  '单独变更节点前验证': 'itemGanttSummaryShowAction.ndo?action=adjustmentNodeTest',
  '甘特表帮助按钮': 'noticeAction.ndo?action=getHelpText'
}

const request = function (param) {
  param.path = host + url[param.name]
  Axios(param)
}

export default request
