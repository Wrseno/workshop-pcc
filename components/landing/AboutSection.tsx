import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function AboutSection() {
  return (
    <section id="about" className="container mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h2 className="text-4xl font-bold text-gray-900">
          About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Training PCC</span>
        </h2>
        <p className="text-lg text-gray-600">
          Workshop UKM PCC memiliki dua program kerja berupa pelatihan mengenai 3 bidang yaitu Multimedia, Network, dan Software.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-blue-50 to-white">
          <div className="relative w-full h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent z-10"></div>
            <Image 
              src="/images/training-basic.webp" 
              alt="Training Basic" 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <CardHeader className="relative">
            <div className="absolute -top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
              Gratis untuk Semua
            </div>
            <CardTitle className="text-2xl mt-4 group-hover:text-blue-600 transition-colors">Training Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed text-gray-700">
              Pelatihan dasar yang dirancang untuk pemula yang ingin mempelajari keterampilan baru, dan dapat diikuti secara gratis oleh semua Mahasiswa Politeknik Negeri Semarang.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-purple-50 to-white">
          <div className="relative w-full h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent z-10"></div>
            <Image 
              src="/images/pcc-class.webp" 
              alt="PCC Class" 
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <CardHeader className="relative">
            <div className="absolute -top-6 left-6 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg font-semibold">
              Khusus Anggota PCC
            </div>
            <CardTitle className="text-2xl mt-4 group-hover:text-purple-600 transition-colors">PCC Class</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base leading-relaxed text-gray-700">
              Pelatihan lanjutan dengan materi yang lebih mendalam, dapat diikuti secara gratis namun peserta dikhususkan bagi Anggota Aktif UKM PCC.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
