'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const raceDate = new Date('2025-06-29T05:00:00') // วันที่ 29 มิถุนายน 2568 เวลา 05:00
      const difference = +raceDate - +new Date()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    const timer = setInterval(calculateTimeLeft, 1000)
    calculateTimeLeft()

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center gap-12">
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-6xl font-bold text-white mb-2 font-mono">
          {String(timeLeft.days).padStart(2, '0')}
        </div>
        <div className="text-xl text-gray-300">วัน</div>
      </motion.div>
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="text-6xl font-bold text-white mb-2 font-mono">
          {String(timeLeft.hours).padStart(2, '0')}
        </div>
        <div className="text-xl text-gray-300">ชั่วโมง</div>
      </motion.div>
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="text-6xl font-bold text-white mb-2 font-mono">
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <div className="text-xl text-gray-300">นาที</div>
      </motion.div>
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-6xl font-bold text-white mb-2 font-mono">
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
        <div className="text-xl text-gray-300">วินาที</div>
      </motion.div>
    </div>
  )
} 