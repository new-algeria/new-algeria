import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
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
      animate="visible"
      variants={containerVariants}
      className="py-20 bg-secondary dark:bg-primary/10"
      id="services"
    >
      <div className="container">
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
        >
          {t("services.title")}
        </motion.h2>
        <motion.div
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-8"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={itemVariants}>
              <Card className="border-2 hover:border-accent transition-colors duration-300">
                <CardHeader>
                  <div className="mb-4 text-primary dark:text-accent">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
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
