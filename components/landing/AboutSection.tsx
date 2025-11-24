import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ImageWithSkeleton from '@/components/ui/image-with-skeleton'

export default function AboutSection() {
  return (
    <section id="about" className="container mx-auto px-4 py-20 bg-[#030712]">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-block mb-2 px-3 py-1 rounded bg-green-900/20 border border-green-500/30 text-green-400 font-mono text-xs tracking-wider">
          ./README.md
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">
          ABOUT <span className="text-blue-500">WORKSHOP_PCC</span>
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed font-light">
          Workshop UKM PCC memiliki dua program kerja dan beberapa agenda berupa pelatihan mengenai tiga bidang yaitu Multimedia, Network, dan Software.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="group border border-gray-800 bg-[#0a0a0a] hover:border-blue-500/50 transition-all duration-300 rounded-xl overflow-hidden">
          <div className="relative w-full h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
            <ImageWithSkeleton 
              src="/images/training-basic.webp" 
              alt="Training Basic" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
            />
          </div>
          <CardHeader className="relative">
            <div className="absolute -top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-sm shadow-lg shadow-blue-900/20 font-mono text-xs tracking-wider z-20">
              ACCESS: PUBLIC
            </div>
            <CardTitle className="text-2xl mt-4 text-white group-hover:text-blue-400 transition-colors font-bold font-mono">Training_Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed text-gray-400 font-light">
              Pelatihan dasar yang dirancang untuk pemula yang ingin mempelajari keterampilan baru, dan dapat diikuti secara gratis oleh semua Mahasiswa Politeknik Negeri Semarang.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="group border border-gray-800 bg-[#0a0a0a] hover:border-purple-500/50 transition-all duration-300 rounded-xl overflow-hidden">
          <div className="relative w-full h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
            <ImageWithSkeleton 
              src="/images/pcc-class.webp" 
              alt="PCC Class" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
            />
          </div>
          <CardHeader className="relative">
            <div className="absolute -top-6 left-6 bg-purple-600 text-white px-4 py-2 rounded-sm shadow-lg shadow-purple-900/20 font-mono text-xs tracking-wider z-20">
              ACCESS: MEMBERS_ONLY
            </div>
            <CardTitle className="text-2xl mt-4 text-white group-hover:text-purple-400 transition-colors font-bold font-mono">PCC_Class</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed text-gray-400 font-light">
              Pelatihan lanjutan dengan materi yang lebih mendalam, dapat diikuti secara gratis namun peserta dikhususkan bagi Anggota Aktif UKM PCC.
            </CardDescription>
          </CardContent>
        </Card>
        
        {/* Share Your Knowledge Card */}
        <Card className="group border border-gray-800 bg-[#0a0a0a] hover:border-purple-500/50 transition-all duration-300 rounded-xl overflow-hidden md:col-span-2 md:w-3/4 md:mx-auto">
          <div className="relative w-full h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
            <ImageWithSkeleton 
              src="/images/share-your-knowledge.webp" 
              alt="Share Your Knowledge" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
            />
          </div>
          <CardHeader className="relative">
            <div className="absolute -top-6 left-6 bg-purple-600 text-white px-4 py-2 rounded-sm shadow-lg shadow-purple-900/20 font-mono text-xs tracking-wider z-20">
              ACCESS: STO_ONLY
            </div>
            <CardTitle className="text-2xl mt-4 text-white group-hover:text-purple-400 transition-colors font-bold font-mono">Share_Your_Knowledge</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed text-gray-400 font-light">
              Pelatihan rutin yang dilaksanakan sebanyak enam kali, dengan pemateri dari setiap departemen dibawah workshop sebanyak dua kali dalam satu periode PCC. Pelatihan ini memiliki materi tingkat dasar sampai advance serta dikhususkan untuk STO PCC.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
