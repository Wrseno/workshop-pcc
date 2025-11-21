import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="bg-[#030712] py-20 relative overflow-hidden border-t border-gray-800">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="inline-block mb-6 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 font-mono text-xs tracking-wider animate-pulse">
          _READY_TO_DEPLOY?
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          LEVEL UP YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">TECH SKILLS</span>
        </h2>
        
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
          Bergabunglah dengan ratusan mahasiswa yang telah mengikuti program pelatihan kami dan tingkatkan kemampuan teknologi Anda!
        </p>
        
        <Link href="/register">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-6 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all rounded-sm font-mono border border-blue-400/50">
            <span className="mr-2">&gt;</span> EXECUTE_REGISTRATION
          </Button>
        </Link>
      </div>
    </section>
  )
}
