import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { CONTENT } from "@/config/content";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  confirmEmail: z.string().email("Invalid email address"),
  company: z.string().min(2, "Company name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  preferredContact: z.string().min(1, "Please select a preferred contact method"),
  businessTypes: z.array(z.string()).min(1, "Please select at least one business type"),
  help: z.string().min(10, "Please provide more details about how we can help"),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Email addresses do not match",
  path: ["confirmEmail"],
});

type FormData = z.infer<typeof formSchema>;

const PilotForm = () => {
  const navigate = useNavigate();
  const [showAntiBotDialog, setShowAntiBotDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [mathProblem, setMathProblem] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      confirmEmail: "",
      company: "",
      role: "",
      phone: "",
      website: "",
      preferredContact: "",
      businessTypes: [],
      help: "",
    },
  });

  const checkEmailExists = async (email: string) => {
    if (!email || !email.includes('@')) return false;
    
    try {
      const { data, error } = await supabase
        .from('pilot_applications')
        .select('email')
        .eq('email', email.toLowerCase())
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
    if (!email || !email.includes('@')) {
      setEmailExists(false);
      setIsCheckingEmail(false);
      return;
    }

    setIsCheckingEmail(true);
    const exists = await checkEmailExists(email);
    setEmailExists(exists);
    setIsCheckingEmail(false);
  };

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      question: `${num1} + ${num2}`,
      answer: num1 + num2
    };
  };

  const onSubmit = (data: FormData) => {
    if (emailExists || isSubmitting) return; // Prevent double submission
    
    setFormData(data);
    const problem = generateMathProblem();
    setMathProblem(problem);
    setShowAntiBotDialog(true);
  };

  const submitForm = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    
    try {
      const response = await fetch('https://awfyhgeflakjhxtntokd.supabase.co/functions/v1/send-pilot-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmissionStatus('success');
        setShowSuccessDialog(true);
        form.reset();
        setFormData(null);
      } else {
        throw new Error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAntiBotSubmit = () => {
    if (isSubmitting) return; // Prevent double submission
    const userAnswerNum = parseInt(userAnswer);
    if (userAnswerNum === mathProblem.answer && formData) {
      setShowAntiBotDialog(false);
      setUserAnswer("");
      submitForm(formData);
    } else {
      alert("Incorrect answer. Please try again.");
      setUserAnswer("");
    }
  };

  useEffect(() => {
    document.title = 'Apply for Pilot Program - Hobson AI';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-start items-center">
            <a href="/" className="bg-white p-2 rounded-lg">
              <img 
                src="/lovable-uploads/4d207bde-4254-49b7-83e1-ac7325218f41.png" 
                alt="Hobson AI - AI-powered document intelligence" 
                className="h-12 md:h-16" 
                loading="eager"
              />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Apply for Pilot Access
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our exclusive pilot program and be among the first to experience AI-powered document intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-8 -mt-5">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl text-center">
                  {CONTENT.form.title}
                </CardTitle>
              </CardHeader>
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
                      disabled={emailExists || isCheckingEmail || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : CONTENT.form.submitButton}
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
            <Button 
              onClick={handleAntiBotSubmit} 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : CONTENT.dialogs.antiBot.submitButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={(open) => {
        setShowSuccessDialog(open);
        if (!open) navigate('/property-management-software');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-green-600">
              {CONTENT.dialogs.success.title}
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p>{CONTENT.dialogs.success.message}</p>
            <Button onClick={() => {
              setShowSuccessDialog(false);
              navigate('/property-management-software');
            }}>
              {CONTENT.dialogs.success.closeButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PilotForm;