import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight, Lightbulb } from "lucide-react";
import { BoutonVoteIdee } from "@/components/idees/CarteIdee";
import { BadgeCategorie } from "@/components/idees/elements";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexte/ContexteAuth";
import { useIdees, useMesVotesIdees, useVoterIdee } from "@/hooks/use-idees";
import { avecSuite, routes } from "@/lib/routes";
import { ACTIONS_CONTRIBUER, CarteAction, LienAction } from "./actions";

/**
 * Accueil, juste après les projets : « Toi aussi, aide l'Algérie ».
 * À gauche, la boîte à idées en direct (les 3 idées les plus soutenues, votables ici) ; à droite, les autres façons d'aider.
 */
const SectionContribuer = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { data: idees, isPending, isError } = useIdees();
  const { data: mesVotes } = useMesVotesIdees();
  const voter = useVoterIdee();
  const meilleures = (idees ?? []).filter((idee) => idee.statut !== "ecartee").slice(0, 3);

  return (
    <section className="py-20" id="contribuer">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-section-title font-display">
            <Trans i18nKey="contribuer.titre" components={[<span className="mb-highlight" />]} />
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">{t("contribuer.sousTitre")}</p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* Boîte à idées en direct */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="mb-surface relative overflow-hidden p-6 sm:p-8"
          >
            <div className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-400/10" aria-hidden="true" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {t("idees.badge")}
              </span>
              <h3 className="mt-4 font-display text-2xl leading-tight text-[color:var(--na-ink)] sm:text-3xl dark:text-white">{t("contribuer.boite.titre")}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{t("contribuer.boite.texte")}</p>

              <div className="mt-6 space-y-3">
                {isPending ? (
                  Array.from({ length: 3 }, (_, indice) => <Skeleton key={indice} className="h-[72px] rounded-2xl" />)
                ) : isError || meilleures.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center text-gray-600 dark:border-white/15 dark:text-gray-300">
                    <span className="text-3xl" aria-hidden="true">
                      🌱
                    </span>
                    <p className="mt-2">{t("contribuer.boite.vide")}</p>
                  </div>
                ) : (
                  meilleures.map((idee) => {
                    const aVote = mesVotes?.has(idee.id) ?? false;
                    return (
                      <div key={idee.id} className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white/70 p-3 dark:border-white/10 dark:bg-white/5">
                        <BoutonVoteIdee nombre={idee.nb_votes} aVote={aVote} onVoter={() => voter(idee, aVote)} titre={idee.titre} />
                        <Link to={routes.idees} className="min-w-0 flex-1 hover:text-[#0d8a59]">
                          <span className="line-clamp-2 font-semibold text-[color:var(--na-ink)] dark:text-white" dir="auto">
                            {idee.titre}
                          </span>
                          <span className="mt-1 block">
                            <BadgeCategorie categorie={idee.categorie} />
                          </span>
                        </Link>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <LienAction cle="idee" className="mb-pill mb-pill-green inline-flex items-center gap-2 px-5 py-2.5 font-semibold">
                  💡 {t("idees.proposer")}
                </LienAction>
                <Link to={routes.idees} className="inline-flex items-center gap-1.5 font-semibold text-[#0d8a59] hover:underline">
                  {t("contribuer.boite.voirToutes")}
                  <ArrowRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Les autres façons d'aider */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <p className="px-1 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("contribuer.autres")}</p>
            {ACTIONS_CONTRIBUER.filter((action) => action.cle !== "idee").map((action) => (
              <CarteAction key={action.cle} {...action} />
            ))}
            {!session && (
              <p className="mt-2 rounded-2xl bg-[#e1f3ea]/70 p-4 text-sm text-[#0b6b46] dark:bg-emerald-400/10 dark:text-emerald-300">
                {t("contribuer.compte")}{" "}
                <Link to={avecSuite(routes.inscription, routes.idees)} className="font-semibold underline">
                  {t("contribuer.creerCompte")}
                </Link>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SectionContribuer;
