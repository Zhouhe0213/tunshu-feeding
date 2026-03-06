import { useRef, useEffect } from 'react'

export default function WeightChart({ weights, visible }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    const w = rect.width
    const h = rect.height
    ctx.clearRect(0, 0, w, h)

    if (weights.length < 2) {
      ctx.fillStyle = '#ccc'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('至少需要 2 条记录才能显示图表', w / 2, h / 2)
      return
    }

    const pad = { top: 20, right: 20, bottom: 35, left: 50 }
    const cw = w - pad.left - pad.right
    const ch = h - pad.top - pad.bottom
    const values = weights.map(item => item.value)
    const minV = Math.max(0, Math.min(...values) - 50)
    const maxV = Math.max(...values) + 50
    const range = maxV - minV || 1

    ctx.strokeStyle = '#f0dcc8'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + ch - (ch * i / 4)
      ctx.beginPath()
      ctx.moveTo(pad.left, y)
      ctx.lineTo(pad.left + cw, y)
      ctx.stroke()
      ctx.fillStyle = '#9a7d5a'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(Math.round(minV + range * i / 4) + 'g', pad.left - 6, y + 4)
    }

    ctx.strokeStyle = '#e67e22'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (let i = 0; i < weights.length; i++) {
      const x = pad.left + (cw * i / (weights.length - 1))
      const y = pad.top + ch - (ch * (weights[i].value - minV) / range)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    for (let i = 0; i < weights.length; i++) {
      const x = pad.left + (cw * i / (weights.length - 1))
      const y = pad.top + ch - (ch * (weights[i].value - minV) / range)
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#e67e22'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.fillStyle = '#9a7d5a'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center'
    const step = Math.max(1, Math.floor(weights.length / 6))
    for (let i = 0; i < weights.length; i += step) {
      const x = pad.left + (cw * i / (weights.length - 1))
      const label = weights[i].date.substring(5)
      ctx.fillText(label, x, h - pad.bottom + 16)
    }
  }, [weights, visible])

  return (
    <div className="chart-area">
      <canvas ref={canvasRef} className="chart-canvas" />
    </div>
  )
}
