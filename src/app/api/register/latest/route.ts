import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const registration = await prisma.registration.findFirst({
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        paymentStatus: 'PENDING'
      }
    })

    if (!registration) {
      return NextResponse.json({
        success: false,
        error: 'ไม่พบข้อมูลการลงทะเบียน'
      })
    }

    return NextResponse.json({
      success: true,
      registration
    })
  } catch (error) {
    console.error('Error fetching latest registration:', error)
    return NextResponse.json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
    })
  }
} 