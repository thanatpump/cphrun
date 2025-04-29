'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPrint, FaSearch } from 'react-icons/fa'

interface ShippingInfo {
  id: number
  firstName: string
  lastName: string
  address: string
  subDistrict: string
  district: string
  province: string
  postalCode: string
  phone: string
  eventType: string
  shirtSize: string
}

export default function AdminShippingPage() {
  const [shippingList, setShippingList] = useState<ShippingInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchShippingData()
  }, [])

  const fetchShippingData = async () => {
    try {
      const response = await fetch('/api/admin/shipping')
      const data = await response.json()

      if (data.success) {
        setShippingList(data.shippingList)
      } else {
        setError('ไม่สามารถโหลดข้อมูลได้')
      }
    } catch {
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = (info: ShippingInfo) => {
    // สร้าง HTML สำหรับพิมพ์
    const printContent = `
      <div style="font-family: 'Sarabun', sans-serif; padding: 20px; max-width: 400px; margin: 0 auto;">
        <div style="font-size: 18px; margin-bottom: 10px;">
          <strong>ผู้รับ:</strong> ${info.firstName} ${info.lastName}
        </div>
        <div style="font-size: 16px; margin-bottom: 20px;">
          <strong>ที่อยู่:</strong><br/>
          ${info.address}<br/>
          ตำบล/แขวง ${info.subDistrict}<br/>
          อำเภอ/เขต ${info.district}<br/>
          จังหวัด ${info.province}<br/>
          รหัสไปรษณีย์ ${info.postalCode}
        </div>
        <div style="font-size: 16px; margin-bottom: 10px;">
          <strong>เบอร์โทร:</strong> ${info.phone}
        </div>
        <div style="font-size: 14px; color: #666;">
          <strong>ประเภท:</strong> ${info.eventType}<br/>
          <strong>ไซส์เสื้อ:</strong> ${info.shirtSize}
        </div>
      </div>
    `

    // เปิดหน้าต่างใหม่สำหรับพิมพ์
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>พิมพ์ที่อยู่จัดส่ง</title>
            <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap" rel="stylesheet">
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }

  const filteredList = shippingList.filter(info =>
    info.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    info.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    info.province.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              จัดการข้อมูลการจัดส่ง
            </h1>
            <p className="text-lg text-gray-600">
              รายการที่อยู่สำหรับจัดส่งเสื้อ
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="ค้นหาจากชื่อหรือจังหวัด..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Shipping List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((info) => (
              <motion.div
                key={info.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {info.firstName} {info.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{info.phone}</p>
                  </div>
                  <button
                    onClick={() => handlePrint(info)}
                    className="text-violet-600 hover:text-violet-800 transition-colors"
                    title="พิมพ์ที่อยู่"
                  >
                    <FaPrint size={20} />
                  </button>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    {info.address}
                  </p>
                  <p className="text-gray-700">
                    ต.{info.subDistrict} อ.{info.district}
                  </p>
                  <p className="text-gray-700">
                    จ.{info.province} {info.postalCode}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ประเภท: {info.eventType}</span>
                    <span className="text-gray-600">ไซส์เสื้อ: {info.shirtSize}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredList.length === 0 && (
            <div className="text-center text-gray-500 mt-8">
              ไม่พบข้อมูลการจัดส่ง
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 