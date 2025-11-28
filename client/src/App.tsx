import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import KermesseDetail from "./pages/KermesseDetail";
import CreateKermesse from "./pages/CreateKermesse";
import Dashboard from "./pages/Dashboard";
import DonateIngredient from "./pages/DonateIngredient";
import ManageKermesse from "./pages/ManageKermesse";
import RegisterSale from "./pages/RegisterSale";
import ManageDeliveries from "./pages/ManageDeliveries";
import SalesReport from "./pages/SalesReport";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/kermesse/:id"} component={KermesseDetail} />
      <Route path={"/create-kermesse"} component={CreateKermesse} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/my-kermesses"} component={Dashboard} />
      <Route path={"/donate-ingredient/:id"} component={DonateIngredient} />
      <Route path={"/manage-kermesse/:id"} component={ManageKermesse} />
      <Route path={"/register-sale/:id"} component={RegisterSale} />
      <Route path={"/manage-deliveries/:id"} component={ManageDeliveries} />
      <Route path={"/sales-report/:id"} component={SalesReport} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

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
