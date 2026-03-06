import { useState } from 'react'
import { isValidWeight } from '../data/foods'
import { useWeights } from '../hooks/useWeights'
import WeightChart from './WeightChart'

function getToday() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function WeightTracker({ visible }) {
  const [date, setDate] = useState(getToday)
  const [value, setValue] = useState('')
  const { weights, addWeight, deleteWeight, clearWeights } = useWeights()

  const handleAdd = () => {
    const v = parseFloat(value)
    if (!date || !isValidWeight(v)) {
      alert('请填写日期和有效体重')
      return
    }
    addWeight(date, v)
    setValue('')
  }

  const handleClear = () => {
    if (!confirm('确定清空所有体重记录？')) return
    clearWeights()
  }

  return (
    <>
      <div className="flex-row">
        <div className="form-group">
          <label className="form-label">日期</label>
          <input
            className="form-input"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">体重（克）</label>
          <input
            className="form-input"
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="克"
            min="100"
            max="2000"
          />
        </div>
        <button
          className="btn btn-sm"
          onClick={handleAdd}
          style={{ marginBottom: 0, height: 42 }}
        >
          记录
        </button>
      </div>

      <WeightChart weights={weights} visible={visible} />

      <div className="weight-list">
        {weights.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#ccc', padding: 20 }}>暂无记录</div>
        ) : (
          [...weights].reverse().map((w, ri) => {
            const realIdx = weights.length - 1 - ri
            return (
              <div key={`${w.date}-${realIdx}`} className="weight-item">
                <span className="date">{w.date}</span>
                <span className="value">{w.value} g</span>
                <button className="delete-btn" onClick={() => deleteWeight(realIdx)}>×</button>
              </div>
            )
          })
        )}
      </div>

      <div style={{ marginTop: 10, textAlign: 'right' }}>
        <button className="btn btn-sm btn-danger" onClick={handleClear}>清空记录</button>
      </div>
    </>
  )
}
