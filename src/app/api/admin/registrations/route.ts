import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Registration, Payment } from '@prisma/client';

interface RegistrationWithPayment extends Registration {
  payment: Payment | null
}

// GET /api/admin/registrations
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    console.log('Fetching registrations with payment data...');
    
    const registrations = await prisma.registration.findMany({
      include: {
        payment: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${registrations.length} registrations`);
    
    // Log payment status distribution
    const paymentStatusCount = (registrations as RegistrationWithPayment[]).reduce((acc: Record<string, number>, reg: RegistrationWithPayment) => {
      const status = reg.paymentStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Payment status distribution:', paymentStatusCount);

    return NextResponse.json({
      success: true,
      registrations,
      debug: {
        totalCount: registrations.length,
        paymentStatusCount
      }
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'เกิดข้อผิดพลาดในการดึงข้อมูล',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 