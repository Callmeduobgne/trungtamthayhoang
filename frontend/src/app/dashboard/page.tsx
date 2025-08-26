'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  phone: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    // Decode JWT để lấy thông tin user
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUser({ 
        id: payload.sub, 
        phone: payload.phone || '', 
        role: payload.role || 'parent' 
      })
    } catch (error) {
      console.error('JWT decode error:', error)
      localStorage.removeItem('access_token')
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mr-4 border-2 border-yellow-300">
                <span className="text-black text-lg font-bold">🏫</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Trung Tâm Thầy Hoàng</h1>
                <p className="text-sm text-gray-400">Cổng thông tin học sinh</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Trực tuyến</span>
              </div>
              <span className="text-sm text-gray-300">Chào mừng, {user?.role === 'admin' ? 'Quản trị viên' : 'Học sinh'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-300 shadow-lg shadow-green-400/25">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Kết nối thành công!
              </h2>
              <p className="text-gray-400 mb-6">
                Chào mừng đến với hệ thống quản lý Trung Tâm Thầy Hoàng
              </p>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                    <span className="text-sm text-green-400 font-medium">Trạng thái hệ thống</span>
                  </div>
                  <p className="text-xs text-gray-300">Hoạt động</p>
                </div>
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <span className="text-sm text-yellow-400 font-medium">Kênh</span>
                  </div>
                  <p className="text-xs text-gray-300">5 kênh sẵn sàng</p>
                </div>
                <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
                    <span className="text-sm text-blue-400 font-medium">Trạng thái CLI</span>
                  </div>
                  <p className="text-xs text-gray-300">Sẵn sàng</p>
                </div>
              </div>
              
              {user?.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 p-6 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-400/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">👥</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Quản lý học sinh</h3>
                    <p className="text-gray-400 text-sm">Xem và quản lý thông tin học sinh</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 p-6 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">👨‍🏫</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Quản lý giáo viên</h3>
                    <p className="text-gray-400 text-sm">Quản lý thông tin giáo viên và phân công</p>
                  </div>
                  <div className="bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600 p-6 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-400/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Phân tích & Báo cáo</h3>
                    <p className="text-gray-400 text-sm">Xem báo cáo và bảng phân tích</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
