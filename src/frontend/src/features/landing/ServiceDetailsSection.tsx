import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllServices } from '../../lib/merakiServices';
import { Check } from 'lucide-react';

export default function ServiceDetailsSection() {
  const services = getAllServices();

  const scrollToContact = (serviceKey: string) => {
    const element = document.getElementById('contact');
    if (element) {
      // Update URL with service parameter
      const url = new URL(window.location.href);
      url.searchParams.set('service', serviceKey);
      window.history.replaceState({}, '', url);
      
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="space-y-24">
          {services.map((service, index) => (
            <div
              key={service.key}
              id={`service-${service.key}`}
              className="scroll-mt-20"
            >
              <Card className="overflow-hidden border-2 hover:border-primary/30 transition-colors">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <img
                            src={service.icon}
                            alt={`${service.label} icon`}
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <CardTitle className="text-3xl font-display text-primary">
                          {service.label}
                        </CardTitle>
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {service.fullDescription}
                      </p>
                    </CardHeader>
                  </div>

                  <div className={`bg-gradient-to-br from-primary/5 to-accent/5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <CardContent className="h-full flex flex-col justify-center p-8">
                      <h3 className="text-xl font-semibold mb-6 text-primary">What to Expect:</h3>
                      <ul className="space-y-3 mb-8">
                        {service.whatToExpect.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-sm text-foreground/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => scrollToContact(service.key)}
                        className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                      >
                        Book {service.label} Session
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

