import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { usePilotApplication, FormData } from "@/hooks/usePilotApplication";

interface PilotApplicationFormProps {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
}

export const PilotApplicationForm = ({ showForm, setShowForm }: PilotApplicationFormProps) => {
  const {
    form,
    emailExists,
    isCheckingEmail,
    handleEmailChange,
    onSubmit,
    showAntiBotDialog,
    setShowAntiBotDialog,
    mathProblem,
    userAnswer,
    setUserAnswer,
    handleAntiBotSubmit,
    showSuccessDialog,
    setShowSuccessDialog,
  } = usePilotApplication();

  return (
    <>
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Start Free Property AI Pilot
            </DialogTitle>
            <DialogDescription className="text-center">
              Fill out the form below to apply for our free pilot program
            </DialogDescription>
          </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              {...form.register("confirmEmail")}
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
              <Input 
                id="website" 
                placeholder="yourcompany.com" 
                {...form.register("website")}
              />
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
            <Label htmlFor="help">How can Hobson help your business? (Optional)</Label>
            <Textarea 
              id="help"
              placeholder="Tell us about your document challenges, workflows, or specific use cases..."
              className="min-h-[100px]"
              {...form.register("help")}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={emailExists}
          >
            Submit Application
          </Button>
        </form>
      </DialogContent>
    </Dialog>

    {/* Anti-Bot Dialog */}
    <Dialog open={showAntiBotDialog} onOpenChange={setShowAntiBotDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Security Check</DialogTitle>
          <DialogDescription>
            Please solve this simple math problem to continue
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>What is {mathProblem.question}?</Label>
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAntiBotSubmit();
                }
              }}
            />
          </div>
          <Button onClick={handleAntiBotSubmit} className="w-full">
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Success Dialog */}
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Application Submitted Successfully!</DialogTitle>
          <DialogDescription>
            Thank you for applying to our pilot program. We'll be in touch soon.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => {
          setShowSuccessDialog(false);
          setShowForm(false);
        }}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
    </>
  );
};