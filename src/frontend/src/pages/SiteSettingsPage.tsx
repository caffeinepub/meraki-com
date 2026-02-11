import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetSiteSettings, useUpdateSiteSettings, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import LoginButton from '../components/meraki/LoginButton';
import ProfileSetupDialog from '../components/meraki/ProfileSetupDialog';
import ProjectExportCard from '../components/meraki/ProjectExportCard';
import { ArrowLeft, Save, Settings } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';

export default function SiteSettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading, error: adminError } = useIsCallerAdmin();
  const { data: siteSettings, isLoading: settingsLoading } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [formData, setFormData] = useState({
    contactEmail: '',
    contactPhone: '',
    businessName: '',
    addressLine: '',
  });

  const [formInitialized, setFormInitialized] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Initialize form with current settings
  if (siteSettings && !formInitialized) {
    setFormData({
      contactEmail: siteSettings.contactEmail || '',
      contactPhone: siteSettings.contactPhone || '',
      businessName: siteSettings.businessName || '',
      addressLine: siteSettings.addressLine || '',
    });
    setFormInitialized(true);
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.contactEmail.trim()) {
      toast.error('Contact email is required');
      return;
    }

    if (!validateEmail(formData.contactEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.contactPhone.trim()) {
      toast.error('Contact phone is required');
      return;
    }

    try {
      await updateSettings.mutateAsync({
        contactEmail: formData.contactEmail.trim(),
        contactPhone: formData.contactPhone.trim(),
        businessName: formData.businessName.trim() || undefined,
        addressLine: formData.addressLine.trim() || undefined,
        socialLinks: undefined,
      });

      toast.success('Site settings updated successfully!');
    } catch (error: any) {
      console.error('Settings update error:', error);
      toast.error('Failed to update settings. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Access Required</CardTitle>
            <CardDescription>
              Please sign in with Internet Identity to access site settings.
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

  if (adminError || (isAdmin === false && !adminLoading)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You do not have permission to access site settings. Only authorized administrators can access this page.
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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
                <Settings className="h-8 w-8" />
                Site Settings
              </h1>
              {userProfile && (
                <p className="text-muted-foreground">Welcome back, {userProfile.name}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link to="/inquiries">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Inquiries
                </Button>
              </Link>
              <LoginButton />
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Update the contact details displayed on your website. These changes will be reflected immediately on the landing page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {settingsLoading || adminLoading ? (
                  <div className="py-8 text-center text-muted-foreground">
                    Loading settings...
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">
                          Contact Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          placeholder="contact@example.com"
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          This email will be displayed in the contact section
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">
                          Contact Phone <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          This phone number will be displayed in the contact section
                        </p>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name (Optional)</Label>
                        <Input
                          id="businessName"
                          type="text"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          placeholder="Meraki Spiritual Services"
                        />
                        <p className="text-sm text-muted-foreground">
                          Your business or organization name
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="addressLine">Address (Optional)</Label>
                        <Input
                          id="addressLine"
                          type="text"
                          value={formData.addressLine}
                          onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                          placeholder="123 Main St, City, State 12345"
                        />
                        <p className="text-sm text-muted-foreground">
                          Your business address or location
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Link to="/inquiries">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </Link>
                      <Button type="submit" disabled={updateSettings.isPending} className="gap-2">
                        {updateSettings.isPending ? (
                          'Saving...'
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>

            <ProjectExportCard />
          </div>
        </div>
      </div>
    </>
  );
}
