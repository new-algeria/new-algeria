import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronUp, EyeOff, MessageSquareQuote, MoreHorizontal, Pencil, Settings2, Trash2 } from "lucide-react";
import { AvatarMembre } from "@/components/AvatarMembre";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Idee } from "@/lib/idees";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { BadgeCategorie, BadgeStatut, ilYA } from "./elements";

interface CarteIdeeProps {
  idee: Idee;
  aVote: boolean;
  onVoter: () => void;
  /** L'auteur peut modifier ou retirer son idée tant qu'elle est « nouvelle ». */
  estAuteur: boolean;
  estEquipe: boolean;
  onModifier?: () => void;
  onSupprimer?: () => void;
  onStatut?: () => void;
  onMasquer?: () => void;
  /** Version courte (accueil) : description sur deux lignes, sans actions. */
  compacte?: boolean;
}

/** Bouton de vote : flèche et nombre, vert une fois voté. */
export const BoutonVoteIdee = ({ nombre, aVote, onVoter, titre }: { nombre: number; aVote: boolean; onVoter: () => void; titre: string }) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={onVoter}
      aria-pressed={aVote}
      aria-label={t(aVote ? "idees.retirerVote" : "idees.voter", { titre })}
      className={cn(
        "flex h-16 w-12 shrink-0 flex-col items-center justify-center self-start rounded-2xl border transition-all active:scale-95 sm:w-14",
        aVote
          ? "border-[#0d8a59] bg-[#0d8a59] text-white shadow-[0_8px_20px_-10px_rgba(13,138,89,0.9)]"
          : "border-gray-200 bg-white text-gray-700 hover:-translate-y-0.5 hover:border-[#0d8a59] hover:text-[#0d8a59] dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
      )}
    >
      <ChevronUp className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
      <motion.span key={nombre} initial={{ y: -4, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-base font-bold tabular-nums leading-none">
        {nombre}
      </motion.span>
    </button>
  );
};

export const CarteIdee = ({ idee, aVote, onVoter, estAuteur, estEquipe, onModifier, onSupprimer, onStatut, onMasquer, compacte = false }: CarteIdeeProps) => {
  const { t, i18n } = useTranslation();
  const [ouverte, setOuverte] = useState(false);
  const auteurModifiable = estAuteur && idee.statut === "nouvelle";
  const actions = !compacte && (auteurModifiable || estEquipe);
  const nomAuteur = idee.auteur ? idee.auteur.nom_affiche || idee.auteur.pseudo : t("idees.auteurSupprime");
  const longue = idee.description.length > 220;

  return (
    <article className={cn("mb-surface flex gap-4 p-4 sm:p-5", idee.masquee && "opacity-60")}>
      <BoutonVoteIdee nombre={idee.nb_votes} aVote={aVote} onVoter={onVoter} titre={idee.titre} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <BadgeStatut statut={idee.statut} />
          <BadgeCategorie categorie={idee.categorie} />
          {idee.masquee && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500">
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
              {t("idees.masquee")}
            </span>
          )}
          {actions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="ms-auto rounded-full p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10" aria-label={t("idees.actions")}>
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {auteurModifiable && (
                  <DropdownMenuItem onSelect={onModifier} className="cursor-pointer gap-2">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    {t("idees.modifier")}
                  </DropdownMenuItem>
                )}
                {estEquipe && (
                  <>
                    <DropdownMenuItem onSelect={onStatut} className="cursor-pointer gap-2">
                      <Settings2 className="h-4 w-4" aria-hidden="true" />
                      {t("idees.equipe.changer")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={onMasquer} className="cursor-pointer gap-2">
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                      {t(idee.masquee ? "idees.equipe.afficher" : "idees.equipe.masquer")}
                    </DropdownMenuItem>
                  </>
                )}
                {(auteurModifiable || estEquipe) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={onSupprimer} className="cursor-pointer gap-2 text-red-600 focus:text-red-600 dark:text-red-400">
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                      {t("idees.supprimer")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <h3 className="mt-2 font-display text-lg leading-snug text-[color:var(--na-ink)] sm:text-xl dark:text-white" dir="auto">
          {idee.titre}
        </h3>
        {idee.description && (
          <p dir="auto" className={cn("mt-1.5 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300", (compacte || (longue && !ouverte)) && "line-clamp-2 sm:line-clamp-3")}>
            {idee.description}
          </p>
        )}
        {!compacte && longue && (
          <button type="button" onClick={() => setOuverte((valeur) => !valeur)} className="mt-1 text-sm font-semibold text-[#0d8a59] hover:underline">
            {t(ouverte ? "idees.voirMoins" : "idees.voirPlus")}
          </button>
        )}

        {idee.reponse_equipe && !compacte && (
          <div className="mt-3 flex gap-2.5 rounded-xl bg-[#e1f3ea]/70 p-3 text-sm dark:bg-emerald-400/10">
            <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-[#0d8a59]" aria-hidden="true" />
            <p dir="auto">
              <span className="font-semibold text-[#0b6b46] dark:text-emerald-300">{t("idees.motEquipe")} </span>
              <span className="text-gray-700 dark:text-gray-200">{idee.reponse_equipe}</span>
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          {idee.auteur ? (
            <Link to={routes.membre(idee.auteur.pseudo)} className="flex min-w-0 items-center gap-2 font-medium text-gray-700 hover:text-[#0d8a59] dark:text-gray-200">
              <AvatarMembre profil={idee.auteur} className="h-6 w-6 text-[10px]" />
              <span className="truncate" dir="auto">
                {nomAuteur}
              </span>
            </Link>
          ) : (
            <span>{nomAuteur}</span>
          )}
          <span aria-hidden="true">·</span>
          <time dateTime={idee.cree_le}>{ilYA(idee.cree_le, i18n.language)}</time>
        </div>
      </div>
    </article>
  );
};
