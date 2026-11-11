import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexte/ContexteAuth";
import { avecSuite, routes } from "@/lib/routes";
import { DialogueRejoindre } from "./DialogueRejoindre";

type JoinUsBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  [key: `data-${string}`]: string | undefined;
};

/**
 * « Rejoignez-nous » : un visiteur est envoyé vers la connexion (il revient ensuite sur la même page) ;
 * un membre connecté ouvre la fenêtre pour rejoindre l'organisation GitHub ou nous écrire.
 *
 * Toujours le même <button> : la session arrive après le premier affichage, et changer d'élément à ce moment-là
 * laisserait le nouveau bloqué avant son animation d'entrée (data-enter), donc invisible.
 */
const JoinUsBtn = ({ className, children, ...buttonProps }: JoinUsBtnProps) => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const emplacement = useLocation();
  const naviguer = useNavigate();
  const [ouvert, setOuvert] = useState(false);

  const cliquer = () => {
    if (session) {
      setOuvert(true);
      return;
    }
    const suite = `${emplacement.pathname}${emplacement.search}${emplacement.hash}`;
    naviguer(avecSuite(routes.connexion, suite));
  };

  return (
    <>
      <button
        type="button"
        className={
          className ??
          "bg-[#0d8a59] text-white hover:bg-[#0b774d] py-2.5 px-6 rounded-full shadow-[0_8px_24px_-8px_rgba(13,138,89,0.6)] transition-transform hover:-translate-y-0.5"
        }
        onClick={cliquer}
        {...buttonProps}
      >
        {children ?? <>✨ {t("joinUs.joinUs")}</>}
      </button>
      {session && <DialogueRejoindre ouvert={ouvert} onOuvertChange={setOuvert} />}
    </>
  );
};

export default JoinUsBtn;
