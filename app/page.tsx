import { prisma } from '@/lib/prisma'
import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import AboutSection from '@/components/landing/AboutSection'
import ProgramsSection from '@/components/landing/ProgramsSection'
import TeamSection from '@/components/landing/TeamSection'
import SponsorsSection from '@/components/landing/SponsorsSection'
import FaqSection from '@/components/landing/FaqSection'
import CtaSection from '@/components/landing/CtaSection'
import Footer from '@/components/landing/Footer'

async function getSiteConfig() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } })
  return config || { mode: 'TRAINING_BASIC' }
}

async function getTeamMembers() {
  return await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
}

async function getSponsors() {
  return await prisma.sponsor.findMany({ orderBy: { order: 'asc' } })
}

async function getQnaItems(mode: string) {
  return await prisma.qnaItem.findMany({
    where: {
      OR: [
        { mode: null },
        { mode: mode as any }
      ]
    },
    orderBy: { order: 'asc' }
  })
}

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

export default async function Home() {
  const config = await getSiteConfig()
  const teamMembers = await getTeamMembers()
  const sponsors = await getSponsors()
  const qnaItems = await getQnaItems(config.mode)

  const content = trainingDescriptions[config.mode as keyof typeof trainingDescriptions]

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
