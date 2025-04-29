import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ดึงและตรวจสอบ registrationId
    const { searchParams } = new URL(request.url)
    const registrationId = searchParams.get('registrationId')
    
    // สร้าง query conditions
    const where = registrationId 
      ? { registrationId: parseInt(registrationId) }
      : {}  // เอาเงื่อนไข paymentStatus ออก เพื่อให้แสดงข้อมูลทั้งหมด

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

    return NextResponse.json({ success: true, payments })

  } catch (error) {
    console.error('Error in GET /api/admin/payments:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
} 