import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { EVENT_PRICES } from '@/constants'

type EventType = keyof typeof EVENT_PRICES

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { registrationId } = body

    if (!registrationId) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุรหัสการลงทะเบียน' },
        { status: 400 }
      )
    }

    // ค้นหาการลงทะเบียน
    const registration = await prisma.registration.findUnique({
      where: { id: parseInt(registrationId) },
      include: {
        payment: true
      }
    })

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบข้อมูลการลงทะเบียน' },
        { status: 404 }
      )
    }

    // ตรวจสอบว่ามีการชำระเงินแล้วหรือไม่
    if (registration.payment) {
      return NextResponse.json(
        { success: false, message: 'มีการชำระเงินสำหรับการลงทะเบียนนี้แล้ว' },
        { status: 400 }
      )
    }

    try {
      // ตรวจสอบราคาก่อนทำ transaction
      const amount = EVENT_PRICES[registration.eventType as EventType]
      if (!amount) {
        throw new Error('ไม่พบราคาสำหรับประเภทการแข่งขันนี้')
      }

      // สร้างข้อมูลการชำระเงิน
      const payment = await prisma.payment.create({
        data: {
          registrationId: registration.id,
          amount,
          paymentStatus: 'PENDING',
          paymentMethod: 'BANK_TRANSFER'
        }
      })

      return NextResponse.json({
        success: true,
        data: {
          paymentId: payment.id,
          amount: payment.amount,
          registrationId: payment.registrationId
        }
      })

    } catch (error) {
      console.error('Error creating payment:', error)
      return NextResponse.json(
        { 
          success: false, 
          message: 'เกิดข้อผิดพลาดในการสร้างข้อมูลการชำระเงิน',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดในการยืนยันการชำระเงิน',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 