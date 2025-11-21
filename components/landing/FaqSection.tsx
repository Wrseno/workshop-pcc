import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

interface QnaItem {
  id: string
  question: string
  answer: string
  mode: string | null
  order: number
}

interface FaqSectionProps {
  qnaItems: QnaItem[]
}

export default function FaqSection({ qnaItems }: FaqSectionProps) {
  if (qnaItems.length === 0) return null

  return (
    <section id="faq" className="container mx-auto px-4 py-20 bg-[#030712]">
      <div className="text-center mb-16">
        <div className="inline-block mb-4 px-3 py-1 rounded bg-gray-800 border border-gray-700 text-gray-400 font-mono text-xs tracking-wider">
          ./HELP_CENTER
        </div>
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">FREQUENTLY ASKED QUESTIONS</h2>
        <p className="text-lg text-gray-400 font-light">Temukan jawaban untuk pertanyaan umum tentang program pelatihan.</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {qnaItems.map((item, index) => (
            <AccordionItem 
              key={item.id} 
              value={`item-${index}`} 
              className="border border-gray-800 rounded-lg px-6 bg-[#0a0a0a] hover:border-blue-500/30 transition-all duration-300 data-[state=open]:border-blue-500/50 data-[state=open]:bg-blue-900/5"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-200 hover:text-blue-400 py-6 text-lg font-mono">
                <span className="mr-4 text-blue-500 opacity-50">0{index + 1}.</span>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-6 text-base leading-relaxed font-light border-t border-gray-800/50 pt-4">
                <span className="text-blue-500 font-mono mr-2">&gt;</span>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
