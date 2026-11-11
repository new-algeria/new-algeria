import React from "react";
import { useTranslation } from "react-i18next";
import {
  BrainCircuit,
  Database,
  Braces,
  Code2,
  Map,
  GraduationCap,
  FlaskConical,
  ShieldCheck,
  HeartPulse,
  Users,
  Sparkles,
  ArrowDown,
} from "lucide-react";
import JoinUsBtn from "./JoinUsBtn";
import AlgerianFlag from "./AlgerianFlag";
import { useEntrance } from "@/hooks/use-entrance";

const topics = [
  { key: "ai", icon: BrainCircuit },
  { key: "data", icon: Database },
  { key: "api", icon: Braces },
  { key: "opensource", icon: Code2 },
  { key: "geo", icon: Map },
  { key: "education", icon: GraduationCap },
  { key: "research", icon: FlaskConical },
  { key: "security", icon: ShieldCheck },
  { key: "health", icon: HeartPulse },
  { key: "community", icon: Users },
];

const HeroSection = () => {
  const { t } = useTranslation();

  useEntrance();

  // La liste est doublée pour que le défilement boucle sans saut
  const marquee = [...topics, ...topics];

  return (
    <section className="dz-hero" id="home">
      {/* L'image garde ses proportions : le drapeau reste planté au même endroit de l'herbe */}
      <div className="dz-plate">
        <img src="/assets/img/hero-meadow.jpg" alt="" className="dz-plate-img" />
        {/* Le voile passe sous le drapeau pour qu'il reste bien visible */}
        <div className="dz-hero-shade" aria-hidden="true" />
        <AlgerianFlag className="dz-hero-flag" />
      </div>

      <div className="dz-hero-content">
        <p className="dz-badge" data-enter="unblur" data-enter-at="300">
          <Sparkles aria-hidden="true" />
          {t("hero.badge")}
        </p>

        <h1 className="dz-title font-display">
          <span data-enter="spring" data-enter-at="460">New</span>{" "}
          <span data-enter="spring" data-enter-at="600">Algeria</span>
        </h1>

        <p className="dz-sub" data-enter="rise" data-enter-at="800">
          {t("hero.subline")}
        </p>

        <div className="dz-ctas">
          <JoinUsBtn
            className="dz-btn dz-btn-white"
            data-enter="rise"
            data-enter-at="920"
          >
            ✨ {t("joinUs.joinUs")}
          </JoinUsBtn>
          <a
            href="#projets"
            className="dz-btn dz-btn-glass"
            data-enter="rise"
            data-enter-at="1000"
          >
            {t("hero.watch")}
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="dz-marquee" data-enter="unblur" data-enter-at="1200">
        <ul className="dz-marquee-track">
          {marquee.map(({ key, icon: Icon }, index) => (
            <li
              key={`${key}-${index}`}
              className="dz-topic"
              aria-hidden={index >= topics.length}
            >
              <Icon aria-hidden="true" />
              {t(`hero.topics.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
