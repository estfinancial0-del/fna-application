import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function FnaSuccess() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="max-w-2xl w-full shadow-lg">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl">Thank You!</CardTitle>
          <CardDescription className="text-base">
            Your Financial Needs Analysis has been submitted successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg">What happens next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Your client manager will review your submission within 1-2 business days</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>We'll prepare a personalized financial analysis based on your information</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>You'll receive a call to schedule your consultation meeting</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>During the meeting, we'll discuss tailored strategies to achieve your financial goals</span>
              </li>
            </ul>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>If you have any questions in the meantime, please don't hesitate to contact your client manager.</p>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button variant="outline" onClick={() => setLocation("/")}>
              Return Home
            </Button>
            <Button onClick={() => setLocation("/fna")}>
              Start New FNA
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
