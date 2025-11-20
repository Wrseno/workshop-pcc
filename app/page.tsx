'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import AboutSection from '@/components/landing/AboutSection'
import ProgramsSection from '@/components/landing/ProgramsSection'
import TeamSection from '@/components/landing/TeamSection'
import SponsorsSection from '@/components/landing/SponsorsSection'
import FaqSection from '@/components/landing/FaqSection'
import CtaSection from '@/components/landing/CtaSection'
import Footer from '@/components/landing/Footer'

const trainingDescriptions = {
  TRAINING_BASIC: {
    title: 'Training Basic - Divisi Workshop UKM PCC',
    description: 'Program pelatihan dasar untuk mengembangkan keterampilan teknis di bidang IT',
    software: 'Pelajari dasar-dasar pemrograman, pengembangan web, dan aplikasi desktop',
    network: 'Memahami konsep jaringan komputer, konfigurasi, dan keamanan jaringan',
    multimedia: 'Menguasai desain grafis, ui/ux desain, dan produksi konten multimedia'
  },
  PCC_CLASS: {
    title: 'PCC Class - Program Pengembangan Lanjutan',
    description: 'Program lanjutan untuk meningkatkan keahlian dan sertifikasi profesional',
    software: 'Pengembangan software tingkat lanjut dengan framework modern dan best practices',
    network: 'Administrasi jaringan enterprise, troubleshooting, dan network security',
    multimedia: 'Produksi multimedia profesional untuk industri kreatif dan broadcasting'
  }
}

export default function Home() {
  const [config, setConfig] = useState<any>({ mode: 'TRAINING_BASIC' })
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<any[]>([])
  const [qnaItems, setQnaItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [configRes, teamRes, sponsorsRes, qnaRes] = await Promise.all([
          fetch('/api/config'),
          fetch('/api/team'),
          fetch('/api/sponsors'),
          fetch('/api/qna')
        ])

        const configData = await configRes.json()
        const teamData = await teamRes.json()
        const sponsorsData = await sponsorsRes.json()
        const qnaData = await qnaRes.json()

        setConfig(configData || { mode: 'TRAINING_BASIC' })
        setTeamMembers(teamData)
        setSponsors(sponsorsData)
        setQnaItems(qnaData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const content = trainingDescriptions[config.mode as keyof typeof trainingDescriptions] || trainingDescriptions.TRAINING_BASIC

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection 
        mode={config.mode as 'TRAINING_BASIC' | 'PCC_CLASS'} 
        title={content.title} 
        description={content.description} 
      />
      <AboutSection />
      <ProgramsSection 
        software={content.software} 
        network={content.network} 
        multimedia={content.multimedia} 
      />
      <TeamSection teamMembers={teamMembers} />
      <SponsorsSection sponsors={sponsors} />
      <FaqSection qnaItems={qnaItems} />
      <CtaSection />
      <Footer />
    </div>
  )
}
