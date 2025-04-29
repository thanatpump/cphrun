'use client'

import { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaSave } from 'react-icons/fa'

interface Registration {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  eventType: string
  shirtSize: string
  deliveryMethod: string
  shippingAddress: string | null
  emergencyPhone: string
  paymentStatus: string
  createdAt: string
  payment?: {
    amount: number
    paymentStatus: string
  }
}

export default function EditRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const resolvedParams = use(params)

  const fetchRegistration = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/registrations/${resolvedParams.id}`)
      const data = await response.json()

      if (data.success) {
        setRegistration(data.registration)
      } else {
        setError(data.message)
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }, [resolvedParams.id])

  useEffect(() => {
    fetchRegistration()
  }, [fetchRegistration])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!registration) return

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/registrations/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registration),
      })

      const data = await response.json()

      if (data.success) {
        alert('บันทึกข้อมูลสำเร็จ')
        router.push('/admin/registrations')
      } else {
        setError(data.message)
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!registration) return
    
    const { name, value } = e.target
    setRegistration(prev => {
      if (!prev) return prev
      return {
        ...prev,
        [name]: value
      }
    })
  }

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

  if (!registration) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center">
        <div className="text-2xl font-bold text-red-600">ไม่พบข้อมูลการลงทะเบียน</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.push('/admin/registrations')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft /> กลับ
            </button>
            <h1 className="text-3xl font-bold text-gray-900">แก้ไขข้อมูลการลงทะเบียน</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={registration.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    นามสกุล
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={registration.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registration.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={registration.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    อายุ
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={registration.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ประเภทการแข่งขัน
                  </label>
                  <select
                    name="eventType"
                    value={registration.eventType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  >
                    <option value="FUN RUN">FUN RUN</option>
                    <option value="MINI MARATHON">MINI MARATHON</option>
                    <option value="HALF MARATHON">HALF MARATHON</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ขนาดเสื้อ
                  </label>
                  <select
                    name="shirtSize"
                    value={registration.shirtSize}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="2XL">2XL</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วิธีรับเสื้อ
                  </label>
                  <select
                    name="deliveryMethod"
                    value={registration.deliveryMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  >
                    <option value="รับที่งาน">รับที่งาน</option>
                    <option value="ส่งไปรษณีย์">ส่งไปรษณีย์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรฉุกเฉิน
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={registration.emergencyPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              {registration.deliveryMethod === 'ส่งไปรษณีย์' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ที่อยู่จัดส่ง
                  </label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={registration.shippingAddress || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    required
                  />
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">สถานะการชำระเงิน</p>
                    <p className={`text-sm font-medium ${
                      registration.paymentStatus === 'completed' ? 'text-green-600' :
                      registration.paymentStatus === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {registration.paymentStatus === 'completed' ? 'ชำระเงินแล้ว' :
                       registration.paymentStatus === 'pending' ? 'รอชำระเงิน' :
                       'ปฏิเสธการชำระเงิน'}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave />
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 