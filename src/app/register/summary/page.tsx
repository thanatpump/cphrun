'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { EVENT_PRICES, EVENT_TYPES } from '@/constants/events';

interface ShippingAddress {
  address: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

interface RegistrationData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  birthDate?: string;
  eventType: string;
  shirtSize: string;
  otherShirtSize?: string;
  deliveryMethod: string;
  shippingAddress?: ShippingAddress;
  emergencyPhone: string;
}

export default function Summary() {
  const router = useRouter();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = localStorage.getItem('tempRegistrationData');
    if (!data) {
      router.push('/register');
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      // แปลงข้อมูลที่อยู่จาก JSON string กลับเป็น object
      if (parsedData.shippingAddress && typeof parsedData.shippingAddress === 'string') {
        parsedData.shippingAddress = JSON.parse(parsedData.shippingAddress);
      }
      setRegistrationData(parsedData);
    } catch {
      console.error('Error loading registration data');
      router.push('/register');
    }
  }, [router]);

  const handleEdit = () => {
    router.push('/register');
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      if (!registrationData) {
        setError('ไม่พบข้อมูลการลงทะเบียน');
        return;
      }

      // เตรียมข้อมูลสำหรับส่ง API
      const apiData = {
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        phone: registrationData.phone,
        age: registrationData.age,
        eventType: registrationData.eventType,
        shirtSize: registrationData.shirtSize === 'other' ? registrationData.otherShirtSize : registrationData.shirtSize,
        deliveryMethod: registrationData.deliveryMethod,
        shippingAddress: registrationData.deliveryMethod === 'shipping' ? registrationData.shippingAddress : null,
        emergencyPhone: registrationData.emergencyPhone
      };

      // ส่งข้อมูลไปยัง API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }

      if (!data.success) {
        throw new Error(data.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }

      // บันทึกข้อมูลลง localStorage พร้อม ID
      localStorage.setItem('registrationData', JSON.stringify({
        ...registrationData,
        registrationId: data.data.registrationId,
        paymentId: data.data.paymentId
      }));

      // ลบข้อมูลชั่วคราว
      localStorage.removeItem('tempRegistrationData');

      // ไปยังหน้าชำระเงิน
      router.push('/register/payment');
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen bg-hospital-light-gradient flex items-center justify-center">
        <div className="text-2xl font-bold text-violet-900">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  // คำนวณค่าสมัคร
  const amount = EVENT_PRICES[registrationData.eventType as keyof typeof EVENT_PRICES];

  return (
    <div className="min-h-screen bg-hospital-light-gradient py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">ยืนยันการลงทะเบียน</h1>
            <p className="text-lg text-gray-600">กรุณาตรวจสอบข้อมูลการลงทะเบียนของท่าน</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 bg-violet-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-violet-900 mb-4">ข้อมูลส่วนตัว</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ชื่อ-นามสกุล</p>
                      <p className="font-medium">
                        {registrationData.firstName} {registrationData.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">วันเกิด</p>
                      <p className="font-medium">{registrationData.birthDate || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">อายุ</p>
                      <p className="font-medium">{registrationData.age} ปี</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
                      <p className="font-medium">{registrationData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">อีเมล</p>
                      <p className="font-medium">{registrationData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-violet-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-violet-900 mb-4">ข้อมูลการแข่งขัน</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">ประเภทการแข่งขัน</p>
                      <p className="font-medium">
                        {EVENT_TYPES[registrationData.eventType as keyof typeof EVENT_TYPES]}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ขนาดเสื้อ</p>
                      <p className="font-medium">
                        {registrationData.shirtSize === 'other' 
                          ? registrationData.otherShirtSize 
                          : registrationData.shirtSize}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">วิธีการรับเสื้อ</p>
                      <p className="font-medium">
                        {registrationData.deliveryMethod === 'pickup' ? 'รับที่งาน' : 'จัดส่ง'}
                      </p>
                    </div>
                    {registrationData.deliveryMethod === 'shipping' && registrationData.shippingAddress && (
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600 mb-2">ที่อยู่จัดส่ง</p>
                        <div className="font-medium space-y-1">
                          <p>{registrationData.shippingAddress.address}</p>
                          <p>ตำบล/แขวง {registrationData.shippingAddress.subDistrict}</p>
                          <p>อำเภอ/เขต {registrationData.shippingAddress.district}</p>
                          <p>จังหวัด {registrationData.shippingAddress.province}</p>
                          <p>รหัสไปรษณีย์ {registrationData.shippingAddress.postalCode}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 bg-violet-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold text-violet-900 mb-4">ข้อมูลฉุกเฉิน</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">เบอร์โทรฉุกเฉิน</p>
                      <p className="font-medium">{registrationData.emergencyPhone}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ยอดเงินที่ต้องชำระ
                  </h2>
                  <p className="text-3xl font-bold text-violet-600">
                    {amount.toLocaleString()} บาท
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="bg-gray-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  แก้ไขข้อมูล
                </button>
                <motion.button
                  type="button"
                  onClick={handleConfirm}
                  className="bg-violet-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      <span>กำลังส่งข้อมูล...</span>
                    </>
                  ) : (
                    <span>ยืนยันการลงทะเบียน</span>
                  )}
                </motion.button>
              </div>
              {error && (
                <div className="mt-4 text-center text-red-600 font-semibold">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 