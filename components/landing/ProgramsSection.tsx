import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Monitor, Network, Video, CheckCircle } from 'lucide-react'

interface ProgramsSectionProps {
  software: string
  network: string
  multimedia: string
}

export default function ProgramsSection({ software, network, multimedia }: ProgramsSectionProps) {
  return (
    <section id="program" className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Program Pelatihan</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih program yang sesuai dengan minatmu
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          
        <Card className="group hover:scale-105 transition-all duration-300 border-2 hover:border-pink-500 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition"></div>
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Video className="w-9 h-9 text-white" />
              </div>
              <CardTitle className="text-2xl">Multimedia Design</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">
                {multimedia}
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Graphic Design
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  UI/UX Design
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Motion Graphics
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="group hover:scale-105 transition-all duration-300 border-2 hover:border-purple-500 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition"></div>
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Network className="w-9 h-9 text-white" />
              </div>
              <CardTitle className="text-2xl">Network Engineering</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">
                {network}
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Konfigurasi Router & Switch
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Network Security
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Troubleshooting
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="group hover:scale-105 transition-all duration-300 border-2 hover:border-blue-500 hover:shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition"></div>
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Monitor className="w-9 h-9 text-white" />
              </div>
              <CardTitle className="text-2xl">Software Development</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">
                {software}
              </CardDescription>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Pemrograman Web
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Database Management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  API Development
                </li>
              </ul>
            </CardContent>
          </Card>
         
        </div>
      </div>
    </section>
  )
}
