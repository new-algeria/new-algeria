import React from "react";
import { motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Database, Code } from "lucide-react";

const ServicesSection = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: t("services.digital.title"),
      description: t("services.digital.description"),
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: t("services.data.title"),
      description: t("services.data.description"),
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: t("services.dev.title"),
      description: t("services.dev.description"),
    },
  ];

  const categories = Object.keys(
    t("hero.categories", { returnObjects: true }) as Record<string, string>
  ).map((key) => t(`hero.categories.${key}`));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
      className="py-24"
      id="services"
    >
      <div className="container">
        <motion.h2
          variants={itemVariants}
          className="mb-section-title font-display mb-6 text-center"
        >
          <Trans
            i18nKey="services.title"
            components={[<span className="mb-highlight" />]}
          />
        </motion.h2>
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <span
              key={category}
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-[#e5eed8] text-[#5b875c] dark:bg-white/5 dark:text-[#a6d495]"
            >
              {category}
            </span>
          ))}
        </motion.div>
        <motion.div
          variants={containerVariants}
          className="mb-row grid md:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Card className="mb-surface mb-lift h-full border-0">
                <CardHeader>
                  <div className="mb-icon-badge mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServicesSection;
