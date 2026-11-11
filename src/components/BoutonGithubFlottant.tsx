import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useAuth } from "@/contexte/ContexteAuth";
import { DialogueRejoindre } from "./DialogueRejoindre";

/**
 * Bouton flottant en bas à droite, pour les membres connectés : rejoindre l'organisation GitHub.
 * Sur l'accueil, il n'apparaît qu'après le hero, qui a déjà son bouton « Rejoignez-nous » au même endroit.
 */
export const BoutonGithubFlottant = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [ouvert, setOuvert] = useState(false);
  const { pathname } = useLocation();
  const [apresHero, setApresHero] = useState(false);

  useEffect(() => {
    const mesurer = () => setApresHero(window.scrollY > window.innerHeight * 0.6);
    mesurer();
    window.addEventListener("scroll", mesurer, { passive: true });
    return () => window.removeEventListener("scroll", mesurer);
  }, []);

  if (!session) return null;
  const visible = pathname !== "/" || apresHero;

  return (
    <>
      <button
        type="button"
        className={`dz-fab-github ${visible ? "" : "is-hidden"}`}
        onClick={() => setOuvert(true)}
        aria-label={t("joinUs.fabLabel")}
        aria-hidden={!visible}
        tabIndex={visible ? undefined : -1}
      >
        <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
        <span>{t("joinUs.fab")}</span>
      </button>
      <DialogueRejoindre ouvert={ouvert} onOuvertChange={setOuvert} />
    </>
  );
};
