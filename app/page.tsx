import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import AboutSection from '@/components/landing/AboutSection'
import ProgramsSection from '@/components/landing/ProgramsSection'
import TeamSection from '@/components/landing/TeamSection'
import SponsorsSection from '@/components/landing/SponsorsSection'
import FaqSection from '@/components/landing/FaqSection'
import CtaSection from '@/components/landing/CtaSection'
import Footer from '@/components/landing/Footer'
import { getConfig } from '@/app/actions/config'
import { getTeamMembers } from '@/app/actions/team'
import { getSponsors } from '@/app/actions/sponsors'
import { getQnaItems } from '@/app/actions/qna'

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

export default async function Home() {
  // Fetch data using server actions
  const [configResult, teamResult, sponsorsResult, qnaResult] = await Promise.all([
    getConfig(),
    getTeamMembers(),
    getSponsors(),
    getQnaItems()
  ])

  const config = configResult.success && configResult.data ? configResult.data : { mode: 'TRAINING_BASIC' as const }
  const teamMembers = teamResult.success && teamResult.data ? teamResult.data : []
  const sponsors = sponsorsResult.success && sponsorsResult.data ? sponsorsResult.data : []
  const qnaItems = qnaResult.success && qnaResult.data ? qnaResult.data : []

  const content = trainingDescriptions[config.mode as keyof typeof trainingDescriptions] || trainingDescriptions.TRAINING_BASIC

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
