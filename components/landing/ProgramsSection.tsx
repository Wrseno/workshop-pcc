import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Monitor, Network, Video, CheckCircle } from 'lucide-react'

interface ProgramData {
  description: string
  theme: string
}

interface ProgramsSectionProps {
  software: ProgramData
  network: ProgramData
  multimedia: ProgramData
}

export default function ProgramsSection({ software, network, multimedia }: ProgramsSectionProps) {
  return (
    <section id="program" className="bg-[#030712] py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 rounded bg-purple-900/20 border border-purple-500/30 text-purple-400 font-mono text-xs tracking-wider">
            ./AVAILABLE_PROGRAMS
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">CHOOSE YOUR PATH</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Pilih program yang sesuai dengan minatmu.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Multimedia Card */}
          <Card className="group bg-[#0a0a0a] border border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] rounded-xl overflow-hidden">
            <CardHeader className="relative border-b border-gray-800 bg-gray-900/30">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-pink-900/20 rounded-lg flex items-center justify-center border border-pink-500/20 group-hover:border-pink-500/50 transition-colors">
                  <Video className="w-6 h-6 text-pink-500" />
                </div>
                <span className="text-xs font-mono text-gray-500 group-hover:text-pink-400 transition-colors">ID: MM_01</span>
              </div>
              <CardTitle className="text-xl font-bold text-white mt-4 font-mono">Multimedia</CardTitle>
              <p className="text-sm text-gray-500 mt-2 font-mono">{multimedia.theme}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <CardDescription className="text-gray-400 mb-6 leading-relaxed">
                {multimedia.description}
              </CardDescription>
              <ul className="space-y-3 text-sm text-gray-400 font-mono">
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">➜</span> Graphic Design
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">➜</span> UI/UX Design
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">➜</span> Motion Graphics
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Network Card */}
          <Card className="group bg-[#0a0a0a] border border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] rounded-xl overflow-hidden">
            <CardHeader className="relative border-b border-gray-800 bg-gray-900/30">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                  <Network className="w-6 h-6 text-purple-500" />
                </div>
                <span className="text-xs font-mono text-gray-500 group-hover:text-purple-400 transition-colors">ID: NET_02</span>
              </div>
              <CardTitle className="text-xl font-bold text-white mt-4 font-mono">Network</CardTitle>
              <p className="text-sm text-gray-500 mt-2 font-mono">{network.theme}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <CardDescription className="text-gray-400 mb-6 leading-relaxed">
                {network.description}
              </CardDescription>
              <ul className="space-y-3 text-sm text-gray-400 font-mono">
                <li className="flex items-center gap-3">
                  <span className="text-purple-500">➜</span> Cisco Configuration
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-500">➜</span> Cyber Security
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-500">➜</span> Server Admin
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Software Card */}
          <Card className="group bg-[#0a0a0a] border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl overflow-hidden">
            <CardHeader className="relative border-b border-gray-800 bg-gray-900/30">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                  <Monitor className="w-6 h-6 text-blue-500" />
                </div>
                <span className="text-xs font-mono text-gray-500 group-hover:text-blue-400 transition-colors">ID: DEV_03</span>
              </div>
              <CardTitle className="text-xl font-bold text-white mt-4 font-mono">Software</CardTitle>
              <p className="text-sm text-gray-500 mt-2 font-mono">{software.theme}</p>
            </CardHeader>
            <CardContent className="pt-6">
              <CardDescription className="text-gray-400 mb-6 leading-relaxed">
                {software.description}
              </CardDescription>
              <ul className="space-y-3 text-sm text-gray-400 font-mono">
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">➜</span> Fullstack Web
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">➜</span> Database Mgmt
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-500">➜</span> Cloud Computing
                </li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  )
}
