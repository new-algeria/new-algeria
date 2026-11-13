import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";
import JoinUsBtn from "@/components/JoinUsBtn";
import { routes, URL_DATA_DZ } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Paramètre qui ouvre le formulaire de la boîte à idées (voir pages/Idees.tsx). */
const LIEN_PROPOSER = `${routes.idees}?propose=1`;

export type CleAction = "idee" | "voter" | "donnee" | "github";

/** Les façons d'aider, de la plus simple à la plus engagée : même liste sur l'accueil et à l'arrivée d'un nouveau membre. */
export const ACTIONS_CONTRIBUER: { cle: CleAction; emoji: string; teinte: string }[] = [
  { cle: "idee", emoji: "💡", teinte: "bg-amber-100 dark:bg-amber-400/15" },
  { cle: "voter", emoji: "👍", teinte: "bg-[#e1f3ea] dark:bg-emerald-400/15" },
  { cle: "donnee", emoji: "📊", teinte: "bg-sky-100 dark:bg-sky-400/15" },
  { cle: "github", emoji: "💻", teinte: "bg-slate-200 dark:bg-white/10" },
];

interface LienActionProps {
  cle: CleAction;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

/** Enveloppe une action dans le bon lien : page interne, data-dz (nouvel onglet) ou fenêtre « Rejoindre ». */
export const LienAction = ({ cle, className, children, onClick }: LienActionProps) => {
  const { t } = useTranslation();
  if (cle === "github") {
    // Avec onClick, le parent ouvre lui-même la fenêtre « Rejoindre » (ex. depuis la fenêtre de bienvenue, qui se ferme).
    if (onClick) {
      return (
        <button type="button" className={cn("text-start", className)} onClick={onClick}>
          {children}
        </button>
      );
    }
    return (
      <JoinUsBtn className={cn("text-start", className)} aria-label={t("contribuer.actions.github.titre")}>
        {children}
      </JoinUsBtn>
    );
  }
  if (cle === "donnee") {
    return (
      <a href={`${URL_DATA_DZ}/submit`} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link to={cle === "idee" ? LIEN_PROPOSER : routes.idees} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};

/** Carte d'une action : emoji, titre, phrase, durée. */
export const CarteAction = ({ cle, emoji, teinte, onClick, compacte = false }: (typeof ACTIONS_CONTRIBUER)[number] & { onClick?: () => void; compacte?: boolean }) => {
  const { t } = useTranslation();
  return (
    <LienAction
      cle={cle}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 text-start transition-all hover:-translate-y-0.5 hover:border-[#0d8a59]/40 hover:shadow-lg dark:border-white/10 dark:bg-white/5",
        compacte && "p-3"
      )}
    >
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl", teinte)} aria-hidden="true">
        {emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-[color:var(--na-ink)] dark:text-white">{t(`contribuer.actions.${cle}.titre`)}</span>
        <span className="block text-sm text-gray-600 dark:text-gray-400">{t(`contribuer.actions.${cle}.texte`)}</span>
      </span>
      <span className="hidden shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 sm:inline dark:bg-white/10 dark:text-gray-300">
        {t(`contribuer.actions.${cle}.duree`)}
      </span>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0d8a59] rtl:-scale-x-100" aria-hidden="true" />
    </LienAction>
  );
};
