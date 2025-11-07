import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, TrendingUp, MapPin, PenTool, CreditCard, Shield } from "lucide-react";
import { CONTENT_VARIANT as CONTENT } from "@/config/content-variant";
import { OptimizedImage } from "@/components/OptimizedImage";
import hobsonLogo from "/lovable-uploads/0fa56bb9-7c7d-4f95-a81f-36a7f584ed7a.png";

// Form schema using the variant content
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Please enter a valid email"),
  confirmEmail: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().optional(),
  preferredContact: z.string().min(1, "Please select a contact preference"),
  businessTypes: z.array(z.string()).min(1, "Please select at least one business type"),
  help: z.string().optional(),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails don't match",
  path: ["confirmEmail"],
});

type FormData = z.infer<typeof formSchema>;

const LandingPageA = () => {
  const [showAntiBotDialog, setShowAntiBotDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [mathProblem, setMathProblem] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      role: "",
      email: "",
      confirmEmail: "",
      phone: "",
      website: "",
      preferredContact: "",
      businessTypes: [],
      help: "",
    },
  });

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('pilot_applications')
        .select('email')
        .eq('email', email)
        .limit(1);

      if (error) {
        console.error('Error checking email:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const handleEmailChange = async (email: string) => {
    if (email && email.includes('@')) {
      setIsCheckingEmail(true);
      const exists = await checkEmailExists(email);
      setEmailExists(exists);
      setIsCheckingEmail(false);
    } else {
      setEmailExists(false);
      setIsCheckingEmail(false);
    }
  };

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer: number;
    let question: string;
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
        break;
      case '*':
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
      default:
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
    }
    
    return { question, answer };
  };

  const onSubmit = async (data: FormData) => {
    setFormData(data);
    const problem = generateMathProblem();
    setMathProblem(problem);
    setShowAntiBotDialog(true);
    setUserAnswer("");
  };

  const submitForm = async () => {
    if (!formData) return;

    try {
      const { error } = await supabase.functions.invoke('send-pilot-application', {
        body: formData
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: CONTENT.toasts.submissionFailed.title,
          description: CONTENT.toasts.submissionFailed.description,
          variant: "destructive",
        });
        return;
      }

      setShowAntiBotDialog(false);
      setShowSuccessDialog(true);
      form.reset();
      setFormData(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: CONTENT.toasts.submissionFailed.title,
        description: CONTENT.toasts.submissionFailed.description,
        variant: "destructive",
      });
    }
  };

  const handleAntiBotSubmit = () => {
    if (parseInt(userAnswer) === mathProblem.answer) {
      submitForm();
    } else {
      toast({
        title: CONTENT.toasts.incorrectAnswer.title,
        description: CONTENT.toasts.incorrectAnswer.description,
        variant: "destructive",
      });
      setUserAnswer("");
    }
  };

  const iconComponents = {
    Building2,
    TrendingUp,
    MapPin,
    PenTool,
    CreditCard,
    Shield,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-start items-center">
            <a href="https://hobsonschoice.ai" className="bg-white p-2 rounded-lg">
              <img 
                src={hobsonLogo} 
                alt="Hobson AI - AI-powered property management software company logo" 
                className="h-12 md:h-16" 
                loading="eager"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section - Different Design */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="relative">
              <div className="aspect-[4/5] overflow-hidden rounded-lg bg-gray-50 shadow-2xl max-w-md mx-auto">
                <OptimizedImage 
                  src="/lovable-uploads/d7b9dc02-8d5c-4362-8105-30f1cbe9cebf.png" 
                  alt="A tenancy document that can now talk" 
                  width={320}
                  height={400}
                  className="w-full h-full object-cover"
                  priority={true}
                />
              </div>
            </div>
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                {CONTENT.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                {CONTENT.hero.subtitle}
              </p>
               <div className="flex flex-col sm:flex-row gap-4">
                 <Button 
                   size="lg" 
                   className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                   onClick={() => document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })}
                   id="landing-a-hero-cta"
                 >
                   {CONTENT.hero.ctaButton}
                 </Button>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Teams Section - Card Grid Design */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {CONTENT.industryTeams.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              {CONTENT.industryTeams.subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {CONTENT.industryTeams.teams.map((team, index) => {
              const IconComponent = iconComponents[team.icon as keyof typeof iconComponents];
              return (
                <div key={index} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  <Card className="relative border-0 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-300 hover:scale-105 h-full">
                    <CardContent className="p-8">
                      <div className="mb-6 inline-flex p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                        <IconComponent className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-foreground">{team.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{team.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits & How It Works - Combined Modern Design */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            
            {/* Benefits Section - Side by Side Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-24">
              <div className="group">
                <Card className="h-full border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        Eliminate Manual Document Work
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Replace hours of reading with instant AI-powered analysis and extraction.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="group">
                <Card className="h-full border-0 bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-300 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        Make Faster Decisions
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Get immediate answers to complex questions with full source citations and context.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* How It Works Section - Modern Timeline */}
            <div id="how-it-works" className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">How It Works</h2>
              <p className="text-xl text-muted-foreground">Get started in four simple steps</p>
            </div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20"></div>
              
              <div className="grid md:grid-cols-4 gap-8">
                <div className="relative group">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        1
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Connect & Upload</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Connect your existing document systems or upload files.
                    </p>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        2
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Ask Questions</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Ask specific questions or run automated analysis queries.
                    </p>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        3
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Get Answers</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Receive instant, accurate answers with source citations.
                    </p>
                  </div>
                </div>
                
                <div className="relative group">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        4
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground">Join Pilot</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Join our exclusive pilot program for early access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                {CONTENT.form.title}
              </h2>
            </div>

            <Card className="border-2">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name and Company - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{CONTENT.form.fields.name.label}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={CONTENT.form.fields.name.placeholder} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{CONTENT.form.fields.company.label}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={CONTENT.form.fields.company.placeholder} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Role and Email - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{CONTENT.form.fields.role.label}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={CONTENT.form.fields.role.placeholder} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{CONTENT.form.fields.email.label}</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder={CONTENT.form.fields.email.placeholder} 
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleEmailChange(e.target.value);
                                }}
                              />
                            </FormControl>
                            <div className="min-h-[1.25rem]">
                              {isCheckingEmail && (
                                <p className="text-sm text-muted-foreground">
                                  {CONTENT.form.checkingEmailMessage}
                                </p>
                              )}
                              {emailExists && (
                                <p className="text-sm text-destructive">
                                  {CONTENT.form.emailExistsMessage}
                                </p>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Confirm Email */}
                    <FormField
                      control={form.control}
                      name="confirmEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{CONTENT.form.fields.confirmEmail.label}</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder={CONTENT.form.fields.confirmEmail.placeholder} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone and Website - Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{CONTENT.form.fields.phone.label}</FormLabel>
                            <FormControl>
                              <Input 
                                type="tel"
                                placeholder={CONTENT.form.fields.phone.placeholder} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{CONTENT.form.fields.website.label}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={CONTENT.form.fields.website.placeholder} 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Preferred Contact */}
                    <FormField
                      control={form.control}
                      name="preferredContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{CONTENT.form.fields.preferredContact.label}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={CONTENT.form.fields.preferredContact.placeholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CONTENT.form.fields.preferredContact.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Business Types */}
                    <FormField
                      control={form.control}
                      name="businessTypes"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>{CONTENT.form.fields.businessTypes.label}</FormLabel>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {CONTENT.form.fields.businessTypes.options.map((item) => (
                              <FormField
                                key={item}
                                control={form.control}
                                name="businessTypes"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Help Field */}
                    <FormField
                      control={form.control}
                      name="help"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{CONTENT.form.fields.help.label}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={CONTENT.form.fields.help.placeholder}
                              className="min-h-[100px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={emailExists || isCheckingEmail}
                    >
                      {CONTENT.form.submitButton}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Anti-Bot Dialog */}
      <Dialog open={showAntiBotDialog} onOpenChange={setShowAntiBotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{CONTENT.dialogs.antiBot.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{CONTENT.dialogs.antiBot.message}</p>
            <div className="text-center">
              <p className="text-2xl font-bold">{mathProblem.question} = ?</p>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={CONTENT.dialogs.antiBot.placeholder}
                className="mt-2"
              />
            </div>
            <Button onClick={handleAntiBotSubmit} className="w-full" id="landing-a-antibot-submit">
              {CONTENT.dialogs.antiBot.submitButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              {CONTENT.dialogs.success.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p>{CONTENT.dialogs.success.message}</p>
            <Button onClick={() => setShowSuccessDialog(false)}>
              {CONTENT.dialogs.success.closeButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPageA;
