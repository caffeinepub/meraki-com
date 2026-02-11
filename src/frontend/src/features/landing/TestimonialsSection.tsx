import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      service: 'Numerology',
      text: 'Rishab\'s numerology reading was incredibly accurate and insightful. It helped me understand my life path and make important career decisions with confidence.',
      rating: 5,
    },
    {
      name: 'Rajesh Kumar',
      service: 'Vaastu Shastra',
      text: 'After implementing the Vaastu recommendations for our home, we noticed a significant positive shift in our family dynamics and overall prosperity.',
      rating: 5,
    },
    {
      name: 'Anjali Desai',
      service: 'Aura Scanning',
      text: 'The aura scanning session revealed energy blockages I wasn\'t aware of. The healing practices recommended have brought me peace and clarity.',
      rating: 5,
    },
    {
      name: 'Vikram Patel',
      service: 'Reiki Healing',
      text: 'Rishab\'s Reiki sessions have been transformative. I feel more balanced, energized, and connected to my inner self than ever before.',
      rating: 5,
    },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Client Testimonials
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from those who have experienced transformation through our services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.service}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

