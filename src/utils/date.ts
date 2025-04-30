import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return format(date, 'dd MMMM yyyy HH:mm', { locale: th }) + ' น.'
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
} 