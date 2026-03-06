import { useState } from 'react'
import TabNav from './components/TabNav'
import VCCalculator from './components/VCCalculator'
import FoodReference from './components/FoodReference'
import FeedingCalculator from './components/FeedingCalculator'
import WeightTracker from './components/WeightTracker'
import HealthAssessment from './components/HealthAssessment'

export default function App() {
  const [activeTab, setActiveTab] = useState('calc')

  return (
    <div className="container">
      <h1>🐹 猪猪的吃喝指南</h1>
      <p className="subtitle">— 荷兰猪健康饮食小助手 —</p>
      <TabNav activeTab={activeTab} onSwitch={setActiveTab} />

      <div className={`tab-panel ${activeTab === 'calc' ? 'active' : ''}`}>
        <VCCalculator />
      </div>
      <div className={`tab-panel ${activeTab === 'food' ? 'active' : ''}`}>
        <FoodReference />
      </div>
      <div className={`tab-panel ${activeTab === 'feed' ? 'active' : ''}`}>
        <FeedingCalculator />
      </div>
      <div className={`tab-panel ${activeTab === 'weight' ? 'active' : ''}`}>
        <WeightTracker visible={activeTab === 'weight'} />
      </div>
      <div className={`tab-panel ${activeTab === 'health' ? 'active' : ''}`}>
        <HealthAssessment />
      </div>
    </div>
  )
}
