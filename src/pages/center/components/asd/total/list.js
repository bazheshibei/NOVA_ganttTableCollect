
// const list = []

/**
 * [基础列表]
 */
const base = [
  { style_id: 1, date: '2020-01-01' },
  { style_id: 2, date: '2020-02-02' },
  { style_id: 3, date: '2020-03-03' }
]

/**
 * [大货相关]
 */
const DHXG_1 = [
  { style_id: 1, DHXG_1_attr1: '大货相关_值_1', DHXG_1_attr2: '大货相关_值_2', DHXG_1_attr3: '大货相关_值_3', DHXG_1_attr4: '大货相关_值_4', DHXG_1_attr5: '大货相关_值_5' },
  { style_id: 1, DHXG_1_attr1: '大货相关_值_6', DHXG_1_attr2: '大货相关_值_7', DHXG_1_attr3: '大货相关_值_8', DHXG_1_attr4: '大货相关_值_9', DHXG_1_attr5: '大货相关_值_10' },
  { style_id: 2, DHXG_1_attr1: '大货相关_值_11', DHXG_1_attr2: '大货相关_值_12', DHXG_1_attr3: '大货相关_值_13', DHXG_1_attr4: '大货相关_值_14', DHXG_1_attr5: '大货相关_值_15' },
  { style_id: 2, DHXG_1_attr1: '大货相关_值_16', DHXG_1_attr2: '大货相关_值_17', DHXG_1_attr3: '大货相关_值_18', DHXG_1_attr4: '大货相关_值_19', DHXG_1_attr5: '大货相关_值_20' },
  { style_id: 3, DHXG_1_attr1: '大货相关_值_21', DHXG_1_attr2: '大货相关_值_22', DHXG_1_attr3: '大货相关_值_23', DHXG_1_attr4: '大货相关_值_24', DHXG_1_attr5: '大货相关_值_25' },
  { style_id: 3, DHXG_1_attr1: '大货相关_值_26', DHXG_1_attr2: '大货相关_值_27', DHXG_1_attr3: '大货相关_值_28', DHXG_1_attr4: '大货相关_值_29', DHXG_1_attr5: '大货相关_值_30' }
]

/**
 * [开发相关]
 */
const KFXG = [
  { style_id: 1, KFXG_attr1: '开发相关_值_1', KFXG_attr2: '开发相关_值_2', KFXG_attr3: '开发相关_值_3', KFXG_attr4: '开发相关_值_4', KFXG_attr5: '开发相关_值_5' },
  { style_id: 1, KFXG_attr1: '开发相关_值_6', KFXG_attr2: '开发相关_值_7', KFXG_attr3: '开发相关_值_8', KFXG_attr4: '开发相关_值_9', KFXG_attr5: '开发相关_值_10' },
  { style_id: 1, KFXG_attr1: '开发相关_值_11', KFXG_attr2: '开发相关_值_12', KFXG_attr3: '开发相关_值_13', KFXG_attr4: '开发相关_值_14', KFXG_attr5: '开发相关_值_15' },
  { style_id: 2, KFXG_attr1: '开发相关_值_16', KFXG_attr2: '开发相关_值_17', KFXG_attr3: '开发相关_值_18', KFXG_attr4: '开发相关_值_19', KFXG_attr5: '开发相关_值_20' },
  { style_id: 2, KFXG_attr1: '开发相关_值_21', KFXG_attr2: '开发相关_值_22', KFXG_attr3: '开发相关_值_23', KFXG_attr4: '开发相关_值_24', KFXG_attr5: '开发相关_值_25' },
  { style_id: 2, KFXG_attr1: '开发相关_值_26', KFXG_attr2: '开发相关_值_27', KFXG_attr3: '开发相关_值_28', KFXG_attr4: '开发相关_值_29', KFXG_attr5: '开发相关_值_30' },
  { style_id: 3, KFXG_attr1: '开发相关_值_31', KFXG_attr2: '开发相关_值_32', KFXG_attr3: '开发相关_值_33', KFXG_attr4: '开发相关_值_34', KFXG_attr5: '开发相关_值_35' },
  { style_id: 3, KFXG_attr1: '开发相关_值_36', KFXG_attr2: '开发相关_值_37', KFXG_attr3: '开发相关_值_38', KFXG_attr4: '开发相关_值_39', KFXG_attr5: '开发相关_值_40' },
  { style_id: 3, KFXG_attr1: '开发相关_值_41', KFXG_attr2: '开发相关_值_42', KFXG_attr3: '开发相关_值_43', KFXG_attr4: '开发相关_值_44', KFXG_attr5: '开发相关_值_45' }
]

