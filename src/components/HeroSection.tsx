import React from "react";
import { useTranslation } from "react-i18next";
import { BrainCircuit, Database, Braces, Sparkles, ArrowDown } from "lucide-react";
import JoinUsBtn from "./JoinUsBtn";
import AlgerianFlag from "./AlgerianFlag";
import { SceneBack, SceneFront } from "./AlgiersScene";
import { useEntrance } from "@/hooks/use-entrance";

const HeroSection = () => {
  const { t } = useTranslation();

  useEntrance();

  const features = [
    { key: "ai", icon: <BrainCircuit /> },
    { key: "data", icon: <Database /> },
    { key: "api", icon: <Braces /> },
  ];

  return (
    <section className="dz-hero" id="home">
      <div className="dz-scene">
        <SceneBack />
        <div className="dz-haze" />
        <AlgerianFlag className="dz-hero-flag" />
        <SceneFront />
      </div>

      <div className="dz-hero-content">
        <p className="dz-badge" data-enter="unblur" data-enter-at="300">
          <Sparkles aria-hidden="true" />
          {t("hero.badge")}
        </p>

        <div className="dz-heading">
          <h1 className="dz-title font-display">
            <span className="dz-title-new" data-enter="spring" data-enter-at="460">
              New
            </span>{" "}
            <span className="dz-title-algeria" data-enter="spring" data-enter-at="620">
              Algeria
            </span>
          </h1>
          <p className="dz-aside" data-enter="rise" data-enter-at="760">
            <span className="dz-aside-kicker">{t("hero.kicker")}</span>
            <span className="dz-aside-lead">{t("hero.lead")}</span>
          </p>
        </div>

        <p className="dz-sub" data-enter="rise" data-enter-at="900">
          {t("hero.subline")}
        </p>

        <div className="dz-ctas">
          <JoinUsBtn
            className="dz-btn dz-btn-primary"
            data-enter="rise"
            data-enter-at="1000"
          >
            ✨ {t("joinUs.joinUs")}
          </JoinUsBtn>
          <a
            href="#projets"
            className="dz-btn dz-btn-glass"
            data-enter="rise"
            data-enter-at="1080"
          >
            {t("hero.watch")}
            <ArrowDown aria-hidden="true" />
          </a>
        </div>

        <ul className="dz-features">
          {features.map((feature, index) => (
            <li
              key={feature.key}
              className="dz-feature"
              data-enter="rise"
              data-enter-at={String(1180 + index * 90)}
            >
              <span className="dz-feature-icon" aria-hidden="true">
                {feature.icon}
              </span>
              <span>
                <span className="dz-feature-title">
                  {t(`hero.features.${feature.key}.title`)}
                </span>
                <span className="dz-feature-desc">
                  {t(`hero.features.${feature.key}.description`)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
