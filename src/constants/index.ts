export const RACE_DATE = new Date('2025-06-29T05:00:00')

export const EVENT_PRICES = {
  funrun: 400,
  minimarathon: 500,
  vip: 1000,
} as const

export const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const

export const DELIVERY_METHODS = {
  pickup: 'รับที่งาน',
  delivery: 'จัดส่งทางไปรษณีย์',
} as const

export const EVENT_TYPES = {
  funrun: 'Fun Run 5KM',
  minimarathon: 'Mini Marathon 10KM',
  vip: 'VIP',
} as const

export const PAYMENT_STATUS = {
  pending: 'รอการชำระเงิน',
  completed: 'ชำระเงินแล้ว',
  failed: 'การชำระเงินล้มเหลว',
} as const 