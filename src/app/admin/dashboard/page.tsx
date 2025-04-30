'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaUsers, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa'
import { Registration } from '@prisma/client'
import dynamic from 'next/dynamic'

// Dynamic import for Recharts to avoid SSR issues
const RechartsPieChart = dynamic(
  () => import('recharts').then(mod => mod.PieChart),
  { ssr: false }
)
const RechartsPie = dynamic(
  () => import('recharts').then(mod => mod.Pie),
  { ssr: false }
)
const RechartsCell = dynamic(
  () => import('recharts').then(mod => mod.Cell),
  { ssr: false }
)
const RechartsResponsiveContainer = dynamic(
  () => import('recharts').then(mod => mod.ResponsiveContainer),
  { ssr: false }
)
const RechartsLegend = dynamic(
  () => import('recharts').then(mod => mod.Legend),
  { ssr: false }
)
const RechartsTooltip = dynamic(
  () => import('recharts').then(mod => mod.Tooltip),
  { ssr: false }
)

interface DashboardStats {
  total: number
  completed: number
  pending: number
  rejected: number
  funrun: {
    completed: number
    pending: number
    rejected: number
  }
  minimarathon: {
    completed: number
    pending: number
    rejected: number
  }
  halfmarathon: {
    completed: number
    pending: number
    rejected: number
  }
  marathon: {
    completed: number
    pending: number
    rejected: number
  }
}

interface RegistrationWithPayment extends Registration {
  payment?: {
    paymentStatus: string
  }
}

const COLORS = {
  completed: '#10B981', // สีเขียว
  pending: '#F59E0B',   // สีเหลือง
  rejected: '#EF4444'   // สีแดง
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    completed: 0,
    pending: 0,
    rejected: 0,
    funrun: {
      completed: 0,
      pending: 0,
      rejected: 0
    },
    minimarathon: {
      completed: 0,
      pending: 0,
      rejected: 0
    },
    halfmarathon: {
      completed: 0,
      pending: 0,
      rejected: 0
    },
    marathon: {
      completed: 0,
      pending: 0,
      rejected: 0
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/registrations')
        const data = await response.json()
        
        if (data.success) {
          const registrations: RegistrationWithPayment[] = data.registrations

          // แยกตามประเภทการวิ่ง
          const funrunRegs = registrations.filter((r: RegistrationWithPayment) => r.eventType === 'FUNRUN')
          const miniRegs = registrations.filter((r: RegistrationWithPayment) => r.eventType === 'MINI')
          const halfRegs = registrations.filter((r: RegistrationWithPayment) => r.eventType === 'HALF')
          const marathonRegs = registrations.filter((r: RegistrationWithPayment) => r.eventType === 'FULL')

          // Calculate statistics
          const stats = {
            total: registrations.length,
            completed: registrations.filter((r: RegistrationWithPayment) => r.paymentStatus === 'COMPLETED').length,
            pending: registrations.filter((r: RegistrationWithPayment) => ['PENDING', 'PENDING_REVIEW'].includes(r.paymentStatus)).length,
            rejected: registrations.filter((r: RegistrationWithPayment) => r.paymentStatus === 'REJECTED').length,
            funrun: {
              completed: funrunRegs.filter((r: RegistrationWithPayment) => r.paymentStatus === 'COMPLETED').length,
              pending: funrunRegs.filter((r: RegistrationWithPayment) => ['PENDING', 'PENDING_REVIEW'].includes(r.paymentStatus)).length,
              rejected: funrunRegs.filter((r: RegistrationWithPayment) => r.paymentStatus === 'REJECTED').length
            },
            minimarathon: {
              completed: miniRegs.filter((r: RegistrationWithPayment) => r.paymentStatus === 'COMPLETED').length,
              pending: miniRegs.filter((r: RegistrationWithPayment) => ['PENDING', 'PENDING_REVIEW'].includes(r.paymentStatus)).length,
              rejected: miniRegs.filter((r: RegistrationWithPayment) => r.paymentStatus === 'REJECTED').length
            },
            halfmarathon: {
              completed: halfRegs.filter((r: RegistrationWithPayment) => r.paymentStatus === 'COMPLETED').length,
              pending: halfRegs.filter((r: RegistrationWithPayment) => ['PENDING', 'PENDING_REVIEW'].includes(r.paymentStatus)).length,
              rejected: halfRegs.filter((r: RegistrationWithPayment) => r.paymentStatus === 'REJECTED').length
            },
            marathon: {
              completed: marathonRegs.filter((r: RegistrationWithPayment) => r.paymentStatus === 'COMPLETED').length,
              pending: marathonRegs.filter((r: RegistrationWithPayment) => ['PENDING', 'PENDING_REVIEW'].includes(r.paymentStatus)).length,
              rejected: marathonRegs.filter((r: RegistrationWithPayment) => r.paymentStatus === 'REJECTED').length
            }
          }
          setStats(stats)
        } else {
          setError('ไม่สามารถดึงข้อมูลได้')
        }
      } catch {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">ข้อผิดพลาด!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    )
  }

  const cards = [
    {
      title: 'การลงทะเบียนทั้งหมด',
      value: stats.total,
      icon: FaUsers,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'ชำระเงินสำเร็จ',
      value: stats.completed,
      icon: FaCheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'รอดำเนินการ',
      value: stats.pending,
      icon: FaClock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    },
    {
      title: 'ยกเลิก',
      value: stats.rejected,
      icon: FaTimesCircle,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    }
  ]

  const createChartData = (data: { completed: number; pending: number; rejected: number }) => [
    { name: 'ชำระเงินสำเร็จ', value: data.completed },
    { name: 'รอดำเนินการ', value: data.pending },
    { name: 'ยกเลิก', value: data.rejected }
  ]

  const renderPieChart = (data: { name: string; value: number }[], title: string) => {
    if (typeof window === 'undefined') return null; // Prevent SSR issues
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-900">{title}</h2>
        <div className="w-full h-[300px]">
          <RechartsResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <RechartsPie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <RechartsCell 
                    key={`cell-${index}`} 
                    fill={
                      entry.name === 'ชำระเงินสำเร็จ' ? COLORS.completed :
                      entry.name === 'รอดำเนินการ' ? COLORS.pending :
                      COLORS.rejected
                    }
                  />
                ))}
              </RechartsPie>
              <RechartsTooltip 
                formatter={(value) => [`${value} คน`, 'จำนวนผู้สมัคร']}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#1f2937' }}
              />
              <RechartsLegend 
                wrapperStyle={{ color: '#1f2937' }}
              />
            </RechartsPieChart>
          </RechartsResponsiveContainer>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">แดชบอร์ด</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${card.color} bg-opacity-20`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              <motion.span 
                className="text-3xl font-bold text-gray-900"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: index * 0.1 + 0.3
                }}
              >
                {card.value}
              </motion.span>
            </div>
            <h3 className="text-gray-800 text-sm">{card.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Registration Type Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderPieChart(createChartData(stats.funrun), 'Fun Run')}
        {renderPieChart(createChartData(stats.minimarathon), 'Mini Marathon')}
        {renderPieChart(createChartData(stats.halfmarathon), 'Half Marathon')}
        {renderPieChart(createChartData(stats.marathon), 'Full Marathon')}
      </div>
    </div>
  )
} 