import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetAllInquiries, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import LoginButton from '../components/meraki/LoginButton';
import ProfileSetupDialog from '../components/meraki/ProfileSetupDialog';
import type { Inquiry } from '../types/meraki';
import { Mail, Phone, MessageSquare, Calendar, User, Settings, Filter } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { getAllServices } from '../lib/merakiServices';

export default function InquiriesPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading, error: adminError } = useIsCallerAdmin();
  const { data: inquiries = [], isLoading: inquiriesLoading } = useGetAllInquiries();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const services = getAllServices();

  const filteredInquiries = serviceFilter === 'all'
    ? inquiries
    : inquiries.filter((inq) => inq.service === serviceFilter);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp / 1000000).toLocaleString();
  };

  const getServiceLabel = (serviceValue: string) => {
    const service = services.find((s) => s.backendValue === serviceValue);
    return service?.label || serviceValue;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              Please sign in with Internet Identity to view inquiries.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <LoginButton />
            <Link to="/">
              <Button variant="ghost">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminError || (isAdmin === false && !adminLoading)) {
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
              <Button variant="ghost" className="w-full">Back to Home</Button>
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
                  Site Settings
                </Button>
              </Link>
              <LoginButton />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter by Service
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={serviceFilter} onValueChange={setServiceFilter} orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col h-auto w-full">
                      <TabsTrigger value="all" className="w-full justify-start">
                        All Services ({inquiries.length})
                      </TabsTrigger>
                      {services.map((service) => {
                        const count = inquiries.filter((inq) => inq.service === service.backendValue).length;
                        return (
                          <TabsTrigger key={service.key} value={service.backendValue} className="w-full justify-start">
                            {service.label} ({count})
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Inquiries List</CardTitle>
                  <CardDescription>
                    {filteredInquiries.length} {filteredInquiries.length === 1 ? 'inquiry' : 'inquiries'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    {inquiriesLoading || adminLoading ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Loading inquiries...
                      </div>
                    ) : filteredInquiries.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No inquiries found
                      </div>
                    ) : (
                      <div className="space-y-2 p-4">
                        {filteredInquiries.map((inquiry) => (
                          <Card
                            key={inquiry.id}
                            className={`cursor-pointer transition-colors hover:bg-accent ${
                              selectedInquiry?.id === inquiry.id ? 'border-primary bg-accent' : ''
                            }`}
                            onClick={() => setSelectedInquiry(inquiry)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold">{inquiry.fullName}</h3>
                                <Badge variant="outline">{getServiceLabel(inquiry.service)}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{inquiry.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {formatDate(inquiry.timestamp)}
                              </p>
                            </CardContent>
                          </Card>
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
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Inquiry Details
                    </CardTitle>
                    <CardDescription>
                      Submitted on {formatDate(selectedInquiry.timestamp)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span className="font-medium">Full Name</span>
                        </div>
                        <p className="text-lg">{selectedInquiry.fullName}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Service</span>
                        </div>
                        <Badge variant="secondary" className="text-base">
                          {getServiceLabel(selectedInquiry.service)}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="font-medium">Email</span>
                        </div>
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          className="text-primary hover:underline"
                        >
                          {selectedInquiry.email}
                        </a>
                      </div>

                      {selectedInquiry.phone && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span className="font-medium">Phone</span>
                          </div>
                          <a
                            href={`tel:${selectedInquiry.phone}`}
                            className="text-primary hover:underline"
                          >
                            {selectedInquiry.phone}
                          </a>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          <span className="font-medium">Preferred Contact Method</span>
                        </div>
                        <Badge variant="outline">
                          {selectedInquiry.preferredContactMethod === 'email' ? 'Email' : 'Phone'}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Message</span>
                      </div>
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <p className="whitespace-pre-wrap">{selectedInquiry.message}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button asChild className="gap-2">
                        <a href={`mailto:${selectedInquiry.email}`}>
                          <Mail className="h-4 w-4" />
                          Send Email
                        </a>
                      </Button>
                      {selectedInquiry.phone && (
                        <Button variant="outline" asChild className="gap-2">
                          <a href={`tel:${selectedInquiry.phone}`}>
                            <Phone className="h-4 w-4" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Inquiry Selected</h3>
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
