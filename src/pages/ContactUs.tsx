import { SimpleButton } from "@/components/ui/simple-button";
import { SimpleCard, SimpleCardContent } from "@/components/ui/simple-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, FormEvent } from "react";
import { toast } from "@/hooks/use-toast";
import { checkRateLimit, sanitizeInput } from "@/utils/security";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Helmet } from "react-helmet-async";
import { useContent } from "@/contexts/LanguageContext";

const ContactUs = () => {
  const navigate = useNavigate();
  const content = useContent();
  const contactContent = content.contact;
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    confirmEmail: "",
    reason: ""
  });
  const [showAntiBotDialog, setShowAntiBotDialog] = useState(false);
  const [mathProblem, setMathProblem] = useState({ question: "", answer: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [pendingFormData, setPendingFormData] = useState<typeof formData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      question: `${num1} + ${num2}`,
      answer: num1 + num2
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const clientId = `${formData.email}_${Date.now()}`;
    if (!checkRateLimit(clientId, 3, 300000)) {
      toast({
        title: contactContent.validation.tooManyRequests.title,
        description: contactContent.validation.tooManyRequests.description,
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name || !formData.email || !formData.confirmEmail || !formData.reason) {
      toast({
        title: contactContent.validation.missingInfo.title,
        description: contactContent.validation.missingInfo.description,
        variant: "destructive",
      });
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      toast({
        title: contactContent.validation.emailMismatch.title,
        description: contactContent.validation.emailMismatch.description,
        variant: "destructive",
      });
      return;
    }

    const sanitizedFormData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      phone: sanitizeInput(formData.phone),
      reason: sanitizeInput(formData.reason),
      confirmEmail: sanitizeInput(formData.confirmEmail)
    };

    setPendingFormData(sanitizedFormData);
    const problem = generateMathProblem();
    setMathProblem(problem);
    setUserAnswer("");
    setShowAntiBotDialog(true);
  };

  const submitForm = async () => {
    if (!pendingFormData || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('https://awfyhgeflakjhxtntokd.supabase.co/functions/v1/send-contact-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: pendingFormData.name,
          email: pendingFormData.email,
          phone: pendingFormData.phone,
          reason: pendingFormData.reason
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: contactContent.success.title,
          description: contactContent.success.description,
        });
        
        setFormData({ name: "", phone: "", email: "", confirmEmail: "", reason: "" });
        setShowAntiBotDialog(false);
        setPendingFormData(null);
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: contactContent.validation.sendFailed.title,
        description: contactContent.validation.sendFailed.description,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAntiBotSubmit = () => {
    if (isSubmitting) return;
    if (parseInt(userAnswer) === mathProblem.answer) {
      submitForm();
    } else {
      toast({
        title: contactContent.validation.incorrectAnswer.title,
        description: contactContent.validation.incorrectAnswer.description,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Contact Us - Hobson's Choice AI | Get Property Intelligence Support</title>
        <meta name="description" content="Contact Hobson's Choice AI for property management support, questions about our AI document intelligence platform, or to discuss your property technology needs." />
        <meta name="keywords" content="contact Hobson AI, property management support, AI document analysis contact, real estate technology help" />
        <meta property="og:title" content="Contact Us - Hobson's Choice AI" />
        <meta property="og:description" content="Get support and answers for your property management AI needs. Contact our team today." />
        <meta property="og:type" content="website" />
      </Helmet>
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">{contactContent.title}</h1>
          
          <SimpleCard>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  {contactContent.subtitle}
                </p>
              </div>
            </div>
            <SimpleCardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{contactContent.form.name.label}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={contactContent.form.name.placeholder}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{contactContent.form.phone.label}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={contactContent.form.phone.placeholder}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{contactContent.form.email.label}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={contactContent.form.email.placeholder}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">{contactContent.form.confirmEmail.label}</Label>
                  <Input
                    id="confirmEmail"
                    type="email"
                    value={formData.confirmEmail}
                    onChange={(e) => handleInputChange("confirmEmail", e.target.value)}
                    placeholder={contactContent.form.confirmEmail.placeholder}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">{contactContent.form.reason.label}</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    placeholder={contactContent.form.reason.placeholder}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <SimpleButton 
                    type="submit" 
                    className="w-full text-lg px-8 py-3"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? contactContent.form.submitting : contactContent.form.submit}
                  </SimpleButton>
                </div>
              </form>
            </SimpleCardContent>
          </SimpleCard>
        </div>
      </div>

      {/* Anti-Bot Verification */}
      {showAntiBotDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full border shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-4">{contactContent.antiBot.title}</h3>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                {contactContent.antiBot.description}
              </p>
              <div className="text-center">
                <p className="text-2xl font-bold mb-4">
                  {mathProblem.question} = ?
                </p>
                <Input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  className="text-center text-lg"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <SimpleButton 
                  variant="outline" 
                  onClick={() => setShowAntiBotDialog(false)}
                  className="flex-1"
                >
                  {contactContent.antiBot.cancel}
                </SimpleButton>
                <SimpleButton 
                  onClick={handleAntiBotSubmit}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? contactContent.antiBot.submitting : contactContent.antiBot.submit}
                </SimpleButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactUs;
