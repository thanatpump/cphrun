'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaCheckCircle } from 'react-icons/fa'

export default function Success() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 10000) // 10 วินาที

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-violet-100">
            <div className="flex justify-center mb-6">
              <FaCheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-violet-900 mb-4">ขอบคุณที่ลงทะเบียน</h1>
            <p className="text-xl text-gray-600 mb-6">ลงทะเบียนสำเร็จ!</p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <p className="text-yellow-700">
                ระบบจะทำการตรวจสอบข้อมูลการลงทะเบียนและหลักฐานการชำระเงินของคุณภายใน 24 ชั่วโมง
              </p>
            </div>

            <p className="text-gray-600 mb-6">
              คุณสามารถตรวจสอบสถานะการลงทะเบียนได้ที่หน้าเว็บไซต์ โดยใช้อีเมลที่ใช้ในการลงทะเบียน
            </p>

            <div className="text-sm text-gray-500">
              ระบบจะนำคุณกลับไปยังหน้าหลักในอีก 10 วินาที...
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 