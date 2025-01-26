import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const ContactSection = () => {
  const { t } = useTranslation();

  const mailtoLink = `mailto:admin@newalgeria.org?subject=${encodeURIComponent(
    t("contact.subject")
  )}&body=${encodeURIComponent(t("contact.body"))}`;

  return (
    <section className="py-20">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            {t("contact.title")}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={mailtoLink}>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90"
              >
                {t("nav.contact")}
                <ChevronRight className="ml-2" size={16} />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
