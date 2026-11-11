import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProjectsSection = () => {
  const { t } = useTranslation();

  const projects = [
    {
      key: "dataDz",
      href: "https://www.data-dz.com",
      logo: (
        <img
          src="/assets/img/data-dz-logo.png"
          alt="Logo data-dz"
          className="dz-project-logo-img"
        />
      ),
      name: (
        <>
          data<span className="text-[#10b981]">-dz</span>
        </>
      ),
    },
    {
      key: "apiDz",
      href: "https://www.data-dz.com/api",
      // Même logo que data-dz, teinté en violet
      logo: (
        <img
          src="/assets/img/data-dz-logo.png"
          alt="Logo data-dz/api"
          className="dz-project-logo-img dz-logo-violet"
        />
      ),
      name: (
        <>
          data<span className="text-[#10b981]">-dz</span>
          <span className="text-[#8b5cf6]">/api</span>
        </>
      ),
    },
    {
      key: "community",
      href: "https://github.com/new-algeria",
      logo: (
        <span className="dz-project-logo-icon dz-project-logo-dark">
          <FontAwesomeIcon icon={faGithub} />
        </span>
      ),
      name: t("projects.community.name"),
    },
  ];

  return (
    <section className="dz-projects" id="projets">
      <div className="container">
        <div className="dz-projects-head">
          <h2 className="mb-section-title font-display">{t("projects.title")}</h2>
          <a
            href="https://github.com/new-algeria"
            target="_blank"
            rel="noopener noreferrer"
            className="dz-projects-link"
          >
            {t("projects.browse")} <span className="mb-chevron">›</span>
          </a>
        </div>
        <div className="dz-projects-grid mb-row">
          {projects.map((project) => (
            <a
              key={project.key}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="dz-project mb-surface mb-lift"
            >
              <span className="dz-project-top">
                {project.logo}
                <ArrowUpRight className="dz-project-arrow" aria-hidden="true" />
              </span>
              <span className="dz-project-name font-display">{project.name}</span>
              <span className="dz-project-desc">
                {t(`projects.${project.key}.description`)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
