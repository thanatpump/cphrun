import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // ตรวจสอบข้อมูลที่จำเป็น
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'age',
      'eventType',
      'shirtSize',
      'deliveryMethod',
      'emergencyPhone'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, message: `กรุณากรอก${field}` },
          { status: 400 }
        );
      }
    }

    // ตรวจสอบข้อมูลที่อยู่จัดส่งถ้าเลือกวิธีจัดส่ง
    if (data.deliveryMethod === 'shipping') {
      if (!data.shippingAddress) {
        return NextResponse.json(
          { success: false, message: 'กรุณากรอกที่อยู่จัดส่ง' },
          { status: 400 }
        );
      }
    }

    // ตรวจสอบอีเมล
    const existingUser = await prisma.registration.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'อีเมลนี้ได้ลงทะเบียนแล้ว' },
        { status: 400 }
      );
    }

    // สร้างการลงทะเบียนใหม่
    const registration = await prisma.registration.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        shirtSize: data.shirtSize === 'other' ? data.otherShirtSize : data.shirtSize,
        deliveryMethod: data.deliveryMethod,
        age: parseInt(data.age),
        emergencyPhone: data.emergencyPhone,
        address: data.shippingAddress?.address || null,
        subDistrict: data.shippingAddress?.subDistrict || null,
        district: data.shippingAddress?.district || null,
        province: data.shippingAddress?.province || null,
        postalCode: data.shippingAddress?.postalCode || null,
        paymentStatus: 'PENDING'
      }
    });

    // สร้างข้อมูลการชำระเงิน
    const payment = await prisma.payment.create({
      data: {
        registrationId: registration.id,
        amount: data.eventType === 'funrun' ? 400 : 
                data.eventType === 'minimarathon' ? 500 : 1000,
        paymentStatus: 'PENDING',
        paymentMethod: 'bank_transfer'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'ลงทะเบียนสำเร็จ',
      data: {
        registrationId: registration.id,
        paymentId: payment.id,
        ...registration,
        payment: payment
      }
    });
  } catch (error) {
    console.error('Error:', error);
    
    // ตรวจสอบ Prisma errors
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'อีเมลนี้ได้ลงทะเบียนแล้ว' },
        { status: 400 }
      );
    }

    // ตรวจสอบ validation errors
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
} 