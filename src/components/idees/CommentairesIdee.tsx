import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { EyeOff, Loader2, Pencil, Reply, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AvatarMembre } from "@/components/AvatarMembre";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexte/ContexteAuth";
import {
  ajouterCommentaire,
  chargerCommentaires,
  cleErreurCommentaire,
  grouperEnFils,
  LONGUEUR_MAX_COMMENTAIRE,
  masquerCommentaire,
  modifierCommentaire,
  supprimerCommentaire,
  type CommentaireIdee,
} from "@/lib/commentaires-idees";
import { avecSuite, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ilYA } from "./elements";

/** Champ de saisie d'un commentaire (nouveau, réponse ou modification). */
const Saisie = ({
  initial = "",
  placeholder,
  bouton,
  envoi,
  onEnvoyer,
  onAnnuler,
  autoFocus = false,
}: {
  initial?: string;
  placeholder: string;
  bouton: string;
  envoi: boolean;
  onEnvoyer: (texte: string) => void;
  onAnnuler?: () => void;
  autoFocus?: boolean;
}) => {
  const { t } = useTranslation();
  const [texte, setTexte] = useState(initial);
  const valide = texte.trim().length > 0 && texte.length <= LONGUEUR_MAX_COMMENTAIRE;
  const envoyer = (evenement: FormEvent) => {
    evenement.preventDefault();
    if (valide && !envoi) onEnvoyer(texte.trim());
  };
  return (
    <form onSubmit={envoyer} className="space-y-2">
      <textarea
        value={texte}
        onChange={(evenement) => setTexte(evenement.target.value)}
        placeholder={placeholder}
        rows={2}
        dir="auto"
        autoFocus={autoFocus}
        onKeyDown={(evenement) => {
          if (evenement.key === "Enter" && (evenement.metaKey || evenement.ctrlKey)) envoyer(evenement);
        }}
        className="w-full resize-y rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-[#0d8a59] focus:ring-2 focus:ring-[#0d8a59]/20 sm:text-sm dark:border-white/10 dark:bg-white/5"
      />
      <div className="flex items-center justify-end gap-2">
        {texte.length > LONGUEUR_MAX_COMMENTAIRE * 0.8 && (
          <span className={cn("me-auto text-xs tabular-nums", texte.length > LONGUEUR_MAX_COMMENTAIRE ? "text-red-600" : "text-gray-500")}>
            {texte.length} / {LONGUEUR_MAX_COMMENTAIRE}
          </span>
        )}
        {onAnnuler && (
          <button type="button" onClick={onAnnuler} className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10">
            {t("idees.dialogue.annuler")}
          </button>
        )}
        <button
          type="submit"
          disabled={!valide || envoi}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#0d8a59] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#0b774d] disabled:opacity-50"
        >
          {envoi ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : <Send className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />}
          {bouton}
        </button>
      </div>
    </form>
  );
};

interface CommentairesIdeeProps {
  ideeId: string;
  estEquipe: boolean;
  /** Commentaire à mettre en avant (lien d'une notification : #comment-<id>). */
  cibleId?: string | null;
}

