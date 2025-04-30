import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { shippingStatus } = await request.json()

    // อัพเดทสถานะการจัดส่ง
    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: { shippingStatus },
    })

    return NextResponse.json({ success: true, registration: updatedRegistration })
  } catch (error) {
    console.error('Error updating shipping status:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทสถานะการจัดส่ง' },
      { status: 500 }
    )
  }
} 