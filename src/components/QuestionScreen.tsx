import React, { useRef, useState, useEffect } from 'react'
import YesButton from './YesButton'
import EvasiveNoButton from './EvasiveNoButton'

interface QuestionScreenProps {
  onYes: () => void
  onReplay?: () => void
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ onYes }) => {
  const [typingIndex, setTypingIndex] = useState(0)
  const [showButtons, setShowButtons] = useState(false)
  const yesButtonRef = useRef<HTMLButtonElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)

  const questionText = 'Will you go on a date with me? ❤️'

  // Typing animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingIndex(prev => {
        if (prev >= questionText.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 75)

    return () => clearInterval(interval)
  }, [questionText.length])

  // When typing animation finishes, reveal the buttons
  useEffect(() => {
    if (typingIndex >= questionText.length) {
      setShowButtons(true)
    }
  }, [typingIndex, questionText.length])

  const handleYesClick = () => {
    onYes()
  }

  return (
    <div
      className="question-container"
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        textAlign: 'center'
      }}
    >
      <div
        className="question-card"
        style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem 2rem',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(255, 107, 138, 0.15)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
      >
        <div
          className="question-text"
          style={{
            fontSize: '2rem',
            fontWeight: '600',
            color: '#ff6b8a',
            marginBottom: '2rem',
            minHeight: '3.5em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {questionText.substring(0, typingIndex).split('').map((char, i) => {
            if (char === '❤️') {
              return (
                <span key={i} style={{ fontSize: '1.2em', verticalAlign: 'middle', marginLeft: '6px' }}>
                  ❤️
                </span>
              )
            }
            return <span key={i}>{char}</span>
          })}
          {typingIndex < questionText.length && (
            <span
              className="typing-cursor"
              style={{
                display: 'inline-block',
                width: '4px',
                height: '1.2em',
                background: '#ff6b8a',
                marginLeft: '4px',
                animation: 'blink 1s step-end infinite'
              }}
            />
          )}
        </div>

        {showButtons && (
          <div
            className="buttons-container"
            style={{
              marginTop: '2rem',
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              minHeight: '60px'
            }}
          >
            <YesButton
              ref={yesButtonRef}
              onClick={handleYesClick}
            />
            <EvasiveNoButton
              ref={noButtonRef}
              yesButtonRef={yesButtonRef}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default QuestionScreen
