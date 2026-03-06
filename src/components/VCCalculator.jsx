import { useState } from 'react'
import { isValidWeight } from '../data/foods'

export default function VCCalculator() {
  const [weight, setWeight] = useState('')
  const [result, setResult] = useState(null)

  const calcVC = () => {
    const w = parseFloat(weight)
    if (!isValidWeight(w)) {
      alert('请输入有效体重（100-2000 克）')
      return
    }
    const kg = w / 1000
    setResult({
      weight: w,
      low: (kg * 10).toFixed(1),
      mid: (kg * 20).toFixed(1),
      high: (kg * 30).toFixed(1),
    })
  }

  return (
    <>
      <div className="form-group">
        <label className="form-label">荷兰猪体重（克）</label>
        <input
          className="form-input"
          type="number"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="例如：1000"
          min="100"
          max="2000"
        />
      </div>
      <button className="btn" onClick={calcVC}>计算每日 VC 需求</button>
      {result && (
        <div className="result-box">
          <strong>体重：{result.weight} 克</strong><br />
          日常维持：{result.low} mg VC<br />
          生长/恢复期：{result.mid} mg VC<br />
          应激/康复期：{result.high} mg VC
        </div>
      )}
      <p className="note-box">
        💡 日常维持 10mg/kg，应激/生病/老年 30mg/kg
        &nbsp;&nbsp;&nbsp;&nbsp;VC 片常见规格：50mg/片，可掰碎使用
      </p>
    </>
  )
}
