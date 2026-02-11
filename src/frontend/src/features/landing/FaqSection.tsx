import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FaqSection() {
  const faqs = [
    {
      question: 'What can I expect from my first consultation?',
      answer: 'Your first consultation will be a comprehensive session where we discuss your concerns, goals, and current life situation. Depending on the service you choose, we\'ll perform the relevant analysis (numerology calculations, vaastu assessment, aura reading, or Reiki healing) and provide you with detailed insights and actionable recommendations.',
    },
    {
      question: 'How long does a typical session last?',
      answer: 'Session duration varies by service. Numerology and aura scanning sessions typically last 60-90 minutes, Vaastu consultations can take 90-120 minutes depending on the property size, and Reiki healing sessions are usually 45-60 minutes. We ensure adequate time to address all your questions and concerns.',
    },
    {
      question: 'Can consultations be done remotely?',
      answer: 'Yes! Many of our services can be conducted remotely via video call. Numerology, aura scanning, and Reiki healing work effectively at a distance. For Vaastu consultations, we can work with floor plans and photos, though an in-person visit may be recommended for complex cases.',
    },
    {
      question: 'How soon will I see results?',
      answer: 'Results vary by individual and service. Some clients experience immediate shifts in awareness and energy, while others notice gradual improvements over weeks or months as they implement the recommendations. Consistency in following the guidance provided is key to achieving lasting transformation.',
    },
    {
      question: 'Are your services suitable for everyone?',
      answer: 'Our services are designed to help anyone seeking spiritual growth, balance, and harmony. However, they work best for those who are open-minded and committed to personal transformation. We welcome people of all backgrounds, beliefs, and life stages.',
    },
    {
      question: 'Important Disclaimer',
      answer: 'Our services provide spiritual guidance and holistic well-being support. They are not a substitute for professional medical, legal, financial, or psychological advice. If you have health concerns, please consult with a qualified healthcare provider. Our services complement, but do not replace, conventional professional care.',
    },
  ];

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about our services and approach
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-2 rounded-lg px-6 hover:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-primary hover:text-accent">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

