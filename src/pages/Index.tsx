import React from "react";
import Navigation from "@/components/Navigation";

import BentoGridSection from "@/components/BentoGridSection";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

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
      <Footer year={new Date().getFullYear()} />
    </div>
  );
};

export default Index;
