import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prismaClient = new PrismaClient()

async function main() {
  // สร้างข้อมูลการลงทะเบียนตัวอย่าง
  const registration = await prismaClient.registration.create({
    data: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '0812345678',
      age: 25,
      eventType: 'FULL',
      shirtSize: 'M',
      deliveryMethod: 'PICKUP',
      emergencyPhone: '0898765432'
    }
  })

  // สร้างข้อมูลการชำระเงิน
  await prismaClient.payment.create({
    data: {
      amount: 1500,
      paymentMethod: 'BANK_TRANSFER',
      registrationId: registration.id,
      paymentStatus: 'PENDING',
      paymentDate: new Date()
    }
  })

  // สร้าง admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prismaClient.adminUser.create({
    data: {
      username: 'admin',
      passwordHash: hashedPassword,
      role: 'admin'
    }
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prismaClient.$disconnect()
  }) 