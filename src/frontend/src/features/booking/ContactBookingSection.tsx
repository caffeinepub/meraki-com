import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useSubmitInquiry, useGetSiteSettings } from '../../hooks/useQueries';
import { getAllServices, getServiceKeyFromUrl, type MerakiServiceKey } from '../../lib/merakiServices';
import { ContactMethod } from '../../backend';
import { toast } from 'sonner';
import { CheckCircle2, Mail, Phone, MessageSquare } from 'lucide-react';

export default function ContactBookingSection() {
  const services = getAllServices();
  const submitInquiry = useSubmitInquiry();
  const { data: siteSettings } = useGetSiteSettings();

  // Fallback to defaults if settings not available
  const contactEmail = siteSettings?.contactEmail || 'meetrishabmehta@gmail.com';
  const contactPhone = siteSettings?.contactPhone || '9990093666';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '' as MerakiServiceKey | '',
    preferredContactMethod: '' as 'email' | 'phone' | '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const preselectedService = getServiceKeyFromUrl();
    if (preselectedService) {
      setFormData((prev) => ({ ...prev, service: preselectedService }));
    }
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.service) newErrors.service = 'Please select a service';
    if (!formData.preferredContactMethod) newErrors.preferredContactMethod = 'Please select a contact method';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (!formData.consent) newErrors.consent = 'You must agree to be contacted';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedService = services.find((s) => s.key === formData.service);
    if (!selectedService) {
      toast.error('Invalid service selection');
      return;
    }

    try {
      await submitInquiry.mutateAsync({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: selectedService.backendValue,
        preferredContactMethod: formData.preferredContactMethod === 'email' ? ContactMethod.email : ContactMethod.phone,
        message: formData.message,
        consent: formData.consent,
      });

      setIsSubmitted(true);
      toast.success('Your inquiry has been submitted successfully!');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        service: '',
        preferredContactMethod: '',
        message: '',
        consent: false,
      });
      setErrors({});

      // Reset success state after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      toast.error('Failed to submit inquiry. Please try again.');
      console.error('Inquiry submission error:', error);
    }
  };

  // Sanitize phone number for tel: link (remove spaces and non-dialable characters)
  const sanitizePhoneForTel = (phone: string) => {
    return phone.replace(/[\s()-]/g, '');
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-12 pb-12 text-center">
                <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
                <p className="text-muted-foreground mb-6">
                  Your inquiry has been successfully saved to our system. The site owner will be able to view your details after signing in to the Inquiries dashboard and will get back to you within 24 hours.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  Submit Another Inquiry
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Consultation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to begin your journey? Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                  {contactEmail}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <a href={`tel:${sanitizePhoneForTel(contactPhone)}`} className="text-primary hover:underline">
                  {contactPhone}
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className={errors.fullName ? 'border-destructive' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 9990093666"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service">
                      Service <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={(value) => setFormData({ ...formData, service: value as MerakiServiceKey })}
                    >
                      <SelectTrigger className={errors.service ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.key} value={service.key}>
                            {service.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.service && (
                      <p className="text-sm text-destructive">{errors.service}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredContactMethod">
                      Preferred Contact Method <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.preferredContactMethod}
                      onValueChange={(value) => setFormData({ ...formData, preferredContactMethod: value as 'email' | 'phone' })}
                    >
                      <SelectTrigger className={errors.preferredContactMethod ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select contact method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.preferredContactMethod && (
                      <p className="text-sm text-destructive">{errors.preferredContactMethod}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your needs and what you'd like to explore..."
                      rows={5}
                      className={errors.message ? 'border-destructive' : ''}
                    />
                    {errors.message && (
                      <p className="text-sm text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                      className={errors.consent ? 'border-destructive' : ''}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="consent" className="text-sm font-normal cursor-pointer">
                        I agree to be contacted regarding my inquiry and understand that my information will be processed according to the privacy policy. <span className="text-destructive">*</span>
                      </Label>
                      {errors.consent && (
                        <p className="text-sm text-destructive">{errors.consent}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={submitInquiry.isPending}
                  >
                    {submitInquiry.isPending ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
