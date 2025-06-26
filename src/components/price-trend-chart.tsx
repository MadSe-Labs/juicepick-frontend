"use client"

import { useEffect, useRef } from "react"

export default function PriceTrendChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    canvas.width = canvas.offsetWidth
    canvas.height = 150

    // Sample data - price trends for the last 30 days
    const data = [
      18000, 18000, 17500, 17500, 17000, 17000, 16500, 16500, 16000, 16000, 15500, 15500, 15000, 15000, 15000, 15500,
      15500, 16000, 16000, 16500, 16500, 16000, 15500, 15000, 15000, 14500, 14500, 15000, 15000, 15000,
    ]

    // Chart settings
    const padding = 20
    const maxPrice = Math.max(...data) * 1.1
    const minPrice = Math.min(...data) * 0.9

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (canvas.height - 2 * padding) * (i / 4)
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
    }

    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (canvas.width - 2 * padding) * (i / 6)
      ctx.moveTo(x, padding)
      ctx.lineTo(x, canvas.height - padding)
    }

    ctx.stroke()

    // Draw line chart
    ctx.beginPath()
    ctx.strokeStyle = "#16a34a"
    ctx.lineWidth = 2

    data.forEach((price, index) => {
      const x = padding + (canvas.width - 2 * padding) * (index / (data.length - 1))
      const y = padding + (canvas.height - 2 * padding) * (1 - (price - minPrice) / (maxPrice - minPrice))

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    data.forEach((price, index) => {
      const x = padding + (canvas.width - 2 * padding) * (index / (data.length - 1))
      const y = padding + (canvas.height - 2 * padding) * (1 - (price - minPrice) / (maxPrice - minPrice))

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "#16a34a"
      ctx.fill()
    })
  }, [])

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  )
}
