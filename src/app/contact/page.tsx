'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-violet-900 mb-8 text-center">ช่องทางการติดต่อ</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="text-2xl mt-1">📞</span>
                <div>
                  <p className="font-semibold text-violet-600">โทรศัพท์</p>
                  <p className="text-lg">063-0287628, 044-104610</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <span className="text-2xl mt-1">📍</span>
                <div>
                  <p className="font-semibold text-violet-600">ที่อยู่</p>
                  <p className="text-lg">โรงพยาบาลชัยภูมิ ถ.บรรณาการ ต.ในเมือง อ.เมือง จ.ชัยภูมิ 36000</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p className="font-semibold text-violet-600">ติดตามเราได้ที่</p>
              <div className="flex flex-col space-y-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=100077671868056" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                >
                  <span className="text-2xl">🌐</span>
                  <span className="text-lg">Facebook</span>
                </a>
                <a 
                  href="https://lin.ee/4Gwt5Fl" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                >
                  <span className="text-2xl">💬</span>
                  <span className="text-lg">Line</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              กลับไปหน้าแรก
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 