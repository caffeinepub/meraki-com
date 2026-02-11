import { Card, CardContent } from '@/components/ui/card';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Book Your Consultation',
      description: 'Choose your service and schedule a convenient time for your session through our simple booking form.',
    },
    {
      number: '02',
      title: 'Initial Assessment',
      description: 'Share your concerns and goals. We\'ll gather the necessary information to provide personalized guidance.',
    },
    {
      number: '03',
      title: 'Deep Analysis',
      description: 'Receive comprehensive insights using proven spiritual sciences tailored to your unique situation.',
    },
    {
      number: '04',
      title: 'Actionable Guidance',
      description: 'Get practical recommendations and remedies you can implement immediately to transform your life.',
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Your journey to balance and harmony begins with a simple four-step process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card
              key={step.number}
              className="relative border-2 hover:border-primary/50 transition-all hover:shadow-premium"
            >
              <CardContent className="p-6">
                <div className="text-6xl font-display font-bold text-accent/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-6 border-t-2 border-r-2 border-accent/30 transform rotate-45 -translate-y-1/2" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

