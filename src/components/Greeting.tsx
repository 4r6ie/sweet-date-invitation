import React, { useEffect } from 'react'

interface GreetingProps {
  onContinue: () => void
}

const Greeting: React.FC<GreetingProps> = ({ onContinue }) => {
  // Automatically transition after 4 seconds if not clicked manually
  useEffect(() => {
    const timeout = setTimeout(() => {
      onContinue()
    }, 4000)

    return () => clearTimeout(timeout)
  }, [onContinue])

  return (
    <div
      className="greeting-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fff0f5'
      }}
    >
      <h1
        className="greeting-title"
        style={{
          fontSize: '3rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #ff6b8a, #ffa3b5)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}
      >
        To My Favorite Person ❤️
      </h1>
      <p
        className="greeting-subtitle"
        style={{
          fontSize: '1.25rem',
          color: '#666666',
          marginBottom: '2rem'
        }}
      >
        Let us start our own love story
      </p>
      <button
        type="button"
        className="button greeting-btn"
        style={{
          marginTop: '2rem',
          padding: '1rem 2.5rem',
          background: 'linear-gradient(135deg, #ff6b8a, #ffa3b5)',
          color: 'white',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(255, 107, 138, 0.3)',
          transition: 'all 0.2s ease'
        }}
        onClick={onContinue}
      >
        Start the Journey ✨
      </button>
    </div>
  )
}

export default Greeting
