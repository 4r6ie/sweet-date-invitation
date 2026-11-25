import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback
} from 'react'
import { createPortal } from 'react-dom'

export interface EvasiveNoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  yesButtonRef?: React.RefObject<HTMLButtonElement | null>
}

const PLAYFUL_PHRASES = [
  'NO 😢',
  'Are you sure? 🥺',
  'Try again! 😜',
  'Nope! 🏃‍♂️',
  'Too slow! 💨',
  'Can\'t catch me! ✨',
  'Think again! 💖',
  'Almost had it! 🤭',
  'Click YES instead! 💕'
]

const EvasiveNoButton = forwardRef<HTMLButtonElement, EvasiveNoButtonProps>((
  { onClick, yesButtonRef, style: customStyle, className = '', ...props },
  forwardedRef
) => {
  const internalRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(forwardedRef, () => internalRef.current as HTMLButtonElement)

  const [phraseIndex, setPhraseIndex] = useState(0)
  const [isFloating, setIsFloating] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isEscaping, setIsEscaping] = useState(false)
  const [placeholderSize, setPlaceholderSize] = useState<{ width: number; height: number }>({ width: 140, height: 48 })

  const escapeTimeoutRef = useRef<number | null>(null)
  const lastRelocateTimeRef = useRef<number>(0)

  // Safe random coordinate calculation:
  // 1. Strictly inside viewport (never negative, never out-of-screen)
  // 2. Safe distance away from YES button (never overlaps)
  // 3. Clear of the chasing cursor/touch so it always darts away to an open area
  const calculateSafeRandomPosition = useCallback((cursorX?: number, cursorY?: number) => {
    const btn = internalRef.current
    const buttonWidth = btn ? Math.max(btn.offsetWidth, 160) : 160
    const buttonHeight = btn ? Math.max(btn.offsetHeight, 48) : 48
    const margin = 20

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    const minX = margin
    const maxX = Math.max(margin, viewportWidth - margin - buttonWidth)
    const minY = margin
    const maxY = Math.max(margin, viewportHeight - margin - buttonHeight)

    const yesRect = yesButtonRef?.current?.getBoundingClientRect()
    const safetyBuffer = 35
    const cursorBuffer = 120

    let chosenX = minX
    let chosenY = minY
    let foundValidPosition = false

    // Attempt up to 50 candidates to find an open spot clear of YES button and cursor
    for (let i = 0; i < 50; i++) {
      const candidateX = Math.round(minX + Math.random() * (maxX - minX))
      const candidateY = Math.round(minY + Math.random() * (maxY - minY))

      // Check collision with YES button
      if (yesRect) {
        const overlapsYes =
          candidateX < yesRect.right + safetyBuffer &&
          candidateX + buttonWidth > yesRect.left - safetyBuffer &&
          candidateY < yesRect.bottom + safetyBuffer &&
          candidateY + buttonHeight > yesRect.top - safetyBuffer

        if (overlapsYes) {
          continue
        }
      }

      // Check distance from cursor so it doesn't spawn under the user's cursor/finger
      if (typeof cursorX === 'number' && typeof cursorY === 'number') {
        const distToCursor = Math.hypot(
          candidateX + buttonWidth / 2 - cursorX,
          candidateY + buttonHeight / 2 - cursorY
        )
        if (distToCursor < cursorBuffer) {
          continue
        }
      }

      chosenX = candidateX
      chosenY = candidateY
      foundValidPosition = true
      break
    }

    // Fallback if tight: place on opposite side of viewport from YES button
    if (!foundValidPosition) {
      if (yesRect) {
        chosenX = yesRect.left > viewportWidth / 2 ? minX : maxX
        chosenY = yesRect.top > viewportHeight / 2 ? minY : maxY
      } else {
        chosenX = Math.round(minX + Math.random() * (maxX - minX))
        chosenY = Math.round(minY + Math.random() * (maxY - minY))
      }
    }

    // Strict clamping guaranteeing the button is always 100% visible inside the viewport
    return {
      x: Math.max(minX, Math.min(chosenX, maxX)),
      y: Math.max(minY, Math.min(chosenY, maxY))
    }
  }, [yesButtonRef])

  const relocate = useCallback((cursorX?: number, cursorY?: number) => {
    const now = Date.now()
    // Small throttle (60ms) to ensure smooth transitions without jerky skips
    if (now - lastRelocateTimeRef.current < 60) return
    lastRelocateTimeRef.current = now

    // Record dimensions for layout stability
    if (internalRef.current && !isFloating) {
      setPlaceholderSize({
        width: internalRef.current.offsetWidth,
        height: internalRef.current.offsetHeight
      })
    }

    const newCoords = calculateSafeRandomPosition(cursorX, cursorY)
    setIsFloating(true)
    setPosition(newCoords)
    setIsEscaping(true)
    setPhraseIndex(prev => (prev + 1) % PLAYFUL_PHRASES.length)

    if (escapeTimeoutRef.current) {
      window.clearTimeout(escapeTimeoutRef.current)
    }
    escapeTimeoutRef.current = window.setTimeout(() => {
      setIsEscaping(false)
    }, 250)
  }, [calculateSafeRandomPosition, isFloating])

  // Desktop: Global mousemove listener detects cursor approaching the button
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!internalRef.current) return
      const rect = internalRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY)
      const proximityThreshold = 95 // Escapes as cursor approaches so user can chase it

      if (distance < proximityThreshold) {
        relocate(e.clientX, e.clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [relocate])

  // Mobile: Global touchmove listener so moving fingers near it also cause escape
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!internalRef.current || e.touches.length === 0) return
      const touch = e.touches[0]
      const rect = internalRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const distance = Math.hypot(touch.clientX - centerX, touch.clientY - centerY)
      const proximityThreshold = 80

      if (distance < proximityThreshold) {
        relocate(touch.clientX, touch.clientY)
      }
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [relocate])

  // Re-clamp position if window is resized so button is never caught offscreen
  useEffect(() => {
    const handleResize = () => {
      if (!isFloating) return
      const margin = 20
      const btn = internalRef.current
      const width = btn ? Math.max(btn.offsetWidth, 140) : 140
      const height = btn ? Math.max(btn.offsetHeight, 48) : 48
      const maxX = Math.max(margin, window.innerWidth - margin - width)
      const maxY = Math.max(margin, window.innerHeight - margin - height)

      setPosition(prev => ({
        x: Math.max(margin, Math.min(prev.x, maxX)),
        y: Math.max(margin, Math.min(prev.y, maxY))
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isFloating])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (escapeTimeoutRef.current) {
        window.clearTimeout(escapeTimeoutRef.current)
      }
    }
  }, [])

  // Direct handlers for hover, touch, pointer and click attempts
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    relocate(e.clientX, e.clientY)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    relocate(e.clientX, e.clientY)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const touch = e.touches[0]
    relocate(touch ? touch.clientX : undefined, touch ? touch.clientY : undefined)
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    relocate(e.clientX, e.clientY)
    onClick?.(e)
  }

  const buttonStyle: React.CSSProperties = isFloating
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999, // Always above card backgrounds and other elements
        opacity: 1, // Must NEVER disappear or become translucent
        visibility: 'visible',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '140px',
        padding: '0.875rem 1.75rem',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.96)',
        color: '#ff6b8a',
        border: '2px solid #ff6b8a',
        fontWeight: '600',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: '0 8px 28px rgba(255, 107, 138, 0.3)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'left 0.25s cubic-bezier(0.15, 0.85, 0.35, 1.2), top 0.25s cubic-bezier(0.15, 0.85, 0.35, 1.2)',
        ...customStyle
      }
    : {
        position: 'relative',
        opacity: 1,
        visibility: 'visible',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '140px',
        padding: '0.875rem 1.75rem',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.7)',
        color: '#ff6b8a',
        border: '2px solid #ff6b8a',
        fontWeight: '600',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(255, 107, 138, 0.15)',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'transform 0.2s ease, background 0.2s ease',
        ...customStyle
      }

  const buttonElement = (
    <button
      ref={internalRef}
      type="button"
      className={`button no-btn ${className} ${isEscaping ? 'no-button-escaping' : ''}`.trim()}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onPointerDown={handlePointerDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      aria-label="No button that playfully evades when chased"
      {...props}
    >
      {PLAYFUL_PHRASES[phraseIndex]}
    </button>
  )

  // When floating, render via React Portal to document.body so no parent CSS
  // (transform, filter, overflow) can ever distort its fixed viewport coordinates.
  // Leave an invisible placeholder in the original layout so the YES button doesn't jump.
  if (isFloating && typeof document !== 'undefined') {
    return (
      <>
        <div
          style={{
            width: `${placeholderSize.width}px`,
            height: `${placeholderSize.height}px`,
            minWidth: '140px',
            visibility: 'hidden',
            pointerEvents: 'none'
          }}
          aria-hidden="true"
        />
        {createPortal(buttonElement, document.body)}
      </>
    )
  }

  return buttonElement
})

EvasiveNoButton.displayName = 'EvasiveNoButton'

export default EvasiveNoButton
