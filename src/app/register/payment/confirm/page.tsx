'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function PaymentConfirmation() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // ตรวจสอบขนาดไฟล์
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB')
        return
      }

      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        setError('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น')
        return
      }

      setSelectedImage(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('กรุณาอัพโหลดหลักฐานการชำระเงิน')
      return
    }

    setIsSubmitting(true)
    setError('')
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('receipt', selectedImage)

      const xhr = new XMLHttpRequest()
      
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      }

      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          if (response.success) {
            router.push('/register/success')
          } else {
            setError(response.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
          }
        } else {
          setError('เกิดข้อผิดพลาดในการอัพโหลด กรุณาลองใหม่อีกครั้ง')
        }
        setIsSubmitting(false)
      }

      xhr.onerror = function() {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง')
        setIsSubmitting(false)
      }

      xhr.open('POST', '/api/payment/upload', true)
      xhr.send(formData)

    } catch (error) {
      console.error('Error uploading:', error)
      setError('เกิดข้อผิดพลาดในการอัพโหลด กรุณาลองใหม่อีกครั้ง')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-hospital-light-gradient py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ยืนยันการชำระเงิน</h1>
            <p className="text-lg text-gray-600">อัพโหลดหลักฐานการชำระเงินของท่าน</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {previewUrl ? (
                    <div className="relative w-full h-64">
                      <Image
                        src={previewUrl}
                        alt="Receipt preview"
                        fill
                        className="object-contain"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null)
                          setPreviewUrl(null)
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-64 cursor-pointer">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-4 text-lg text-gray-600">คลิกเพื่ออัพโหลดสลิปการโอนเงิน</p>
                      <p className="mt-2 text-sm text-gray-500">PNG, JPG ไม่เกิน 5MB</p>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-violet-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Link href="/register/payment">
                    <motion.button
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      ย้อนกลับ
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={handleSubmit}
                    className={`bg-violet-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-violet-700 transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันการชำระเงิน'}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 