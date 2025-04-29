'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { FaSearch, FaFilter, FaCheck, FaTimes, FaImage } from 'react-icons/fa'

interface Registration {
  id: number
  firstName: string
  lastName: string
  email: string
  eventType: string
  paymentStatus: string
}

interface Payment {
  id: number
  amount: number
  paymentStatus: string
  paymentDate: string | null
  receiptImage: string | null
  verificationNote: string | null
  createdAt: string
  updatedAt: string
  registration: Registration
}

export default function PaymentList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registrationId = searchParams.get('registrationId')
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchPayments = useCallback(async () => {
    try {
      const url = registrationId 
        ? `/api/admin/payments?registrationId=${registrationId}`
        : '/api/admin/payments'
      
      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setPayments(data.payments)
        if (registrationId && data.payments.length > 0) {
          setSelectedPayment(data.payments[0])
        }
      } else {
        setError('ไม่สามารถโหลดข้อมูลได้')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }, [registrationId])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const handleVerification = async (paymentId: number, status: 'verified' | 'rejected') => {
    const confirmMessage = status === 'verified' 
      ? 'ยืนยันการชำระเงินใช่หรือไม่?' 
      : 'ปฏิเสธการชำระเงินใช่หรือไม่?'
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setProcessing(true)
      const response = await fetch('/api/admin/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          status,
          verificationNote: status === 'verified' ? 'ยืนยันการชำระเงิน' : 'ปฏิเสธการชำระเงิน'
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert(status === 'verified' ? 'ยืนยันการชำระเงินสำเร็จ' : 'ปฏิเสธการชำระเงินสำเร็จ')
        setSelectedPayment(null)
        setTimeout(() => {
          window.location.reload()
        }, 100)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการตรวจสอบการชำระเงิน')
    } finally {
      setProcessing(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.registration.email.toLowerCase().includes(searchTerm.toLowerCase())

    if (filterStatus === 'all') return matchesSearch
    if (filterStatus === 'completed') return matchesSearch && payment.paymentStatus === 'COMPLETED'
    if (filterStatus === 'pending') return matchesSearch && payment.paymentStatus === 'PENDING_VERIFICATION'
    if (filterStatus === 'rejected') return matchesSearch && payment.paymentStatus === 'REJECTED'
    
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
              <option value="pending">รอตรวจสอบ</option>
              <option value="rejected">ปฏิเสธการชำระเงิน</option>
            </select>
          </div>
        </div>
        {registrationId && (
          <button
            onClick={() => router.push('/admin/payments')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            กลับไปหน้ารายการรอตรวจสอบ
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อ-นามสกุล</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภทการแข่งขัน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนเงิน</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่อัพโหลด</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สลิป</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.registration.firstName} {payment.registration.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{payment.registration.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.registration.eventType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-violet-600">{payment.amount} บาท</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.paymentStatus === 'COMPLETED' 
                      ? 'bg-green-100 text-green-800'
                      : payment.paymentStatus === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.paymentStatus === 'COMPLETED' 
                      ? 'ชำระเงินแล้ว'
                      : payment.paymentStatus === 'REJECTED'
                      ? 'ปฏิเสธการชำระเงิน'
                      : 'รอตรวจสอบ'
                    }
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(payment.createdAt), 'dd/MM/yyyy HH:mm', { locale: th })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {payment.receiptImage && (
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                    >
                      <FaImage /> ดูสลิป
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal แสดงรูปสลิป */}
      {selectedPayment && selectedPayment.receiptImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">สลิปการชำระเงิน</h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={selectedPayment.receiptImage}
                  alt="Receipt"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-4">รายละเอียดการชำระเงิน</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">ชื่อ-นามสกุล</p>
                      <p className="font-medium">{selectedPayment.registration.firstName} {selectedPayment.registration.lastName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">อีเมล</p>
                      <p className="font-medium">{selectedPayment.registration.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ประเภทการแข่งขัน</p>
                      <p className="font-medium">{selectedPayment.registration.eventType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">จำนวนเงิน</p>
                      <p className="font-medium text-violet-600">{selectedPayment.amount} บาท</p>
                    </div>
                    <div>
                      <p className="text-gray-600">วันที่อัพโหลด</p>
                      <p className="font-medium">{format(new Date(selectedPayment.createdAt), 'dd MMMM yyyy HH:mm', { locale: th })} น.</p>
                    </div>
                    <div>
                      <p className="text-gray-600">สถานะ</p>
                      <p className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
                        selectedPayment.paymentStatus === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800'
                          : selectedPayment.paymentStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedPayment.paymentStatus === 'COMPLETED' ? 'ชำระเงินแล้ว' :
                         selectedPayment.paymentStatus === 'REJECTED' ? 'ปฏิเสธการชำระเงิน' :
                         'รอตรวจสอบ'}
                      </p>
                    </div>
                    {selectedPayment.verificationNote && (
                      <div>
                        <p className="text-gray-600">บันทึกเพิ่มเติม</p>
                        <p className="font-medium">{selectedPayment.verificationNote}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  {(!selectedPayment.paymentStatus || 
                    selectedPayment.paymentStatus === 'PENDING_VERIFICATION' || 
                    selectedPayment.paymentStatus === 'pending' ||
                    selectedPayment.paymentStatus === 'PENDING' ||
                    selectedPayment.paymentStatus === 'รอตรวจสอบ') ? (
                    <div className="space-y-3">
                      <button
                        onClick={() => handleVerification(selectedPayment.id, 'verified')}
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaCheck />
                        {processing ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
                      </button>
                      <button
                        onClick={() => handleVerification(selectedPayment.id, 'rejected')}
                        disabled={processing}
                        className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaTimes />
                        {processing ? 'กำลังดำเนินการ...' : 'ปฏิเสธการชำระเงิน'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPayment(null)}
                      className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      ปิดหน้าต่าง
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 