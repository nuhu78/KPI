import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, getErrorMessage } from '../api/client'
import '../styles/auth.css'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleVerify = (event) => {
    event.preventDefault()
    setError('')
    if (!code.trim()) {
      setError('Enter your employee code')
      return
    }
    setStep(2)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/employee/register', {
        employee_code: code,
        password,
      })
      navigate('/login', { state: { tab: 'employee', code } })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <form
        className="auth-card"
        onSubmit={step === 1 ? handleVerify : handleSubmit}
      >
        <h1 className="auth-title">Register</h1>
        {step === 1 ? (
          <>
            <label className="auth-label">
              Employee code
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                autoFocus
                autoComplete="off"
              />
            </label>
            <button className="auth-submit" type="submit">
              Verify
            </button>
          </>
        ) : (
          <>
            <p className="auth-verified">
              Verified employee code: <strong>{code}</strong>
            </p>
            <label className="auth-label">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <label className="auth-label">
              Confirm password
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>
            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
            <button
              type="button"
              className="auth-link"
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </>
        )}
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <p className="auth-alt">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  )
}
