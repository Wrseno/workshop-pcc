'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Monitor, Network, Video, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import ImageWithSkeleton from '@/components/ui/image-with-skeleton'

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
    <section id="team" className="container mx-auto px-4 py-20 bg-[#030712] border-t border-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      
      <div className="text-center mb-16 relative z-10">
        <div className="inline-block mb-4 px-3 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400 font-mono text-xs tracking-wider">
          ./CORE_TEAM
        </div>
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight font-mono">MEET_THE_TEAM</h2>
        <p className="text-lg text-gray-400 font-light">Tim dibalik pelatihan-pelatihan yang diselenggarakan UKM PCC.</p>
      </div>

      {/* Divisi Workshop Members */}
      {divisiMembers.length > 0 && (
        <div className="mb-16 relative z-10">
          <div className="text-center mb-8">
            <Badge className="bg-blue-900/20 text-blue-400 border border-blue-500/30 px-4 py-2 text-sm font-mono tracking-wider rounded-sm">
              WORKSHOP_DIVISION
            </Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {divisiMembers.map((member) => (
              <Card key={member.id} className="group relative overflow-hidden border border-gray-800 bg-[#0a0a0a] hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] rounded-xl">
                
                {/* Card content */}
                <div className="relative">
                  <CardHeader className="text-center pt-8">
                    <div className="relative mx-auto mb-6">
                      {/* Avatar container */}
                      <div className="relative w-32 h-32 mx-auto rounded-xl bg-gray-900 border border-gray-800 p-1 group-hover:border-blue-500/50 transition-colors duration-500">
                        <div className="w-full h-full rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden relative">
                          {member.avatarUrl ? (
                            <ImageWithSkeleton 
                              src={member.avatarUrl} 
                              alt={member.name} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                              skeletonClassName="rounded-lg"
                            />
                          ) : (
                            <span className="text-4xl font-bold font-mono text-gray-700 group-hover:text-blue-400 transition-colors">
                              {member.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        {/* Tech corners */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-gray-600 group-hover:border-blue-500 transition-colors"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-gray-600 group-hover:border-blue-500 transition-colors"></div>
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-gray-600 group-hover:border-blue-500 transition-colors"></div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-gray-600 group-hover:border-blue-500 transition-colors"></div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-white font-mono mb-2 group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </CardTitle>
                    <CardDescription className="font-mono text-blue-500/80 text-sm mb-4">
                      &lt;{member.position} /&gt;
                    </CardDescription>
                    {member.description && (
                      <CardDescription className="text-sm text-gray-500 leading-relaxed font-light border-t border-gray-800 pt-4">
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
      <div className="relative z-10">
        <div className="text-center mb-8">
          <Badge className="bg-purple-900/20 text-purple-400 border border-purple-500/30 px-4 py-2 text-sm font-mono tracking-wider rounded-sm">
            DEPARTMENTS
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
                    <Card className="group relative overflow-hidden border border-gray-800 bg-[#0a0a0a] hover:border-purple-500/50 transition-all duration-500 cursor-pointer rounded-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                      
                      {/* Card content */}
                      <div className="relative">
                        {/* Department Image */}
                        <div className="relative h-64 overflow-hidden rounded-t-xl border-b border-gray-800">
                          <Image 
                            src={dept.image}
                            alt={dept.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent"></div>
                          
                          {/* Icon Overlay */}
                          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-lg border border-gray-700">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        
                        <CardHeader className="text-left pb-6">
                          <div className="flex justify-between items-center mb-2">
                            <CardTitle className="text-xl font-bold text-white font-mono">
                              {dept.name}
                            </CardTitle>
                            <Badge variant="secondary" className="bg-gray-800 text-gray-300 border border-gray-700 font-mono text-xs">
                              {members.length} MEMBERS
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-500 text-sm line-clamp-2 mb-6 font-light">
                            {dept.description}
                          </CardDescription>
                          
                          <Button 
                            className="w-full bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 hover:border-purple-500/50 hover:text-purple-400 transition-all font-mono text-sm"
                          >
                            VIEW_MEMBERS
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardHeader>
                      </div>
                    </Card>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0a0a0a] border border-gray-800 text-white">
                  <DialogHeader className="border-b border-gray-800 pb-6">
                    <DialogTitle className="flex items-center gap-4 text-2xl font-mono">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-700">
                        <Image 
                          src={dept.image}
                          alt={dept.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {dept.name}
                    </DialogTitle>
                    <p className="text-gray-400 mt-2 font-light">{dept.description}</p>
                  </DialogHeader>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    {members.map((member) => (
                      <Card key={member.id} className="group hover:border-purple-500/30 transition-all border border-gray-800 bg-[#111]">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-20 h-20 rounded-lg bg-gray-900 border border-gray-800 p-0.5 group-hover:border-purple-500/30 transition-colors">
                                <div className="w-full h-full rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                                  {member.avatarUrl ? (
                                    <ImageWithSkeleton 
                                      src={member.avatarUrl} 
                                      alt={member.name} 
                                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                                      skeletonClassName="rounded-lg"
                                    />
                                  ) : (
                                    <span className="text-2xl font-bold font-mono text-gray-600 group-hover:text-purple-400">
                                      {member.name.charAt(0)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-lg font-bold mb-1 text-white font-mono">{member.name}</h3>
                              <p className="text-sm font-mono text-purple-400 mb-2">
                                {member.position}
                              </p>
                              {member.description && (
                                <p className="text-sm text-gray-500 leading-relaxed font-light">
                                  {member.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {members.length === 0 && (
                      <div className="col-span-2 text-center py-12 border border-dashed border-gray-800 rounded-xl bg-gray-900/20">
                        <p className="text-gray-500 font-mono">No members found in this directory.</p>
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
