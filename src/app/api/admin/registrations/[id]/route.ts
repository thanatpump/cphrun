import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      )
    }

    const id = parseInt(context.params.id)
    
    if (isNaN(id)) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid ID' }),
        { status: 400 }
      )
    }

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        payment: true
      }
    })

    if (!registration) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Registration not found' }),
        { status: 404 }
      )
    }

    // แปลงข้อมูลให้ตรงกับหน้าหลัก
    const formattedRegistration = {
      ...registration,
      paymentStatus: registration.payment?.paymentStatus === 'COMPLETED' ? 'completed' :
                    registration.payment?.paymentStatus === 'REJECTED' ? 'rejected' :
                    'pending'
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        data: formattedRegistration
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching registration:', error)
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const id = parseInt(context.params.id)
    const body = await request.json()

    // ตรวจสอบข้อมูลที่จำเป็น
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'age', 'eventType', 'shirtSize', 'deliveryMethod', 'emergencyPhone']
    for (const field of requiredFields) {
      if (!body[field]) {
        return new NextResponse(
          JSON.stringify({ success: false, message: `กรุณากรอก ${field}` }),
          { status: 400 }
        )
      }
    }

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่ (ยกเว้นอีเมลเดิมของตัวเอง)
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        email: body.email,
        NOT: {
          id: id
        }
      }
    })

    if (existingRegistration) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'อีเมลนี้ถูกใช้งานแล้ว' }),
        { status: 400 }
      )
    }

    // อัพเดทข้อมูล
    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        age: parseInt(body.age),
        eventType: body.eventType,
        shirtSize: body.shirtSize,
        deliveryMethod: body.deliveryMethod,
        emergencyPhone: body.emergencyPhone,
        ...(body.deliveryMethod === 'SHIPPING' && {
          shippingAddress: body.shippingAddress
        })
      },
      include: {
        payment: true
      }
    })

    // แปลงข้อมูลให้ตรงกับหน้าหลัก
    const formattedRegistration = {
      ...updatedRegistration,
      paymentStatus: updatedRegistration.payment?.paymentStatus === 'COMPLETED' ? 'completed' :
                    updatedRegistration.payment?.paymentStatus === 'REJECTED' ? 'rejected' :
                    'pending'
    }

    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: 'อัพเดทข้อมูลสำเร็จ',
        registration: formattedRegistration
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating registration:', error)
    return new NextResponse(
      JSON.stringify({ success: false, message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' }),
      { status: 500 }
    )
  }
} 