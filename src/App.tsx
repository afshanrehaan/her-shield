import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DiscreetModeProvider } from "@/contexts/DiscreetModeContext";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index.tsx";
import SOSPage from "./pages/SOSPage.tsx";
import HealthPage from "./pages/HealthPage.tsx";
import SecurityPage from "./pages/SecurityPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DiscreetModeProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/sos" element={<SOSPage />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </DiscreetModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
