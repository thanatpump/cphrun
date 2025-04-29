import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // ตรวจสอบการเข้าสู่ระบบ
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' },
        { status: 401 }
      )
    }

    // ดึงและตรวจสอบ registrationId
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('registrationId')
    
    // สร้าง query conditions
    const where = {
      ...(registrationId ? { registrationId: parseInt(registrationId) } : {}),
      // ถ้าไม่มี registrationId ให้แสดงเฉพาะรายการที่รอตรวจสอบ
      ...(!registrationId ? { paymentStatus: 'PENDING_VERIFICATION' } : {})
    }

    // ดึงข้อมูลการชำระเงิน
    const payments = await prisma.payment.findMany({
      where,
      select: {
        id: true,
        registrationId: true,
        amount: true,
        paymentMethod: true,
        paymentDate: true,
        paymentStatus: true,
        receiptImage: true,
        verificationNote: true,
        createdAt: true,
        registration: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            eventType: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ 
      success: true, 
      payments 
    })

  } catch (error) {
    console.error('Error in GET /api/admin/payments:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง'
      },
      { status: 500 }
    )
  }
} 