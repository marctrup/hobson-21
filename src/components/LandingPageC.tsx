import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { usePilotApplication } from "@/hooks/usePilotApplication";
import { OptimizedImage } from "@/components/OptimizedImage";
import hobsonLogo from "@/assets/hobson-logo.png";
import avatarVideo from "@/assets/avitar-hobson-explainer.mp4";

const LandingPageC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const {
    form,
    emailExists,
    isCheckingEmail,
    handleEmailChange,
    onSubmit,
  } = usePilotApplication();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <OptimizedImage
              src={hobsonLogo}
              alt="Hobson's Choice AI"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold">Hobson's Choice AI</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background with gradient - exact HeyGen purple gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600"></div>
        
        <div className="relative container mx-auto pl-4 pr-0 max-w-7xl h-[60vh] flex flex-col">
          {/* Breadcrumb - exact HeyGen style */}
          <nav className="text-white/80 text-sm mb-8 pt-8">
            <span>Home</span>
            <span className="mx-2">{'>'}</span>
            <span>Playbook</span>
            <span className="mx-2">{'>'}</span>
            <span className="text-white">HeyGen for Marketers: The Ultimate AI Video Jumpstart Guide</span>
          </nav>

          <div className="flex-1 grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content - Left Side */}
            <div className="text-white space-y-6">
              {/* Tag - exact HeyGen style */}
              <div className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-white/30">
                Playbook
              </div>
              
              {/* Main Heading - exact HeyGen typography */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  HeyGen for Marketers:
                </h1>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight opacity-90">
                  The Ultimate AI Video
                  <br />
                  Jumpstart Guide
                </h2>
              </div>
            </div>

            {/* Person with Play Button - Right Side - Completely embedded */}
            <div className="relative h-full flex items-stretch justify-end" style={{ marginRight: '-19px' }}>
              {/* Main container that fills the available space */}
              <div className="relative w-full h-full">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                  {/* Primary background frame */}
                  <div className="absolute top-0 right-0 w-full h-full bg-white/5 backdrop-blur-sm border border-white/10"></div>
                  {/* Secondary subtle frame */}
                  <div className="absolute top-8 left-8 w-[calc(100%-2rem)] h-[calc(100%-2rem)] bg-white/3 backdrop-blur-sm border border-white/5"></div>
                </div>
                
                {/* Person image container - completely fills the frame */}
                <div className="relative z-10 w-full h-full">
                  <div className="relative h-full w-full">
                    {/* Person image - fills entire container */}
                    <img 
                      src="/lovable-uploads/9134dbfd-4f1b-4aa2-b873-22cc634732e8.png"
                      alt="Person presenting"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    
                    {/* Play button overlay - positioned within the frame */}
                    <div className="absolute bottom-8 left-8">
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                        aria-label="Play video"
                      >
                        <div className="w-0 h-0 border-l-[16px] border-l-purple-600 border-y-[12px] border-y-transparent ml-1"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Welcome to Your Property Intelligence Pilot Guide
            </h2>
            <div className="text-xl text-gray-600 space-y-6 max-w-4xl mx-auto leading-relaxed">
              <p>
                Want to revolutionize your property workflows but feel held back by time-consuming document analysis, manual compliance checks, or inefficient data extraction? You're not alone.
              </p>
              <p>
                Here's the good news: with Hobson's Choice AI, you can transform property documents into intelligent insights that drive better decisions, faster processes, and superior outcomes at a fraction of the traditional cost and time.
              </p>
              <p>
                This pilot program is built for property professionals ready to elevate their operations with AI-powered intelligence. You'll learn how to go from manual document processing to automated insights, creating high-quality, scalable workflows without requiring extensive technical expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Application Form */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 border border-border/50">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Register Your Interest
              </h3>
              <p className="text-muted-foreground">
                Complete the form below to join our pilot program
              </p>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-base font-medium">Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="Your full name" 
                    className="mt-2"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="company" className="text-base font-medium">Company *</Label>
                  <Input 
                    id="company" 
                    placeholder="Your company name" 
                    className="mt-2"
                    {...form.register("company")}
                  />
                  {form.formState.errors.company && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.company.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="role" className="text-base font-medium">Role *</Label>
                  <Input 
                    id="role" 
                    placeholder="Your job title" 
                    className="mt-2"
                    {...form.register("role")}
                  />
                  {form.formState.errors.role && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-base font-medium">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="mt-2"
                    {...form.register("email", {
                      onChange: (e) => {
                        handleEmailChange(e.target.value);
                      },
                    })}
                  />
                  <div className="min-h-[1.25rem] mt-1">
                    {form.formState.errors.email ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.email.message}
                      </p>
                    ) : isCheckingEmail ? (
                      <p className="text-sm text-muted-foreground">
                        Checking email...
                      </p>
                    ) : emailExists ? (
                      <p className="text-sm text-destructive">
                        This email has already been used for a pilot application. If you're the same person, please contact us directly at info@hobsonschoice.ai
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmEmail" className="text-base font-medium">Confirm Email *</Label>
                <Input 
                  id="confirmEmail" 
                  type="email" 
                  placeholder="Confirm your email address" 
                  className="mt-2"
                  {...form.register("confirmEmail")}
                />
                {form.formState.errors.confirmEmail && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.confirmEmail.message}
                  </p>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone" className="text-base font-medium">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="Your phone number" 
                    className="mt-2"
                    {...form.register("phone")}
                  />
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="website" className="text-base font-medium">Website</Label>
                  <Input 
                    id="website" 
                    placeholder="yourcompany.com" 
                    className="mt-2"
                    {...form.register("website")}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="preferredContact" className="text-base font-medium">Preferred Contact Method *</Label>
                <Select onValueChange={(value) => form.setValue("preferredContact", value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="How would you like us to contact you?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="either">Either Email or Phone</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.preferredContact && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.preferredContact.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-base font-medium">Business Type (Select all that apply) *</Label>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {["Property Management", "Property Sales", "Surveying", "Architecture and Planning", "Lending", "Compliance"].map((type) => (
                    <div key={type} className="flex items-center space-x-3">
                      <Checkbox 
                        id={type}
                        {...form.register("businessTypes")}
                        value={type}
                        onCheckedChange={(checked) => {
                          const currentValues = form.getValues("businessTypes") || [];
                          if (checked) {
                            form.setValue("businessTypes", [...currentValues, type]);
                          } else {
                            form.setValue("businessTypes", currentValues.filter(v => v !== type));
                          }
                        }}
                      />
                      <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.businessTypes && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.businessTypes.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="help" className="text-base font-medium">How can Hobson help your business? (Optional)</Label>
                <Textarea 
                  id="help"
                  placeholder="Tell us about your document challenges, workflows, or specific use cases..."
                  className="min-h-[120px] mt-2"
                  {...form.register("help")}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-semibold"
                size="lg"
                disabled={emailExists}
              >
                Join the Pilot Program
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Hobson's Choice AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageC;