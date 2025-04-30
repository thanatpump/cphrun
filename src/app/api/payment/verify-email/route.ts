import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EVENT_PRICES } from '@/constants'

type EventType = keyof typeof EVENT_PRICES

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุอีเมล' },
        { status: 400 }
      )
    }

    // ค้นหาการลงทะเบียนจากอีเมล
    const registration = await prisma.registration.findFirst({
      where: { 
        email: email,
        paymentStatus: 'PENDING' // เฉพาะรายการที่รอการชำระเงิน
      },
      include: { 
        payment: true 
      },
      orderBy: {
        createdAt: 'desc' // เรียงจากใหม่ไปเก่า
      }
    })

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลการลงทะเบียนที่รอการชำระเงิน' },
        { status: 404 }
      )
    }

    // ดึงข้อมูลการชำระเงิน
    const amount = EVENT_PRICES[registration.eventType as EventType]

    return NextResponse.json({
      success: true,
      data: {
        id: registration.id,
        amount,
        firstName: registration.firstName,
        lastName: registration.lastName,
        eventType: registration.eventType,
        email: registration.email
      }
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการตรวจสอบการชำระเงิน',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 