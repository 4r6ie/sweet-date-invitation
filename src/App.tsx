import React, { useState } from 'react'
import Greeting from './components/Greeting'
import QuestionScreen from './components/QuestionScreen'
import TimeSelection from './components/TimeSelection'
import FoodSelection from './components/FoodSelection'
import Celebration from './components/Celebration'
import MusicToggle from './components/MusicToggle'

export type AppScreen = 'greeting' | 'question' | 'time' | 'food' | 'celebration'

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('greeting')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedFood, setSelectedFood] = useState<string>('')
  const [replayCount, setReplayCount] = useState(0)

  // Advance from greeting to Step 1 (Question)
  const handleGreetingContinue = () => {
    setScreen('question')
  }

  // Step 1: When YES is clicked, advance to Step 2 (Time Selection)
  const handleYesClick = () => {
    setScreen('time')
  }

  // Step 2: When time is chosen, advance to Step 3 (Food Selection)
  const handleTimeSelected = (time: string) => {
    setSelectedTime(time)
    setScreen('food')
  }

  // Step 3: When food is chosen, advance to Step 4 (Celebration)
  const handleFoodSelected = (food: string) => {
    setSelectedFood(food)
    setScreen('celebration')
  }

  // Step 4: Replay button restarts the invitation from Step 1
  const handleReplay = () => {
    setSelectedTime('')
    setSelectedFood('')
    setReplayCount(prev => prev + 1)
    setScreen('question')
  }

  return (
    <div
      className="app-container"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff0f5 0%, #fdfaf5 100%)',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflowX: 'hidden',
        color: '#333'
      }}
    >
      {/* Step 0: Warm Greeting Screen */}
      {screen === 'greeting' && <Greeting onContinue={handleGreetingContinue} />}

      {/* Step 1: Original Date Question ("Will you go on a date with me? ❤️") */}
      {screen === 'question' && (
        <QuestionScreen
          key={`question-${replayCount}`}
          onYes={handleYesClick}
          onReplay={handleReplay}
        />
      )}

      {/* Step 2: Time Selection ("What time should we go? ⏰") */}
      {screen === 'time' && (
        <TimeSelection onContinue={handleTimeSelected} />
      )}

      {/* Step 3: Food Selection ("What would you like to eat? 🍔") */}
      {screen === 'food' && (
        <FoodSelection onContinue={handleFoodSelected} />
      )}

      {/* Step 4: Final Romantic Greeting & Date Summary */}
      {screen === 'celebration' && (
        <Celebration
          onReplay={handleReplay}
          replayCount={replayCount}
          selectedTime={selectedTime}
          selectedFood={selectedFood}
        />
      )}

      {/* Ambient Romantic Music Toggle (Default OFF) */}
      <MusicToggle />
    </div>
  )
}

export default App
