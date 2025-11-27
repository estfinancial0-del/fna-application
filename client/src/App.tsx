import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FnaForm from "./pages/FnaForm";
import FnaSuccess from "./pages/FnaSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import FnaDetailView from "./pages/FnaDetailView";
import { LoginPage } from "./pages/LoginPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path={"/"} component={Home} />
      <Route path="/fna" component={FnaForm} />
      <Route path="/fna/success" component={FnaSuccess} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/fna/:id" component={FnaDetailView} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
