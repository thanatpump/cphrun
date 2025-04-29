import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    // ตรวจสอบว่า paymentId เป็นตัวเลข
    const paymentId = parseInt(params.paymentId);
    if (isNaN(paymentId)) {
      return NextResponse.json(
        { success: false, error: 'รหัสการชำระเงินไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // ค้นหาข้อมูลการชำระเงินจากฐานข้อมูล
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        registration: true
      }
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบข้อมูลการชำระเงิน' },
        { status: 404 }
      );
    }

    // อัพเดทสถานะการชำระเงินและลงทะเบียน
    if (payment.paymentStatus === 'verified') {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          paymentStatus: 'verified',
          verificationNote: 'ยืนยันการชำระเงิน',
          paymentDate: new Date()
        }
      });

      await prisma.registration.update({
        where: { id: payment.registrationId },
        data: { paymentStatus: 'success' }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        status: payment.paymentStatus,
        paymentId: payment.id,
        registrationId: payment.registrationId,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        paymentDate: payment.paymentDate,
        verificationNote: payment.verificationNote
      }
    });
  } catch (error) {
    console.error('Error checking payment status:', error);
    
    // ตรวจสอบ Prisma errors
    if (error instanceof Error && 'code' in error) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { success: false, error: 'ไม่พบข้อมูลการชำระเงิน' },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการตรวจสอบสถานะการชำระเงิน' },
      { status: 500 }
    );
  }
} 