import { useState, useMemo } from 'react'
import { FOODS } from '../data/foods'

const LEVEL_MAP = { high: '高', mid: '中', low: '低' }
const CLASS_MAP = { high: 'vc-high', mid: 'vc-mid', low: 'vc-low' }

export default function FoodReference() {
  const [sortKey, setSortKey] = useState('vc')
  const [sortAsc, setSortAsc] = useState(false)

  const maxVc = useMemo(() => Math.max(...FOODS.map(f => f.vc)), [])

  const sorted = useMemo(() => {
    const copy = [...FOODS]
    copy.sort((a, b) => {
      const cmp = sortKey === 'vc'
        ? a.vc - b.vc
        : a.name.localeCompare(b.name, 'zh')
      return sortAsc ? cmp : -cmp
    })
    return copy
  }, [sortKey, sortAsc])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(prev => !prev)
    } else {
      setSortKey(key)
      setSortAsc(key === 'name')
    }
  }

  const getSortIcon = (key) => {
    if (sortKey !== key) return ''
    return sortAsc ? '▲' : '▼'
  }

  return (
    <>
      <p className="form-label">
        常见蔬果 VC 含量（每 100g）
        <span style={{ fontWeight: 'normal', fontSize: 12, color: '#b8956a' }}> 点击表头排序</span>
      </p>
      <table className="food-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              食物 <span className="sort-icon">{getSortIcon('name')}</span>
            </th>
            <th onClick={() => handleSort('vc')}>
              VC (mg) <span className="sort-icon">{getSortIcon('vc')}</span>
            </th>
            <th>等级</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(f => (
            <tr key={f.name}>
              <td>{f.name}</td>
              <td>
                <div className="vc-bar-wrap">
                  <strong>{f.vc}</strong>
                  <div className="vc-bar-bg">
                    <div
                      className="vc-bar"
                      style={{ width: Math.round(f.vc / maxVc * 60) }}
                    />
                  </div>
                </div>
              </td>
              <td><span className={CLASS_MAP[f.level]}>{LEVEL_MAP[f.level]}</span></td>
              <td>{f.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note-box">
        💡 数据为近似值，实际含量因品种和新鲜度有差异。建议每天提供 2-3 种不同蔬果搭配。
      </p>
      <div className="accuracy-box">
        <strong>📌 数据准确性说明</strong><br />
        1）本表 VC 为常见公开营养数据的近似值（mg/100g），不同产地、成熟度、存放时间会影响实际含量。<br />
        2）本工具用于日常喂养参考，不替代兽医诊断。若出现食欲下降、精神差、持续腹泻等情况，请尽快就医。<br />
        3）建议优先把"高 VC 食物"作为主来源，并通过多食材轮换降低单一食材风险。
      </div>
    </>
  )
}
