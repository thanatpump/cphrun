'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FaDatabase, FaMoneyBillWave, FaShippingFast, FaSignOutAlt, FaChartBar } from 'react-icons/fa'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await fetch('/api/admin/registrations')
        const data = await response.json()
        
        if (!data.success) {
          setError('ไม่สามารถดึงข้อมูลได้')
        }
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      if (response.ok) {
        router.push('/admin/login')
      }
    } catch (err) {
      console.error('Logout failed:', err)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">แผงควบคุม</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <FaSignOutAlt /> ออกจากระบบ
          </button>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => handleNavigate('/admin/dashboard')}
            className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6 hover:bg-violet-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-violet-100 p-3 rounded-full">
                <FaChartBar className="text-xl text-violet-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">แดชบอร์ด</p>
                <p className="text-sm text-gray-600">ดูภาพรวมและสถิติทั้งหมด</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => handleNavigate('/admin/registrations')}
            className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6 hover:bg-violet-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-violet-100 p-3 rounded-full">
                <FaDatabase className="text-xl text-violet-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">จัดการการลงทะเบียน</p>
                <p className="text-sm text-gray-600">ดูและแก้ไขข้อมูลผู้สมัคร</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => handleNavigate('/admin/payments')}
            className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6 hover:bg-violet-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-violet-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-xl text-violet-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">ตรวจสอบการชำระเงิน</p>
                <p className="text-sm text-gray-600">ยืนยันและจัดการการชำระเงิน</p>
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => handleNavigate('/admin/shipping')}
            className="flex items-center justify-between bg-white rounded-xl shadow-lg p-6 hover:bg-violet-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="bg-violet-100 p-3 rounded-full">
                <FaShippingFast className="text-xl text-violet-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">จัดการการจัดส่ง</p>
                <p className="text-sm text-gray-600">ตรวจสอบและอัพเดทสถานะการจัดส่ง</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  )
} 