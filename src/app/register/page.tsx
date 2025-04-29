'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface RegistrationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  eventType: string
  shirtSize: string
  otherShirtSize: string
  deliveryMethod: string
  birthDate: string
  age: number
  emergencyPhone: string
  address: string
  subDistrict: string
  district: string
  province: string
  postalCode: string
}

export default function Register() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventType: '',
    shirtSize: '',
    otherShirtSize: '',
    deliveryMethod: '',
    birthDate: '',
    age: 0,
    emergencyPhone: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: ''
  });

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - i + 543;
    return year.toString();
  });

  const getDaysInMonth = (year: string, month: string) => {
    if (!year || !month) return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
    const monthIndex = months.indexOf(month);
    const christianYear = parseInt(year) - 543;
    const daysInMonth = new Date(christianYear, monthIndex + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '';
    const [year, month, day] = birthDate.split('-').map(Number);
    const birth = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  const handleDateChange = (type: 'day' | 'month' | 'year', value: string) => {
    const updatedMonth = type === 'month' ? value : selectedMonth;
    const updatedYear = type === 'year' ? value : selectedYear;

    // ตรวจสอบว่าวันที่เลือกไว้มีในเดือนใหม่หรือไม่
    if (type === 'month' || type === 'year') {
      if (updatedMonth && updatedYear) {
        const monthIndex = months.indexOf(updatedMonth);
        const christianYear = parseInt(updatedYear) - 543;
        const daysInMonth = new Date(christianYear, monthIndex + 1, 0).getDate();
        
        // ถ้าวันที่เลือกไว้เกินจำนวนวันในเดือนใหม่ ให้ reset วันที่
        if (selectedDay && parseInt(selectedDay) > daysInMonth) {
          setSelectedDay('');
        }
      }
    }

    // อัพเดทค่าที่เลือก
    if (type === 'day') setSelectedDay(value);
    if (type === 'month') setSelectedMonth(value);
    if (type === 'year') setSelectedYear(value);

    // สร้างวันที่ในรูปแบบ ISO
    let newDate = '';
    if (type === 'day' ? value : selectedDay) {
      const finalDay = type === 'day' ? value : selectedDay;
      const monthIndex = (months.indexOf(updatedMonth) + 1).toString().padStart(2, '0');
      const christianYear = (parseInt(updatedYear) - 543).toString();
      newDate = `${christianYear}-${monthIndex}-${finalDay}`;
      
      // คำนวณอายุเมื่อวันที่สมบูรณ์
      const age = calculateAge(newDate);
      setFormData(prev => ({
        ...prev,
        birthDate: newDate,
        age: parseInt(age)
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'deliveryMethod' && value !== 'shipping' ? { 
        address: '',
        subDistrict: '',
        district: '',
        province: '',
        postalCode: ''
      } : {})
    }));
  };

  // โหลดข้อมูลจาก localStorage เมื่อโหลดหน้า
  useEffect(() => {
    // ล้างข้อมูลเก่าออก
    localStorage.removeItem('tempRegistrationData');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      eventType: '',
      shirtSize: '',
      otherShirtSize: '',
      deliveryMethod: '',
      birthDate: '',
      age: 0,
      emergencyPhone: '',
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postalCode: ''
    });
    setSelectedDay('');
    setSelectedMonth('');
    setSelectedYear('');
  }, []);

  // เพิ่มฟังก์ชันตรวจสอบข้อมูล
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const validatePostalCode = (postalCode: string) => {
    const postalCodeRegex = /^[0-9]{5}$/;
    return postalCodeRegex.test(postalCode);
  };

  const validateAge = (age: number) => {
    return age >= 15; // กำหนดอายุขั้นต่ำ 15 ปี
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!formData.firstName || !formData.lastName || !formData.birthDate || !formData.age || 
        !formData.phone || !formData.email || !formData.eventType || !formData.shirtSize || 
        !formData.deliveryMethod || !formData.emergencyPhone) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      setIsSubmitting(false);
      return;
    }

    // ตรวจสอบรูปแบบเบอร์โทรศัพท์
    if (!validatePhoneNumber(formData.phone)) {
      setError('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (ตัวเลข 10 หลัก)');
      setIsSubmitting(false);
      return;
    }

    // ตรวจสอบรูปแบบเบอร์โทรฉุกเฉิน
    if (!validatePhoneNumber(formData.emergencyPhone)) {
      setError('กรุณากรอกเบอร์โทรฉุกเฉินให้ถูกต้อง (ตัวเลข 10 หลัก)');
      setIsSubmitting(false);
      return;
    }

    // ตรวจสอบอายุขั้นต่ำ
    if (!validateAge(formData.age)) {
      setError('ผู้สมัครต้องมีอายุ 15 ปีขึ้นไป');
      setIsSubmitting(false);
      return;
    }

    // ตรวจสอบที่อยู่จัดส่งถ้าเลือกวิธีจัดส่ง
    if (formData.deliveryMethod === 'shipping') {
      if (!formData.address || 
          !formData.subDistrict || 
          !formData.district || 
          !formData.province || 
          !formData.postalCode) {
        setError('กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน');
        setIsSubmitting(false);
        return;
      }

      // ตรวจสอบรหัสไปรษณีย์
      if (!validatePostalCode(formData.postalCode)) {
        setError('กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง (ตัวเลข 5 หลัก)');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // เตรียมข้อมูลสำหรับบันทึก
      const registrationData = {
        ...formData,
        shippingAddress: formData.deliveryMethod === 'shipping' ? {
          address: formData.address,
          subDistrict: formData.subDistrict,
          district: formData.district,
          province: formData.province,
          postalCode: formData.postalCode
        } : null,
        createdAt: new Date().toISOString()
      };

      // บันทึกข้อมูลลง localStorage สำหรับหน้า summary
      localStorage.setItem('tempRegistrationData', JSON.stringify(registrationData));
      
      // นำไปยังหน้า summary
      router.push('/register/summary');
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-hospital-light-gradient py-12">
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative h-48">
            <Image
              src="/registration-header.png"
              alt="Registration Header"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-violet-900/50 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">ลงทะเบียนวิ่ง</h1>
            </div>
            <button 
              onClick={() => router.back()}
              className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            >
              ←
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 bg-violet-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-violet-900 mb-4">ข้อมูลส่วนตัว</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      นามสกุล
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      วันเกิด
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={selectedDay}
                        onChange={(e) => handleDateChange('day', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                        required
                      >
                        <option value="">วัน</option>
                        {getDaysInMonth(selectedYear, selectedMonth).map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <select
                        value={selectedMonth}
                        onChange={(e) => handleDateChange('month', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                        required
                      >
                        <option value="">เดือน</option>
                        {months.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                      <select
                        value={selectedYear}
                        onChange={(e) => handleDateChange('year', e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                        required
                      >
                        <option value="">ปี พ.ศ.</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      อายุ (ปี)
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age ? formData.age.toString() : ''}
                      className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-900"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-violet-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-violet-900 mb-4">ข้อมูลการแข่งขัน</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      ประเภทการแข่งขัน
                    </label>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">เลือกประเภท</option>
                      <option value="funrun">Funrun 5 กม. (400 บาท)</option>
                      <option value="minimarathon">Mini Marathon 10 กม. (500 บาท)</option>
                      <option value="vip">VIP (1000 บาท)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      ขนาดเสื้อ
                    </label>
                    <select
                      name="shirtSize"
                      value={formData.shirtSize}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">เลือกขนาด</option>
                      <option value="3S">3S (รอบอก 32 นิ้ว)</option>
                      <option value="2S">2S (รอบอก 34 นิ้ว)</option>
                      <option value="S">S (รอบอก 36 นิ้ว)</option>
                      <option value="M">M (รอบอก 38 นิ้ว)</option>
                      <option value="L">L (รอบอก 40 นิ้ว)</option>
                      <option value="XL">XL (รอบอก 42 นิ้ว)</option>
                      <option value="2XL">2XL (รอบอก 44 นิ้ว)</option>
                      <option value="3XL">3XL (รอบอก 46 นิ้ว)</option>
                      <option value="4XL">4XL (รอบอก 48 นิ้ว)</option>
                      <option value="5XL">5XL (รอบอก 50 นิ้ว)</option>
                      <option value="other">อื่นๆ</option>
                    </select>
                    {formData.shirtSize === 'other' && (
                      <input
                        type="text"
                        name="otherShirtSize"
                        value={formData.otherShirtSize || ''}
                        onChange={handleChange}
                        placeholder="ระบุขนาดเสื้อ"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white mt-2"
                        required
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      วิธีการรับเสื้อ
                    </label>
                    <select
                      name="deliveryMethod"
                      value={formData.deliveryMethod}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                      required
                    >
                      <option value="">เลือกวิธีการรับเสื้อ</option>
                      <option value="pickup">รับที่งาน</option>
                      <option value="shipping">จัดส่ง</option>
                    </select>
                    {formData.deliveryMethod === 'shipping' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">ที่อยู่จัดส่ง</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ที่อยู่
                            </label>
                            <textarea
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              rows={3}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ตำบล/แขวง
                            </label>
                            <input
                              type="text"
                              name="subDistrict"
                              value={formData.subDistrict}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              อำเภอ/เขต
                            </label>
                            <input
                              type="text"
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              จังหวัด
                            </label>
                            <input
                              type="text"
                              name="province"
                              value={formData.province}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              รหัสไปรษณีย์
                            </label>
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-violet-50 p-4 rounded-lg">
                <h2 className="text-xl font-bold text-violet-900 mb-4">ข้อมูลฉุกเฉิน</h2>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-violet-700 text-sm font-bold mb-2">
                      เบอร์โทรฉุกเฉิน
                    </label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                ยกเลิก
              </button>
              <motion.button
                type="submit"
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
                  <span>ลงทะเบียน</span>
                )}
              </motion.button>
            </div>
            {error && (
              <div className="mt-4 text-center text-red-600 font-semibold">
                {error}
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
} 