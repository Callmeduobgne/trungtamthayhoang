'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Student {
  _id: string
  full_name: string
  phone: string
  date_of_birth: string
  gender: string
  address: string
  class_id: string
  class_name: string
  parent_name: string
  parent_phone: string
  status: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editStudent, setEditStudent] = useState<Student | undefined>()
  const router = useRouter()

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`http://localhost:5001/admin/students?search=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [searchTerm])

  const handleDelete = async (studentId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa học sinh này?')) return

    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(`http://localhost:5001/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchStudents()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Đang tải...</div>
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="border-b border-yellow-400 bg-slate-800 px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Quản lý học sinh</h1>
          <button
            onClick={() => { setEditStudent(undefined); setModalOpen(true) }}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded font-semibold transition-colors"
          >
            + Thêm học sinh
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Họ tên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">SĐT</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Lớp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Phụ Huynh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-750">
                    <td className="px-6 py-4 whitespace-nowrap text-white">{student.full_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{student.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{student.class_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">{student.parent_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${student.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                        }`}>
                        {student.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => { setEditStudent(student); setModalOpen(true) }}
                        className="text-yellow-400 hover:text-yellow-300 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div className="text-center py-8 text-slate-400">Không tìm thấy học sinh nào</div>
          )}
        </div>
      </div>

      {modalOpen && (
        <StudentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={fetchStudents}
          student={editStudent}
        />
      )}
    </div>
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  student?: Student
}

function StudentModal({ isOpen, onClose, onSave, student }: ModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    parent_name: '',
    parent_phone: '',
    status: 'active'
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (student) {
      setFormData({
        full_name: student.full_name || '',
        phone: student.phone || '',
        date_of_birth: student.date_of_birth || '',
        gender: student.gender || '',
        address: student.address || '',
        parent_name: student.parent_name || '',
        parent_phone: student.parent_phone || '',
        status: student.status || 'active'
      })
    }
  }, [student])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('access_token')
      const url = student
        ? `http://localhost:5001/admin/students/${student._id}`
        : 'http://localhost:5001/admin/students'

      const response = await fetch(url, {
        method: student ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSave()
        onClose()
      } else {
        alert('Lưu thông tin học sinh thất bại')
      }
    } catch {
      alert('Lỗi kết nối mạng')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-yellow-400 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">
          {student ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
            required
          />

          <input
            type="text"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
            required
          />

          <input
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          />

          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          >
            <option value="">Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
          </select>

          <input
            type="text"
            placeholder="Tên phụ huynh"
            value={formData.parent_name}
            onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          />

          <input
            type="text"
            placeholder="Số điện thoại phụ huynh"
            value={formData.parent_phone}
            onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded"
          />

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-yellow-500 text-black rounded">
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
