import React from "react";
import { useTranslation } from "react-i18next";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = ({ year }) => {
  const { t } = useTranslation();

  return (
    <footer className="container mt-10 flex flex-wrap justify-between pb-16 pt-10 ">
      <div className="flex basis-full justify-between gap-8 md:basis-auto md:flex-col md:justify-start">
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/new-algeria"
            className="text-muted-foreground hover:text-foreground"
          >
            <FontAwesomeIcon icon={faGithub} /> GitHub
          </a>
          <a
            href="https://x.com/newalgeria_org"
            className="text-muted-foreground hover:text-foreground"
          >
            <FontAwesomeIcon icon={faTwitter} /> Twitter
          </a>
        </div>
      </div>
      <div className="mt-10 flex basis-1/2 flex-col gap-5 md:mt-0 md:basis-auto">
        <h3 className="font-semibold">{t("footer.product")}</h3>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("footer.features")}
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("footer.pricing")}
        </a>
      </div>
      <div className="mt-10 flex basis-1/2 flex-col gap-5 md:mt-0 md:basis-auto">
        <h3 className="font-semibold">{t("footer.resources")}</h3>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("footer.community")}
        </a>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("footer.contact")}
        </a>
      </div>
      <div className="my-8 pt-8 px-8 w-full border-t border-primary/10 text-center text-muted-foreground">
        ©{year} {t("footer.copyright")}
      </div>
    </footer>
  );
};

export default Footer;
