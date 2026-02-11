import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllInquiries, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoginButton from '../components/meraki/LoginButton';
import ProfileSetupDialog from '../components/meraki/ProfileSetupDialog';
import { ArrowLeft, Mail, Phone, Calendar, MessageSquare, Settings } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { Inquiry } from '../backend';

export default function InquiriesPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: inquiries = [], isLoading, error } = useGetAllInquiries();
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const filteredInquiries = selectedService === 'all'
    ? inquiries
    : inquiries.filter(inq => inq.service === selectedService);

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      consulting: 'Numerology / Reiki',
      coaching: 'Vaastu',
      workshops: 'Aura Scanning'
    };
    return labels[service] || service;
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              Please sign in with Internet Identity to access the inquiries dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <LoginButton />
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to view inquiries. Only authorized administrators can access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <LoginButton />
            <Link to="/">
              <Button variant="ghost" className="gap-2 w-full">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupDialog open={showProfileSetup} onOpenChange={() => {}} />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Inquiries Dashboard</h1>
              {userProfile && (
                <p className="text-muted-foreground">Welcome back, {userProfile.name}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link to="/settings">
                <Button variant="outline" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <LoginButton />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Filter Inquiries</CardTitle>
                  <CardDescription>
                    {filteredInquiries.length} of {inquiries.length} inquiries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="consulting">Numerology / Reiki</SelectItem>
                      <SelectItem value="coaching">Vaastu</SelectItem>
                      <SelectItem value="workshops">Aura Scanning</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Inquiries List</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {isLoading ? (
                      <div className="p-4 text-center text-muted-foreground">Loading...</div>
                    ) : filteredInquiries.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">No inquiries found</div>
                    ) : (
                      <div className="space-y-1">
                        {filteredInquiries.map((inquiry) => (
                          <button
                            key={inquiry.id.toString()}
                            onClick={() => setSelectedInquiry(inquiry)}
                            className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                              selectedInquiry?.id === inquiry.id ? 'bg-muted' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{inquiry.fullName}</p>
                                <p className="text-sm text-muted-foreground truncate">{inquiry.email}</p>
                              </div>
                              <Badge variant="secondary" className="shrink-0 text-xs">
                                {getServiceLabel(inquiry.service)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(inquiry.timestamp)}
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              {selectedInquiry ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedInquiry.fullName}</CardTitle>
                        <CardDescription className="mt-1">
                          Inquiry #{selectedInquiry.id.toString()}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {getServiceLabel(selectedInquiry.service)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{selectedInquiry.email}</p>
                        </div>
                      </div>
                      
                      {selectedInquiry.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">{selectedInquiry.phone}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Submitted</p>
                          <p className="font-medium">{formatDate(selectedInquiry.timestamp)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Preferred Contact</p>
                          <p className="font-medium capitalize">{selectedInquiry.preferredContactMethod}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2">Message</h3>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>
                    </div>

                    {selectedInquiry.consent && (
                      <div className="text-sm text-muted-foreground">
                        ✓ Consent given for contact and data processing
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Select an inquiry from the list to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
