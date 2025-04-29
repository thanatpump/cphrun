'use client'

import { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'

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
    paymentDate: string | null
    receiptImage: string | null
  }
}

export default function ViewRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
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
            <h1 className="text-3xl font-bold text-gray-900">ข้อมูลการลงทะเบียน</h1>
            <button
              onClick={() => router.push(`/admin/registrations/${resolvedParams.id}/edit`)}
              className="flex items-center gap-2 text-violet-600 hover:text-violet-900"
            >
              <FaEdit /> แก้ไข
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">ชื่อ-นามสกุล</p>
                  <p className="font-medium">{registration.firstName} {registration.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">อีเมล</p>
                  <p className="font-medium">{registration.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
                  <p className="font-medium">{registration.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">อายุ</p>
                  <p className="font-medium">{registration.age} ปี</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ประเภทการแข่งขัน</p>
                  <p className="font-medium">{registration.eventType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ขนาดเสื้อ</p>
                  <p className="font-medium">{registration.shirtSize}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">วิธีรับเสื้อ</p>
                  <p className="font-medium">{registration.deliveryMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">เบอร์โทรฉุกเฉิน</p>
                  <p className="font-medium">{registration.emergencyPhone}</p>
                </div>
              </div>

              {registration.deliveryMethod === 'ส่งไปรษณีย์' && registration.shippingAddress && (
                <div>
                  <p className="text-sm text-gray-600">ที่อยู่จัดส่ง</p>
                  <p className="font-medium">{registration.shippingAddress}</p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">ข้อมูลการชำระเงิน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">สถานะการชำระเงิน</p>
                    <p className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                      registration.paymentStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      registration.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      registration.paymentStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.paymentStatus === 'completed' ? 'ชำระเงินแล้ว' :
                       registration.paymentStatus === 'pending' ? 'รอชำระเงิน' :
                       registration.paymentStatus === 'rejected' ? 'ปฏิเสธการชำระเงิน' :
                       'รอตรวจสอบ'}
                    </p>
                  </div>
                  {registration.payment && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600">จำนวนเงิน</p>
                        <p className="font-medium text-violet-600">{registration.payment.amount} บาท</p>
                      </div>
                      {registration.payment.paymentDate && (
                        <div>
                          <p className="text-sm text-gray-600">วันที่ชำระเงิน</p>
                          <p className="font-medium">
                            {format(new Date(registration.payment.paymentDate), 'dd MMMM yyyy HH:mm', { locale: th })} น.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">วันที่ลงทะเบียน</p>
                <p className="font-medium">
                  {format(new Date(registration.createdAt), 'dd MMMM yyyy HH:mm', { locale: th })} น.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 