import React, { useState } from 'react'

interface TimeSelectionProps {
  onContinue: (time: string) => void
}

interface TimeOption {
  id: string
  label: string
  sublabel: string
  icon: string
}

const TIME_OPTIONS: TimeOption[] = [
  { id: '10:00 AM', label: '10:00 AM', sublabel: 'Morning Sunshine ☀️', icon: '🌅' },
  { id: '2:00 PM', label: '2:00 PM', sublabel: 'Afternoon Date ☕', icon: '🌤️' },
  { id: '5:00 PM', label: '5:00 PM', sublabel: 'Golden Hour / Sunset 🌇', icon: '🌇' },
  { id: '7:00 PM', label: '7:00 PM', sublabel: 'Romantic Dinner 🌙', icon: '✨' },
  { id: 'Other', label: 'Other', sublabel: 'Pick our special time ✍️', icon: '⏰' }
]

const TimeSelection: React.FC<TimeSelectionProps> = ({ onContinue }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [customTime, setCustomTime] = useState('')

  const isOther = selectedOption === 'Other'
  const isValid = isOther ? customTime.trim().length > 0 : selectedOption !== null
  const effectiveTime = isOther ? customTime.trim() : (selectedOption || '')

  const handleSelect = (optionId: string) => {
    setSelectedOption(optionId)
  }

  const handleContinue = () => {
    if (!isValid) return
    onContinue(effectiveTime)
  }

  return (
    <div
      className="time-container"
      style={{
        maxWidth: '620px',
        margin: '0 auto',
        padding: '2rem 1.25rem',
        textAlign: 'center',
        animation: 'fadeInUp 0.5s ease forwards'
      }}
    >
      <div
        className="question-card"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
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
          STEP 2 OF 3 💕
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
          What time should we go? ⏰
        </h2>

        <p
          style={{
            fontSize: '1.05rem',
            color: '#666',
            marginBottom: '2rem'
          }}
        >
          Pick the perfect moment for our special date
        </p>

        {/* Time Options Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem'
          }}
        >
          {TIME_OPTIONS.map(opt => {
            const isSelected = selectedOption === opt.id
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.25rem 0.75rem',
                  borderRadius: '16px',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(255, 107, 138, 0.18), rgba(255, 163, 181, 0.28))'
                    : 'rgba(255, 255, 255, 0.75)',
                  border: isSelected ? '2px solid #ff6b8a' : '2px solid rgba(255, 163, 181, 0.25)',
                  transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  boxShadow: isSelected
                    ? '0 8px 24px rgba(255, 107, 138, 0.25)'
                    : '0 2px 10px rgba(0, 0, 0, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  outline: 'none'
                }}
              >
                <span style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{opt.icon}</span>
                <span
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: '700',
                    color: isSelected ? '#ff477e' : '#333',
                    marginBottom: '0.2rem'
                  }}
                >
                  {opt.label}
                </span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: isSelected ? '#ff6b8a' : '#888'
                  }}
                >
                  {opt.sublabel}
                </span>
              </button>
            )
          })}
        </div>

        {/* Custom Time Input if "Other" is chosen */}
        {isOther && (
          <div
            style={{
              marginBottom: '2rem',
              animation: 'fadeInUp 0.3s ease forwards',
              textAlign: 'left'
            }}
          >
            <label
              htmlFor="custom-time-input"
              style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '600',
                color: '#ff6b8a',
                marginBottom: '0.5rem'
              }}
            >
              Enter our preferred time:
            </label>
            <input
              id="custom-time-input"
              type="text"
              value={customTime}
              maxLength={60}
              onChange={e =>
                setCustomTime(e.target.value.replace(/[\u0000-\u001F\u007F]/g, ''))
              }
              placeholder="e.g. 6:30 PM, Midnight Stroll, Sunrise..."
              style={{
                width: '100%',
                padding: '0.9rem 1.25rem',
                borderRadius: '12px',
                border: '2px solid #ff6b8a',
                fontSize: '1.05rem',
                color: '#333',
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 4px 15px rgba(255, 107, 138, 0.12)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              autoFocus
            />
          </div>
        )}

        {/* Continue Button */}
        <button
          type="button"
          disabled={!isValid}
          onClick={handleContinue}
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '1rem 2rem',
            borderRadius: '14px',
            background: isValid
              ? 'linear-gradient(135deg, #ff6b8a, #ffa3b5)'
              : 'linear-gradient(135deg, #cccccc, #dddddd)',
            color: 'white',
            fontSize: '1.15rem',
            fontWeight: '600',
            border: 'none',
            cursor: isValid ? 'pointer' : 'not-allowed',
            opacity: isValid ? 1 : 0.65,
            boxShadow: isValid ? '0 8px 25px rgba(255, 107, 138, 0.35)' : 'none',
            transition: 'all 0.25s ease',
            transform: isValid ? 'translateY(0)' : 'none'
          }}
        >
          {isValid ? 'Continue to Food 💕' : 'Select a time to continue ⏰'}
        </button>
      </div>
    </div>
  )
}

export default TimeSelection
