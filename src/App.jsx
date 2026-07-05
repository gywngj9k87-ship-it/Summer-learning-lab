import React, { useState } from 'react'
import { useApp } from './context/AppContext.jsx'
import Login from './components/Login.jsx'
import Home from './components/Home.jsx'
import ActivityRunner from './components/ActivityRunner.jsx'
import FridayTest from './components/FridayTest.jsx'
import ParentDashboard from './components/ParentDashboard.jsx'

export default function App() {
  const { loading, profile } = useApp()
  const [view, setView] = useState({ name: 'home' })

  if (loading) {
    return (
      <div className="splash">
        <div className="logo big">☀️📚</div>
        <p>Loading Summer Learning Lab…</p>
      </div>
    )
  }

  if (!profile) return <Login />

  const goHome = () => setView({ name: 'home' })

  return (
    <div className="app">
      {view.name === 'home' && (
        <Home
          onOpenActivity={(topicId) => setView({ name: 'activity', topicId })}
          onOpenTest={() => setView({ name: 'test' })}
          onOpenParent={() => setView({ name: 'parent' })}
        />
      )}
      {view.name === 'activity' && (
        <ActivityRunner key={view.topicId} topicId={view.topicId} onDone={goHome} />
      )}
      {view.name === 'test' && <FridayTest onDone={goHome} />}
      {view.name === 'parent' && <ParentDashboard onBack={goHome} />}
    </div>
  )
}
