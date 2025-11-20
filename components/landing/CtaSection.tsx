import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Siap Mengembangkan Skill IT Anda?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan ratusan mahasiswa yang telah mengikuti program pelatihan kami dan tingkatkan kemampuan teknologi Anda!
        </p>
        <Link href="/register">
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all">
            Daftar Sekarang
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </section>
  )
}
