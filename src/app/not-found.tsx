import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">ไม่พบหน้าที่คุณกำลังค้นหา</p>
        <Link 
          href="/"
          className="text-violet-600 hover:text-violet-700 font-medium"
        >
          กลับไปหน้าแรก
        </Link>
      </div>
    </div>
  )
} 