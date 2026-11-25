import React, { useState } from 'react'

interface FoodSelectionProps {
  onContinue: (food: string) => void
}

interface FoodOption {
  id: string
  title: string
  subtitle: string
  badge: string
  illustration: React.ReactNode
}

const FoodSelection: React.FC<FoodSelectionProps> = ({ onContinue }) => {
  const [selectedFood, setSelectedFood] = useState<string | null>(null)

  const FOOD_OPTIONS: FoodOption[] = [
    {
      id: 'MILKTEA 🧋',
      title: 'MILKTEA 🧋',
      subtitle: 'Sweet brown sugar boba & pearls',
      badge: 'Classic Favorite',
      illustration: (
        <svg viewBox="0 0 120 120" width="80" height="80" style={{ filter: 'drop-shadow(0 4px 8px rgba(255,107,138,0.2))' }}>
          {/* Straw */}
          <line x1="68" y1="10" x2="52" y2="90" stroke="#ff477e" strokeWidth="8" strokeLinecap="round" />
          {/* Cup */}
          <path d="M35 38 L42 105 A6 6 0 0 0 48 110 L72 110 A6 6 0 0 0 78 105 L85 38 Z" fill="#fff5eb" stroke="#ff6b8a" strokeWidth="3" />
          {/* Liquid */}
          <path d="M37 46 L42 103 A5 5 0 0 0 47 107 L73 107 A5 5 0 0 0 78 103 L83 46 Z" fill="#f2c49b" opacity="0.9" />
          {/* Milk swirl top */}
          <path d="M37 46 Q60 52 83 46 L84 56 Q60 62 36 56 Z" fill="#fff" opacity="0.7" />
          {/* Boba pearls */}
          <circle cx="50" cy="98" r="4.5" fill="#4a2e18" />
          <circle cx="62" cy="100" r="4.5" fill="#4a2e18" />
          <circle cx="71" cy="96" r="4.5" fill="#4a2e18" />
          <circle cx="56" cy="90" r="4" fill="#4a2e18" />
          <circle cx="66" cy="88" r="4" fill="#4a2e18" />
          <circle cx="48" cy="85" r="3.5" fill="#4a2e18" />
          {/* Cup Lid */}
          <ellipse cx="60" cy="38" rx="27" ry="6" fill="#fff" stroke="#ff6b8a" strokeWidth="3" />
          <path d="M42 38 Q60 22 78 38 Z" fill="rgba(255,255,255,0.7)" stroke="#ff6b8a" strokeWidth="2.5" />
          {/* Heart on cup */}
          <path d="M60 70 C60 65, 53 62, 53 67 C53 71, 60 76, 60 77 C60 76, 67 71, 67 67 C67 62, 60 65, 60 70 Z" fill="#ff477e" />
        </svg>
      )
    },
    {
      id: 'BURGER 🍔',
      title: 'BURGER 🍔',
      subtitle: 'Juicy, cheesy & freshly grilled treat',
      badge: 'Savory & Delicious',
      illustration: (
        <svg viewBox="0 0 120 120" width="80" height="80" style={{ filter: 'drop-shadow(0 4px 8px rgba(255,163,181,0.25))' }}>
          {/* Top Bun */}
          <path d="M25 50 Q60 18 95 50 Z" fill="#e69a47" stroke="#b86d26" strokeWidth="3" />
          {/* Sesame seeds */}
          <ellipse cx="45" cy="38" rx="2" ry="3.5" transform="rotate(-15 45 38)" fill="#fff" />
          <ellipse cx="60" cy="32" rx="2" ry="3.5" fill="#fff" />
          <ellipse cx="75" cy="38" rx="2" ry="3.5" transform="rotate(20 75 38)" fill="#fff" />
          <ellipse cx="55" cy="42" rx="2" ry="3" fill="#fff" />
          <ellipse cx="68" cy="43" rx="2" ry="3" fill="#fff" />
          {/* Lettuce */}
          <path d="M22 52 Q30 57 40 52 Q50 58 60 52 Q70 58 80 52 Q90 58 98 52" stroke="#5cb85c" strokeWidth="6" strokeLinecap="round" fill="none" />
          {/* Tomato */}
          <rect x="25" y="58" width="70" height="7" rx="3.5" fill="#e74c3c" />
          {/* Cheese */}
          <polygon points="26,67 94,67 85,78 60,72 40,78" fill="#f1c40f" />
          {/* Patty */}
          <rect x="23" y="70" width="74" height="12" rx="6" fill="#6d4224" stroke="#4a2c16" strokeWidth="2.5" />
          {/* Bottom Bun */}
          <rect x="26" y="84" width="68" height="15" rx="7.5" fill="#e69a47" stroke="#b86d26" strokeWidth="3" />
        </svg>
      )
    },
    {
      id: 'AKO NALANG? HAHAHA ❤️',
      title: 'AKO NALANG? HAHAHA ❤️',
      subtitle: '100% free, unlimited love & cuddles 🥰',
      badge: 'Best Choice Ever ✨',
      illustration: (
        <svg viewBox="0 0 120 120" width="80" height="80" style={{ filter: 'drop-shadow(0 6px 12px rgba(255,71,126,0.35))' }}>
          {/* Big Kawaii Heart */}
          <path
            d="M60 102 C30 75, 14 55, 14 36 C14 20, 26 10, 42 10 C52 10, 58 16, 60 20 C62 16, 68 10, 78 10 C94 10, 106 20, 106 36 C106 55, 90 75, 60 102 Z"
            fill="url(#heartGrad)"
            stroke="#ff2e63"
            strokeWidth="3"
          />
          <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff758c" />
              <stop offset="100%" stopColor="#ff477e" />
            </linearGradient>
          </defs>
          {/* Happy Eyes */}
          <path d="M40 38 Q46 32 52 38" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <path d="M68 38 Q74 32 80 38" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {/* Blushing cheeks */}
          <ellipse cx="36" cy="46" rx="6" ry="3.5" fill="#ffb6c1" opacity="0.8" />
          <ellipse cx="84" cy="46" rx="6" ry="3.5" fill="#ffb6c1" opacity="0.8" />
          {/* Sweet smiling mouth */}
          <path d="M54 48 Q60 56 66 48" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Sparkle stars */}
          <path d="M96 16 L98 22 L104 24 L98 26 L96 32 L94 26 L88 24 L94 22 Z" fill="#ffd700" />
          <path d="M22 65 L23 68 L26 69 L23 70 L22 73 L21 70 L18 69 L21 68 Z" fill="#ffd700" />
        </svg>
      )
    }
  ]

  const handleContinue = () => {
    if (!selectedFood) return
    onContinue(selectedFood)
  }

  return (
    <div
      className="food-container"
      style={{
        maxWidth: '680px',
        margin: '0 auto',
        padding: '2rem 1.25rem',
        textAlign: 'center',
        animation: 'fadeInUp 0.5s ease forwards'
      }}
    >
      <div
        className="question-card"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '2.5rem 1.75rem',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 12px 40px rgba(255, 107, 138, 0.18)'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            background: 'rgba(255, 107, 138, 0.12)',
            color: '#ff6b8a',
            borderRadius: '999px',
            fontSize: '0.9rem',
            fontWeight: '600',
            marginBottom: '1rem',
            letterSpacing: '0.04em'
          }}
        >
          STEP 3 OF 3 🍽️
        </span>

        <h2
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.3rem)',
            fontWeight: '700',
            color: '#ff6b8a',
            marginBottom: '0.5rem',
            fontFamily: "'Playfair Display', serif"
          }}
        >
          What would you like to eat? 🍔
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            color: '#666',
            marginBottom: '2rem'
          }}
        >
          Choose our delicious date treat (choose wisely! 😉)
        </p>

        {/* Food Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.25rem'
          }}
        >
          {FOOD_OPTIONS.map(opt => {
            const isSelected = selectedFood === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedFood(opt.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '1.5rem 1rem',
                  borderRadius: '20px',
                  background: isSelected
                    ? 'linear-gradient(145deg, rgba(255, 240, 245, 0.95), rgba(255, 225, 235, 0.95))'
                    : 'rgba(255, 255, 255, 0.75)',
                  border: isSelected ? '2.5px solid #ff477e' : '2px solid rgba(255, 163, 181, 0.3)',
                  transform: isSelected ? 'translateY(-4px) scale(1.03)' : 'scale(1)',
                  boxShadow: isSelected
                    ? '0 12px 30px rgba(255, 71, 126, 0.28)'
                    : '0 4px 15px rgba(0, 0, 0, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  position: 'relative',
                  outline: 'none',
                  textAlign: 'center'
                }}
              >
                {/* Badge */}
                <span
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: isSelected
                      ? 'linear-gradient(135deg, #ff477e, #ff6b8a)'
                      : 'rgba(255, 107, 138, 0.15)',
                    color: isSelected ? '#fff' : '#ff477e',
                    boxShadow: isSelected ? '0 2px 8px rgba(255, 71, 126, 0.35)' : 'none',
                    letterSpacing: '0.02em'
                  }}
                >
                  {opt.badge}
                </span>

                <div style={{ margin: '0.75rem 0 0.5rem' }}>{opt.illustration}</div>

                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    color: isSelected ? '#ff2e63' : '#333',
                    marginBottom: '0.35rem',
                    lineHeight: 1.3
                  }}
                >
                  {opt.title}
                </span>

                <span
                  style={{
                    fontSize: '0.82rem',
                    color: isSelected ? '#666' : '#888',
                    lineHeight: 1.4
                  }}
                >
                  {opt.subtitle}
                </span>

                {/* Selection Checkmark */}
                <div
                  style={{
                    marginTop: '0.75rem',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: isSelected ? 'none' : '2px solid rgba(255, 163, 181, 0.6)',
                    background: isSelected ? '#ff477e' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isSelected && '✓'}
                </div>
              </button>
            )
          })}
        </div>

        {/* Continue Button */}
        <button
          type="button"
          disabled={!selectedFood}
          onClick={handleContinue}
          style={{
            width: '100%',
            maxWidth: '340px',
            padding: '1.05rem 2rem',
            borderRadius: '14px',
            background: selectedFood
              ? 'linear-gradient(135deg, #ff477e, #ff85a1)'
              : 'linear-gradient(135deg, #cccccc, #dddddd)',
            color: 'white',
            fontSize: '1.15rem',
            fontWeight: '600',
            border: 'none',
            cursor: selectedFood ? 'pointer' : 'not-allowed',
            opacity: selectedFood ? 1 : 0.65,
            boxShadow: selectedFood ? '0 8px 25px rgba(255, 71, 126, 0.38)' : 'none',
            transition: 'all 0.25s ease'
          }}
        >
          {selectedFood ? 'Finalize Our Date 💖' : 'Select a food option to continue 🍔'}
        </button>
      </div>
    </div>
  )
}

export default FoodSelection
