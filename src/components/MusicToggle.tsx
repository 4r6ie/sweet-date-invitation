import React, { useState, useEffect, useRef, useCallback } from 'react'

const AUDIO_PATH = './audio/sweet-love-theme.wav'

const MusicToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.65) // Gentle romantic background volume
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [isAudioReady, setIsAudioReady] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const noticeTimerRef = useRef<number | null>(null)

  const showNotice = useCallback((msg: string) => {
    setNotice(msg)
    if (noticeTimerRef.current) {
      window.clearTimeout(noticeTimerRef.current)
    }
    noticeTimerRef.current = window.setTimeout(() => {
      setNotice(null)
    }, 4000)
  }, [])

  // Initialize single persistent HTML5 Audio element for Sweet Love Theme
  useEffect(() => {
    if (typeof Audio === 'undefined') return

    const audio = new Audio()
    audio.src = AUDIO_PATH
    audio.loop = true
    audio.volume = volume
    audio.preload = 'auto'
    audioRef.current = audio

    const handleCanPlay = () => {
      setIsAudioReady(true)
    }

    const handleError = () => {
      setIsAudioReady(false)
      setIsPlaying(false)
      showNotice('Sweet Love Theme: audio file loading issue. Please refresh! 💕')
    }

    audio.addEventListener('canplaythrough', handleCanPlay)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay)
      audio.removeEventListener('error', handleError)
      audio.pause()
      audio.src = ''
      audioRef.current = null
      if (noticeTimerRef.current) {
        window.clearTimeout(noticeTimerRef.current)
      }
    }
  }, [])

  // Synchronize volume slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Play, Pause, and Resume handling
  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!isAudioReady) {
      showNotice('Loading Sweet Love Theme... Click again in a moment! 💕')
      return
    }

    if (isPlaying) {
      // Pause playback without resetting song position
      audio.pause()
      setIsPlaying(false)
    } else {
      try {
        // Start or resume playback on explicit user interaction
        await audio.play()
        setIsPlaying(true)
        showNotice('Playing: Sweet Love Theme ❤️')
      } catch (err) {
        // Handle browser autoplay policy restrictions
        setIsPlaying(false)
        showNotice('Click again to start Sweet Love Theme! 💕')
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    if (newVol > 0 && !isPlaying && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <div
      className="music-controller-wrapper"
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}
      onMouseEnter={() => setShowVolumeSlider(true)}
      onMouseLeave={() => setShowVolumeSlider(false)}
    >
      {/* Toast Notice */}
      {notice && (
        <div
          style={{
            position: 'absolute',
            top: '3.5rem',
            right: 0,
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            color: '#ff477e',
            padding: '0.65rem 1.1rem',
            borderRadius: '14px',
            boxShadow: '0 8px 30px rgba(255, 107, 138, 0.25)',
            fontSize: '0.82rem',
            fontWeight: '600',
            maxWidth: '280px',
            textAlign: 'right',
            border: '1.5px solid #ffa3b5',
            animation: 'fadeInUp 0.3s ease forwards',
            pointerEvents: 'none',
            lineHeight: 1.4,
            whiteSpace: 'nowrap'
          }}
        >
          {notice}
        </div>
      )}

      {/* Expandable Volume Slider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: showVolumeSlider ? '0.4rem 0.75rem' : '0',
          width: showVolumeSlider ? '110px' : '0',
          opacity: showVolumeSlider ? 1 : 0,
          overflow: 'hidden',
          borderRadius: '999px',
          border: showVolumeSlider ? '1px solid rgba(255, 107, 138, 0.3)' : 'none',
          boxShadow: showVolumeSlider ? '0 4px 15px rgba(255, 107, 138, 0.15)' : 'none',
          transition: 'all 0.25s ease'
        }}
      >
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Sweet Love Theme volume"
          style={{
            width: '100%',
            accentColor: '#ff6b8a',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Main Music Toggle Button */}
      <button
        type="button"
        className="music-toggle"
        style={{
          width: '48px',
          height: '48px',
          background: isPlaying ? 'rgba(255, 240, 245, 0.95)' : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '14px',
          border: isPlaying ? '2px solid #ff6b8a' : '1px solid rgba(255, 107, 138, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isPlaying
            ? '0 6px 20px rgba(255, 107, 138, 0.35)'
            : '0 4px 15px rgba(255, 107, 138, 0.15)',
          fontSize: '1.3rem',
          transition: 'all 0.2s ease',
          outline: 'none',
          userSelect: 'none'
        }}
        onClick={toggleMusic}
        title={isPlaying ? 'Mute "Sweet Love Theme ❤️"' : 'Play "Sweet Love Theme ❤️"'}
        aria-label={isPlaying ? 'Mute Sweet Love Theme' : 'Play Sweet Love Theme'}
      >
        {isPlaying ? '🎵' : '🔇'}
      </button>
    </div>
  )
}

export default MusicToggle
