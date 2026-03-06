import { useState } from 'react'
import { isValidWeight } from '../data/foods'

const WEIGHT_RANGES = {
  baby: { min: 100, max: 400, label: '幼年' },
  young: { min: 300, max: 700, label: '青年' },
  adult: { min: 700, max: 1200, label: '成年' },
  senior: { min: 600, max: 1100, label: '老年' },
}

export default function HealthAssessment() {
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('adult')
  const [pregnant, setPregnant] = useState(false)
  const [sick, setSick] = useState(false)
  const [stress, setStress] = useState(false)
  const [cards, setCards] = useState(null)

  const assess = () => {
    const w = parseFloat(weight)
    if (!isValidWeight(w)) {
      alert('请输入有效体重（100-2000 克）')
      return
    }

    const resultCards = []
    const wr = WEIGHT_RANGES[age]

    let weightStatus, weightClass, tagClass
    if (w < wr.min) {
      weightStatus = '偏轻'
      weightClass = 'health-alert'
      tagClass = 'tag-red'
    } else if (w > wr.max) {
      weightStatus = '偏重'
      weightClass = 'health-warn'
      tagClass = 'tag-orange'
    } else {
      weightStatus = '正常'
      weightClass = 'health-good'
      tagClass = 'tag-green'
    }

    resultCards.push({
      type: 'weight',
      className: weightClass,
      title: '体重评估',
      tag: { text: weightStatus, className: tagClass },
      content: (
        <p>
          {wr.label}荷兰猪正常体重范围：{wr.min}-{wr.max} 克<br />
          当前体重：<strong>{w} 克</strong>
          {weightStatus === '偏轻' && <><br />⚠️ 建议增加喂食量，观察食欲和精神状态</>}
          {weightStatus === '偏重' && <><br />⚠️ 建议适当控制零食，增加活动空间</>}
        </p>
      ),
    })

    const kg = w / 1000
    let vcLevel = 10
    const vcReasons = []
    if (age === 'baby' || age === 'young') { vcLevel = 20; vcReasons.push('幼年/青年期需要更多 VC') }
    if (age === 'senior') { vcLevel = 20; vcReasons.push('老年期吸收能力下降') }
    if (pregnant) { vcLevel = 30; vcReasons.push('怀孕/哺乳期需求增加') }
    if (sick) { vcLevel = 30; vcReasons.push('生病期间消耗增大') }
    if (stress) { vcLevel = Math.max(vcLevel, 25); vcReasons.push('应激状态需额外补充') }
    const vcNeed = (kg * vcLevel).toFixed(1)
    const vcClass = vcLevel >= 20 ? 'health-warn' : 'health-good'

    resultCards.push({
      type: 'vc',
      className: vcClass,
      title: 'VC 补充建议',
      content: (
        <p>
          建议每日补充：<strong>{vcNeed} mg</strong>（{vcLevel}mg/kg）<br />
          {vcReasons.length > 0
            ? `原因：${vcReasons.join('、')}`
            : '当前状态良好，日常维持即可'
          }
        </p>
      ),
    })

    const tips = []
    if (age === 'baby') {
      tips.push('幼年期需要充足的苜蓿草（高钙）')
      tips.push('逐步引入新鲜蔬菜，每次只加一种')
    } else {
      tips.push('以提摩西草为主食，无限量供应')
    }
    if (pregnant) tips.push('怀孕期增加苜蓿草比例，补充钙质')
    if (sick) tips.push('生病期间保证饮水，必要时用针管喂水')
    if (age === 'senior') tips.push('老年猪牙齿可能有问题，注意观察进食情况')
    tips.push('每天提供新鲜蔬菜，优先选择高 VC 食物（甜椒、羽衣甘蓝）')
    tips.push('保持干净饮水，每天更换')

    resultCards.push({
      type: 'tips',
      className: 'health-good',
      title: '喂养建议',
      content: (
        <p>
          {tips.map((t, i) => (
            <span key={i}>{t}{i < tips.length - 1 && <br />}</span>
          ))}
        </p>
      ),
    })

    setCards(resultCards)
  }

  return (
    <>
      <div className="form-group">
        <label className="form-label">体重（克）</label>
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

      <div className="form-group">
        <label className="form-label">年龄</label>
        <select className="form-select" value={age} onChange={e => setAge(e.target.value)}>
          <option value="baby">幼年（&lt; 6 个月）</option>
          <option value="young">青年（6-12 个月）</option>
          <option value="adult">成年（1-4 岁）</option>
          <option value="senior">老年（&gt; 4 岁）</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">特殊状态（可多选）</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
          <label style={{ fontWeight: 'normal', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={pregnant} onChange={e => setPregnant(e.target.checked)} /> 怀孕/哺乳
          </label>
          <label style={{ fontWeight: 'normal', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={sick} onChange={e => setSick(e.target.checked)} /> 生病中
          </label>
          <label style={{ fontWeight: 'normal', fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="checkbox" checked={stress} onChange={e => setStress(e.target.checked)} /> 应激状态
          </label>
        </div>
      </div>

      <button className="btn" onClick={assess}>评估健康状态</button>

      {cards && (
        <div>
          {cards.map(card => (
            <div key={card.type} className={`health-card ${card.className}`}>
              <h3>
                {card.title}
                {card.tag && <> <span className={`tag ${card.tag.className}`}>{card.tag.text}</span></>}
              </h3>
              {card.content}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
