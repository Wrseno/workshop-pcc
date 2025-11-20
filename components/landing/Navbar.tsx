import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">W</span>
            </div>
            <span className="font-bold text-xl">Workshop PCC</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition">Tentang</a>
            <a href="#program" className="text-gray-700 hover:text-blue-600 transition">Program</a>
            <a href="#team" className="text-gray-700 hover:text-blue-600 transition">Tim</a>
            <a href="#faq" className="text-gray-700 hover:text-blue-600 transition">FAQ</a>
          </div>
          <Link href="/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Daftar Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
