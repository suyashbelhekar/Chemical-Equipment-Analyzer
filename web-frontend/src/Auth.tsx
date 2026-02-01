import React, { useState } from 'react'
import { EnvelopeIcon, LockClosedIcon, UserIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface AuthProps {
  onAuthenticate: (email: string) => void
}

export default function Auth({ onAuthenticate }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLightOn, setIsLightOn] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (isSignUp) {
      if (!name) {
        setError('Name is required')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return
      }
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Store auth info in localStorage
      const authData = {
        email,
        name: isSignUp ? name : email.split('@')[0],
        timestamp: Date.now()
      }
      localStorage.setItem('chemicalAuth', JSON.stringify(authData))

      // Light on animation before authentication
      setIsLightOn(true)
      setTimeout(() => {
        onAuthenticate(email)
      }, 500)
    } catch (err) {
      setError('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
  }

  return (
    <div className="auth-container">
      {/* Animated Background with Light Effect */}
      <div className={`light-bulb ${isLightOn ? 'on' : 'off'}`}></div>
      
      <div className={`auth-gradient ${isLightOn ? 'light-on' : 'light-off'}`}></div>

      {/* Main Auth Card */}
      <div className="auth-card">
        {/* Light Toggle Button */}
        <button
          type="button"
          onClick={() => setIsLightOn(!isLightOn)}
          className="light-toggle"
          title={isLightOn ? 'Turn off light' : 'Turn on light'}
        >
          <div className={`light-icon ${isLightOn ? 'on' : 'off'}`}>
            {isLightOn ? '💡' : '🌙'}
          </div>
        </button>

        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">
            Chemical Equipment Visualizer
          </h1>
          <p className="auth-subtitle">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="auth-error">
            <ExclamationCircleIcon className="error-icon" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name Field (Sign Up Only) */}
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-wrapper">
                <UserIcon className="input-icon" />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <EnvelopeIcon className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <LockClosedIcon className="input-icon" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Confirm Password Field (Sign Up Only) */}
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <LockClosedIcon className="input-icon" />
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`submit-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="auth-toggle">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              onClick={toggleMode}
              className="toggle-button"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div className="auth-demo">
          <p className="demo-text">Demo Mode: Use any email/password</p>
        </div>
      </div>
    </div>
  )
}
