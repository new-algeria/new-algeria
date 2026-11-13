import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation, Trans } from "react-i18next";
import { motion } from "framer-motion";
import { Lightbulb, Plus, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import { PageInterne } from "@/components/PageInterne";
import { CarteIdee } from "@/components/idees/CarteIdee";
import { DialogueIdee } from "@/components/idees/DialogueIdee";
import { DialogueStatut } from "@/components/idees/DialogueStatut";
import { PASTILLE_STATUT } from "@/components/idees/elements";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexte/ContexteAuth";
import { useEstModerateur, useIdees, useMesVotesIdees, useVoterIdee } from "@/hooks/use-idees";
import {
  BoiteIdeesIndisponible,
  CATEGORIES_IDEE,
  changerStatutIdee,
  cleErreurIdee,
  EMOJI_CATEGORIE,
  filtrerIdees,
  masquerIdee,
  modifierIdee,
  proposerIdee,
  STATUTS_IDEE,
  supprimerIdee,
  trierIdees,
  type CategorieIdee,
  type ContenuIdee,
  type Idee,
  type StatutIdee,
  type TriIdees,
} from "@/lib/idees";
import { avecSuite, routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** Paramètre d'URL qui ouvre directement le formulaire (accueil, retour de connexion). */
export const PARAMETRE_PROPOSER = "propose";

const Puce = ({ actif, onClick, children }: { actif: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    aria-pressed={actif}
    onClick={onClick}
    className={cn(
      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
      actif
        ? "border-[color:var(--na-ink)] bg-[color:var(--na-ink)] text-white dark:border-white dark:bg-white dark:text-gray-900"
        : "border-gray-200 bg-white/80 text-gray-700 hover:border-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
    )}
  >
    {children}
  </button>
);

/** Boîte à idées : ce qui manque en Algérie, proposé et soutenu par la communauté. */
const Idees = () => {
  const { t } = useTranslation();
  const { session, utilisateur } = useAuth();
  const client = useQueryClient();
  const naviguer = useNavigate();
  const [parametres, setParametres] = useSearchParams();

  const requete = useIdees();
  const { data: mesVotes } = useMesVotesIdees();
  const { data: equipe = false } = useEstModerateur();
  const voter = useVoterIdee();

  const [tri, setTri] = useState<TriIdees>("populaires");
  const [categorie, setCategorie] = useState<CategorieIdee | null>(null);
  const [statut, setStatut] = useState<StatutIdee | null>(null);
  const [terme, setTerme] = useState("");
  const [formulaire, setFormulaire] = useState<{ ouvert: boolean; idee?: Idee }>({ ouvert: false });
  const [aSupprimer, setASupprimer] = useState<Idee | null>(null);
  const [aModerer, setAModerer] = useState<Idee | null>(null);

  // « ?propose=1 » : ouvre le formulaire (depuis l'accueil ou au retour de la connexion).
  useEffect(() => {
    if (parametres.get(PARAMETRE_PROPOSER) && session) {
      setFormulaire({ ouvert: true });
      parametres.delete(PARAMETRE_PROPOSER);
      setParametres(parametres, { replace: true });
    }
  }, [parametres, session, setParametres]);

  const ouvrirProposition = () => {
    if (!session) {
      naviguer(avecSuite(routes.connexion, `${routes.idees}?${PARAMETRE_PROPOSER}=1`));
      return;
    }
    setFormulaire({ ouvert: true });
  };

  const rafraichir = () => client.invalidateQueries({ queryKey: ["idees"] });
  const surErreur = (erreur: unknown) => toast.error(t(cleErreurIdee(erreur)));

  const envoi = useMutation({
    mutationFn: (contenu: ContenuIdee) => (formulaire.idee ? modifierIdee(formulaire.idee.id, contenu) : proposerIdee(contenu)),
    onSuccess: () => {
      toast.success(t(formulaire.idee ? "idees.modifiee" : "idees.publiee"));
      setFormulaire({ ouvert: false });
      if (!formulaire.idee) setTri("recentes");
      rafraichir();
    },
    onError: surErreur,
  });
  const suppression = useMutation({
    mutationFn: (idee: Idee) => supprimerIdee(idee.id),
    onSuccess: () => {
      toast.success(t("idees.supprimee"));
      setASupprimer(null);
      rafraichir();
    },
    onError: surErreur,
  });
  const moderation = useMutation({
    mutationFn: ({ idee, statut, reponse }: { idee: Idee; statut: StatutIdee; reponse: string }) => changerStatutIdee(idee.id, statut, reponse),
    onSuccess: () => {
      toast.success(t("idees.equipe.enregistre"));
      setAModerer(null);
      rafraichir();
    },
    onError: surErreur,
  });
  const masquage = useMutation({
    mutationFn: (idee: Idee) => masquerIdee(idee.id, !idee.masquee),
    onSuccess: rafraichir,
    onError: surErreur,
  });

  const idees = useMemo(() => requete.data ?? [], [requete.data]);
  const affichees = useMemo(() => trierIdees(filtrerIdees(idees, { categorie, statut, terme }), tri), [idees, categorie, statut, terme, tri]);
  const totalVotes = idees.reduce((somme, idee) => somme + idee.nb_votes, 0);
  const indisponible = requete.error instanceof BoiteIdeesIndisponible;

  return (
    <PageInterne titre={t("idees.titrePage")}>
      {/* En-tête */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#e1f3ea] via-[#f4f8f1] to-transparent dark:from-emerald-950/40 dark:via-transparent" aria-hidden="true" />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="container relative max-w-5xl py-12 text-center md:py-16"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#0d8a59]/25 bg-white/80 px-3.5 py-1 text-sm font-semibold text-[#0b6b46] dark:bg-white/5 dark:text-emerald-300">
            <Lightbulb className="h-4 w-4" aria-hidden="true" />
            {t("idees.badge")}
          </span>
          <h1 className="mb-section-title font-display mx-auto mt-4 max-w-3xl">
            <Trans i18nKey="idees.titre" components={[<span className="mb-highlight" />]} />
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">{t("idees.sousTitre")}</p>
          <button type="button" onClick={ouvrirProposition} className="mb-pill mb-pill-green mt-7 inline-flex items-center gap-2 px-6 py-3 text-base font-semibold">
            <Plus className="h-5 w-5" aria-hidden="true" />
            {t("idees.proposer")}
          </button>
          {idees.length > 0 && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {t("idees.compteurs", { idees: idees.length, votes: totalVotes, count: idees.length })}
            </p>
          )}
        </motion.div>
      </section>

      <div className="container grid max-w-6xl gap-8 pb-20 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {/* Barre d'outils */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={terme}
                onChange={(evenement) => setTerme(evenement.target.value)}
                placeholder={t("idees.rechercher")}
                aria-label={t("idees.rechercher")}
                className="h-11 w-full rounded-full border border-gray-200 bg-white/90 pe-4 ps-10 text-base outline-none transition focus:border-[#0d8a59] focus:ring-2 focus:ring-[#0d8a59]/20 dark:border-white/10 dark:bg-white/5"
              />
            </div>
            <div role="group" aria-label={t("idees.tri")} className="inline-flex shrink-0 rounded-full bg-gray-100 p-1 dark:bg-white/10">
              {(["populaires", "recentes"] as const).map((valeur) => (
                <button
                  key={valeur}
                  type="button"
                  aria-pressed={tri === valeur}
                  onClick={() => setTri(valeur)}
                  className={cn(
                    "flex-1 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                    tri === valeur ? "bg-white text-[color:var(--na-ink)] shadow-sm dark:bg-gray-900 dark:text-white" : "text-gray-500"
                  )}
                >
                  {t(`idees.tris.${valeur}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]" role="group" aria-label={t("idees.filtreCategorie")}>
            <Puce actif={categorie === null} onClick={() => setCategorie(null)}>
              {t("idees.toutes")}
            </Puce>
            {CATEGORIES_IDEE.map((code) => (
              <Puce key={code} actif={categorie === code} onClick={() => setCategorie(categorie === code ? null : code)}>
                <span aria-hidden="true">{EMOJI_CATEGORIE[code]}</span>
                {t(`idees.categories.${code}`)}
              </Puce>
            ))}
          </div>

          {statut && (
            <button type="button" onClick={() => setStatut(null)} className="mt-3 text-sm font-semibold text-[#0d8a59] hover:underline">
              {t("idees.filtreStatutActif", { statut: t(`idees.statuts.${statut}`) })} ✕
            </button>
          )}

          {/* Liste */}
          <div className="mt-5 space-y-4">
            {requete.isPending ? (
              Array.from({ length: 4 }, (_, indice) => <Skeleton key={indice} className="h-36 rounded-3xl" />)
            ) : indisponible ? (
              <p className="mb-surface p-8 text-center text-gray-600 dark:text-gray-300">{t("idees.indisponible")}</p>
            ) : requete.isError ? (
              <div className="mb-surface p-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">{t("idees.erreurs.chargement")}</p>
                <button type="button" onClick={() => requete.refetch()} className="mt-3 font-semibold text-[#0d8a59] hover:underline">
                  {t("idees.reessayer")}
                </button>
              </div>
            ) : idees.length === 0 ? (
              <div className="mb-surface flex flex-col items-center gap-3 p-10 text-center">
                <span className="text-5xl" aria-hidden="true">
                  💡
                </span>
                <p className="max-w-sm font-display text-xl text-[color:var(--na-ink)] dark:text-white">{t("idees.vide")}</p>
                <button type="button" onClick={ouvrirProposition} className="mb-pill mb-pill-green mt-2 px-5 py-2.5 font-semibold">
                  {t("idees.proposerPremiere")}
                </button>
              </div>
            ) : affichees.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-gray-500">
                <SearchX className="h-8 w-8" aria-hidden="true" />
                {t("idees.aucunResultat")}
              </div>
            ) : (
              affichees.map((idee) => (
                <CarteIdee
                  key={idee.id}
                  idee={idee}
                  aVote={mesVotes?.has(idee.id) ?? false}
                  onVoter={() => voter(idee, mesVotes?.has(idee.id) ?? false)}
                  estAuteur={Boolean(utilisateur) && idee.auteur_id === utilisateur?.id}
                  estEquipe={equipe}
                  onModifier={() => setFormulaire({ ouvert: true, idee })}
                  onSupprimer={() => setASupprimer(idee)}
                  onStatut={() => setAModerer(idee)}
                  onMasquer={() => masquage.mutate(idee)}
                />
              ))
            )}
          </div>
        </div>

        {/* Colonne : comment ça marche, statuts */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="mb-surface p-5">
            <h2 className="font-display text-lg text-[color:var(--na-ink)] dark:text-white">{t("idees.commentTitre")}</h2>
            <ol className="mt-3 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {[1, 2, 3].map((etape) => (
                <li key={etape} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e1f3ea] text-xs font-bold text-[#0b6b46] dark:bg-emerald-400/10 dark:text-emerald-300">
                    {etape}
                  </span>
                  {t(`idees.comment.${etape}`)}
                </li>
              ))}
            </ol>
          </section>
          <section className="mb-surface p-5">
            <h2 className="font-display text-lg text-[color:var(--na-ink)] dark:text-white">{t("idees.statutsTitre")}</h2>
            <ul className="mt-3 space-y-1">
              {STATUTS_IDEE.map((code) => {
                const nombre = idees.filter((idee) => idee.statut === code).length;
                return (
                  <li key={code}>
                    <button
                      type="button"
                      onClick={() => setStatut(statut === code ? null : code)}
                      aria-pressed={statut === code}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-start text-sm transition-colors hover:bg-gray-100 dark:hover:bg-white/5",
                        statut === code && "bg-gray-100 dark:bg-white/10"
                      )}
                    >
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", PASTILLE_STATUT[code])} aria-hidden="true" />
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{t(`idees.statuts.${code}`)}</span>
                      <span className="min-w-0 flex-1 truncate text-gray-500">{t(`idees.statutsDetail.${code}`)}</span>
                      {nombre > 0 && <span className="text-xs font-semibold tabular-nums text-gray-500">{nombre}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </aside>
      </div>

      <DialogueIdee
        ouvert={formulaire.ouvert}
        onOuvertChange={(ouvert) => setFormulaire((actuel) => ({ ...actuel, ouvert }))}
        initial={formulaire.idee}
        envoi={envoi.isPending}
        onEnvoyer={(contenu) => envoi.mutate(contenu)}
      />
      <DialogueStatut
        idee={aModerer}
        onFermer={() => setAModerer(null)}
        envoi={moderation.isPending}
        onEnvoyer={(nouveau, reponse) => aModerer && moderation.mutate({ idee: aModerer, statut: nouveau, reponse })}
      />
      <AlertDialog open={Boolean(aSupprimer)} onOpenChange={(ouvert) => !ouvert && setASupprimer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("idees.supprimerTitre")}</AlertDialogTitle>
            <AlertDialogDescription dir="auto">{aSupprimer?.titre}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("idees.dialogue.annuler")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(evenement) => {
                evenement.preventDefault();
                if (aSupprimer) suppression.mutate(aSupprimer);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("idees.supprimer")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageInterne>
  );
};

export default Idees;
