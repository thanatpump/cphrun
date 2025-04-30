const fs = require('fs')
const path = require('path')

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

// ตรวจสอบว่าโฟลเดอร์มีอยู่จริง
if (fs.existsSync(uploadsDir)) {
  // อ่านรายการไฟล์ทั้งหมดในโฟลเดอร์
  const files = fs.readdirSync(uploadsDir)
  
  // ลบไฟล์ทีละไฟล์
  for (const file of files) {
    const filePath = path.join(uploadsDir, file)
    try {
      fs.unlinkSync(filePath)
      console.log(`ลบไฟล์ ${file} เรียบร้อยแล้ว`)
    } catch (error) {
      console.error(`ไม่สามารถลบไฟล์ ${file} ได้:`, error)
    }
  }
  
  console.log('ลบไฟล์ทั้งหมดเรียบร้อยแล้ว')
} else {
  console.log('ไม่พบโฟลเดอร์ uploads')
} 