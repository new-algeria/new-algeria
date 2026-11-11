import React from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

const ContactSection = () => {
  const { t } = useTranslation();

  const mailtoLink = `mailto:admin@newalgeria.org?subject=${encodeURIComponent(
    t("contact.subject")
  )}&body=${encodeURIComponent(t("contact.body"))}`;

  return (
    <section className="py-24" id="contact">
      <div className="container">
        <div className="mb-sky-banner mx-auto max-w-5xl px-6 py-16 md:py-24 text-center">
          <h2 className="font-display text-4xl md:text-6xl uppercase mb-8 [text-shadow:0_4px_18px_rgba(28,70,120,0.35)]">
            {t("contact.title")}
          </h2>
          <a
            href={mailtoLink}
            className="mb-pill mb-pill-white inline-flex h-14 px-8 text-lg"
          >
            {t("nav.contact")}
            <ChevronRight size={18} className="rtl:-scale-x-100" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
