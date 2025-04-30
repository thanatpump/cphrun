'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-violet-900">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
        <div className="relative h-full flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white text-center"
          >
            เกี่ยวกับงานวิ่ง
          </motion.h1>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* ข้อมูลทั่วไป */}
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-violet-800 mb-6">ข้อมูลทั่วไป</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>งานวิ่งมาราธอนการกุศล โรงพยาบาลชัยภูมิ จัดขึ้นเพื่อเฉลิมฉลองครบรอบ 72 ปีของโรงพยาบาลชัยภูมิ</p>
              <p>รายได้จากการจัดงานจะนำไปใช้ในการพัฒนาระบบสาธารณสุขและการให้บริการทางการแพทย์ของโรงพยาบาลชัยภูมิ</p>
            </div>
          </section>

          {/* วันเวลาและสถานที่ */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-violet-800 mb-6">วันและเวลา</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-violet-600">📅</span>
                  <p>วันเสาร์ที่ 29 มิถุนายน 2568</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-violet-600">⏰</span>
                  <p>เวลา 04:00 น. - ลงทะเบียนและรับเสื้อ</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-violet-600">🏃</span>
                  <p>เวลา 05:00 น. - ปล่อยตัวนักวิ่ง</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-violet-800 mb-6">สถานที่</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-center space-x-3">
                  <span className="text-violet-600">🏁</span>
                  <p>จุดปล่อยตัว: ศาลากลางจังหวัดชัยภูมิ</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-violet-600">🎯</span>
                  <p>เส้นชัย: โรงพยาบาลชัยภูมิ</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-violet-600">📍</span>
                  <p>ที่อยู่: ถนนบรรณาการ ตำบลในเมือง อำเภอเมือง จังหวัดชัยภูมิ 36000</p>
                </div>
              </div>
            </div>
          </section>

          {/* ประเภทการแข่งขัน */}
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-violet-800 mb-6">ประเภทการแข่งขัน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-xl border border-violet-100">
                <h3 className="text-xl font-bold text-violet-700 mb-4">Fun Run 5 กม.</h3>
                <p className="text-gray-700 mb-6">เหมาะสำหรับผู้เริ่มต้นและนักวิ่งทั่วไป</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">👕</span>
                    <span>เสื้อที่ระลึก</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">🏅</span>
                    <span>เหรียญที่ระลึก</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">🎫</span>
                    <span>BIB หมายเลข</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">🛡️</span>
                    <span>ประกันอุบัติเหตุ</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-violet-50 to-white p-8 rounded-xl border border-violet-100">
                <h3 className="text-xl font-bold text-violet-700 mb-4">Mini Marathon 10 กม.</h3>
                <p className="text-gray-700 mb-6">สำหรับนักวิ่งที่มีประสบการณ์</p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">👕</span>
                    <span>เสื้อที่ระลึก</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">🏅</span>
                    <span>เหรียญที่ระลึก</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">🎫</span>
                    <span>BIB หมายเลข</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">🛡️</span>
                    <span>ประกันอุบัติเหตุ</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-violet-600">🏆</span>
                    <span>ถ้วยรางวัล (TOP 3)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* แผนผังเส้นทาง */}
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-violet-800 mb-6">แผนผังเส้นทาง</h2>
            <div className="aspect-video relative bg-gray-100 rounded-xl overflow-hidden">
              <Image
                src="/images/map.jpg"
                alt="แผนผังเส้นทางวิ่ง"
                fill
                className="object-cover"
              />
            </div>
          </section>

          {/* ข้อควรทราบ */}
          <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-violet-800 mb-6">ข้อควรทราบ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="text-violet-600 mt-1">⏰</span>
                  <span>กรุณามาถึงก่อนเวลาเริ่มงานอย่างน้อย 1 ชั่วโมง</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-violet-600 mt-1">💪</span>
                  <span>ควรเตรียมร่างกายให้พร้อมก่อนการแข่งขัน</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-violet-600 mt-1">💧</span>
                  <span>มีจุดบริการน้ำและอาหารว่างตามเส้นทาง</span>
                </li>
              </ul>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start space-x-3">
                  <span className="text-violet-600 mt-1">🏥</span>
                  <span>มีทีมแพทย์และพยาบาลคอยให้ความช่วยเหลือตลอดเส้นทาง</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-violet-600 mt-1">🚫</span>
                  <span>ห้ามนำสัตว์เลี้ยงเข้าแข่งขัน</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-violet-600 mt-1">🚫</span>
                  <span>ห้ามใช้รถจักรยานหรือยานพาหนะอื่นๆ</span>
                </li>
              </ul>
            </div>
          </section>

          <div className="text-center mb-12">
            <Link 
              href="/"
              className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              กลับไปหน้าแรก
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 