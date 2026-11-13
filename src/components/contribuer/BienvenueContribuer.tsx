import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexte/ContexteAuth";
import { routes } from "@/lib/routes";
import { DialogueRejoindre } from "@/components/DialogueRejoindre";
import { ACTIONS_CONTRIBUER, CarteAction } from "./actions";

/** Fenêtre montrée une seule fois, aux comptes de moins de 7 jours. */
const JOURS_NOUVEAU_COMPTE = 7;
const cleVue = (uid: string) => `newalgeria:bienvenue:${uid}`;

const dejaVue = (uid: string) => {
  try {
    return window.localStorage.getItem(cleVue(uid)) !== null;
  } catch {
    return true; // stockage bloqué : on ne risque pas de l'afficher à chaque visite
  }
};
const marquerVue = (uid: string) => {
  try {
    window.localStorage.setItem(cleVue(uid), new Date().toISOString());
  } catch {
    /* stockage bloqué */
  }
};

/**
 * Juste après l'inscription : « Bienvenue ! Comment veux-tu aider ? », avec les 4 façons d'aider.
 * Un clic mène à l'action ; « Plus tard » ferme. Jamais sur les pages de connexion, ni deux fois.
 */
export const BienvenueContribuer = () => {
  const { t } = useTranslation();
  const { utilisateur, profil } = useAuth();
  const { pathname } = useLocation();
  const [ouvert, setOuvert] = useState(false);
  const [rejoindre, setRejoindre] = useState(false);

  const pageAuth = [routes.connexion, routes.inscription, routes.motDePasseOublie, routes.nouveauMotDePasse, routes.retourAuth].includes(
    pathname as (typeof routes)["connexion"]
  );

  useEffect(() => {
    if (!utilisateur || !profil || pageAuth || dejaVue(utilisateur.id)) return;
    const age = Date.now() - new Date(utilisateur.created_at).getTime();
    if (age > JOURS_NOUVEAU_COMPTE * 86_400_000) {
      marquerVue(utilisateur.id); // ancien membre : jamais de bienvenue
      return;
    }
    // Petit délai : la page de destination s'affiche d'abord.
    const minuteur = window.setTimeout(() => setOuvert(true), 900);
    return () => window.clearTimeout(minuteur);
  }, [utilisateur, profil, pageAuth]);

  const fermer = () => {
    if (utilisateur) marquerVue(utilisateur.id);
    setOuvert(false);
  };

  if (!utilisateur || !profil) return null;
  const prenom = profil.nom_affiche || profil.pseudo;

  return (
    <>
    <DialogueRejoindre ouvert={rejoindre} onOuvertChange={setRejoindre} />
    <Dialog open={ouvert} onOpenChange={(valeur) => !valeur && fermer()}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-lg" onOpenAutoFocus={(evenement) => evenement.preventDefault()}>
        <DialogHeader className="items-center text-center sm:text-center">
          <img src="/assets/img/fennec-mascotte.webp" alt="" className="h-24 w-auto" />
          <DialogTitle className="font-display text-2xl" dir="auto">
            {t("bienvenue.titre", { nom: prenom })}
          </DialogTitle>
          <DialogDescription className="text-base">{t("bienvenue.texte")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2.5">
          {ACTIONS_CONTRIBUER.map((action) => (
            <CarteAction
              key={action.cle}
              {...action}
              compacte
              onClick={
                action.cle === "github"
                  ? () => {
                      fermer();
                      setRejoindre(true);
                    }
                  : fermer
              }
            />
          ))}
        </div>
        <button type="button" onClick={fermer} className="mx-auto mt-1 block text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
          {t("bienvenue.plusTard")}
        </button>
      </DialogContent>
    </Dialog>
    </>
  );
};
