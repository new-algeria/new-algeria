import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Database, LogIn, LogOut, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarMembre } from "@/components/AvatarMembre";
import { useAuth } from "@/contexte/ContexteAuth";
import { deconnecter } from "@/lib/auth";
import { avecSuite, routes, URL_DATA_DZ } from "@/lib/routes";

/** Visiteur : bouton vert « Se connecter ». Membre : avatar + nom ▾ (profil, data-dz, déconnexion). */
export const MenuCompte = () => {
  const { t } = useTranslation();
  const { session, utilisateur, profil, chargement } = useAuth();
  const emplacement = useLocation();
  const naviguer = useNavigate();

  if (chargement) return <Skeleton className="h-[46px] w-[46px] rounded-full" />;

  if (!session) {
    const suite = `${emplacement.pathname}${emplacement.search}`;
    return (
      <Link
        to={avecSuite(routes.connexion, emplacement.pathname === routes.connexion ? "/" : suite)}
        className="mb-pill mb-pill-green mb-nav-login"
        aria-label={t("auth.seConnecter")}
      >
        <LogIn aria-hidden="true" />
        <span>{t("auth.seConnecter")}</span>
      </Link>
    );
  }

  const quitter = async () => {
    try {
      await deconnecter();
    } finally {
      naviguer(routes.accueil);
    }
  };
  const nom = profil ? profil.nom_affiche || profil.pseudo : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="mb-pill mb-pill-glass mb-nav-compte" aria-label={t("auth.menuCompte")}>
          {profil ? <AvatarMembre profil={profil} className="h-9 w-9" /> : <Skeleton className="h-9 w-9 rounded-full" />}
          <span className="mb-nav-compte-nom" dir="auto">
            {nom}
          </span>
          <ChevronDown className="h-4 w-4 opacity-60" aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {profil && (
          <>
            <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
              <AvatarMembre profil={profil} className="h-10 w-10" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold" dir="auto">
                  {nom}
                </span>
                {utilisateur?.email && (
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400" dir="ltr">
                    {utilisateur.email}
                  </span>
                )}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem asChild>
          <Link to={routes.profil} className="cursor-pointer gap-2.5 py-2">
            <UserRound className="h-4 w-4 text-gray-500" aria-hidden="true" />
            {t("auth.monProfil")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={URL_DATA_DZ} target="_blank" rel="noopener noreferrer" className="cursor-pointer gap-2.5 py-2">
            <Database className="h-4 w-4 text-gray-500" aria-hidden="true" />
            {t("compte.ouvrirDataDz")}
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={quitter} className="cursor-pointer gap-2.5 py-2 text-red-600 focus:text-red-600 dark:text-red-400">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {t("auth.deconnexion")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
