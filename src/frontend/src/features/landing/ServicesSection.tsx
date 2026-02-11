import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllServices } from '../../lib/merakiServices';
import { ArrowRight } from 'lucide-react';

export default function ServicesSection() {
  const services = getAllServices();

  const scrollToServiceDetail = (serviceKey: string) => {
    const element = document.getElementById(`service-${serviceKey}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive spiritual guidance tailored to your unique journey towards balance and enlightenment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card
              key={service.key}
              className="group hover:shadow-premium transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <img
                    src={service.icon}
                    alt={`${service.label} icon`}
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <CardTitle className="text-xl font-display text-primary group-hover:text-accent transition-colors">
                  {service.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {service.shortDescription}
                </CardDescription>
                <Button
                  variant="ghost"
                  onClick={() => scrollToServiceDetail(service.key)}
                  className="group/btn text-primary hover:text-accent"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

