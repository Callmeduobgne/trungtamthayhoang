'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    phone: '',
    studentName: '',
    className: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Registration successful!')
        router.push('/login')
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
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Đăng ký</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Số điện thoại phụ huynh</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Tên học sinh</label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Lớp</label>
            <input
              type="text"
              value={formData.className}
              onChange={(e) => setFormData({...formData, className: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded"
              placeholder="VD: 6A1"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Mật khẩu</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded"
              minLength={8}
              required
            />
            <p className="text-xs text-gray-400 mt-1">≥8 ký tự có ít nhất 1 số</p>
          </div>

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-yellow-400 hover:text-yellow-300">
            Đã có tài khoản? Đăng nhập
          </a>
        </div>
      </div>
    </div>
  )
}
