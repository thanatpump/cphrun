import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { registrationId } = await request.json()

    if (!registrationId) {
      return NextResponse.json({
        success: false,
        error: 'ไม่พบรหัสการลงทะเบียน'
      })
    }

    const registration = await prisma.registration.findUnique({
      where: {
        id: registrationId
      }
    })

    if (!registration) {
      return NextResponse.json({
        success: false,
        error: 'ไม่พบข้อมูลการลงทะเบียน'
      })
    }

    // TODO: ในอนาคตจะเพิ่มการเช็คกับระบบธนาคารจริง
    // สำหรับตอนนี้จะสมมติว่าชำระเงินแล้ว
    await prisma.registration.update({
      where: {
        id: registrationId
      },
      data: {
        paymentStatus: 'COMPLETED',
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      status: 'COMPLETED'
    })
  } catch (error) {
    console.error('Error checking payment status:', error)
    return NextResponse.json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะการชำระเงิน'
    })
  }
} 