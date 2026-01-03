import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Zap, Building2, TrendingUp, MapPin, PenTool, CreditCard, Shield, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import hobsonLogo from "/hobson-logo.png";
import documentAiIcon from "/lovable-uploads/807ac70f-d32b-415b-a7ac-e51d33f140d7.png";
import { CONTENT } from "@/config/content";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  confirmEmail: z.string().email("Please enter a valid email address"),
  preferredContact: z.string().min(1, "Please select your preferred contact method"),
  businessTypes: z.array(z.string()).min(1, "Please select at least one business type"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().optional(),
  help: z.string().optional(),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Email addresses must match",
  path: ["confirmEmail"],
});

type FormData = z.infer<typeof formSchema>;

const LandingPageB = () => {
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showAntiBotDialog, setShowAntiBotDialog] = useState(false);
  const [mathProblem, setMathProblem] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      role: "",
      email: "",
      confirmEmail: "",
      preferredContact: "",
      businessTypes: [],
      phone: "",
      website: "",
      help: "",
    },
  });

  const checkEmailExists = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) return false;
    
    setIsCheckingEmail(true);
    try {
      const { data, error } = await supabase
        .from('pilot_applications')
        .select('email')
        .eq('email', email)
        .single();
      
      setIsCheckingEmail(false);
      return !!data;
    } catch (error) {
      setIsCheckingEmail(false);
      return false;
    }
  }, []);

  const handleEmailChange = useCallback(async (email: string) => {
    if (!email || !email.includes('@')) {
      setEmailExists(false);
      return;
    }
    
    const exists = await checkEmailExists(email);
    setEmailExists(exists);
  }, [checkEmailExists]);

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      question: `${num1} + ${num2}`,
      answer: num1 + num2
    };
  };

  const onSubmit = async (data: FormData) => {
    setPendingFormData(data);
    const problem = generateMathProblem();
    setMathProblem(problem);
    setUserAnswer("");
    setShowAntiBotDialog(true);
  };

  const submitForm = async () => {
    if (!pendingFormData) return;
    
    try {
      const response = await fetch('https://awfyhgeflakjhxtntokd.supabase.co/functions/v1/send-pilot-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pendingFormData),
      });

      if (response.ok) {
        setShowSuccessDialog(true);
        setShowAntiBotDialog(false);
        form.reset();
        setPendingFormData(null);
        setEmailExists(false);
        setIsCheckingEmail(false);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAntiBotSubmit = () => {
    if (parseInt(userAnswer) === mathProblem.answer) {
      submitForm();
    } else {
      toast({
        title: "Incorrect Answer",
        description: "Please solve the math problem correctly.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-start items-center">
          <a href="https://hobsonschoice.ai">
            <img src={hobsonLogo} alt={CONTENT.header.logoAlt} className="h-20" loading="eager" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
          {CONTENT.hero.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
          {CONTENT.hero.subtitle}
        </p>
        <Button 
          variant="cta" 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={() => document.getElementById('pilot-form')?.scrollIntoView({ behavior: 'smooth' })}
          id="landing-b-hero-cta"
        >
          {CONTENT.hero.ctaButton}
        </Button>
      </section>

      {/* Industry Teams Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{CONTENT.industryTeams.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {CONTENT.industryTeams.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CONTENT.industryTeams.teams.map((team, index) => {
              const iconMap = {
                Building2: Building2,
                TrendingUp: TrendingUp,
                MapPin: MapPin,
                PenTool: PenTool,
                CreditCard: CreditCard,
                Shield: Shield,
              };
              
              const IconComponent = iconMap[team.icon as keyof typeof iconMap];
              
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4 mb-3">
                      {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
                      <h3 className="text-lg font-semibold">{team.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {team.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Zap className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">{CONTENT.benefits.automate.title}</h3>
              <p className="text-muted-foreground">
                {CONTENT.benefits.automate.description}
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <Search className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-3">{CONTENT.benefits.insights.title}</h3>
              <p className="text-muted-foreground">
                {CONTENT.benefits.insights.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src={documentAiIcon} 
                alt="tenant agreement contract" 
                className="w-auto h-auto max-w-sm mx-auto object-contain"
                loading="eager"
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{CONTENT.howItWorks.title}</h2>
              <div className="space-y-4">
                {CONTENT.howItWorks.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">{step.title}</p>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign-Up Form */}
      <section id="pilot-form" className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Start Free Property AI Pilot
          </h2>
          
          <Card className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input 
                      id="name" 
                      placeholder="Your name" 
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="company">Company *</Label>
                    <Input 
                      id="company" 
                      placeholder="Company name" 
                      {...form.register("company")}
                    />
                    {form.formState.errors.company && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.company.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Input 
                      id="role" 
                      placeholder="Your role" 
                      {...form.register("role")}
                    />
                    {form.formState.errors.role && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.role.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
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
                  <Label htmlFor="confirmEmail">Confirm Email *</Label>
                  <Input 
                    id="confirmEmail" 
                    type="email" 
                    placeholder="Confirm your email" 
                    {...form.register("confirmEmail", {
                      validate: (value) => {
                        const email = form.getValues("email");
                        if (!email) return true; // Don't validate if main email is empty
                        return value === email || "Email addresses must match";
                      }
                    })}
                    onBlur={() => {
                      // Trigger validation when user leaves the field
                      form.trigger("confirmEmail");
                    }}
                  />
                  {form.formState.errors.confirmEmail && (
                    <p className="text-sm text-destructive mt-1">
                      {form.formState.errors.confirmEmail.message}
                    </p>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="Your phone number" 
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                        https://
                      </span>
                      <Input 
                        id="website" 
                        type="text"
                        placeholder="yourcompany.com" 
                        className="pl-14"
                        {...form.register("website")}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="preferredContact">How would you prefer to be contacted? *</Label>
                  <Select onValueChange={(value) => form.setValue("preferredContact", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select how you'd like to be contacted" />
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
                  <Label>Business Type (Select all that apply) *</Label>
                  <div className="grid md:grid-cols-2 gap-3 mt-3">
                    {["Property Management", "Property Sales", "Surveying", "Architecture and Planning", "Lending", "Compliance"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
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
                        <Label htmlFor={type} className="text-sm font-normal">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.businessTypes && (
                    <p className="text-sm text-destructive mt-1">
                      Please select at least one business type
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="help">How can AI help your property business?</Label>
                  <Textarea 
                    id="help" 
                    placeholder="Tell us about your current challenges and how you think AI could help..."
                    className="min-h-[100px]"
                    {...form.register("help")}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={emailExists || isCheckingEmail}
                >
                  Submit Application
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>
      </section>

      {/* Anti-Bot Dialog */}
      <Dialog open={showAntiBotDialog} onOpenChange={setShowAntiBotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify You're Human</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Please solve this simple math problem to continue:</p>
            <div className="text-center">
              <p className="text-2xl font-bold">{mathProblem.question} = ?</p>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="mt-2"
              />
            </div>
            <Button onClick={handleAntiBotSubmit} className="w-full" id="landing-b-antibot-submit">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              Application Submitted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p>
              Thank you for your interest in Hobson's Choice AI pilot program. 
              We'll review your application and get back to you soon.
            </p>
            <Button onClick={() => setShowSuccessDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPageB;