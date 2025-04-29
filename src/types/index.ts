export interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export interface DatePickerProps {
  onChange: (date: string) => void
  value: string
}

export interface RegistrationData {
  id?: number
  firstName: string
  lastName: string
  email: string
  phone: string
  birthDate: string
  age: number
  eventType: 'funrun' | 'minimarathon' | 'vip'
  shirtSize: '3S' | '2S' | 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL' | '4XL' | '5XL' | 'other'
  otherShirtSize?: string
  deliveryMethod: 'pickup' | 'shipping'
  emergencyPhone: string
  shippingAddress?: {
    address: string
    subDistrict: string
    district: string
    province: string
    postalCode: string
  }
  createdAt?: string
  updatedAt?: string
  paymentStatus?: 'pending' | 'pending_review' | 'completed' | 'rejected'
}

export interface PaymentData {
  id?: number
  registrationId: number
  amount: number
  paymentMethod: 'bank_transfer'
  paymentStatus: 'pending' | 'pending_review' | 'completed' | 'rejected'
  paymentDate?: string
  verificationNote?: string
  createdAt?: string
  updatedAt?: string
}

export const EVENT_PRICES = {
  funrun: 400,
  minimarathon: 500,
  vip: 1000
} as const;

export const EVENT_TYPES = {
  funrun: 'Fun Run 5 กม.',
  minimarathon: 'Mini Marathon 10 กม.',
  vip: 'VIP'
} as const; 