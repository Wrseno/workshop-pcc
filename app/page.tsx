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
    software: {
      description: 'Pelajari dasar-dasar pemrograman, pengembangan web, dan aplikasi desktop',
      theme: '"Membuat Landing Page Bisnis Kopi"',
    },
    network: {
      description: 'Memahami konsep jaringan komputer, konfigurasi, dan keamanan jaringan',
      theme: '"Network Fundamental, Basic Configuration, and Routing Basic"',
    },
    multimedia: {
      description: 'Menguasai desain grafis, ui/ux desain, dan produksi konten multimedia',
      theme: '"PCC Maintenance Store - Mobile App UI Design"',
    }
  },
  PCC_CLASS: {
    title: 'PCC Class - Program Pengembangan Lanjutan',
    description: 'Program lanjutan untuk meningkatkan keahlian dan sertifikasi profesional',
    software: {
      description: 'Pengembangan software tingkat lanjut dengan framework modern dan best practices',
      theme: 'Membangun aplikasi skala besar dengan arsitektur modern',
    },
    network: {
      description: 'Administrasi jaringan enterprise, troubleshooting, dan network security',
      theme: 'Mengamankan dan mengelola infrastruktur jaringan kompleks',
    },
    multimedia: {
      description: 'Produksi multimedia profesional untuk industri kreatif dan broadcasting',
      theme: 'Menciptakan konten visual berkualitas tinggi standar industri',
    }
  }
}

export default function Home() {
  const [config, setConfig] = useState<any>({ mode: 'TRAINING_BASIC' })
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [sponsors, setSponsors] = useState<any[]>([])
  const [qnaItems, setQnaItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [configRes, teamRes, sponsorsRes, qnaRes] = await Promise.all([
          fetch('/api/config').catch(() => ({ ok: false, json: () => Promise.resolve({ mode: 'TRAINING_BASIC' }) })),
          fetch('/api/team').catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
          fetch('/api/sponsors').catch(() => ({ ok: false, json: () => Promise.resolve([]) })),
          fetch('/api/qna').catch(() => ({ ok: false, json: () => Promise.resolve([]) }))
        ])

        const configData = configRes.ok ? await configRes.json() : { mode: 'TRAINING_BASIC' }
        const teamData = teamRes.ok ? await teamRes.json() : []
        const sponsorsData = sponsorsRes.ok ? await sponsorsRes.json() : []
        const qnaData = qnaRes.ok ? await qnaRes.json() : []

        setConfig(configData || { mode: 'TRAINING_BASIC' })
        setTeamMembers(teamData)
        setSponsors(sponsorsData)
        setQnaItems(qnaData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Failed to load data. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const content = trainingDescriptions[config.mode as keyof typeof trainingDescriptions] || trainingDescriptions.TRAINING_BASIC

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

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
