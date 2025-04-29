'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { FaSearch, FaUser, FaEnvelope, FaRunning, FaCalendarAlt, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Registration {
  id: number
  firstName: string
  lastName: string
  email: string
  eventType: string
  createdAt: string
  payment: {
    paymentStatus: string
    amount: number
    paymentDate: string | null
    verificationNote: string | null
  } | null
}

export default function CheckStatusPage() {
  const [email, setEmail] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('กรุณากรอกอีเมลที่ใช้ลงทะเบียน')
      return
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('กรุณากรอกอีเมลให้ถูกต้อง')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/check-status?search=${encodeURIComponent(email.trim())}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการค้นหาข้อมูล')
      }

      setRegistrations(data.registrations)
      setSearched(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหาข้อมูล')
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING_VERIFICATION':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'COMPLETED':
        return 'ชำระเงินแล้ว'
      case 'REJECTED':
        return 'ปฏิเสธการชำระเงิน'
      case 'PENDING_VERIFICATION':
        return 'รอตรวจสอบการชำระเงิน'
      default:
        return 'ยังไม่ชำระเงิน'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-violet-900 mb-4">ตรวจสอบสถานะการลงทะเบียน</h1>
            <p className="text-gray-600 text-lg">กรอกอีเมลที่ใช้ลงทะเบียนเพื่อตรวจสอบสถานะการสมัครและชำระเงิน</p>
          </motion.div>
          
          {/* ฟอร์มค้นหา */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-violet-100"
          >
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมลที่ใช้ลงทะเบียน
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-violet-500" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="กรอกอีเมลที่ใช้ลงทะเบียน"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaSearch className="h-5 w-5" />
                <span>{loading ? 'กำลังค้นหา...' : 'ค้นหา'}</span>
              </button>
            </form>
          </motion.div>

          {/* แสดงข้อผิดพลาด */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8"
            >
              <p className="text-red-600 text-center">{error}</p>
            </motion.div>
          )}

          {/* แสดงผลการค้นหา */}
          {searched && !loading && !error && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {registrations.length > 0 ? (
                registrations.map((registration) => (
                  <motion.div 
                    key={registration.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl p-8 border border-violet-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <FaUser className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ชื่อ-นามสกุล</p>
                          <p className="font-medium text-lg">
                            {registration.firstName} {registration.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <FaEnvelope className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">อีเมล</p>
                          <p className="font-medium text-lg">{registration.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <FaRunning className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ประเภทการแข่งขัน</p>
                          <p className="font-medium text-lg">{registration.eventType}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <FaCalendarAlt className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">วันที่ลงทะเบียน</p>
                          <p className="font-medium text-lg">
                            {format(new Date(registration.createdAt), 'PPp', { locale: th })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <FaMoneyBillWave className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">สถานะการชำระเงิน</p>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.payment?.paymentStatus)}`}>
                            {getStatusText(registration.payment?.paymentStatus)}
                          </span>
                        </div>
                      </div>
                      {registration.payment?.amount && (
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-violet-100 rounded-lg">
                            <FaMoneyBillWave className="h-5 w-5 text-violet-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">จำนวนเงิน</p>
                            <p className="font-medium text-lg">{registration.payment.amount} บาท</p>
                          </div>
                        </div>
                      )}
                      {registration.payment?.paymentDate && (
                        <div className="col-span-2 flex items-center space-x-3">
                          <div className="p-2 bg-violet-100 rounded-lg">
                            <FaCalendarAlt className="h-5 w-5 text-violet-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">วันที่ชำระเงิน</p>
                            <p className="font-medium text-lg">
                              {format(new Date(registration.payment.paymentDate), 'PPp', { locale: th })}
                            </p>
                          </div>
                        </div>
                      )}
                      {registration.payment?.verificationNote && (
                        <div className="col-span-2 flex items-center space-x-3">
                          <div className="p-2 bg-violet-100 rounded-lg">
                            <FaInfoCircle className="h-5 w-5 text-violet-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">หมายเหตุ</p>
                            <p className="font-medium text-lg">{registration.payment.verificationNote}</p>
                          </div>
                        </div>
                      )}
                      {(!registration.payment || registration.payment.paymentStatus === 'NOT_PAID') && (
                        <div className="col-span-2 text-center mt-6">
                          <Link
                            href="/register/payment/verify"
                            className="inline-block bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            ยืนยันการชำระเงิน
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-2xl shadow-xl p-8 text-center border border-violet-100"
                >
                  <p className="text-gray-500 text-lg">ไม่พบข้อมูลการลงทะเบียน</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 