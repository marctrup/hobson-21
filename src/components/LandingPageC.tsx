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
      <section className="relative overflow-hidden">
        {/* Background with gradient and decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-20 md:py-32">
          {/* Breadcrumb */}
          <nav className="text-white/80 text-sm mb-8">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Pilot Program</span>
            <span className="mx-2">›</span>
            <span className="text-white">Hobson's Choice AI: The Ultimate Property Intelligence Guide</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content - Left Side */}
            <div className="text-white space-y-8">
              <div className="inline-block rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-white/30">
                Pilot Program
              </div>
              
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  Hobson's Choice AI:
                </h1>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  The Ultimate Property
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    Intelligence Guide
                  </span>
                </h2>
              </div>
            </div>

            {/* Video Container - Right Side */}
            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                {/* Video with play button overlay */}
                <div className="relative rounded-2xl overflow-hidden bg-black">
                  <video
                    className="w-full h-auto"
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    poster="/lovable-uploads/b5265bc4-b41d-4891-8c70-ab934835d300.png"
                  >
                    <source src={avatarVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Play/Mute button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110"
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      ) : (
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-xl"></div>
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