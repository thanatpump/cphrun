const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // ลบข้อมูลในตาราง Payment ก่อน
    await prisma.payment.deleteMany()
    console.log('ลบข้อมูลในตาราง Payment เรียบร้อยแล้ว')

    // ลบข้อมูลในตาราง Registration
    await prisma.registration.deleteMany()
    console.log('ลบข้อมูลในตาราง Registration เรียบร้อยแล้ว')
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 