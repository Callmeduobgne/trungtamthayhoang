'use client'

import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const requestOTP = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:5001/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      if (response.ok) {
        setStep(2)
        alert('OTP sent to console (check terminal)')
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:5001/auth/forgot-password/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      })
      if (response.ok) {
        setStep(3)
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:5001/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newPassword })
      })
      if (response.ok) {
        alert('Password reset successful!')
        window.location.href = '/login'
      } else {
        const data = await response.json()
        setError(data.message)
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg border border-yellow-400 p-6">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Đặt lại mật khẩu</h2>

        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded"
            />
            <button onClick={requestOTP} disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded">
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded"
            />
            <button onClick={verifyOTP} disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded">
              {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded"
            />
            <button onClick={resetPassword} disabled={loading} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded">
              {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
            </button>
          </div>
        )}

        {error && <div className="text-red-400 text-sm mt-2">{error}</div>}

        <div className="mt-4 text-center">
          <a href="/login" className="text-yellow-400 hover:text-yellow-300">Quay lại đăng nhập</a>
        </div>
      </div>
    </div>
  )
}
