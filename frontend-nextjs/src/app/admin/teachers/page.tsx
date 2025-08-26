'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Teacher {
  _id: string
  full_name: string
  position: string
  date_of_birth: string
  subject: string
  phone: string
  email: string
  status: string
  avatar?: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTeacher, setEditTeacher] = useState<Teacher | undefined>()
  const router = useRouter()

  // Mock data for demo
  const mockTeachers: Teacher[] = [
    {
      _id: '1',
      full_name: 'Nguyễn Thị Lan',
      position: 'Giáo viên chủ nhiệm',
      date_of_birth: '1985-03-15',
      subject: 'Toán học',
      phone: '0987654321',
      email: 'lan.nguyen@school.edu.vn',
      status: 'active'
    },
    {
      _id: '2', 
      full_name: 'Trần Văn Minh',
      position: 'Phó hiệu trưởng',
      date_of_birth: '1980-07-22',
      subject: 'Vật lý',
      phone: '0987654322',
      email: 'minh.tran@school.edu.vn',
      status: 'active'
    },
    {
      _id: '3',
      full_name: 'Lê Thị Hương',
      position: 'Giáo viên',
      date_of_birth: '1990-12-08',
      subject: 'Ngữ văn',
      phone: '0987654323',
      email: 'huong.le@school.edu.vn',
      status: 'active'
    },
    {
      _id: '4',
      full_name: 'Phạm Đức Thành',
      position: 'Tổ trưởng',
      date_of_birth: '1988-05-30',
      subject: 'Hóa học',
      phone: '0987654324',
      email: 'thanh.pham@school.edu.vn',
      status: 'active'
    },
    {
      _id: '5',
      full_name: 'Võ Thị Mai',
      position: 'Giáo viên',
      date_of_birth: '1992-09-14',
      subject: 'Tiếng Anh',
      phone: '0987654325',
      email: 'mai.vo@school.edu.vn',
      status: 'active'
    }
  ]

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`http://localhost:5001/admin/teachers?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setTeachers(data.teachers || mockTeachers) // Fallback to mock data
      } else {
        // Use mock data if API fails
        setTeachers(mockTeachers)
      }
    } catch (error) {
      console.error('Error:', error)
      // Use mock data if API fails
      setTeachers(mockTeachers)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [searchTerm])

  const filteredTeachers = teachers.filter(teacher =>
    teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (teacherId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
      setTeachers(teachers.filter(t => t._id !== teacherId))
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-yellow-400 bg-gray-800 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý giáo viên</h1>
          <button
            onClick={() => {setEditTeacher(undefined); setModalOpen(true)}}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Thêm giáo viên
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm giáo viên theo tên hoặc môn học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-600 text-white rounded-lg focus:border-yellow-400 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher._id} className="bg-gray-800 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20 overflow-hidden">
              <div className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center border-4 border-yellow-300">
                    <span className="text-black text-2xl font-bold">
                      {teacher.full_name.split(' ').slice(-1)[0].charAt(0)}
                    </span>
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-gray-800 ${
                    teacher.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                  }`}></div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">{teacher.full_name}</h3>
                <p className="text-yellow-400 text-sm font-medium mb-2">{teacher.position}</p>
                <p className="text-gray-400 text-sm mb-1">Môn: {teacher.subject}</p>
                <p className="text-gray-400 text-xs">Sinh: {new Date(teacher.date_of_birth).toLocaleDateString('vi-VN')}</p>

                <div className="flex justify-center space-x-2 mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {setEditTeacher(teacher); setModalOpen(true)}}
                    className="text-yellow-400 hover:text-yellow-300 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    title="Sửa thông tin"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    title="Xóa giáo viên"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">Không tìm thấy giáo viên nào</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <TeacherModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={() => {/* Implement save logic */}}
          teacher={editTeacher}
        />
      )}
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  teacher?: Teacher
}

function TeacherModal({ isOpen, onClose, onSave, teacher }: Readonly<ModalProps>) {
  const [formData, setFormData] = useState({
    full_name: '',
    position: '',
    date_of_birth: '',
    subject: '',
    phone: '',
    email: '',
    status: 'active'
  })

  useEffect(() => {
    if (teacher) {
      setFormData({
        full_name: teacher.full_name || '',
        position: teacher.position || '',
        date_of_birth: teacher.date_of_birth || '',
        subject: teacher.subject || '',
        phone: teacher.phone || '',
        email: teacher.email || '',
        status: teacher.status || 'active'
      })
    }
  }, [teacher])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-yellow-400 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">
          {teacher ? 'Sửa thông tin giáo viên' : 'Thêm giáo viên mới'}
        </h2>
        
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            value={formData.full_name}
            onChange={(e) => setFormData({...formData, full_name: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          />
          
          <select
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          >
            <option value="">Chọn chức vụ</option>
            <option value="Hiệu trưởng">Hiệu trưởng</option>
            <option value="Phó hiệu trưởng">Phó hiệu trưởng</option>
            <option value="Tổ trưởng">Tổ trưởng</option>
            <option value="Giáo viên chủ nhiệm">Giáo viên chủ nhiệm</option>
            <option value="Giáo viên">Giáو viên</option>
          </select>

          <input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          />

          <input
            type="text"
            placeholder="Môn học"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          />

          <input
            type="text"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">
              Hủy
            </button>
            <button type="submit" className="px-4 py-2 bg-yellow-500 text-black rounded">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
