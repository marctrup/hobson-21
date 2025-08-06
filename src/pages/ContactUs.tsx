import { SimpleButton } from "@/components/ui/simple-button";
import { SimpleCard, SimpleCardContent } from "@/components/ui/simple-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useState, lazy, Suspense, FormEvent } from "react";
import { toast } from "@/hooks/use-toast";

// Lazy load the Header to reduce initial bundle size for contact page
const Header = lazy(() => import("@/components/homepage/Header").then(module => ({ default: module.Header })));

const ContactUs = () => {
  const navigate = useNavigate();
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
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.confirmEmail || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Email confirmation validation
    if (formData.email !== formData.confirmEmail) {
      toast({
        title: "Email Mismatch",
        description: "Email addresses must match.",
        variant: "destructive",
      });
      return;
    }

    // Show anti-bot verification
    setPendingFormData(formData);
    const problem = generateMathProblem();
    setMathProblem(problem);
    setUserAnswer("");
    setShowAntiBotDialog(true);
  };

  const submitForm = async () => {
    if (!pendingFormData) return;

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
        if (result.isDuplicate) {
          toast({
            title: "Email Already Used",
            description: "This email address has already been used. We've sent your message but won't create a duplicate entry.",
          });
        } else {
          let successMessage = "Thank you for your enquiry. We'll get back to you soon.";
          if (result.emailExists) {
            successMessage += " We notice you've previously submitted a pilot application.";
          }
          
          toast({
            title: "Message Sent!",
            description: successMessage,
          });
        }
        
        // Reset form
        setFormData({ name: "", phone: "", email: "", confirmEmail: "", reason: "" });
        setShowAntiBotDialog(false);
        setPendingFormData(null);
        
        // Redirect to home page after success
        setTimeout(() => {
          navigate('/');
        }, 2000); // Wait 2 seconds to let user see the success message
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to Send",
        description: "There was an error sending your message. Please try again.",
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-16 bg-background border-b"></div>}>
        <Header />
      </Suspense>
      <div className="container mx-auto px-4 py-8">        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
          
          <SimpleCard>
            <div className="p-6">
              <div className="text-center mb-6">
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  We would be delighted to talk to you!
                </p>
              </div>
            </div>
            <SimpleCardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">Confirm Email *</Label>
                  <Input
                    id="confirmEmail"
                    type="email"
                    value={formData.confirmEmail}
                    onChange={(e) => handleInputChange("confirmEmail", e.target.value)}
                    placeholder="Confirm your email address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Enquiry *</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    placeholder="Please describe your enquiry..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <SimpleButton type="submit" className="w-full text-lg px-8 py-3">
                    Send Message
                  </SimpleButton>
                </div>
              </form>
            </SimpleCardContent>
          </SimpleCard>
        </div>
      </div>

      {/* Anti-Bot Verification - Simplified without Dialog */}
      {showAntiBotDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full border shadow-lg">
            <h3 className="text-lg font-semibold text-center mb-4">Quick Security Check</h3>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Please solve this simple math problem to verify you're human:
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
                  Cancel
                </SimpleButton>
                <SimpleButton 
                  onClick={handleAntiBotSubmit}
                  className="flex-1"
                >
                  Submit Message
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