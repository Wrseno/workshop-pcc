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
    <section id="faq" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
        <p className="text-lg text-gray-600">Temukan jawaban untuk pertanyaan umum tentang program pelatihan</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {qnaItems.map((item, index) => (
            <AccordionItem key={item.id} value={`item-${index}`} className="border-2 rounded-xl px-6 bg-white hover:border-blue-400 transition">
              <AccordionTrigger className="text-left font-semibold hover:text-blue-600 py-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
