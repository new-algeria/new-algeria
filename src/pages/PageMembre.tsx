import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { PageInterne } from "@/components/PageInterne";
import { CarteBio, EnTeteMembre } from "@/components/membres/FicheMembre";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexte/ContexteAuth";
import { chargerMembre } from "@/lib/profils";
import { routes } from "@/lib/routes";

/** Page publique d'un membre (/members/:username) ; sa propre page redirige vers /profile. */
const PageMembre = () => {
  const { t } = useTranslation();
  const { pseudo = "" } = useParams();
  const { profil } = useAuth();
  const requete = useQuery({
    queryKey: ["membre", pseudo.toLowerCase()],
    queryFn: () => chargerMembre(pseudo),
    enabled: Boolean(pseudo),
  });

  if (profil && profil.pseudo === pseudo.toLowerCase()) return <Navigate to={routes.profil} replace />;

  const membre = requete.data;
  const titre = membre ? `${membre.nom_affiche || membre.pseudo} (@${membre.pseudo})` : t("membre.introuvableTitre");

  return (
    <PageInterne titre={titre}>
      {requete.isPending ? (
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-12" aria-busy="true">
          <div className="flex items-end gap-5">
            <Skeleton className="h-28 w-28 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : requete.isError || !membre ? (
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">{requete.isError ? t("membre.erreur") : t("membre.introuvableTitre")}</h1>
          {!requete.isError && <p className="text-gray-500 dark:text-gray-400">{t("membre.introuvableTexte", { pseudo })}</p>}
          {requete.isError ? (
            <Button type="button" onClick={() => requete.refetch()} className="bg-emerald-700 text-white hover:bg-emerald-800">
              {t("compte.reessayer")}
            </Button>
          ) : (
            <Button asChild className="bg-emerald-700 text-white hover:bg-emerald-800">
              <Link to={routes.accueil}>{t("compte.retourAccueil")}</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <EnTeteMembre membre={membre} />
          <div className="mx-auto max-w-3xl px-4 pb-16 pt-8">
            <CarteBio membre={membre} />
          </div>
        </>
      )}
    </PageInterne>
  );
};

export default PageMembre;
