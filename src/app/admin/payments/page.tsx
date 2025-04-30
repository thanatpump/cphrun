'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { useSearchParams, useRouter } from 'next/navigation'
import { FaSearch, FaFilter, FaCheck, FaTimes, FaImage } from 'react-icons/fa'
import PaymentList from './PaymentList'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Registration {
  firstName: string
  lastName: string
  email: string
  eventType: string
}

interface Payment {
  id: number
  registrationId: number
  amount: number
  paymentMethod: string
  paymentDate: string | null
  paymentStatus: 'COMPLETED' | 'REJECTED' | 'PENDING_VERIFICATION'
  receiptImage: string | null
  verificationNote: string | null
  createdAt: string
  registration: Registration
}

export default function PaymentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">ตรวจสอบการชำระเงิน</h1>
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentList />
      </Suspense>
    </div>
  )
} 