import React from "react";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("faqs.0.question"),
      answer: t("faqs.0.answer"),
    },
    {
      question: t("faqs.1.question"),
      answer: t("faqs.1.answer"),
    },
    {
      question: t("faqs.2.question"),
      answer: t("faqs.2.answer"),
    },
  ];

  return (
    <section className="py-20 bg-secondary dark:bg-primary/10">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          {t("faqs.title")}
        </h2>
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left no-underline hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
