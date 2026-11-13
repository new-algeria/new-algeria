import React, { useEffect } from "react";
import Navigation from "@/components/Navigation";
import BentoGridSection from "@/components/BentoGridSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import SectionContribuer from "@/components/contribuer/SectionContribuer";
import ServicesSection from "@/components/ServicesSection";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";

const Index = () => {
  // Arrivée depuis une autre page par « /#services » : la section n'existe qu'une fois la page affichée.
  useEffect(() => {
    const ancre = window.location.hash.slice(1);
    if (!ancre) return;
    const minuteur = window.setTimeout(() => document.getElementById(ancre)?.scrollIntoView({ behavior: "smooth" }), 150);
    return () => window.clearTimeout(minuteur);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Projects Section */}
      <ProjectsSection />

      {/* Contribuer : boîte à idées et autres façons d'aider */}
      <SectionContribuer />

      {/* Services Section */}
      <ServicesSection />

      {/* BentoGrid Section */}
      <BentoGridSection />

      {/* Timeline Section */}
      <TimelineSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;