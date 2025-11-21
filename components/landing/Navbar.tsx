import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Terminal } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
      <div className="bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 flex items-center justify-between w-full max-w-5xl shadow-2xl shadow-blue-900/10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2 rounded-lg">
            <Terminal className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight text-white">
            WORKSHOP<span className="text-blue-500">_PCC</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="font-mono text-sm text-gray-400 hover:text-white transition-colors">_ABOUT</a>
          <a href="#program" className="font-mono text-sm text-gray-400 hover:text-white transition-colors">_PROGRAMS</a>
          <a href="#team" className="font-mono text-sm text-gray-400 hover:text-white transition-colors">_TEAM</a>
          <a href="#faq" className="font-mono text-sm text-gray-400 hover:text-white transition-colors">_FAQ</a>
        </div>

        <Link href="/register">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-mono text-sm rounded-lg px-6 py-2 h-auto shadow-[0_0_15px_rgba(37,99,235,0.5)] border border-blue-400/30">
            DAFTAR
          </Button>
        </Link>
      </div>
    </nav>
  )
}
