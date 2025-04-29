'use client'

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CountdownTimer from '@/components/CountdownTimer'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Marathon Background"
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/40" />
        </div>
        
        <motion.div
          className="relative z-10 container mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                72 ปี โรงพยาบาลชัยภูมิ
                <br />
                <span className="text-violet-300">วิ่งต้าน NCD</span>
              </h1>
              <motion.p 
                className="text-xl text-gray-300 mb-8"
                variants={itemVariants}
              >
                ครบรอบ 72 ปีโรงพยาบาลชัยภูมิ
                <br />
                วันที่ 29 มิถุนายน 2568
              </motion.p>
              <motion.div variants={itemVariants}>
                <Link 
                  href="/register"
                  className="inline-block bg-violet-500 hover:bg-violet-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  สมัครวิ่ง
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="relative lg:block hidden"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/marathon-image.png"
                  alt="Marathon Event"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="section bg-gradient-to-b from-violet-900 to-violet-800">
        <motion.div
          className="container mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">นับถอยหลังสู่การแข่งขัน</h2>
            <p className="text-xl text-gray-400">เตรียมพร้อมสำหรับการแข่งขันครั้งสำคัญ</p>
          </div>
          <CountdownTimer />
        </motion.div>
      </section>

      {/* Shirt Preview Section */}
      <section className="py-32 bg-white">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">เสื้อที่ระลึก</h2>
            <p className="text-xl text-gray-600">เสื้อที่ระลึกสุดพิเศษสำหรับนักวิ่งทุกท่าน</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-full h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/shirt.jpg"
                  alt="เสื้อที่ระลึก Marathon 2025"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900">รายละเอียดเสื้อ</h3>
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  เนื้อผ้าคุณภาพสูง ระบายอากาศดี
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  ดีไซน์พิเศษเฉพาะงาน
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  มีให้เลือกหลายขนาด XS, S, M, L, XL, 2XL
                </li>
              </ul>
              
              <div className="mt-8">
                <Link 
                  href="/register"
                  className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
                >
                  ลงทะเบียนเพื่อรับเสื้อ
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Event Info Section */}
      <section className="py-32 bg-hospital-light-gradient">
        <motion.div
          className="container mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-center mb-16">รายละเอียดการแข่งขัน</h2>
          <motion.div
            className="bg-white rounded-3xl p-12 shadow-xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-violet-600 mb-4">วันและเวลา</h3>
                  <p className="text-xl text-gray-700">วันเสาร์ที่ 29 มิถุนายน 2568</p>
                  <p className="text-xl text-gray-700">ปล่อยตัวเวลา 05:00 น.</p>
                  <p className="text-lg text-gray-600 mt-2">ลงทะเบียนและรับเสื้อ: 04:00 น.</p>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-violet-600 mb-4">สถานที่</h3>
                  <p className="text-xl text-gray-700">ศาลากลางจังหวัดชัยภูมิ</p>
                  <p className="text-lg text-gray-600 mt-2">จุดปล่อยตัว: บริเวณลานหน้าศาลากลาง</p>
                  <p className="text-lg text-gray-600">เส้นชัย: สวนสาธารณะหนองปลาเฒ่า</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-2xl font-bold text-violet-600 mb-6">ประเภทการแข่งขันและค่าสมัคร</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Funrun 5 กม.</h4>
                    <p className="text-3xl font-bold text-violet-600 mb-4">400 บาท</p>
                    <ul className="text-gray-600 space-y-2">
                      <li>• เสื้อที่ระลึก</li>
                      <li>• เหรียญที่ระลึก</li>
                      <li>• BIB หมายเลข</li>
                      <li>• ประกันอุบัติเหตุ</li>
                    </ul>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-violet-500">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Mini Marathon 10 กม.</h4>
                    <p className="text-3xl font-bold text-violet-600 mb-4">500 บาท</p>
                    <ul className="text-gray-600 space-y-2">
                      <li>• เสื้อที่ระลึก</li>
                      <li>• เหรียญที่ระลึก</li>
                      <li>• BIB หมายเลข</li>
                      <li>• ประกันอุบัติเหตุ</li>
                      <li>• ถ้วยรางวัล (TOP 3)</li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-violet-600 to-violet-700 p-6 rounded-xl shadow-lg text-white">
                    <h4 className="text-xl font-bold mb-2">VIP</h4>
                    <p className="text-3xl font-bold mb-4">1,000 บาท</p>
                    <ul className="space-y-2">
                      <li>• เสื้อที่ระลึกพรีเมียม</li>
                      <li>• เหรียญที่ระลึก</li>
                      <li>• BIB หมายเลข</li>
                      <li>• ประกันอุบัติเหตุ</li>
                      <li>• ถ้วยรางวัล (TOP 3)</li>
                      <li>• อาหารเช้า VIP</li>
                      <li>• ที่จอดรถพิเศษ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <footer className="bg-violet-900 text-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-violet-300 text-center">ช่องทางการติดต่อ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <span className="text-2xl mt-1">📞</span>
                  <div>
                    <p className="font-semibold text-violet-200">โทรศัพท์</p>
                    <p>063-0287628, 044-104610</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <span className="text-2xl mt-1">📍</span>
                  <div>
                    <p className="font-semibold text-violet-200">ที่อยู่</p>
                    <p>โรงพยาบาลชัยภูมิ ถ.บรรณาการ ต.ในเมือง อ.เมือง จ.ชัยภูมิ 36000</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-semibold text-violet-200">ติดตามเราได้ที่</p>
                <div className="flex space-x-6">
                  <a 
                    href="https://www.facebook.com/profile.php?id=100077671868056" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-violet-300 transition-colors group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">🌐</span>
                    <span>Facebook</span>
                  </a>
                  <a 
                    href="https://lin.ee/4Gwt5Fl" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 hover:text-violet-300 transition-colors group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
                    <span>Line</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-violet-800">
            <p className="text-violet-400 text-center">© 2025 Thanat Thincheelong. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
