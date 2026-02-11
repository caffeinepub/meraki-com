import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Users, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const highlights = [
    {
      icon: Award,
      title: '20+ Years Experience',
      description: 'Two decades of dedicated practice and continuous learning in spiritual sciences',
    },
    {
      icon: Users,
      title: '1000+ Lives Transformed',
      description: 'Helping individuals and families find balance, harmony, and purpose',
    },
    {
      icon: Heart,
      title: 'Holistic Approach',
      description: 'Integrating ancient wisdom with modern understanding for complete well-being',
    },
    {
      icon: Sparkles,
      title: 'Personalized Guidance',
      description: 'Every consultation is tailored to your unique energy and life circumstances',
    },
  ];

  return (
    <section id="about" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">
              Meet Rishab Mehta
            </h2>
            <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
              <p>
                With over <span className="font-semibold text-primary">20 years of experience</span> in spiritual sciences, 
                Rishab Mehta has dedicated his life to helping people discover their true potential and live in harmony 
                with the universe.
              </p>
              <p>
                As a certified expert in Numerology, Vaastu Shastra, Aura Scanning, and Reiki healing, Rishab combines 
                ancient wisdom with compassionate guidance to address the unique challenges faced by each individual.
              </p>
              <p>
                His mission is simple yet profound: to help you lead a <span className="font-semibold text-accent">balanced 
                and harmonious life</span> by aligning your energy with your purpose, your space with cosmic forces, and 
                your spirit with universal healing.
              </p>
              <p className="text-muted-foreground italic">
                "True transformation begins when we understand the invisible forces that shape our reality and learn to 
                work with them, not against them."
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item) => (
              <Card key={item.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

