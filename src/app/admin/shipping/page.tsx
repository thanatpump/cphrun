'use client'

import { useEffect, useState } from 'react'
import { RegistrationData } from '@/types'
import { formatDate } from '@/utils/date'

export default function ShippingPage() {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkedRows, setCheckedRows] = useState<number[]>([])

  useEffect(() => {
    // โหลดค่า checkedRows จาก localStorage เมื่อโหลดหน้า
    const savedCheckedRows = localStorage.getItem('shippingCheckedRows')
    if (savedCheckedRows) {
      setCheckedRows(JSON.parse(savedCheckedRows))
    }

    const fetchRegistrations = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/shipping')
        if (!response.ok) {
          throw new Error('ไม่สามารถโหลดข้อมูลได้')
        }
        const data = await response.json()
        
        if (data.success && Array.isArray(data.shippingList)) {
          setRegistrations(data.shippingList)
        } else {
          throw new Error('รูปแบบข้อมูลไม่ถูกต้อง')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด')
        setRegistrations([])
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

  const handlePrint = (registration: RegistrationData) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>รายละเอียดการจัดส่ง</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .info { margin-bottom: 10px; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>รายละเอียดการจัดส่ง</h2>
            </div>
            <div class="info">
              <span class="label">ชื่อ-นามสกุล:</span> ${registration.firstName} ${registration.lastName}
            </div>
            <div class="info">
              <span class="label">เบอร์โทรศัพท์:</span> ${registration.phone}
            </div>
            <div class="info">
              <span class="label">ที่อยู่จัดส่ง:</span><br>
              ${registration.address}<br>
              ตำบล/แขวง ${registration.subDistrict}<br>
              อำเภอ/เขต ${registration.district}<br>
              จังหวัด ${registration.province}<br>
              รหัสไปรษณีย์ ${registration.postalCode}
            </div>
            <div class="info">
              <span class="label">ขนาดเสื้อ:</span> ${registration.shirtSize}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleCheckboxChange = (id: number) => {
    setCheckedRows(prev => {
      const newCheckedRows = prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
      
      // บันทึกค่า checkedRows ลง localStorage
      localStorage.setItem('shippingCheckedRows', JSON.stringify(newCheckedRows))
      
      return newCheckedRows
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">เกิดข้อผิดพลาด</h3>
            <p className="mt-2 text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              รายการจัดส่งเสื้อ
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              รายการผู้ลงทะเบียนที่เลือกวิธีการรับเสื้อเป็น &quot;จัดส่งทางไปรษณีย์&quot;
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เลือก
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      รหัส
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ชื่อ-นามสกุล
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      เบอร์โทรศัพท์
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ที่อยู่จัดส่ง
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ขนาดเสื้อ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      พิมพ์
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                        ไม่พบข้อมูลการลงทะเบียนที่เลือกวิธีการรับเสื้อเป็น &quot;จัดส่งทางไปรษณีย์&quot;
                      </td>
                    </tr>
                  ) : (
                    registrations.map((registration) => (
                      <tr 
                        key={registration.id}
                        className={checkedRows.includes(registration.id) ? 'bg-green-50' : ''}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={checkedRows.includes(registration.id)}
                            onChange={() => handleCheckboxChange(registration.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {registration.firstName} {registration.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.phone}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {registration.address}<br />
                          ตำบล/แขวง {registration.subDistrict}<br />
                          อำเภอ/เขต {registration.district}<br />
                          จังหวัด {registration.province}<br />
                          รหัสไปรษณีย์ {registration.postalCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {registration.shirtSize}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => handlePrint(registration)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            พิมพ์
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 