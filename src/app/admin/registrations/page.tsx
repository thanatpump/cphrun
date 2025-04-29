'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { FaSearch, FaFilter, FaEye, FaEdit } from 'react-icons/fa'

interface Registration {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  eventType: string
  paymentStatus: string
  createdAt: string
}

export default function AdminRegistrationsPage() {
  const router = useRouter()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations')
      const data = await response.json()

      if (data.success) {
        setRegistrations(data.registrations)
      } else {
        setError('ไม่สามารถโหลดข้อมูลได้')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = 
      registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === 'all') return matchesSearch
    if (filterStatus === 'completed') return matchesSearch && registration.paymentStatus === 'COMPLETED'
    if (filterStatus === 'pending') return matchesSearch && ['PENDING', 'PENDING_REVIEW'].includes(registration.paymentStatus)
    if (filterStatus === 'rejected') return matchesSearch && registration.paymentStatus === 'REJECTED'
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center">
        <div className="text-2xl font-bold text-violet-900">กำลังโหลดข้อมูล...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center">
        <div className="text-2xl font-bold text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              จัดการข้อมูลการลงทะเบียน
            </h1>
            <p className="text-lg text-gray-600">
              รายการลงทะเบียนทั้งหมด
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Search and Filter Section */}
            <div className="p-6 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="ค้นหาจากชื่อหรืออีเมล..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="all">ทั้งหมด</option>
                    <option value="completed">ชำระเงินแล้ว</option>
                    <option value="pending">รอดำเนินการ</option>
                    <option value="rejected">ยกเลิก</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภทการแข่งขัน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่ลงทะเบียน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRegistrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {registration.firstName} {registration.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{registration.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{registration.eventType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          registration.paymentStatus === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : registration.paymentStatus === 'PENDING_REVIEW'
                            ? 'bg-yellow-100 text-yellow-800'
                            : registration.paymentStatus === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {registration.paymentStatus === 'COMPLETED'
                            ? 'ชำระเงินสำเร็จ'
                            : registration.paymentStatus === 'PENDING_REVIEW'
                            ? 'รอตรวจสอบ'
                            : registration.paymentStatus === 'REJECTED'
                            ? 'ยกเลิก'
                            : 'รอการชำระเงิน'
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(registration.createdAt), 'dd/MM/yyyy HH:mm', { locale: th })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => router.push(`/admin/registrations/${registration.id}`)}
                            className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                            title="ดูข้อมูล"
                          >
                            <FaEye /> ดูข้อมูล
                          </button>
                          <button
                            onClick={() => router.push(`/admin/registrations/${registration.id}/edit`)}
                            className="text-violet-600 hover:text-violet-900 transition-colors flex items-center gap-1"
                            title="แก้ไข"
                          >
                            <FaEdit /> แก้ไข
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 