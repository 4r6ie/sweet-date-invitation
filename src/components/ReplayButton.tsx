import React from 'react'

interface ReplayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onReplay: () => void
}

const ReplayButton: React.FC<ReplayButtonProps> = ({
  onReplay,
  style,
  className = '',
  children,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onReplay()
  }

  const defaultStyle: React.CSSProperties = {
    marginTop: '1.5rem',
    padding: '0.95rem 2.25rem',
    background: 'linear-gradient(135deg, var(--pink-accent, #ff6b8a), var(--pink-medium, #ffa3b5))',
    color: 'white',
    borderRadius: '14px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 8px 25px rgba(255, 107, 138, 0.35)'
  }

  return (
    <button
      type="button"
      className={`button replay-btn ${className}`.trim()}
      style={{ ...defaultStyle, ...style }}
      onClick={handleClick}
      aria-label="Replay the romantic invitation"
      {...props}
    >
      {children || 'Plan Another Date 💕'}
    </button>
  )
}

export default ReplayButton
