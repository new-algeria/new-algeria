import React from "react";
import { useTranslation } from "react-i18next";
import {
  faGithub,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowUp } from "lucide-react";
import JoinUsBtn from "./JoinUsBtn";

const socials = [
  { href: "https://github.com/new-algeria", icon: faGithub, label: "GitHub" },
  { href: "https://x.com/newalgeria_org", icon: faXTwitter, label: "X" },
  {
    href: "https://www.linkedin.com/company/106182021/",
    icon: faLinkedin,
    label: "LinkedIn",
  },
];

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="dz-footer">
      <div className="dz-footer-glow" aria-hidden="true" />
      <div className="container dz-footer-inner">
        <div className="dz-footer-brand">
          <a href="/" className="dz-footer-logo font-display">
            <img src="/assets/img/logo.png" alt="" />
            New Algeria
          </a>
          <p className="dz-footer-tagline">{t("footer.tagline")}</p>
          <div className="dz-footer-socials">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <FontAwesomeIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>

        <nav className="dz-footer-col" aria-label={t("footer.product")}>
          <h3>{t("footer.product")}</h3>
          <a href="https://www.data-dz.com" target="_blank" rel="noopener noreferrer">
            data-dz
          </a>
          <a href="https://www.data-dz.com/api" target="_blank" rel="noopener noreferrer">
            data-dz/api
          </a>
        </nav>

        <nav className="dz-footer-col" aria-label={t("footer.community")}>
          <h3>{t("footer.community")}</h3>
          <a href="https://github.com/new-algeria" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="mailto:admin@newalgeria.org">{t("footer.contact")}</a>
          <JoinUsBtn className="dz-footer-join">{t("footer.join")}</JoinUsBtn>
        </nav>
      </div>

      <div className="container dz-footer-bottom">
        <span>
          © {year} New Algeria · {t("footer.copyright")}
        </span>
        <span>{t("footer.madeWith")}</span>
        <a
          href="#home"
          className="dz-footer-top"
          aria-label="Haut de page"
          onClick={(evenement) => {
            evenement.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <ArrowUp aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
