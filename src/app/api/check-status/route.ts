import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('search')

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุอีเมลที่ใช้ลงทะเบียน' },
        { status: 400 }
      )
    }

    // ค้นหาจากอีเมลที่ตรงกัน
    const registrations = await prisma.registration.findMany({
      where: {
        email: email.trim()
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        eventType: true,
        createdAt: true,
        payment: {
          select: {
            amount: true,
            paymentStatus: true,
            paymentDate: true,
            verificationNote: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ 
      success: true, 
      registrations 
    })
  } catch (error) {
    console.error('Error in GET /api/check-status:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'เกิดข้อผิดพลาดในการค้นหาข้อมูล กรุณาลองใหม่อีกครั้ง'
      },
      { status: 500 }
    )
  }
} 