'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import QRCode from 'react-qr-code'
import { motion } from 'framer-motion'
import { EVENT_PRICES, EVENT_TYPES } from '@/constants/events'

interface RegistrationData {
  registrationId?: string
  firstName: string
  lastName: string
  email: string
  eventType: string
}

export default function PaymentPage() {
  const router = useRouter()
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem('registrationData')
    if (!data) {
      router.push('/register/payment/verify')
      return
    }

    try {
      const parsedData = JSON.parse(data)
      setRegistrationData(parsedData)
    } catch (err) {
      console.error('Error parsing registration data:', err)
      router.push('/register/payment/verify')
    }
  }, [router])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('ขนาดไฟล์ต้องไม่เกิน 5MB')
      return
    }

    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('กรุณาอัพโหลดไฟล์ภาพ JPG หรือ PNG เท่านั้น')
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError(null)
  }

  const handleConfirmPayment = async () => {
    try {
      setIsLoading(true)
      setError('')

      if (!selectedFile || !registrationData?.registrationId) {
        setError('กรุณาเลือกไฟล์และตรวจสอบข้อมูลการลงทะเบียน')
        return
      }

      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('registrationId', registrationData.registrationId.toString())

      console.log('Sending payment confirmation request...')
      const response = await fetch('/api/payment/upload', {
        method: 'POST',
        body: formData,
      })

      // ตรวจสอบ response status ก่อน
      if (!response.ok) {
        console.error('Server error:', response.status, response.statusText)
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || 
          `เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: ${response.status} ${response.statusText}`
        )
      }

      // พยายามแปลง response เป็น JSON
      let data
      try {
        data = await response.json()
        console.log('Server response:', data)
      } catch (error) {
        console.error('Error parsing response:', error)
        throw new Error('เกิดข้อผิดพลาดในการอ่านข้อมูลจากเซิร์ฟเวอร์')
      }

      // ตรวจสอบสถานะการอัพโหลด
      if (!data.success) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์')
      }

      // ถ้าสำเร็จ redirect ไปหน้า success
      router.push('/register/success')
    } catch (error) {
      console.error('Payment confirmation error:', error)
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')
    } finally {
      setIsLoading(false)
    }
  }

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-hospital-light-gradient flex items-center justify-center">
        <div className="text-2xl font-bold text-violet-900">กำลังโหลด...</div>
      </div>
    )
  }

  const amount = EVENT_PRICES[registrationData.eventType as keyof typeof EVENT_PRICES]

  return (
    <div className="min-h-screen bg-hospital-light-gradient py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* หัวข้อ */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ชำระเงิน</h1>
            <p className="text-lg text-gray-600">กรุณาชำระเงินและอัพโหลดหลักฐานการชำระเงิน</p>
          </div>

          {/* การ์ดข้อมูล */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="p-8">
              {/* ข้อมูลผู้สมัคร */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">ข้อมูลผู้สมัคร</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <p className="font-medium">ชื่อ-นามสกุล</p>
                    <p>{registrationData.firstName} {registrationData.lastName}</p>
                  </div>
                  <div>
                    <p className="font-medium">อีเมล</p>
                    <p>{registrationData.email}</p>
                  </div>
                  <div>
                    <p className="font-medium">ประเภทการแข่งขัน</p>
                    <p>{EVENT_TYPES[registrationData.eventType as keyof typeof EVENT_TYPES]}</p>
                  </div>
                  <div>
                    <p className="font-medium">จำนวนเงิน</p>
                    <p className="text-2xl font-bold text-violet-600">{amount} บาท</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code สำหรับชำระเงิน</h2>
                <div className="bg-gray-50 p-6 rounded-xl flex flex-col items-center">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <QRCode
                      value={`https://promptpay.io/0812345678/${amount}`}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                  <p className="text-sm text-gray-500">สแกน QR Code เพื่อชำระเงินผ่าน Mobile Banking</p>
                </div>
              </div>

              {/* อัพโหลดสลิป */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">อัพโหลดสลิปการโอนเงิน</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                  {previewUrl ? (
                    <div className="relative">
                      <Image
                        src={previewUrl}
                        alt="Receipt preview"
                        width={300}
                        height={400}
                        className="mx-auto rounded-lg"
                        objectFit="contain"
                      />
                      <button
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl(null)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <label htmlFor="receipt" className="cursor-pointer">
                          <div className="bg-violet-50 rounded-full p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                          </div>
                          <input
                            type="file"
                            id="receipt"
                            accept="image/jpeg,image/png"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <div>
                        <p className="text-gray-600">คลิกเพื่ออัพโหลดสลิปการโอนเงิน</p>
                        <p className="text-sm text-gray-500">รองรับไฟล์ JPG และ PNG ขนาดไม่เกิน 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
                {error && (
                  <div className="mt-4 text-red-500 text-sm">{error}</div>
                )}
              </div>

              {/* ปุ่มยืนยัน */}
              <motion.button
                onClick={handleConfirmPayment}
                className={`w-full bg-violet-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-violet-700 transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || !selectedFile}
              >
                {isLoading ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}