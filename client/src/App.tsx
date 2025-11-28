import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import FnaForm from "./pages/FnaForm";
import FnaIntroduction from "./pages/FnaIntroduction";
import FnaSuccess from "./pages/FnaSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import FnaDetailView from "./pages/FnaDetailView";
import { LoginPage } from "./pages/LoginPage";
import RunMigration from "./pages/RunMigration";
import MakeAdmin from "./pages/MakeAdmin";
import AddJohnUser from "./pages/AddJohnUser";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path={"/"} component={Home} />
      <Route path="/fna/start" component={FnaIntroduction} />
      <Route path="/fna" component={FnaForm} />
      <Route path="/fna/success" component={FnaSuccess} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/fna/:id" component={FnaDetailView} />
      <Route path="/migrate" component={RunMigration} />
      <Route path="/make-admin" component={MakeAdmin} />
      <Route path="/add-john" component={AddJohnUser} />
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
