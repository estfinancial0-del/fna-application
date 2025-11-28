import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { FileText, CheckCircle2 } from "lucide-react";
import { APP_LOGO } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export default function FnaIntroduction() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleBegin = () => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login page
      setLocation("/login");
    } else {
      // User is logged in, proceed to FNA form
      setLocation("/fna");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="EST Financial" className="h-8" />
            <h1 className="text-xl font-semibold text-gray-900">Financial Needs Analysis</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome to Your Financial Journey
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Let's build a comprehensive understanding of your financial situation
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Introduction Text */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                In order to provide you with the best possible guidance, it is vital that we
                build an understanding of your current situation and the areas in which we
                can best be of assistance.
              </p>

              <p className="text-gray-700 leading-relaxed mt-4">
                This questionnaire represents the first step on your financial journey, and
                its purpose is twofold:
              </p>
            </div>

            {/* Purpose Points */}
            <div className="space-y-4 my-6">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 mt-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">1. Prepare for Your Initial Appointment</h3>
                  <p className="text-gray-700 text-sm">
                    It will help us to prepare for our initial appointment, as it ensures that
                    we have an understanding of your situation.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">2. Identify Additional Opportunities</h3>
                  <p className="text-gray-700 text-sm">
                    It may also help identify other issues that you may not have considered
                    and can therefore be discussed with your EST Client Manager.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                <strong>Please Note:</strong> The Team at EST will gather further information at your initial meeting. 
                If you are completing this questionnaire as a couple, we ask that you provide
                a joint response. If there are differences in some of your responses, you
                may wish to initial them so they can be discussed further.
              </p>
            </div>

            {/* What to Expect */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">What to Expect:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>The questionnaire is divided into 8 comprehensive sections</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You can save your progress at any time and return later</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>All information provided is strictly confidential</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Estimated completion time: 20-30 minutes</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleBegin}
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
              >
                I Understand - Begin FNA
              </Button>
            </div>

            {/* Footer Note */}
            <p className="text-center text-sm text-gray-500 mt-6">
              By clicking "Begin FNA", you acknowledge that you have read and understood the purpose of this questionnaire.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
