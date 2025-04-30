import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import prisma from '@/lib/prisma'
import { Prisma, PrismaClient } from '@prisma/client'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export async function POST(request: Request) {
  try {
    console.log('Starting file upload process...')
    
    const formData = await request.formData()
    const file = formData.get('file') as Blob | null
    const registrationId = formData.get('registrationId')
    const paymentMethod = formData.get('paymentMethod') as string | null
    const amount = formData.get('amount') as string | null

    // Log all form data for debugging
    console.log('Form data received:', {
      hasFile: !!file,
      registrationId,
      fileType: file?.type,
      fileSize: file?.size,
      formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
        key,
        type: value instanceof Blob ? 'Blob' : typeof value,
        value: value instanceof Blob ? `Blob: ${value.size} bytes` : value
      }))
    })

    if (!file || !registrationId || !paymentMethod || !amount) {
      console.log('Missing required fields:', { hasFile: !!file, registrationId, paymentMethod, amount })
      return NextResponse.json(
        { 
          success: false, 
          message: 'กรุณาเลือกไฟล์และระบุรหัสการลงทะเบียน, วิธีการชำระเงิน, และจำนวนเงิน',
          debug: { hasFile: !!file, registrationId, paymentMethod, amount }
        },
        { status: 400 }
      )
    }

    // ตรวจสอบขนาดไฟล์
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: 'ขนาดไฟล์ต้องไม่เกิน 5MB',
          debug: { fileSize: file.size }
        },
        { status: 400 }
      )
    }

    // ตรวจสอบประเภทไฟล์
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: 'รองรับเฉพาะไฟล์ภาพ (JPG, JPEG, PNG)',
          debug: { fileType: file.type }
        },
        { status: 400 }
      )
    }

    // แปลง registrationId เป็นตัวเลข
    const registrationIdNumber = parseInt(registrationId.toString())
    if (isNaN(registrationIdNumber)) {
      return NextResponse.json(
        {
          success: false,
          message: 'รหัสการลงทะเบียนไม่ถูกต้อง',
          debug: { registrationId }
        },
        { status: 400 }
      )
    }

    // ตรวจสอบว่ามีการลงทะเบียนอยู่จริง
    let registration
    try {
      registration = await prisma.registration.findUnique({
        where: { id: registrationIdNumber },
        include: { payment: true }
      })
      console.log('Registration found:', { 
        id: registration?.id,
        hasPayment: !!registration?.payment
      })
    } catch (error) {
      console.error('Database error when finding registration:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        registrationId: registrationIdNumber
      })
      return NextResponse.json(
        { 
          success: false, 
          message: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูลการลงทะเบียน',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

    if (!registration) {
      console.log('Registration not found:', { registrationId })
      return NextResponse.json(
        { 
          success: false, 
          message: 'ไม่พบข้อมูลการลงทะเบียน',
          debug: { registrationId }
        },
        { status: 404 }
      )
    }

    // ตรวจสอบว่าการชำระเงินได้รับการยืนยันแล้วหรือไม่
    if (registration.payment?.paymentStatus === 'COMPLETED') {
      return NextResponse.json(
        {
          success: false,
          message: 'การชำระเงินนี้ได้รับการยืนยันแล้ว',
          debug: { registrationId }
        },
        { status: 400 }
      )
    }

    // สร้างโฟลเดอร์ uploads ถ้ายังไม่มี
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    console.log('Upload directory:', uploadDir)
    
    if (!existsSync(uploadDir)) {
      console.log('Creating uploads directory...')
      try {
        await mkdir(uploadDir, { recursive: true })
        console.log('Uploads directory created successfully')
      } catch (error) {
        console.error('Error creating uploads directory:', {
          error: error instanceof Error ? {
            message: error.message,
            stack: error.stack
          } : error,
          path: uploadDir
        })
        return NextResponse.json(
          { 
            success: false, 
            message: 'เกิดข้อผิดพลาดในการสร้างโฟลเดอร์สำหรับเก็บไฟล์',
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    }

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now()
    const extension = file.type === 'image/jpeg' ? 'jpg' : 'png'
    const filename = `receipt_${registrationId}_${timestamp}.${extension}`
    const filepath = join(uploadDir, filename)
    console.log('File will be saved as:', filepath)

    try {
      // อ่านไฟล์เป็น ArrayBuffer
      console.log('Reading file as array buffer...')
      const arrayBuffer = await file.arrayBuffer()
      console.log('File read successfully, size:', arrayBuffer.byteLength)

      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        throw new Error('ไม่สามารถอ่านข้อมูลไฟล์ได้')
      }

      // แปลงเป็น Buffer และบันทึกไฟล์
      console.log('Converting to buffer and saving file...')
      const buffer = Buffer.from(arrayBuffer)
      await writeFile(filepath, buffer)
      console.log('File saved successfully:', filepath)

      // อัพเดทข้อมูลการชำระเงินในฐานข้อมูล
      console.log('Starting database transaction...')
      try {
        const result = await prisma.$transaction(async (tx) => {
          let payment
          if (registration.payment) {
            console.log('Updating existing payment record...')
            payment = await tx.payment.update({
              where: { registrationId: registrationIdNumber },
              data: {
                receiptImage: `/uploads/${filename}`,
                paymentStatus: 'PENDING_REVIEW',
                updatedAt: new Date(),
                amount: parseFloat(amount),
                paymentMethod,
                paymentDate: new Date()
              }
            })
          } else {
            console.log('Creating new payment record...')
            payment = await tx.payment.create({
              data: {
                registrationId: registrationIdNumber,
                receiptImage: `/uploads/${filename}`,
                paymentStatus: 'PENDING_REVIEW',
                amount: parseFloat(amount),
                paymentMethod,
                paymentDate: new Date()
              }
            })
          }

          // อัพเดทสถานะการลงทะเบียน
          await tx.registration.update({
            where: { id: registrationIdNumber },
            data: { paymentStatus: 'PENDING_REVIEW' }
          })

          return payment
        })

        console.log('Database transaction completed successfully:', {
          paymentId: result.id,
          registrationId: result.registrationId,
          paymentStatus: result.paymentStatus,
          receiptImage: result.receiptImage
        })

        return NextResponse.json({
          success: true,
          message: 'อัพโหลดสลิปเรียบร้อยแล้ว กรุณารอการตรวจสอบ',
          data: {
            paymentId: result.id,
            registrationId: result.registrationId,
            receiptImage: result.receiptImage,
            paymentStatus: result.paymentStatus
          }
        })

      } catch (error) {
        console.error('Database transaction error:', {
          error: error instanceof Error ? {
            message: error.message,
            stack: error.stack
          } : error,
          registrationId: registrationIdNumber
        })
        
        // ลบไฟล์ที่อัพโหลดไว้ถ้าการอัพเดทฐานข้อมูลล้มเหลว
        try {
          await unlink(filepath)
          console.log('Uploaded file deleted due to transaction error')
        } catch (unlinkError) {
          console.error('Error deleting uploaded file:', unlinkError)
        }

        return NextResponse.json(
          {
            success: false,
            message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลการชำระเงิน',
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    } catch (error) {
      console.error('File processing error:', {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : error,
        filepath
      })
      return NextResponse.json(
        {
          success: false,
          message: 'เกิดข้อผิดพลาดในการประมวลผลไฟล์',
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : error
    })
    return NextResponse.json(
      {
        success: false,
        message: 'เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองใหม่อีกครั้ง',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 