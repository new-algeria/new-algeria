import React from "react";
import { motion } from "framer-motion";
import { Laptop, Shield, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam.tsx";
import { useTranslation, Trans } from "react-i18next";

const BentoGridSection = () => {
  const { t } = useTranslation();

  const bentoItems = [
    {
      title: t("bentoGrid.digitalInfrastructure.title"),
      description: t("bentoGrid.digitalInfrastructure.description"),
      icon: <Laptop className="w-8 h-8" />,
      color: "bg-emerald-500/10",
    },
    {
      title: t("bentoGrid.cybersecurity.title"),
      description: t("bentoGrid.cybersecurity.description"),
      icon: <Shield className="w-8 h-8" />,
      color: "bg-blue-500/10",
    },
    {
      title: t("bentoGrid.community.title"),
      description: t("bentoGrid.community.description"),
      icon: <Users className="w-8 h-8" />,
      color: "bg-purple-500/10",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-20"
    >
      <div className="container">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center"
        >
          <Trans
            i18nKey="bentoGridSection.title"
            components={[<span className="text-primary dark:text-accent" />]}
          />
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {bentoItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative rounded-xl">
                <CardHeader>
                  <div
                    className={`w-16 h-16 rounded-lg ${item.color} flex items-center justify-center mb-4`}
                  >
                    <div className="text-primary dark:text-accent">
                      {item.icon}
                    </div>
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
                <BorderBeam
                  size={250}
                  duration={Math.floor(Math.random() * (12 - 5 + 1)) + 5}
                  borderWidth={2}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BentoGridSection;
