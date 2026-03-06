import { useState } from 'react'
import { FOODS, FOOD_CAUTION, isValidWeight } from '../data/foods'

function findOptimalMixRatio(weight, level, mainFood, mixFood) {
  let best = null
  for (let ratio = 50; ratio <= 90; ratio += 5) {
    const needMg = (weight / 1000) * level
    const mainMg = needMg * (ratio / 100)
    const mixMg = needMg * (1 - ratio / 100)
    const mainGram = mainMg / mainFood.vc * 100
    const mixGram = mixMg / mixFood.vc * 100
    const maxGram = Math.max(mainGram, mixGram)
    const totalGram = mainGram + mixGram
    const overLimitPenalty =
      (mainGram > 35 ? (mainGram - 35) * 2 : 0) +
      (mixGram > 35 ? (mixGram - 35) * 2 : 0)
    const score = maxGram * 1.0 + totalGram * 0.15 + overLimitPenalty
    if (!best || score < best.score) {
      best = { ratio, score, mainGram, mixGram }
    }
  }
  return best
}

export default function FeedingCalculator() {
  const [weight, setWeight] = useState('')
  const [foodIdx, setFoodIdx] = useState(0)
  const [mixEnabled, setMixEnabled] = useState(false)
  const [mixFoodIdx, setMixFoodIdx] = useState(1)
  const [mixMainRatio, setMixMainRatio] = useState(70)
  const [level, setLevel] = useState(10)
  const [result, setResult] = useState(null)
  const [optimalMixNote, setOptimalMixNote] = useState('')

  const clearOptimalNote = () => setOptimalMixNote('')

  const setFeedFoodByName = (name) => {
    const idx = FOODS.findIndex(f => f.name === name)
    if (idx >= 0) setFoodIdx(idx)
  }

  const doCalcFeed = (w, fIdx, mixOn, mfIdx, ratio, lvl, optNote) => {
    const food = FOODS[fIdx]
    const kg = w / 1000
    const needMg = kg * lvl
    const needGram = needMg / food.vc * 100
    const tips = []
    let mixResult = null

    if (mixOn) {
      const mixFood = FOODS[mfIdx]
      if (mixFood && mfIdx !== fIdx) {
        const mainRate = ratio / 100
        const mainMg = needMg * mainRate
        const mixMg = needMg * (1 - mainRate)
        const mainGram = mainMg / food.vc * 100
        const mixGram = mixMg / mixFood.vc * 100
        mixResult = { food, mixFood, needMg, ratio, mainGram, mixGram, optNote }
        if (food.vc < 30 || mixFood.vc < 30) {
          tips.push('当前搭配中有低 VC 食材，建议至少保留一个高 VC 主食材（如红/黄甜椒）。')
        }
        if (mainGram > 35 || mixGram > 35) {
          tips.push('某一食材所需克数仍偏高，可继续提高高 VC 食材比例。')
        }
        if (FOOD_CAUTION[mixFood.name]) {
          tips.push(`${mixFood.name}：${FOOD_CAUTION[mixFood.name]}`)
        }
      } else {
        tips.push('混合喂法需选择不同搭配食材，已按单一食材结果显示。')
      }
    }

    if (!mixResult) {
      if (food.vc < 30) tips.push('该食物 VC 含量较低，不建议作为主要 VC 来源。')
      if (needGram > 35) tips.push('仅靠这一种食物补足 VC 需要量偏大，建议换成高 VC 食物（如红/黄甜椒）或使用混合喂法。')
    }

    if (FOOD_CAUTION[food.name]) tips.push(`${food.name}：${FOOD_CAUTION[food.name]}`)

    setResult({ food, needMg, needGram, mixResult, tips })
  }

  const calcFeed = () => {
    const w = parseFloat(weight)
    if (!isValidWeight(w)) {
      alert('请输入有效体重（100-2000 克）')
      return
    }
    doCalcFeed(w, foodIdx, mixEnabled, mixFoodIdx, mixMainRatio, level, optimalMixNote)
  }

  const applyOptimalMixRatio = () => {
    if (!mixEnabled) { alert('请先勾选"启用混合喂法"'); return }
    const w = parseFloat(weight)
    if (!isValidWeight(w)) { alert('请先输入有效体重（100-2000 克）'); return }
    if (foodIdx === mixFoodIdx) { alert('主食材和搭配食材不能相同'); return }
    const mainFood = FOODS[foodIdx]
    const mixFood = FOODS[mixFoodIdx]
    if (!mainFood || !mixFood || !level) { alert('请先选择完整的喂食参数'); return }
    const best = findOptimalMixRatio(w, level, mainFood, mixFood)
    if (!best) return
    setMixMainRatio(best.ratio)
    const note = `已自动推荐最优比例：${best.ratio}% / ${100 - best.ratio}%`
    setOptimalMixNote(note)
    doCalcFeed(w, foodIdx, true, mixFoodIdx, best.ratio, level, note)
  }

  return (
    <>
      <div className="form-group">
        <label className="form-label">荷兰猪体重（克）</label>
        <input
          className="form-input"
          type="number"
          value={weight}
          onChange={e => { setWeight(e.target.value); clearOptimalNote() }}
          placeholder="例如：1000"
          min="100"
          max="2000"
        />
      </div>

      <div className="form-group">
        <label className="form-label">选择食物</label>
        <select
          className="form-select"
          value={foodIdx}
          onChange={e => { setFoodIdx(Number(e.target.value)); clearOptimalNote() }}
        >
          {FOODS.map((f, i) => (
            <option key={i} value={i}>{f.name}（{f.vc}mg/100g）</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <button type="button" className="btn btn-chip" onClick={() => setFeedFoodByName('红甜椒')}>
            首选：红甜椒
          </button>
          <button type="button" className="btn btn-chip" onClick={() => setFeedFoodByName('黄甜椒')}>
            首选：黄甜椒
          </button>
          <button type="button" className="btn btn-chip" onClick={() => setFeedFoodByName('绿甜椒')}>
            备选：绿甜椒
          </button>
        </div>
      </div>

      <div className="form-group">
        <label style={{ fontWeight: 'normal', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            type="checkbox"
            checked={mixEnabled}
            onChange={e => { setMixEnabled(e.target.checked); clearOptimalNote() }}
          />
          启用混合喂法（主食材 + 搭配食材）
        </label>
      </div>

      {mixEnabled && (
        <div className="form-group">
          <label className="form-label">搭配食材（承担约 30% VC）</label>
          <select
            className="form-select"
            value={mixFoodIdx}
            onChange={e => { setMixFoodIdx(Number(e.target.value)); clearOptimalNote() }}
          >
            {FOODS.map((f, i) => (
              <option key={i} value={i}>{f.name}（{f.vc}mg/100g）</option>
            ))}
          </select>
          <div style={{ marginTop: 10 }}>
            <label className="form-label" style={{ marginBottom: 8 }}>
              主食材占比：{mixMainRatio}%（搭配食材 {100 - mixMainRatio}%）
            </label>
            <input
              className="form-input"
              type="range"
              min="50"
              max="90"
              step="5"
              value={mixMainRatio}
              onChange={e => { setMixMainRatio(Number(e.target.value)); clearOptimalNote() }}
              style={{ padding: 0, height: 34 }}
            />
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-chip" onClick={applyOptimalMixRatio}>
                一键最优比例
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="form-label">补充强度</label>
        <select
          className="form-select"
          value={level}
          onChange={e => { setLevel(Number(e.target.value)); clearOptimalNote() }}
        >
          <option value={10}>日常维持（10mg/kg）</option>
          <option value={20}>轻度补充（20mg/kg）</option>
          <option value={30}>应激/康复（30mg/kg）</option>
        </select>
      </div>

      <button className="btn" onClick={calcFeed}>计算喂食量</button>

      {result && (
        <div className="result-box">
          {result.mixResult ? (
            <>
              <strong>混合喂法建议</strong><br />
              每日 VC 目标：{result.mixResult.needMg.toFixed(1)} mg
              （主食材 {result.mixResult.ratio}% + 搭配食材 {100 - result.mixResult.ratio}%）<br />
              主食材：<strong>{result.mixResult.mainGram.toFixed(1)} 克</strong> {result.mixResult.food.name}<br />
              搭配食材：<strong>{result.mixResult.mixGram.toFixed(1)} 克</strong> {result.mixResult.mixFood.name}<br />
              {result.mixResult.optNote && (
                <><span style={{ fontSize: 13, color: '#6f8f4e' }}>✅ {result.mixResult.optNote}</span><br /></>
              )}
              <span style={{ fontSize: 13, color: '#9a7d5a' }}>
                （混合喂法更适合长期轮换，减少单一食材风险）
              </span>
            </>
          ) : (
            <>
              <strong>{result.food.name}</strong><br />
              每日 VC 需求：{result.needMg.toFixed(1)} mg<br />
              需要喂食：<strong>{result.needGram.toFixed(1)} 克</strong> {result.food.name}<br />
              <span style={{ fontSize: 13, color: '#9a7d5a' }}>
                （约 {(result.needGram / 10).toFixed(1)} 个拇指大小的块）
              </span>
            </>
          )}
          {result.tips.length > 0 && (
            <div style={{ marginTop: 8, fontSize: 13, color: '#9a7d5a', lineHeight: 1.6 }}>
              {result.tips.map((tip, i) => (
                <span key={i}>⚠️ {tip}{i < result.tips.length - 1 && <br />}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="accuracy-box">
        <strong>📌 数据准确性说明</strong><br />
        1）喂食克数按"每 100g 食物含 VC"反推，属于估算值，真实摄入会因个体挑食和剩食波动。<br />
        2）当单一食材算出的克数较大时，建议使用混合喂法，降低高糖/高草酸/高钙食材的单日负担。<br />
        3）维C补充是整体喂养的一部分，提摩西草和饮水管理同样重要。
      </div>
    </>
  )
}
