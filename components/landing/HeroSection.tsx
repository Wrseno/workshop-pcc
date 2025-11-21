import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, ChevronRight } from 'lucide-react'

interface HeroSectionProps {
  mode: 'TRAINING_BASIC' | 'PCC_CLASS'
  title: string
  description: string
}

export default function HeroSection({ mode, title, description }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-[#030712]">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-[#030712]"></div>
      
      {/* Glow Effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 font-mono text-xs tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              SYSTEM_STATUS: REGISTRATION_OPEN
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
              TRAINING BASIC <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                WORKSHOP
              </span> <br />
              UKM PCC
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              <span className="italic">
                Stop watching tech happen. Start building it. 
                </span>
                <br />
              Program pelatihan dasar untuk mengembangkan keterampilan teknis di bidang IT.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6 rounded-sm font-bold font-mono group">
                  Daftar Pelatihan
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#program">
                <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white text-lg px-8 py-6 rounded-sm font-mono bg-transparent">
                  view_program.sh
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Terminal */}
          <div className="flex-1 w-full max-w-xl">
            <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-gray-800 shadow-2xl shadow-blue-900/20 font-mono text-sm">
              {/* Terminal Header */}
              <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-2 border-b border-gray-800">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 text-center text-gray-500 text-xs">user@pcc-polines:~</div>
              </div>
              
              {/* Terminal Body */}
              <div className="p-6 space-y-4 min-h-[300px]">
                <div className="flex items-center gap-2 text-green-400">
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-blue-400">~</span>
                  <span className="text-white">pcc init --batch=2025</span>
                </div>
                
                <div className="text-gray-500 pl-6">Loading modules...</div>
                
                <div className="space-y-2 pl-6">
                  <div className="flex items-center gap-3 p-3 rounded bg-blue-900/10 border border-blue-500/20 text-blue-300">
                    <span className="text-blue-500">[OK]</span> Web_Dev_Module
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-purple-900/10 border border-purple-500/20 text-purple-300">
                    <span className="text-purple-500">[OK]</span> Net_Security
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded bg-pink-900/10 border border-pink-500/20 text-pink-300">
                    <span className="text-pink-500">[OK]</span> Multimedia_Arts
                  </div>
                </div>

                <div className="flex items-center gap-2 text-green-400 pt-4 animate-pulse">
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-blue-400">~</span>
                  <span className="text-white">awaiting_user_registration...</span>
                  <span className="w-2 h-4 bg-white animate-blink"></span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
