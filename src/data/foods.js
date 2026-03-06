export const FOODS = [
  { name: '红甜椒', vc: 127, level: 'high', note: '首选补 VC 食物（更稳妥）' },
  { name: '黄甜椒', vc: 183, level: 'high', note: 'VC 很高，和红椒轮换更好' },
  { name: '绿甜椒', vc: 80, level: 'mid', note: '比红黄椒低一些' },
  { name: '西兰花', vc: 89, level: 'mid', note: '适量喂，易胀气' },
  { name: '羽衣甘蓝', vc: 120, level: 'high', note: '钙含量也高' },
  { name: '芹菜', vc: 12, level: 'low', note: '水分多，VC 少' },
  { name: '番茄', vc: 14, level: 'low', note: '少量喂，偏酸' },
  { name: '草莓', vc: 59, level: 'mid', note: '当零食，糖分高' },
  { name: '橙子', vc: 53, level: 'mid', note: '少量喂，偏酸' },
  { name: '猕猴桃', vc: 93, level: 'mid', note: '偶尔喂，糖分高' },
  { name: '菠菜', vc: 28, level: 'low', note: '草酸高，少喂' },
  { name: '生菜（罗马）', vc: 24, level: 'low', note: '水分多，营养一般' },
  { name: '胡萝卜', vc: 6, level: 'low', note: 'VC 极少，当零食' },
  { name: '黄瓜', vc: 3, level: 'low', note: '几乎无 VC，补水用' },
  { name: '欧芹', vc: 133, level: 'high', note: '钙高，适量喂' },
]

export const FOOD_CAUTION = {
  '草莓': '糖分较高，建议仅作零食',
  '橙子': '偏酸且糖分高，建议仅作零食',
  '猕猴桃': '糖分较高，建议仅作零食',
  '番茄': '偏酸，敏感个体可能不耐受',
  '菠菜': '草酸偏高，不建议高频大量喂',
  '欧芹': '钙较高，建议与低钙蔬菜轮换',
  '羽衣甘蓝': '钙较高，建议控制频次',
  '胡萝卜': '糖分偏高，VC 低，不适合作为主补充来源',
  '黄瓜': 'VC 低，主要用于补水',
}

export function isValidWeight(weight) {
  return Number.isFinite(weight) && weight >= 100 && weight <= 2000
}
