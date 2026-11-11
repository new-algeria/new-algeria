import React from "react";
import { useTranslation } from "react-i18next";
import { Sparkles, ArrowDown } from "lucide-react";
import JoinUsBtn from "./JoinUsBtn";
import AlgerianFlag from "./AlgerianFlag";
import { useEntrance } from "@/hooks/use-entrance";

// Domaines qui défilent dans « Nous avons besoin de toi dans … », chacun avec sa couleur
const fields = [
  { key: "ai", emoji: "✨", color: "#8b5cf6" },
  { key: "security", emoji: "🛡️", color: "#2563eb" },
  { key: "health", emoji: "💊", color: "#e11d48" },
  { key: "data", emoji: "📊", color: "#0d8a59" },
  { key: "education", emoji: "🎓", color: "#d97706" },
  { key: "research", emoji: "🔬", color: "#0891b2" },
  { key: "opensource", emoji: "💻", color: "#334155" },
  { key: "geo", emoji: "🗺️", color: "#059669" },
];

const ROTATE_EVERY_MS = 2200;

const HeroSection = () => {
  const { t } = useTranslation();

  const [fieldIndex, setFieldIndex] = React.useState(0);

  useEntrance();

  React.useEffect(() => {
    const timer = window.setInterval(
      () => setFieldIndex((index) => (index + 1) % fields.length),
      ROTATE_EVERY_MS
    );
    return () => window.clearInterval(timer);
  }, []);

  const field = fields[fieldIndex];

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

      <p className="dz-rotator" data-enter="rise" data-enter-at="1200" aria-live="polite">
        <span className="dz-rotator-lead">{t("hero.needYou")}</span>
        <span
          key={field.key}
          className="dz-rotator-word"
          style={{ backgroundColor: field.color }}
        >
          {t(`hero.fields.${field.key}`)} {field.emoji}
        </span>
      </p>
    </section>
  );
};

export default HeroSection;
