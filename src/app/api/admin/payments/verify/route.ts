import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma, PrismaClient } from '@prisma/client'

export async function POST(request: Request) {
  try {
    console.log('Received verification request')
    
    // ตรวจสอบ session ของ admin
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    if (!session?.user?.id) {
      console.log('No valid session found')
      return NextResponse.json(
        { success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { paymentId, status, verificationNote } = body

    if (!paymentId || !status) {
      console.log('Missing required fields:', { paymentId, status })
      return NextResponse.json(
        {
          success: false,
          message: 'กรุณาระบุ paymentId และสถานะการตรวจสอบ'
        },
        { status: 400 }
      )
    }

    // ตรวจสอบว่าสถานะถูกต้อง
    const validStatuses = ['COMPLETED', 'REJECTED']
    if (!validStatuses.includes(status)) {
      console.log('Invalid status:', status)
      return NextResponse.json(
        {
          success: false,
          message: 'สถานะการตรวจสอบไม่ถูกต้อง'
        },
        { status: 400 }
      )
    }

    // ตรวจสอบว่ามี payment อยู่จริง
    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { registration: true }
    })

    if (!existingPayment) {
      console.log('Payment not found:', paymentId)
      return NextResponse.json(
        {
          success: false,
          message: 'ไม่พบข้อมูลการชำระเงิน'
        },
        { status: 404 }
      )
    }

    console.log('Found payment:', existingPayment)

    // อัพเดทข้อมูลการชำระเงินและการลงทะเบียนในทรานแซคชั่นเดียวกัน
    const result = await prisma.$transaction(async (tx) => {
      console.log('Starting transaction')
      
      // อัพเดทข้อมูลการชำระเงิน
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          paymentStatus: status === 'COMPLETED' ? 'COMPLETED' : 'REJECTED',
          paymentDate: status === 'COMPLETED' ? new Date() : null,
          verificationNote: verificationNote || null,
          updatedAt: new Date()
        },
        include: {
          registration: true
        }
      })

      console.log('Updated payment:', payment)

      // อัพเดทสถานะการลงทะเบียน
      await tx.registration.update({
        where: { id: payment.registrationId },
        data: {
          paymentStatus: status === 'COMPLETED' ? 'COMPLETED' : 'REJECTED'
        }
      })

      console.log('Updated registration:', payment.registration)

      // อัพเดทข้อมูลผู้ดูแลระบบ
      await tx.adminUser.update({
        where: { id: parseInt(session.user.id) },
        data: {
          lastVerifiedAt: new Date(),
          lastVerifiedPaymentId: payment.id
        }
      })

      console.log('Updated admin:', session.user)

      return payment
    })

    console.log('Transaction completed successfully')

    return NextResponse.json({
      success: true,
      message: status === 'COMPLETED' ? 'ยืนยันการชำระเงินเรียบร้อย' : 'ปฏิเสธการชำระเงินเรียบร้อย',
      data: result
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