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
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side on Desktop */}
          <div className="order-2 lg:order-1 space-y-6">
            <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Limited Time Beta Access
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Join Our{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Pilot Scheme
              </span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Transform your property documents with AI-powered intelligence and get early access to revolutionary document analysis.
            </p>
          </div>

          {/* Video - Right Side on Desktop */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 p-8">
              <video
                className="w-full h-auto rounded-xl shadow-2xl"
                autoPlay
                muted={isMuted}
                loop
                playsInline
              >
                <source src={avatarVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Controls */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-primary rounded-full p-3 shadow-lg transition-all duration-200"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.785L4.764 13.5H3a1 1 0 01-1-1v-5a1 1 0 011-1h1.764l3.619-3.285a1 1 0 011.617.785zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.785L4.764 13.5H3a1 1 0 01-1-1v-5a1 1 0 011-1h1.764l3.619-3.285a1 1 0 011.617.785zM12 9H4v2h8V9z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Text Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Welcome to Our Pilot Scheme
          </h2>
          <div className="text-lg text-muted-foreground space-y-4 max-w-3xl mx-auto">
            <p>
              Our AI-powered property document intelligence platform is designed for forward-thinking property professionals ready to revolutionize their document workflows.
            </p>
            <p>
              Join our exclusive pilot program and be among the first to experience instant document analysis, intelligent property insights, and automated compliance checks that save hours of manual work.
            </p>
            <p>
              Limited spaces available for our beta launch. Apply now to secure your early access and help shape the future of property technology.
            </p>
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