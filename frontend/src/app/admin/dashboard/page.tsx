'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.role !== 'admin') {
        router.push('/dashboard')
        return
      }
    } catch (error) {
      router.push('/login')
      return
    }

    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

    const menuItems = [
    'Tổng quan',
    'Quản lý học sinh', 
    'Quản lý giáo viên',
    'Quản lý lớp học',
    'Thời khóa biểu',
    'Quản lý bài thi',
    'Quản lý điểm số',
    'Quản lý học phí',
    'Báo cáo',
    'Cài đặt'
  ]

  const stats = [
    { label: 'Học sinh', value: '245' },
    { label: 'Giáo viên', value: '15' },
    { label: 'Lớp học', value: '12' },
    { label: 'Doanh thu', value: '125M' }
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <div className="w-64 bg-gray-900 shadow-lg border-r-4 border-yellow-400">
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-4 border-b border-gray-800">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
              <span className="text-black text-lg font-bold">🏫</span>
            </div>
            <h1 className="text-lg font-bold text-white">Trung Tâm Thầy Hoàng</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <a href="/admin/dashboard" className="group flex items-center px-3 py-3 rounded-lg text-sm transition-all duration-200 bg-yellow-400 bg-opacity-20 text-yellow-300 border-l-4 border-yellow-400 font-medium">
              <span className="w-2 h-2 rounded-full mr-3 bg-yellow-400"></span>
              Tổng quan
            </a>
            <a href="/admin/students" className="group flex items-center px-3 py-3 rounded-lg text-sm transition-all duration-200 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-l-4 hover:border-yellow-400">
              <span className="w-2 h-2 rounded-full mr-3 bg-gray-600 group-hover:bg-yellow-400"></span>
              Quản lý học sinh
            </a>
            <a href="/admin/teachers" className="group flex items-center px-3 py-3 rounded-lg text-sm transition-all duration-200 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-l-4 hover:border-yellow-400">
              <span className="w-2 h-2 rounded-full mr-3 bg-gray-600 group-hover:bg-yellow-400"></span>
              Quản lý giáo viên
            </a>
            {menuItems.slice(3).map((item, index) => (
              <a key={item} href="#" className="group flex items-center px-3 py-3 rounded-lg text-sm transition-all duration-200 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-l-4 hover:border-yellow-400">
                <span className="w-2 h-2 rounded-full mr-3 bg-gray-600 group-hover:bg-yellow-400"></span>
                {item}
              </a>
            ))}
          </nav>
          
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border-2 border-yellow-300">
                <span className="text-black text-sm font-bold">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Quản trị viên</p>
                <p className="text-xs text-gray-400">Quản trị hệ thống</p>
              </div>
              <button onClick={handleLogout} className="ml-auto text-gray-400 hover:text-red-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-900">
        <header className="bg-gray-800 shadow-lg border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Bảng điều khiển</h1>
              <p className="text-sm text-gray-400 mt-1">Quản lý hệ thống trung tâm</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">Trạng thái hệ thống: Hoạt động</span>
              </div>
              <div className="text-sm text-gray-400">
                Cập nhật lần cuối: <span className="text-yellow-400 font-mono">2 phút trước</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 bg-gray-900">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-blue-500 bg-opacity-20 border border-blue-400' :
                    index === 1 ? 'bg-green-500 bg-opacity-20 border border-green-400' :
                    index === 2 ? 'bg-purple-500 bg-opacity-20 border border-purple-400' :
                    'bg-yellow-500 bg-opacity-20 border border-yellow-400'
                  }`}>
                    <span className={`text-lg ${
                      index === 0 ? 'text-blue-400' :
                      index === 1 ? 'text-green-400' :
                      index === 2 ? 'text-purple-400' :
                      'text-yellow-400'
                    }`}>
                      {index === 0 ? '👥' : index === 1 ? '👨‍🏫' : index === 2 ? '📚' : '💰'}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className={`h-2 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`} style={{width: `${60 + index * 10}%`}}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Hoạt động gần đây</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-yellow-400">Trực tiếp</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 hover:border-yellow-400 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-sm">✓</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-white">
                    Đăng ký học sinh mới hoàn thành
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Xác nhận thành công • 2 giờ trước</p>
                </div>
                <div className="text-xs text-green-400 font-mono bg-green-400 bg-opacity-10 px-2 py-1 rounded">
                  THÀNH CÔNG
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 hover:border-yellow-400 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-white">
                    Xử lý thanh toán học phí
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Giao dịch đang xử lý • 4 giờ trước</p>
                </div>
                <div className="text-xs text-blue-400 font-mono bg-blue-400 bg-opacity-10 px-2 py-1 rounded">
                  CHỜ XỬ LÝ
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 hover:border-yellow-400 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📊</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-white">
                    Tạo báo cáo tuần
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Tác vụ tự động • 1 ngày trước</p>
                </div>
                <div className="text-xs text-purple-400 font-mono bg-purple-400 bg-opacity-10 px-2 py-1 rounded">
                  HOÀN THÀNH
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
