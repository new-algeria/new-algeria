import { useEffect, type ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface PageInterneProps {
  /** Titre de l'onglet, sans « - New Algeria ». */
  titre: string;
  children: ReactNode;
}

/** Mise en page des pages hors accueil (connexion, profil, membres) : barre de navigation opaque et pied de page. */
export const PageInterne = ({ titre, children }: PageInterneProps) => {
  useEffect(() => {
    const precedent = document.title;
    document.title = `${titre} - New Algeria`;
    return () => {
      document.title = precedent;
    };
  }, [titre]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navigation solide />
      <main className="flex-1 pt-[76px]">{children}</main>
      <Footer />
    </div>
  );
};
