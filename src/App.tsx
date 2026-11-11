import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { FournisseurAuth } from "@/contexte/FournisseurAuth";
import { RouteProtegee } from "@/components/auth/RouteProtegee";
import { routes } from "@/lib/routes";
import { BoutonGithubFlottant } from "@/components/BoutonGithubFlottant";
import Index from "./pages/Index";

// Pages du compte chargées à la demande : la vitrine reste aussi légère qu'avant.
const Connexion = lazy(() => import("./pages/auth/Connexion"));
const Inscription = lazy(() => import("./pages/auth/Inscription"));
const MotDePasseOublie = lazy(() => import("./pages/auth/MotDePasseOublie"));
const NouveauMotDePasse = lazy(() => import("./pages/auth/NouveauMotDePasse"));
const RetourAuth = lazy(() => import("./pages/auth/RetourAuth"));
const Profil = lazy(() => import("./pages/Profil"));
const PageMembre = lazy(() => import("./pages/PageMembre"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FournisseurAuth>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-background" />}>
            <Routes>
              <Route path={routes.accueil} element={<Index />} />
              <Route path={routes.connexion} element={<Connexion />} />
              <Route path={routes.inscription} element={<Inscription />} />
              <Route path={routes.motDePasseOublie} element={<MotDePasseOublie />} />
              <Route path={routes.nouveauMotDePasse} element={<NouveauMotDePasse />} />
              <Route path={routes.retourAuth} element={<RetourAuth />} />
              <Route
                path={routes.profil}
                element={
                  <RouteProtegee>
                    <Profil />
                  </RouteProtegee>
                }
              />
              <Route path="/members/:pseudo" element={<PageMembre />} />
              <Route path="*" element={<Navigate to={routes.accueil} replace />} />
            </Routes>
          </Suspense>
          <BoutonGithubFlottant />
        </BrowserRouter>
      </TooltipProvider>
    </FournisseurAuth>
  </QueryClientProvider>
);

export default App;
