import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle } from 'lucide-react'

interface HeroSectionProps {
  mode: 'TRAINING_BASIC' | 'PCC_CLASS'
  title: string
  description: string
}

export default function HeroSection({ mode, title, description }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 px-4 py-2 text-sm font-semibold">
              {mode === 'TRAINING_BASIC' ? ' Training Basic' : ' PCC Class'}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              {title.split('-')[0]}<br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {title.split('-')[1]}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                  Daftar Pelatihan
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                Pelajari Lebih Lanjut
              </Button>
            </div>
            <div className="flex gap-8 justify-center md:justify-start pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">100+</div>
                <div className="text-sm text-gray-600">Peserta</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">Program</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">100%</div>
                <div className="text-sm text-gray-600">Gratis</div>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative bg-white/50 backdrop-blur-lg rounded-3xl p-8 border border-white shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="font-semibold">Materi Berkualitas</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="font-semibold">Hadiah Menarik</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-xl p-4 shadow">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="font-semibold">Sertifikat Peserta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
