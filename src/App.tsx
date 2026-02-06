import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import IsabellaDashboard from "./pages/IsabellaDashboard";
import IsabellaDashboardPage from "./pages/IsabellaDashboardPage";
import DreamSpaces from "./pages/DreamSpaces";
import DreamSpacesPage from "./pages/DreamSpacesPage";
import CivilizationHub from "./pages/CivilizationHub";
import GovernancePage from "./pages/GovernancePage";
import WalletPage from "./pages/WalletPage";
import Auth from "./pages/Auth";

import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing con fondo TAMV hero 3D */}
            <Route
              path="/"
              element={
                <div className="tamv-hero">
                  <div className="tamv-hero__grid" />

                  <div className="tamv-hero__matrix">
                    <div
                      className="tamv-line tamv-line--lg tamv-line--silver"
                      style={{ left: "6%", animationDelay: "0s" }}
                    />
                    <div
                      className="tamv-line tamv-line--md tamv-line--neon-pink"
                      style={{ left: "17%", animationDelay: "-1.4s" }}
                    />
                    <div
                      className="tamv-line tamv-line--sm tamv-line--neon-lime"
                      style={{ left: "26%", animationDelay: "-2.8s" }}
                    />
                    <div
                      className="tamv-line tamv-line--md tamv-line--silver"
                      style={{ left: "38%", animationDelay: "-0.9s" }}
                    />
                    <div
                      className="tamv-line tamv-line--lg tamv-line--neon-pink"
                      style={{ left: "50%", animationDelay: "-3.2s" }}
                    />
                    <div
                      className="tamv-line tamv-line--sm tamv-line--silver"
                      style={{ left: "63%", animationDelay: "-2.1s" }}
                    />
                    <div
                      className="tamv-line tamv-line--md tamv-line--neon-lime"
                      style={{ left: "76%", animationDelay: "-3.5s" }}
                    />
                    <div
                      className="tamv-line tamv-line--lg tamv-line--silver"
                      style={{ left: "88%", animationDelay: "-1.7s" }}
                    />
                  </div>

                  <div className="tamv-hero__core">
                    <div className="tamv-hero__core-lines" />
                    <div className="tamv-hero__nucleus" />
                    {/* Contenido de la landing dentro del núcleo */}
                    <Index />
                  </div>
                </div>
              }
            />

            {/* Rutas de aplicación normales */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/isabella" element={<IsabellaDashboardPage />} />
            <Route path="/isabella-legacy" element={<IsabellaDashboard />} />
            <Route path="/dreamspaces" element={<DreamSpacesPage />} />
            <Route path="/dreamspaces-legacy" element={<DreamSpaces />} />
            <Route path="/hub" element={<CivilizationHub />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/wallet" element={<WalletPage />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
