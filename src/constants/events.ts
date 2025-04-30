export const EVENT_TYPES = {
  funrun: 'Fun Run (5 km)',
  minimarathon: 'Mini Marathon (10 km)',
  vip: 'VIP',
} as const

export const EVENT_PRICES = {
  funrun: 400,
  minimarathon: 500,
  vip: 1000,
} as const

export const SHIRT_SIZES = {
  SS: 'SS',
  S: 'S',
  M: 'M',
  L: 'L',
  XL: 'XL',
  XXL: 'XXL',
  XXXL: 'XXXL',
} as const

export const DELIVERY_METHODS = {
  PICKUP: 'รับที่งาน',
  SHIPPING: 'จัดส่งทางไปรษณีย์',
} as const

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const 