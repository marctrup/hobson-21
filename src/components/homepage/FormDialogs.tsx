import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormDialogsProps {
  showSuccessDialog: boolean;
  setShowSuccessDialog: (show: boolean) => void;
  showAntiBotDialog: boolean;
  setShowAntiBotDialog: (show: boolean) => void;
  mathProblem: { question: string; answer: number };
  userAnswer: string;
  setUserAnswer: (answer: string) => void;
  handleAntiBotSubmit: () => void;
}

export const FormDialogs = ({
  showSuccessDialog,
  setShowSuccessDialog,
  showAntiBotDialog,
  setShowAntiBotDialog,
  mathProblem,
  userAnswer,
  setUserAnswer,
  handleAntiBotSubmit,
}: FormDialogsProps) => {
  return (
    <>
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-green-600">
              Application Submitted Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-lg">
              Thank you for your interest in the Hobson AI pilot. We'll review your application and get back to you soon with next steps.
            </p>
            <Button onClick={() => setShowSuccessDialog(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Anti-Bot Dialog */}
      <Dialog open={showAntiBotDialog} onOpenChange={setShowAntiBotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Quick Security Check
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-center">
              Please solve this simple math problem to verify you're human:
            </p>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {mathProblem.question} = ?
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="math-answer">Your answer</Label>
              <Input
                id="math-answer"
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAntiBotSubmit();
                  }
                }}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAntiBotDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAntiBotSubmit}>
                Verify & Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};