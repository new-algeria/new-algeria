import React from "react";
import MetaTags from "react-meta-tags";
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
      <MetaTags>
        <link
          rel="icon"
          type="image/png"
          href="/assets/img/logo.png"
        />
        <title>New Algeria | Digital Transformation</title>
        <meta
          name="description"
          content="Building a Digital Future for Algeria through innovation, accessibility, and development. Join us in transforming Algeria's digital landscape."
        />
        <meta property="og:title" content="New Algeria - Digital Transformation" />
        <meta
          property="og:description"
          content="Building a Digital Future for Algeria through innovation, accessibility, and development. Join us in transforming Algeria's digital landscape."
        />
        <meta
          property="og:site_name"
          content="New Algeria - Digital Transformation"
        />
        <meta
          property="og:image"
          content="https://www.newalgeria.org/assets/img/logo.png"
        />
        <meta
          property="og:url"
          content="https://www.newalgeria.org"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="New Algeria - Digital Transformation" />
        <meta
          name="twitter:description"
          content="Building a Digital Future for Algeria through innovation, accessibility, and development. Join us in transforming Algeria's digital landscape."
        />
        <meta
          name="twitter:image"
          content="https://www.newalgeria.org/assets/img/logo.png"
        />
      </MetaTags>

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
      <Footer />
    </div>
  );
};

export default Index;