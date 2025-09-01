import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

export type FormData = z.infer<typeof formSchema>;

export const usePilotApplication = () => {
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

  const checkEmailExists = useCallback(async (email: string): Promise<boolean> => {
    if (!email || !email.includes('@')) return false;
    
    setIsCheckingEmail(true);
    try {
      const { data, error } = await supabase
        .from('pilot_applications')
        .select('email')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking email:', error);
        toast({
          title: "Error",
          description: "Failed to check email. Please try again.",
          variant: "destructive",
        });
      }
      
      setIsCheckingEmail(false);
      return !!data;
    } catch (error) {
      console.error('Unexpected error checking email:', error);
      setIsCheckingEmail(false);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const handleEmailChange = useCallback(async (email: string): Promise<void> => {
    if (!email || !email.includes('@')) {
      setEmailExists(false);
      return;
    }
    
    const exists = await checkEmailExists(email);
    setEmailExists(exists);
  }, [checkEmailExists]);

  const generateMathProblem = (): { question: string; answer: number } => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return {
      question: `${num1} + ${num2}`,
      answer: num1 + num2
    };
  };

  const onSubmit = async (data: FormData): Promise<void> => {
    setPendingFormData(data);
    const problem = generateMathProblem();
    setMathProblem(problem);
    setUserAnswer("");
    setShowAntiBotDialog(true);
  };

  const submitForm = async (): Promise<void> => {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Form submission error:', error);
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

  return {
    form,
    showSuccessDialog,
    setShowSuccessDialog,
    showAntiBotDialog,
    setShowAntiBotDialog,
    mathProblem,
    userAnswer,
    setUserAnswer,
    emailExists,
    isCheckingEmail,
    handleEmailChange,
    onSubmit,
    handleAntiBotSubmit,
  };
};