/**
 * [设计相关]
 */
const SJXG = [
  { style_id: 1, SJXG_attr1: '设计相关_值_1', SJXG_attr2: '设计相关_值_2', SJXG_attr3: '设计相关_值_3', SJXG_attr4: '设计相关_值_4', SJXG_attr5: '设计相关_值_5' },
  { style_id: 1, SJXG_attr1: '设计相关_值_6', SJXG_attr2: '设计相关_值_7', SJXG_attr3: '设计相关_值_8', SJXG_attr4: '设计相关_值_9', SJXG_attr5: '设计相关_值_10' },
  { style_id: 1, SJXG_attr1: '设计相关_值_11', SJXG_attr2: '设计相关_值_12', SJXG_attr3: '设计相关_值_13', SJXG_attr4: '设计相关_值_14', SJXG_attr5: '设计相关_值_15' },
  { style_id: 1, SJXG_attr1: '设计相关_值_16', SJXG_attr2: '设计相关_值_17', SJXG_attr3: '设计相关_值_18', SJXG_attr4: '设计相关_值_19', SJXG_attr5: '设计相关_值_20' },
  { style_id: 2, SJXG_attr1: '设计相关_值_21', SJXG_attr2: '设计相关_值_22', SJXG_attr3: '设计相关_值_23', SJXG_attr4: '设计相关_值_24', SJXG_attr5: '设计相关_值_25' },
  { style_id: 2, SJXG_attr1: '设计相关_值_26', SJXG_attr2: '设计相关_值_27', SJXG_attr3: '设计相关_值_28', SJXG_attr4: '设计相关_值_29', SJXG_attr5: '设计相关_值_30' },
  { style_id: 2, SJXG_attr1: '设计相关_值_31', SJXG_attr2: '设计相关_值_32', SJXG_attr3: '设计相关_值_33', SJXG_attr4: '设计相关_值_34', SJXG_attr5: '设计相关_值_35' },
  { style_id: 2, SJXG_attr1: '设计相关_值_36', SJXG_attr2: '设计相关_值_37', SJXG_attr3: '设计相关_值_38', SJXG_attr4: '设计相关_值_39', SJXG_attr5: '设计相关_值_40' },
  { style_id: 3, SJXG_attr1: '设计相关_值_41', SJXG_attr2: '设计相关_值_42', SJXG_attr3: '设计相关_值_43', SJXG_attr4: '设计相关_值_44', SJXG_attr5: '设计相关_值_45' },
  { style_id: 3, SJXG_attr1: '设计相关_值_46', SJXG_attr2: '设计相关_值_47', SJXG_attr3: '设计相关_值_48', SJXG_attr4: '设计相关_值_49', SJXG_attr5: '设计相关_值_50' },
  { style_id: 3, SJXG_attr1: '设计相关_值_51', SJXG_attr2: '设计相关_值_52', SJXG_attr3: '设计相关_值_53', SJXG_attr4: '设计相关_值_54', SJXG_attr5: '设计相关_值_55' },
  { style_id: 3, SJXG_attr1: '设计相关_值_56', SJXG_attr2: '设计相关_值_57', SJXG_attr3: '设计相关_值_58', SJXG_attr4: '设计相关_值_59', SJXG_attr5: '设计相关_值_60' }
]

/**
 * [坏单信息]
 */