/** Commentaires d'une idée, dépliés sous sa carte : fils avec un niveau de réponses. */
export const CommentairesIdee = ({ ideeId, estEquipe, cibleId }: CommentairesIdeeProps) => {
  const { t, i18n } = useTranslation();
  const { utilisateur } = useAuth();
  const client = useQueryClient();
  const emplacement = useLocation();
  const cle = ["idees-commentaires", ideeId];
  const { data: commentaires, isPending, isError, refetch } = useQuery({ queryKey: cle, queryFn: () => chargerCommentaires(ideeId) });
  const [repondreA, setRepondreA] = useState<string | null>(null);
  const [enModification, setEnModification] = useState<string | null>(null);

  // Lien d'une notification : on fait défiler jusqu'au commentaire une fois chargé.
  useEffect(() => {
    if (!cibleId || !commentaires) return;
    const minuteur = window.setTimeout(() => document.getElementById(`comment-${cibleId}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
    return () => window.clearTimeout(minuteur);
  }, [cibleId, commentaires]);

  const apres = () => {
    client.invalidateQueries({ queryKey: cle });
    client.invalidateQueries({ queryKey: ["idees"] });
  };
  const surErreur = (erreur: unknown) => toast.error(t(cleErreurCommentaire(erreur)));

  const ajout = useMutation({
    mutationFn: ({ texte, parent }: { texte: string; parent: string | null }) => ajouterCommentaire(ideeId, texte, parent),
    onSuccess: () => {
      setRepondreA(null);
      apres();
    },
    onError: surErreur,
  });
  const modification = useMutation({
    mutationFn: ({ id, texte }: { id: string; texte: string }) => modifierCommentaire(id, texte),
    onSuccess: () => {
      setEnModification(null);
      apres();
    },
    onError: surErreur,
  });
  const suppression = useMutation({ mutationFn: supprimerCommentaire, onSuccess: apres, onError: surErreur });
  const masquage = useMutation({
    mutationFn: (commentaire: CommentaireIdee) => masquerCommentaire(commentaire.id, !commentaire.masque),
    onSuccess: apres,
    onError: surErreur,
  });

  const fils = grouperEnFils(commentaires ?? []);
  const lienConnexion = avecSuite(routes.connexion, `${emplacement.pathname}${emplacement.search}`);

  // Fonction de rendu (pas un composant) : le champ de modification garde sa saisie entre deux rendus.
  const rendreCommentaire = (commentaire: CommentaireIdee, filId: string, reponse = false) => {
    const estAuteur = Boolean(utilisateur) && commentaire.auteur_id === utilisateur?.id;
    const nom = commentaire.auteur ? commentaire.auteur.nom_affiche || commentaire.auteur.pseudo : t("idees.auteurSupprime");
    return (
      <div
        key={commentaire.id}
        id={`comment-${commentaire.id}`}
        className={cn(
          "flex scroll-mt-28 gap-3 rounded-2xl p-2 transition-colors",
          cibleId === commentaire.id && "bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:ring-amber-400/30",
          commentaire.masque && "opacity-60"
        )}
      >
        {commentaire.auteur ? (
          <Link to={routes.membre(commentaire.auteur.pseudo)} className="shrink-0">
            <AvatarMembre profil={commentaire.auteur} className={reponse ? "h-7 w-7 text-[10px]" : "h-8 w-8 text-xs"} />
          </Link>
        ) : (
          <span className={cn("shrink-0 rounded-full bg-gray-200 dark:bg-white/10", reponse ? "h-7 w-7" : "h-8 w-8")} />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-gray-500 dark:text-gray-400">
            {commentaire.auteur ? (
              <Link to={routes.membre(commentaire.auteur.pseudo)} className="text-sm font-semibold text-gray-800 hover:text-[#0d8a59] dark:text-gray-100" dir="auto">
                {nom}
              </Link>
            ) : (
              <span className="text-sm font-semibold">{nom}</span>
            )}
            <time dateTime={commentaire.cree_le}>{ilYA(commentaire.cree_le, i18n.language)}</time>
            {commentaire.modifie_le && !commentaire.supprime && <span>· {t("idees.commentaires.modifie")}</span>}
            {commentaire.masque && (
              <span className="inline-flex items-center gap-1">
                · <EyeOff className="h-3 w-3" aria-hidden="true" /> {t("idees.masquee")}
              </span>
            )}
          </div>

          {enModification === commentaire.id ? (
            <div className="mt-1.5">
              <Saisie
                initial={commentaire.contenu}
                placeholder=""
                bouton={t("idees.dialogue.enregistrer")}
                envoi={modification.isPending}
                onEnvoyer={(texte) => modification.mutate({ id: commentaire.id, texte })}
                onAnnuler={() => setEnModification(null)}
                autoFocus
              />
            </div>
          ) : commentaire.supprime ? (
            <p className="mt-0.5 text-sm italic text-gray-400">{t("idees.commentaires.supprime")}</p>
          ) : (
            <p dir="auto" className="mt-0.5 whitespace-pre-line break-words text-sm leading-relaxed text-gray-700 dark:text-gray-200">
              {commentaire.contenu}
            </p>
          )}

          {!commentaire.supprime && enModification !== commentaire.id && (
            <div className="mt-1 flex flex-wrap items-center gap-1 text-xs font-semibold text-gray-500">
              {utilisateur ? (
                <button type="button" onClick={() => setRepondreA(repondreA === filId ? null : filId)} className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-gray-100 hover:text-[#0d8a59] dark:hover:bg-white/10">
                  <Reply className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
                  {t("idees.commentaires.repondre")}
                </button>
              ) : null}
              {estAuteur && (
                <>
                  <button type="button" onClick={() => setEnModification(commentaire.id)} className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/10">
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("idees.modifier")}
                  </button>
                  <button
                    type="button"
                    onClick={() => window.confirm(t("idees.commentaires.confirmerSuppression")) && suppression.mutate(commentaire.id)}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("idees.supprimer")}
                  </button>
                </>
              )}
              {estEquipe && !estAuteur && (
                <button type="button" onClick={() => masquage.mutate(commentaire)} className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-gray-100 dark:hover:bg-white/10">
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                  {t(commentaire.masque ? "idees.equipe.afficher" : "idees.equipe.masquer")}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 border-t border-gray-100 pt-4 dark:border-white/10">
      {isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-14 rounded-2xl" />
        </div>
      ) : isError ? (
        <p className="text-sm text-gray-500">
          {t("idees.erreurs.chargement")}{" "}
          <button type="button" onClick={() => refetch()} className="font-semibold text-[#0d8a59] hover:underline">
            {t("idees.reessayer")}
          </button>
        </p>
      ) : (
        <div className="space-y-2">
          {fils.length === 0 && <p className="px-2 text-sm text-gray-500">{t("idees.commentaires.aucun")}</p>}
          {fils.map(({ commentaire, reponses }) => (
            <div key={commentaire.id}>
              {rendreCommentaire(commentaire, commentaire.id)}
              {(reponses.length > 0 || repondreA === commentaire.id) && (
                <div className="ms-6 space-y-1 border-s-2 border-gray-100 ps-3 sm:ms-10 dark:border-white/10">
                  {reponses.map((reponse) => rendreCommentaire(reponse, commentaire.id, true))}
                  {repondreA === commentaire.id && (
                    <div className="p-2">
                      <Saisie
                        placeholder={t("idees.commentaires.placeholderReponse")}
                        bouton={t("idees.commentaires.repondre")}
                        envoi={ajout.isPending}
                        onEnvoyer={(texte) => ajout.mutate({ texte, parent: commentaire.id })}
                        onAnnuler={() => setRepondreA(null)}
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 px-2">
        {utilisateur ? (
          <Saisie
            key={fils.length}
            placeholder={t("idees.commentaires.placeholder")}
            bouton={t("idees.commentaires.publier")}
            envoi={ajout.isPending && repondreA === null}
            onEnvoyer={(texte) => ajout.mutate({ texte, parent: null })}
          />
        ) : (
          <p className="rounded-2xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-white/5 dark:text-gray-300">
            <Link to={lienConnexion} className="font-semibold text-[#0d8a59] hover:underline">
              {t("idees.commentaires.seConnecter")}
            </Link>{" "}
            {t("idees.commentaires.pourCommenter")}
          </p>
        )}
      </div>
    </div>
  );
};
