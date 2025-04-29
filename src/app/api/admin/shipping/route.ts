import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching shipping data...')
    
    // ดึงข้อมูลเฉพาะคนที่เลือกวิธีรับเป็นการจัดส่ง
    const registrations = await prisma.registration.findMany({
      where: {
        deliveryMethod: 'shipping',
        paymentStatus: 'COMPLETED',
        address: {
          not: null
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        eventType: true,
        shirtSize: true,
        address: true,
        subDistrict: true,
        district: true,
        province: true,
        postalCode: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('Found registrations:', registrations.length)

    return NextResponse.json({
      success: true,
      shippingList: registrations
    })
  } catch (error) {
    console.error('Error details:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 