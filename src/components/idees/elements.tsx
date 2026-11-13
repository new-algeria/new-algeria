import { useTranslation } from "react-i18next";
import { EMOJI_CATEGORIE, type CategorieIdee, type StatutIdee } from "@/lib/idees";
import { cn } from "@/lib/utils";

export const COULEUR_STATUT: Record<StatutIdee, string> = {
  nouvelle: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  en_etude: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
  retenue: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300",
  en_cours: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  realisee: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
  ecartee: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
};

export const PASTILLE_STATUT: Record<StatutIdee, string> = {
  nouvelle: "bg-slate-400",
  en_etude: "bg-sky-500",
  retenue: "bg-violet-500",
  en_cours: "bg-amber-500",
  realisee: "bg-emerald-500",
  ecartee: "bg-rose-500",
};

export const BadgeStatut = ({ statut, className }: { statut: StatutIdee; className?: string }) => {
  const { t } = useTranslation();
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", COULEUR_STATUT[statut], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", PASTILLE_STATUT[statut])} aria-hidden="true" />
      {t(`idees.statuts.${statut}`)}
    </span>
  );
};

export const BadgeCategorie = ({ categorie }: { categorie: CategorieIdee }) => {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#e1f3ea] px-2.5 py-0.5 text-xs font-semibold text-[#0b6b46] dark:bg-emerald-400/10 dark:text-emerald-300">
      <span aria-hidden="true">{EMOJI_CATEGORIE[categorie]}</span>
      {t(`idees.categories.${categorie}`)}
    </span>
  );
};

/** « il y a 3 jours », dans la langue affichée. */
export function ilYA(date: string, langue: string): string {
  const secondes = (new Date(date).getTime() - Date.now()) / 1000;
  const format = new Intl.RelativeTimeFormat(langue, { numeric: "auto" });
  const unites: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unite, duree] of unites) {
    if (Math.abs(secondes) >= duree) return format.format(Math.round(secondes / duree), unite);
  }
  return format.format(0, "minute");
}
