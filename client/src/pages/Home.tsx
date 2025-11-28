import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { FileText, ArrowRight } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link, useLocation } from "wouter";

/**
 * All content in this page are only for example, replace with your own feature implementation
 * When building pages, remember your instructions in Frontend Workflow, Frontend Best Practices, Design Guide and Common Pitfalls
 */
export default function Home() {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true });
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt="EST Financial" className="h-10" />
            <h1 className="text-2xl font-bold text-primary">{APP_TITLE}</h1>
          </div>
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={() => setLocation("/admin")}>
                View Submissions
              </Button>
              <Button variant="ghost" size="sm" onClick={async () => {
                await fetch('/api/trpc/auth.logout', { method: 'POST' });
                window.location.href = '/login';
              }}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Financial Needs Analysis
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Take the first step toward financial security. Complete our comprehensive analysis to understand your financial goals and create a personalized strategy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/fna/start">
              <Button size="lg" className="gap-2 text-lg px-8">
                Start Your FNA
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Comprehensive Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Cover all aspects of your financial life including retirement, wealth creation, and protection strategies.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Personalized Insights</h3>
              <p className="text-sm text-muted-foreground">
                Receive tailored recommendations based on your unique situation, goals, and aspirations.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Work with experienced financial advisors who will guide you through every step of your financial journey.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
