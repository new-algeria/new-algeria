import React from "react";
import { useTranslation } from "react-i18next";
import JoinUsBtn from "./JoinUsBtn";
import { useEntrance } from "@/hooks/use-entrance";

const PlayIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 18 20" aria-hidden="true">
    <path
      d="M3.6 1.2c-1.3-.8-3 .2-3 1.7v14.2c0 1.5 1.7 2.5 3 1.7l12-7.1c1.3-.8 1.3-2.6 0-3.4z"
      fill="currentColor"
    />
  </svg>
);

const HeroSection = () => {
  const { t } = useTranslation();
  const [reducedMotion] = React.useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEntrance();

  const projects = [
    {
      key: "dataDz",
      href: "https://www.data-dz.com",
      art: "/assets/hero/card-garden.webp",
    },
    {
      key: "apiDz",
      href: "https://www.data-dz.com/api",
      art: "/assets/hero/card-path.webp",
    },
    {
      key: "community",
      href: "https://github.com/new-algeria",
      art: "/assets/hero/card-kite.webp",
    },
  ];

  return (
    <section className="mb-hero" id="home">
      <div className="mb-frame">
        {/* La scène n'est jamais dessinée en code : image fixe + vidéo en boucle */}
        <div className="mb-scene" aria-hidden="true">
          <img className="mb-plate" src="/assets/hero/meadow.jpg" alt="" />
          {!reducedMotion && (
            <video
              className={`mb-video ${isPlaying ? "is-playing" : ""}`}
              src="/assets/hero/meadow.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onPlaying={() => setIsPlaying(true)}
            />
          )}
          <div className="mb-dusk" />
        </div>
        <div className="mb-fade" />

        <div className="mb-copy">
          <p className="mb-kicker font-display" data-enter="unblur" data-enter-at="350">
            {t("hero.kicker")}
          </p>
          <h1 className="mb-title font-display">
            <span className="mb-line" data-enter="spring" data-enter-at="560">
              {t("hero.line1")}
            </span>
            <span className="mb-line" data-enter="spring" data-enter-at="720">
              {t("hero.line2")}
            </span>
          </h1>
          <p className="mb-sub" data-enter="rise" data-enter-at="1050">
            {t("hero.subline")}
          </p>
          <div className="mb-ctas">
            <JoinUsBtn
              className="mb-pill mb-pill-white mb-btn-join"
              data-enter="rise"
              data-enter-at="1150"
            >
              {t("joinUs.joinUs")}
            </JoinUsBtn>
            <a
              href="#projets"
              className="mb-pill mb-pill-glass mb-btn-watch"
              data-enter="rise"
              data-enter-at="1230"
            >
              <PlayIcon className="mb-play" />
              {t("hero.watch")}
            </a>
          </div>
        </div>

        <div className="mb-projects" id="projets">
          <div className="mb-proj-head">
            <h2 className="mb-proj-title font-display" data-enter="rise" data-enter-at="1400">
              {t("projects.title")}
            </h2>
            <a
              href="https://github.com/new-algeria"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-proj-link"
              data-enter="rise"
              data-enter-at="1460"
            >
              {t("projects.browse")} <span className="mb-chevron">›</span>
            </a>
          </div>
          <div className="mb-cards">
            {projects.map((project, index) => (
              <a
                key={project.key}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-card"
                data-enter="rise"
                data-enter-at={String(1540 + index * 110)}
              >
                <img className="mb-card-art" src={project.art} alt="" loading="lazy" />
                <span className="mb-card-body">
                  <PlayIcon className="mb-card-play" />
                  <span>
                    <span className="mb-card-name font-display">
                      {t(`projects.${project.key}.name`)}
                    </span>
                    <span className="mb-card-desc">
                      {t(`projects.${project.key}.description`)}
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
