import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PatternEditor from './components/PatternEditor'

interface HealthResponse {
  service: string;
  status: string;
  mode: string;
  version: string;
}

function App() {
  const [count, setCount] = useState(0)
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [currentView, setCurrentView] = useState<'demo' | 'pattern-editor'>('demo')

  // Test backend connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:8000/')
        const health: HealthResponse = await response.json()
        setBackendHealth(health)
        setConnectionStatus('connected')
      } catch (error) {
        console.error('Backend connection failed:', error)
        setConnectionStatus('error')
      }
    }

    testConnection()
  }, [])

  const getStatusEmoji = () => {
    switch (connectionStatus) {
      case 'connecting': return '🔄'
      case 'connected': return '✅'
      case 'error': return '❌'
    }
  }

  if (currentView === 'pattern-editor') {
    return (
      <div style={{ padding: '20px', minHeight: '100vh' }}>
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setCurrentView('demo')}
            style={{ 
              padding: '8px 16px', 
              marginRight: '10px',
              background: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ← Back to Demo
          </button>
          <span>T101 Phase 1: Core Canvas Foundation</span>
        </div>
        
        <PatternEditor />
      </div>
    )
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      <h1>AnomalyYunsa 🎯</h1>
      
      {/* Backend Connection Status */}
      <div className="card" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>🔗 Full-Stack Connection Test</h3>
        <p>
          {getStatusEmoji()} Backend Status: <strong>{connectionStatus}</strong>
        </p>
        {backendHealth && (
          <div style={{ textAlign: 'left', margin: '10px 0' }}>
            <p>🚀 Service: {backendHealth.service}</p>
            <p>📊 Status: {backendHealth.status}</p>
            <p>🎮 Mode: {backendHealth.mode}</p>
            <p>📦 Version: {backendHealth.version}</p>
          </div>
        )}
      </div>

      {/* Phase 1 Demo Button */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>🎨 T101 Phase 1: Pattern Editor</h3>
        <button 
          onClick={() => setCurrentView('pattern-editor')}
          style={{ 
            padding: '12px 24px', 
            fontSize: '16px',
            background: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Launch Pattern Editor 🚀
        </button>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Core Canvas + Grid System + Basic Brush Tool
        </p>
      </div>

      {/* Original Vite Demo */}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="read-the-docs">
        Sprint 0.5 Foundation ✅ | T101 Phase 1 Started 🎨
      </p>
    </>
  )
}

export default App
