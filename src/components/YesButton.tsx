import React, { forwardRef } from 'react'

export interface YesButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const YesButton = forwardRef<HTMLButtonElement, YesButtonProps>(({
  onClick,
  style,
  className = '',
  children,
  ...props
}, ref) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClick(e)
  }

  const defaultStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    padding: '1rem 2rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--pink-accent, #ff6b8a), var(--pink-medium, #ffa3b5))',
    color: 'white',
    border: '2px solid transparent',
    cursor: 'pointer',
    minWidth: '140px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 138, 0.3)'
  }

  return (
    <button
      ref={ref}
      type="button"
      className={`button yes-btn ${className}`.trim()}
      style={{ ...defaultStyle, ...style }}
      onClick={handleClick}
      aria-label="Yes, I will go on a date with you"
      {...props}
    >
      {children || 'YES 💗'}
    </button>
  )
})

YesButton.displayName = 'YesButton'

export default YesButton