const HDXX = [
  { style_id: 1, HDXX_attr1: '坏单信息_值_1', HDXX_attr2: '坏单信息_值_2', HDXX_attr3: '坏单信息_值_3', HDXX_attr4: '坏单信息_值_4', HDXX_attr5: '坏单信息_值_5' },
  { style_id: 2, HDXX_attr1: '坏单信息_值_6', HDXX_attr2: '坏单信息_值_7', HDXX_attr3: '坏单信息_值_8', HDXX_attr4: '坏单信息_值_9', HDXX_attr5: '坏单信息_值_10' },
  { style_id: 3, HDXX_attr1: '坏单信息_值_11', HDXX_attr2: '坏单信息_值_12', HDXX_attr3: '坏单信息_值_13', HDXX_attr4: '坏单信息_值_14', HDXX_attr5: '坏单信息_值_15' }
]

/**
 * [委外加工厂相关]
 */
const WWJGCXG = [
  { style_id: 2, WWJGCXG_attr1: '委外加工厂相关_值_1', WWJGCXG_attr2: '委外加工厂相关_值_2', WWJGCXG_attr3: '委外加工厂相关_值_3', WWJGCXG_attr4: '委外加工厂相关_值_4', WWJGCXG_attr5: '委外加工厂相关_值_5' },
  { style_id: 3, WWJGCXG_attr1: '委外加工厂相关_值_6', WWJGCXG_attr2: '委外加工厂相关_值_7', WWJGCXG_attr3: '委外加工厂相关_值_8', WWJGCXG_attr4: '委外加工厂相关_值_9', WWJGCXG_attr5: '委外加工厂相关_值_10' }
]

/**
 * [单耗相关]
 */
const DHXG_2 = [
  { style_id: 1, DHXG_2_attr1: '委外加工厂相关_值_1', DHXG_2_attr2: '委外加工厂相关_值_2', DHXG_2_attr3: '委外加工厂相关_值_3', DHXG_2_attr4: '委外加工厂相关_值_4', DHXG_2_attr5: '委外加工厂相关_值_5' },
  { style_id: 3, DHXG_2_attr1: '委外加工厂相关_值_6', DHXG_2_attr2: '委外加工厂相关_值_7', DHXG_2_attr3: '委外加工厂相关_值_8', DHXG_2_attr4: '委外加工厂相关_值_9', DHXG_2_attr5: '委外加工厂相关_值_10' }
]

/**
 * [大货采购相关]
 */
const DHCGXG = [
  { style_id: 1, DHCGXG_attr1: '大货采购相关_值_1', DHCGXG_attr2: '大货采购相关_值_2', DHCGXG_attr3: '大货采购相关_值_3', DHCGXG_attr4: '大货采购相关_值_4', DHCGXG_attr5: '大货采购相关_值_5' },
  { style_id: 2, DHCGXG_attr1: '大货采购相关_值_6', DHCGXG_attr2: '大货采购相关_值_7', DHCGXG_attr3: '大货采购相关_值_8', DHCGXG_attr4: '大货采购相关_值_9', DHCGXG_attr5: '大货采购相关_值_10' }
]

/**
 * [大货验货相关]
 */
const DHYHXG = [
  { style_id: 1, DHYHXG_attr1: '大货验货相关_值_1', DHYHXG_attr4: '大货验货相关_值_4', DHYHXG_attr5: '大货验货相关_值_5' },
  { style_id: 2, DHYHXG_attr2: '大货验货相关_值_7', DHYHXG_attr4: '大货验货相关_值_9', DHYHXG_attr5: '大货验货相关_值_10' },
  { style_id: 3, DHYHXG_attr3: '大货验货相关_值_13', DHYHXG_attr4: '大货验货相关_值_14', DHYHXG_attr5: '大货验货相关_值_15' }
]

export default { base, DHXG_1, KFXG, SJXG, HDXX, WWJGCXG, DHXG_2, DHCGXG, DHYHXG }
