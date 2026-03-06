import { useState, useCallback } from 'react'

const STORAGE_KEY = 'gp_weights'

export function useWeights() {
  const [weights, setWeights] = useState(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (e) {
      return []
    }
  })

  const addWeight = useCallback((date, value) => {
    setWeights(prev => {
      const next = [...prev, { date, value }]
        .sort((a, b) => a.date.localeCompare(b.date))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const deleteWeight = useCallback((idx) => {
    setWeights(prev => {
      const next = prev.filter((_, i) => i !== idx)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearWeights = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setWeights([])
  }, [])

  return { weights, addWeight, deleteWeight, clearWeights }
}
