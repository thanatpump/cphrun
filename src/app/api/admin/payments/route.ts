import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ message: 'Test response' })
  } catch (error) {
    console.error('Error in payments route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
} 