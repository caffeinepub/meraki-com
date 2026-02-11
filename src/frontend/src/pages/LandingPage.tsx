import HeaderNav from '../features/landing/HeaderNav';
import HeroSection from '../features/landing/HeroSection';
import ServicesSection from '../features/landing/ServicesSection';
import ServiceDetailsSection from '../features/landing/ServiceDetailsSection';
import AboutSection from '../features/landing/AboutSection';
import HowItWorksSection from '../features/landing/HowItWorksSection';
import TestimonialsSection from '../features/landing/TestimonialsSection';
import FaqSection from '../features/landing/FaqSection';
import ContactBookingSection from '../features/booking/ContactBookingSection';
import Footer from '../features/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeaderNav />
      <main>
        <HeroSection />
        <ServicesSection />
        <ServiceDetailsSection />
        <AboutSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactBookingSection />
      </main>
      <Footer />
    </div>
  );
}

