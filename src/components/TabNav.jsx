const TABS = [
  { key: 'calc', label: '💊 VC 计算' },
  { key: 'food', label: '🥬 食物参考' },
  { key: 'feed', label: '🍽 喂食计算' },
  { key: 'weight', label: '📊 体重追踪' },
  { key: 'health', label: '❤ 健康评估' },
]

export default function TabNav({ activeTab, onSwitch }) {
  return (
    <div className="tabs">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onSwitch(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
