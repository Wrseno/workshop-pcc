import ImageWithSkeleton from '@/components/ui/image-with-skeleton'

interface Sponsor {
  id: string
  name: string
  logoUrl: string | null
  linkUrl: string | null
  order: number
}

interface SponsorsSectionProps {
  sponsors: Sponsor[]
}

export default function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  if (sponsors.length === 0) return null

  return (
    <section className="bg-[#030712] py-20 border-t border-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-3 py-1 rounded bg-gray-800 border border-gray-700 text-gray-400 font-mono text-xs tracking-wider">
            ./PARTNERS
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight font-mono">POWERED_BY</h2>
          <p className="text-lg text-gray-400 font-light">Partner dan sponsor yang mendukung program kami.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 items-center max-w-5xl mx-auto">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-50 blur transition duration-500"></div>
              <div className="relative bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300">
                {sponsor.linkUrl ? (
                  <a href={sponsor.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                    {sponsor.logoUrl ? (
                      <div className="relative h-24 w-48 flex items-center justify-center">
                        <ImageWithSkeleton 
                          src={sponsor.logoUrl} 
                          alt={sponsor.name} 
                          className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                          skeletonClassName="rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="text-xl font-bold text-gray-400 font-mono group-hover:text-white transition-colors">{sponsor.name}</div>
                    )}
                  </a>
                ) : (
                  sponsor.logoUrl ? (
                    <div className="relative h-24 w-48 flex items-center justify-center">
                      <ImageWithSkeleton 
                        src={sponsor.logoUrl} 
                        alt={sponsor.name} 
                        className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                        skeletonClassName="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="text-xl font-bold text-gray-400 font-mono group-hover:text-white transition-colors">{sponsor.name}</div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
