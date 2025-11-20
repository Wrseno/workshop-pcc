'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Monitor, Network, Video, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface TeamMember {
  id: string
  name: string
  position: string
  avatarUrl: string | null
  description: string | null
  type: 'DIVISI' | 'DEPARTEMEN'
  department?: 'SOFTWARE' | 'NETWORK' | 'MULTIMEDIA' | null
  order: number
}

interface TeamSectionProps {
  teamMembers: TeamMember[]
}

export default function TeamSection({ teamMembers }: TeamSectionProps) {
  if (teamMembers.length === 0) return null

  const divisiMembers = teamMembers.filter(m => m.type === 'DIVISI')
  const departemenMembers = teamMembers.filter(m => m.type === 'DEPARTEMEN')
  
  const getDepartmentMembers = (dept: 'SOFTWARE' | 'NETWORK' | 'MULTIMEDIA') => {
    return departemenMembers.filter(m => m.department === dept)
  }

  const departments = [
   {
      id: 'MULTIMEDIA' as const,
      name: 'Departemen Multimedia',
      icon: Video,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      description: 'Departemen Multimedia adalah salah satu departemen di UKM PCC yang berfokus pada desain dan editing video serta memiliki tanggung jawab menggembangkan skill anggota dan mengadakan pelatihan mengenai multimedia.',
      image: '/images/multimedia-dept.webp'
    }, 
    {
      id: 'NETWORK' as const,
      name: 'Departemen Network',
      icon: Network,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      description: 'Departemen Network adalah salah satu departemen di UKM PCC yang bertanggung jawab terhadap pelatihan yang berkaitan dengan Network serta menghasilkan produk dan portofolio yang berkaitan dengan Network',
      image: '/images/network-dept.jpg'
    },
    {
      id: 'SOFTWARE' as const,
      name: 'Departemen Software',
      icon: Monitor,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      description: 'Departemen Software adalah salah satu departemen di UKM PCC yang bertanggung jawab terhadap pelatihan yang berkaitan dengan Software serta menghasilkan produk dan portofolio yang berkaitan dengan Software',
      image: '/images/software-dept.webp'
    }
  ]

  return (
    <section id="team" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Tim Kami</h2>
        <p className="text-lg text-gray-600">Tim dibalik pelatihan-pelatihan yang diselenggarakan UKM PCC</p>
      </div>

      {/* Divisi Workshop Members */}
      {divisiMembers.length > 0 && (
        <div className="mb-16">
          <div className="text-center mb-8">
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2 text-lg font-semibold">
              Divisi Workshop
            </Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {divisiMembers.map((member) => (
              <Card key={member.id} className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                
                {/* Animated border glow */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm"></div>
                </div>
                
                {/* Card content with backdrop */}
                <div className="relative bg-white rounded-lg">
                  <CardHeader className="text-center">
                    <div className="relative mx-auto mb-4">
                      {/* Rotating ring on hover */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500" style={{ animationDuration: '3s' }}></div>
                      
                      {/* Avatar container */}
                      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 p-1 group-hover:scale-110 transition-transform duration-500">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <span className="text-4xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                    
                    <CardTitle className="text-xl font-bold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="font-medium text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
                      {member.position}
                    </CardDescription>
                    {member.description && (
                      <CardDescription className="mt-3 text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                        {member.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Departemen - Always Show */}
      <div>
        <div className="text-center mb-8">
          <Badge className="bg-purple-100 text-purple-700 px-4 py-2 text-lg font-semibold">
            Departemen
          </Badge>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {departments.map((dept) => {
            const Icon = dept.icon
            const members = getDepartmentMembers(dept.id)
            
            return (
              <Dialog key={dept.id}>
                <DialogTrigger asChild>
                  <div>
                    <Card className="group relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                      {/* Animated gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                      
                      {/* Animated border glow */}
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${dept.color} blur-sm`}></div>
                      </div>
                      
                      {/* Card content */}
                      <div className="relative bg-white rounded-lg">
                        {/* Department Image */}
                        <div className="relative h-64 overflow-hidden rounded-t-lg">
                          <Image 
                            src={dept.image}
                            alt={dept.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          {/* Shine effect */}
                          <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
                        </div>
                        
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-xl font-bold mb-2">
                            {dept.name}
                          </CardTitle>
                          <CardDescription className="text-gray-600 text-sm line-clamp-2">
                            {dept.description}
                          </CardDescription>
                          <div className="mt-4 flex items-center justify-center gap-3">
                            <Badge variant="secondary" className={`bg-gradient-to-r ${dept.color} text-white px-3 py-1`}>
                              {members.length} Anggota
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <div className="px-6 pb-6">
                          <Button 
                            className={`w-full bg-gradient-to-r ${dept.color} hover:opacity-90 text-white group-hover:shadow-lg transition-all`}
                          >
                            Lihat Anggota
                            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-2xl">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden">
                        <Image 
                          src={dept.image}
                          alt={dept.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {dept.name}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2">{dept.description}</p>
                  </DialogHeader>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {members.map((member) => (
                      <Card key={member.id} className="group hover:shadow-lg transition-all border-0 bg-gradient-to-br from-gray-50 to-white">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${dept.color} p-0.5 group-hover:scale-105 transition-transform`}>
                                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center overflow-hidden">
                                  {member.avatarUrl ? (
                                    <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className={`text-2xl font-bold bg-gradient-to-br ${dept.color} bg-clip-text text-transparent`}>
                                      {member.name.charAt(0)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                              <p className={`text-sm font-semibold text-transparent bg-gradient-to-r ${dept.color} bg-clip-text mb-2`}>
                                {member.position}
                              </p>
                              {member.description && (
                                <p className="text-sm text-gray-600 leading-relaxed">
                                  {member.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {members.length === 0 && (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        Belum ada anggota di departemen ini
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )
          })}
        </div>
      </div>
    </section>
  )
}
