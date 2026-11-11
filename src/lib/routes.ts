// Chemins du site, en anglais comme sur data-dz. Dans le code, on écrit routes.connexion, jamais "/login" en dur.

/** Site data-dz : même compte (même projet Supabase), conditions d'utilisation et confidentialité communes. */
export const URL_DATA_DZ = "https://www.data-dz.com";

export const routes = {
  accueil: "/",
  /** Section de la page d'accueil (ex. « services ») : fonctionne depuis n'importe quelle page. */
  section: (ancre: string) => `/#${ancre}`,
  membre: (pseudo: string) => `/members/${encodeURIComponent(pseudo)}`,
  profil: "/profile",
  connexion: "/login",
  inscription: "/signup",
  motDePasseOublie: "/forgot-password",
  nouveauMotDePasse: "/reset-password",
  retourAuth: "/auth/callback",
  conditions: `${URL_DATA_DZ}/terms`,
  confidentialite: `${URL_DATA_DZ}/privacy`,
} as const;

/** Paramètre d'URL portant la page où revenir après connexion (« next »). L'ancien « suite » reste lu. */
export const PARAMETRE_SUITE = "next";
export const ANCIEN_PARAMETRE_SUITE = "suite";

/** Ajoute ?next=<page> à un chemin. */
export const avecSuite = (chemin: string, suite: string) => `${chemin}?${PARAMETRE_SUITE}=${encodeURIComponent(suite)}`;
