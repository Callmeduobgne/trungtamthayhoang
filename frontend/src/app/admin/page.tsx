'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Stats {
  students: number
  teachers: number
  classes: number
  activeStudents: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ students: 0, teachers: 0, classes: 0, activeStudents: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch('http://localhost:5001/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        console.error('Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) => (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-colors`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{loading ? '...' : value}</p>
        </div>
        <div className={`text-4xl ${color}`}>{icon}</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Quản Trị</h1>
          <p className="text-slate-400">Tổng quan hệ thống Trung Tâm Thầy Hoàng</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Tổng Học Sinh" value={stats.students} icon="👥" color="text-yellow-400" />
          <StatCard title="Giáo Viên" value={stats.teachers} icon="👨‍🏫" color="text-blue-400" />
          <StatCard title="Lớp Học" value={stats.classes} icon="🏫" color="text-green-400" />
          <StatCard title="HS Đang Học" value={stats.activeStudents} icon="📚" color="text-purple-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Hoạt Động Gần Đây</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-slate-300">Thêm học sinh mới: Nguyễn Văn A</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-slate-300">Cập nhật thông tin giáo viên</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">Tạo lớp học mới: 6A3</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Thống Kê Nhanh</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tỷ lệ chuyên cần</span>
                <span className="text-yellow-400 font-semibold">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Điểm trung bình</span>
                <span className="text-yellow-400 font-semibold">8.2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Học phí đã thu</span>
                <span className="text-yellow-400 font-semibold">85%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/students" className="text-center bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors">
            Quản Lý Học Sinh
          </Link>
          <Link href="/admin/teachers" className="text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Quản Lý Giáo Viên
          </Link>
          <Link href="/admin/schedules" className="text-center bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Lịch Học
          </Link>
        </div>
      </div>
    </div>
  )
}
