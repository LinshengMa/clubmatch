import { useState, useRef } from 'react'

const SWIPE_THRESHOLD = 120
const MAX_ROTATION = 15

export default function SwipeCard({
  children,
  isTop,
  stackIndex,
  onSwipeLeft,
  onSwipeRight,
}) {
  const [dragging, setDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [flyingOut, setFlyingOut] = useState(false)
  const startPos = useRef({ x: 0, y: 0 })

  const rotation = isTop ? (offset.x / 300) * MAX_ROTATION : 0
  const direction = offset.x > 50 ? 'right' : offset.x < -50 ? 'left' : null

  const stackStyle = {
    transform: isTop
      ? `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`
      : `scale(${1 - stackIndex * 0.05}) translateY(${stackIndex * 8}px)`,
    zIndex: 10 - stackIndex,
    transition: dragging ? 'none' : 'transform 0.3s ease',
    cursor: isTop ? 'grab' : 'default',
    pointerEvents: isTop ? 'auto' : 'none',
  }

  const flyOut = (dir) => {
    setFlyingOut(true)
    const target = dir === 'right' ? 600 : -600
    setOffset({ x: target, y: offset.y })
    setTimeout(() => {
      dir === 'right' ? onSwipeRight() : onSwipeLeft()
      setOffset({ x: 0, y: 0 })
      setFlyingOut(false)
    }, 300)
  }

  const release = () => {
    setDragging(false)
    if (offset.x > SWIPE_THRESHOLD) {
      flyOut('right')
    } else if (offset.x < -SWIPE_THRESHOLD) {
      flyOut('left')
    } else {
      setOffset({ x: 0, y: 0 })
    }
  }

  // Mouse events
  const handleMouseDown = (e) => {
    if (!isTop || flyingOut) return
    setDragging(true)
    startPos.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
  }
  const handleMouseMove = (e) => {
    if (!dragging) return
    setOffset({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    })
  }
  const handleMouseUp = () => {
    if (!dragging) return
    release()
  }

  // Touch events
  const handleTouchStart = (e) => {
    if (!isTop || flyingOut) return
    const touch = e.touches[0]
    setDragging(true)
    startPos.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y }
  }
  const handleTouchMove = (e) => {
    if (!dragging) return
    const touch = e.touches[0]
    setOffset({
      x: touch.clientX - startPos.current.x,
      y: touch.clientY - startPos.current.y,
    })
  }
  const handleTouchEnd = () => {
    if (!dragging) return
    release()
  }

  // Expose flyOut for button clicks
  const triggerSwipe = (dir) => {
    if (flyingOut) return
    flyOut(dir)
  }

  return (
    <div
      style={stackStyle}
      className="absolute w-[340px] rounded-2xl bg-white shadow-xl overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stamp overlays */}
      {isTop && direction === 'right' && (
        <div className="absolute top-6 left-4 border-4 border-green-500 text-green-500 font-bold text-xl px-3 py-1 rounded-lg -rotate-12 z-20 pointer-events-none">
          感兴��� ❤️
        </div>
      )}
      {isTop && direction === 'left' && (
        <div className="absolute top-6 right-4 border-4 border-red-400 text-red-400 font-bold text-xl px-3 py-1 rounded-lg rotate-12 z-20 pointer-events-none">
          跳过 ✖
        </div>
      )}

      {typeof children === 'function' ? children({ triggerSwipe }) : children}
    </div>
  )
}
