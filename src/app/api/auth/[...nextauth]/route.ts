import NextAuth from 'next-auth'
import { type AuthOptions } from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions as AuthOptions)

// Export the handler using named exports for GET and POST
export { handler as GET, handler as POST } 