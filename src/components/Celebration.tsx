import React, { useRef, useState, useEffect } from 'react'
import ReplayButton from './ReplayButton'

interface CelebrationProps {
  onReplay: () => void
  replayCount: number
  selectedTime?: string
  selectedFood?: string
}

interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  vRot: number
  size: number
  color: string
  shape: 'circle' | 'rect' | 'heart'
}

const WHATSAPP_RECIPIENT = '639928636148'

const Celebration: React.FC<CelebrationProps> = ({
  onReplay,
  replayCount,
  selectedTime = '10:00 AM',
  selectedFood = 'MILKTEA 🧋'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [confettiActive, setConfettiActive] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  // Construct official WhatsApp click-to-chat URL
  const whatsappMessage = `Hi love! ❤️ I'm confirming our date!\n\n⏰ Preferred Time: ${selectedTime}\n🍔 Food Choice: ${selectedFood}\n\nSee you soon! I love you! 🥰❤️`
  const whatsappUrl = `https://wa.me/${WHATSAPP_RECIPIENT}?text=${encodeURIComponent(whatsappMessage)}`

  // Trigger celebration effects on mount
  useEffect(() => {
    setConfettiActive(true)
    const messageTimer = window.setTimeout(() => {
      setShowMessage(true)
    }, 400)

    const confettiTimer = window.setTimeout(() => {
      setConfettiActive(false)
    }, 8000)

    return () => {
      window.clearTimeout(messageTimer)
      window.clearTimeout(confettiTimer)
    }
  }, [replayCount])

  // Canvas confetti particle animation (pink & gold)
  useEffect(() => {
    if (!confettiActive) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const colors = ['#ff6b8a', '#ffa3b5', '#ffd1dc', '#ff477e', '#ff85a1', '#ffd700', '#fbc531']
    const shapes: ('circle' | 'rect' | 'heart')[] = ['circle', 'rect', 'heart']

    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)

    const particles: ConfettiParticle[] = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.4) - 50,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 4.5,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.12,
      size: 8 + Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.vRot

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'heart') {
          ctx.beginPath()
          const topCurveHeight = p.size * 0.3
          ctx.moveTo(0, topCurveHeight)
          ctx.bezierCurveTo(0, 0, -p.size / 2, 0, -p.size / 2, topCurveHeight)
          ctx.bezierCurveTo(-p.size / 2, (p.size + topCurveHeight) / 2, 0, (p.size + topCurveHeight) / 1.4, 0, p.size)
          ctx.bezierCurveTo(0, (p.size + topCurveHeight) / 1.4, p.size / 2, (p.size + topCurveHeight) / 2, p.size / 2, topCurveHeight)
          ctx.bezierCurveTo(p.size / 2, 0, 0, 0, 0, topCurveHeight)
          ctx.fill()
        }

        ctx.restore()

        if (p.y > height + 20) {
          p.y = -20
          p.x = Math.random() * width
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [confettiActive])

  return (
    <div
      className="celebration-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #fff0f5 0%, #fdfaf5 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '2rem 1.25rem',
        overflowY: 'auto'
      }}
    >
      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="confetti-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: confettiActive ? 'block' : 'none',
          pointerEvents: 'none',
          zIndex: 999
        }}
      />

      {/* Floating hearts background overlay */}
      <div
        className="floating-hearts"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        {Array.from({ length: 18 }).map((_, i) => {
          const delay = i * 0.35
          const duration = 6 + (i % 4) * 1.5
          const size = 20 + (i % 5) * 6
          const left = (i * 5.8) % 100
          const opacity = 0.4 + (i % 3) * 0.2
          const color = i % 2 === 0 ? '#ff6b8a' : '#ffd1dc'

          return (
            <div
              key={i}
              className="heart-icon"
              style={{
                position: 'absolute',
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                background: color,
                clipPath:
                  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                animation: `float-heart ${duration}s ease-in-out infinite ${delay}s`,
                opacity
              }}
            />
          )
        })}
      </div>

      {showMessage && (
        <div
          style={{
            textAlign: 'center',
            zIndex: 10,
            maxWidth: '620px',
            animation: 'fadeInUp 0.6s ease forwards',
            margin: 'auto',
            paddingBottom: '2rem'
          }}
        >
          {/* Main Romantic Greetings */}
          <h2
            className="celebration-message"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              fontWeight: '700',
              color: '#ff477e',
              marginBottom: '0.75rem',
              textShadow: '0 2px 10px rgba(255, 71, 126, 0.3)',
              fontFamily: "'Playfair Display', serif"
            }}
          >
            SEE YOU SOON, LOVE! ❤️
          </h2>

          <h3
            style={{
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: '700',
              color: '#ff6b8a',
              marginBottom: '0.75rem'
            }}
          >
            I LOVE YOU! 🥰
          </h3>

          <p
            className="celebration-subtitle"
            style={{
              fontSize: '1.25rem',
              color: '#555',
              marginBottom: '1.75rem',
              lineHeight: 1.5,
              fontWeight: '500'
            }}
          >
            Can't wait to spend time with you. Hehehe! 💗
          </p>

          {/* Cute Date Summary Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '1.5rem 2rem',
              margin: '0 auto 1.5rem',
              maxWidth: '440px',
              border: '2px dashed #ffa3b5',
              boxShadow: '0 12px 35px rgba(255, 107, 138, 0.2)',
              textAlign: 'left',
              animation: 'fadeInUp 0.7s ease forwards'
            }}
          >
            <div
              style={{
                textAlign: 'center',
                fontWeight: '700',
                color: '#ff477e',
                fontSize: '1rem',
                marginBottom: '1.1rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              💌 Our Date Summary 💌
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem',
                background: 'rgba(255, 240, 245, 0.75)',
                padding: '0.75rem 1rem',
                borderRadius: '14px'
              }}
            >
              <span style={{ fontSize: '1.75rem', marginRight: '0.9rem' }}>⏰</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>
                  Time
                </div>
                <div style={{ fontSize: '1.15rem', color: '#333', fontWeight: '700' }}>
                  {selectedTime}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 240, 245, 0.75)',
                padding: '0.75rem 1rem',
                borderRadius: '14px'
              }}
            >
              <span style={{ fontSize: '1.75rem', marginRight: '0.9rem' }}>🍽️</span>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: '700' }}>
                  Food
                </div>
                <div style={{ fontSize: '1.15rem', color: '#ff477e', fontWeight: '700' }}>
                  {selectedFood}
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Date Confirmation Action */}
          <div style={{ margin: '1.5rem auto 1rem', maxWidth: '400px' }}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button whatsapp-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '1.1rem 2rem',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                color: '#ffffff',
                fontSize: '1.2rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 8px 25px rgba(37, 211, 102, 0.4)',
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              {/* WhatsApp SVG Icon */}
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-10.416c-4.298 0-7.79 3.493-7.79 7.79 0 1.373.357 2.664.98 3.787l-1.042 3.809 3.905-1.024c1.085.592 2.327.928 3.647.928 4.298 0 7.79-3.493 7.79-7.79s-3.492-7.79-7.79-7.79zm0 17.58c-1.233 0-2.392-.352-3.376-.96l-.242-.148-2.51.658.67-2.446-.162-.258c-.675-1.074-1.032-2.327-1.032-3.636 0-3.666 2.984-6.65 6.652-6.65 3.667 0 6.65 2.984 6.65 6.65 0 3.668-2.983 6.652-6.65 6.652z" />
              </svg>
              <span>Confirm Our Date ❤️</span>
            </a>
            <div
              style={{
                fontSize: '0.85rem',
                color: '#666',
                marginTop: '0.6rem',
                lineHeight: 1.4
              }}
            >
              💬 Opens WhatsApp with your selections ready — tap <strong>Send</strong> to confirm!
            </div>
          </div>

          <ReplayButton onReplay={onReplay} />
        </div>
      )}
    </div>
  )
}

export default Celebration
