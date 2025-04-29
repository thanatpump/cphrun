'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaEnvelope, FaUser, FaRunning, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa'

interface PaymentData {
  id: number
  firstName: string
  lastName: string
  email: string
  eventType: string
  amount: number
}

export default function PaymentVerification() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null)
  const router = useRouter()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('กรุณาระบุอีเมล')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/payment/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const result = await response.json()
      console.log('API Response:', result) // Debug log

      if (!response.ok) {
        throw new Error(result.message || 'เกิดข้อผิดพลาดในการตรวจสอบ')
      }

      if (result.success && result.data) {
        console.log('Payment Data:', result.data) // Debug log
        setPaymentData(result.data)
      } else {
        throw new Error('ไม่พบข้อมูลการชำระเงิน')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการตรวจสอบ')
      setPaymentData(null)
    } finally {
      setLoading(false)
    }
  }

  const handleProceedToPayment = () => {
    if (paymentData) {
      // Save payment data to localStorage
      localStorage.setItem('registrationData', JSON.stringify({
        registrationId: paymentData.id.toString(),
        firstName: paymentData.firstName,
        lastName: paymentData.lastName,
        email: paymentData.email,
        eventType: paymentData.eventType,
        amount: paymentData.amount
      }))
      // ไปที่หน้าชำระเงินโดยไม่ต้องระบุ ID ในพาท
      router.push('/register/payment')
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
            <h1 className="text-4xl font-bold text-violet-900 mb-4">ยืนยันการชำระเงิน</h1>
            <p className="text-gray-600 text-lg">กรอกอีเมลที่ใช้ลงทะเบียนเพื่อตรวจสอบข้อมูลการชำระเงิน</p>
          </motion.div>

          {/* ฟอร์มตรวจสอบอีเมล */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-violet-100"
          >
            <form onSubmit={handleVerify} className="space-y-6">
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
                <span>{loading ? 'กำลังตรวจสอบ...' : 'ตรวจสอบ'}</span>
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

          {/* แสดงข้อมูลการชำระเงิน */}
          {paymentData && (
            <motion.div 
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
                      {paymentData.firstName} {paymentData.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <FaEnvelope className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">อีเมล</p>
                    <p className="font-medium text-lg">{paymentData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <FaRunning className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ประเภทการแข่งขัน</p>
                    <p className="font-medium text-lg">{paymentData.eventType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <FaMoneyBillWave className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">จำนวนเงินที่ต้องชำระ</p>
                    <p className="font-medium text-lg">{paymentData.amount} บาท</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={handleProceedToPayment}
                  className="inline-flex items-center bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>ไปยังหน้าชำระเงิน</span>
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 