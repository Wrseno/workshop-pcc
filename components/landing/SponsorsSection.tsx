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
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Didukung Oleh</h2>
          <p className="text-lg text-gray-600">Partner dan sponsor yang mendukung program kami</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 items-center max-w-5xl mx-auto">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110">
              {sponsor.linkUrl ? (
                <a href={sponsor.linkUrl} target="_blank" rel="noopener noreferrer">
                  {sponsor.logoUrl ? (
                    <img src={sponsor.logoUrl} alt={sponsor.name} className="h-32 rounded-xl w-auto object-contain" />
                  ) : (
                    <div className="text-3xl font-bold text-gray-700">{sponsor.name}</div>
                  )}
                </a>
              ) : (
                sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="h-32 w-auto object-contain" />
                ) : (
                  <div className="text-3xl font-bold text-gray-700">{sponsor.name}</div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
