'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegistrationData } from '@/types'
import { formatDate } from '@/utils/date'
import { PAYMENT_STATUS } from '@/constants/events'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'

export default function RegistrationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [registration, setRegistration] = useState<RegistrationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/registrations/${params.id}`)
        if (!response.ok) {
          throw new Error('ไม่สามารถโหลดข้อมูลได้')
        }
        const data = await response.json()
        if (data.success) {
          setRegistration(data.data)
        } else {
          throw new Error(data.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด')
      } finally {
        setLoading(false)
      }
    }

    fetchRegistration()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">เกิดข้อผิดพลาด</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                กลับไปหน้าก่อนหน้า
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">ไม่พบข้อมูล</h3>
            <p className="mt-2 text-sm text-gray-500">ไม่พบข้อมูลการลงทะเบียนที่ต้องการ</p>
            <div className="mt-6">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                กลับไปหน้าก่อนหน้า
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800'
      case PAYMENT_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800'
      case PAYMENT_STATUS.PENDING_REVIEW:
        return 'bg-blue-100 text-blue-800'
      case PAYMENT_STATUS.REJECTED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return 'ชำระเงินแล้ว'
      case PAYMENT_STATUS.PENDING:
        return 'รอการชำระเงิน'
      case PAYMENT_STATUS.PENDING_REVIEW:
        return 'รอการตรวจสอบ'
      case PAYMENT_STATUS.REJECTED:
        return 'การชำระเงินถูกปฏิเสธ'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                รายละเอียดการลงทะเบียน
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                รหัสการลงทะเบียน: {registration.id}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              กลับ
            </button>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">สถานะการชำระเงิน</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.paymentStatus)}`}>
                    {getStatusText(registration.paymentStatus)}
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {registration.firstName} {registration.lastName}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">อีเมล</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {registration.email}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {registration.phone}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">อายุ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {registration.age} ปี
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ประเภทการแข่งขัน</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {registration.eventType === 'FUN_RUN' ? 'Fun Run (5 กม.)' : 'Mini Marathon (10 กม.)'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ขนาดเสื้อ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {registration.shirtSize}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">วิธีการรับเสื้อ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {registration.deliveryMethod === 'PICKUP' ? 'รับที่งาน' : 'จัดส่งทางไปรษณีย์'}
                </dd>
              </div>
              {registration.deliveryMethod === 'SHIPPING' && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ที่อยู่จัดส่ง</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {registration.shippingAddress}
                  </dd>
                </div>
              )}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">เบอร์โทรฉุกเฉิน</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {registration.emergencyPhone}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">วันที่ลงทะเบียน</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(registration.createdAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
} 