import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Bell, CheckCheck } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ilYA } from "@/components/idees/elements";
import { useAuth } from "@/contexte/ContexteAuth";
import { chargerNotifications, lienInterne, marquerLue, texteNotification, toutMarquerLu, type NotificationIdee } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const EMOJI_TYPE: Record<string, string> = {
  idee_statut: "💡",
  idee_commentaire: "💬",
  idee_reponse: "↩️",
};

/**
 * Cloche de l'en-tête (membres) : notifications de la boîte à idées, rafraîchies à l'ouverture et toutes les 60 s.
 * Clic : marquée lue, puis ouverture de l'idée (et du commentaire).
 */
export const ClocheNotifications = () => {
  const { t, i18n } = useTranslation();
  const { utilisateur } = useAuth();
  const client = useQueryClient();
  const naviguer = useNavigate();
  const [ouvert, setOuvert] = useState(false);
  const cle = ["notifications", utilisateur?.id];

  const { data, refetch } = useQuery({
    queryKey: cle,
    queryFn: chargerNotifications,
    enabled: Boolean(utilisateur),
    refetchInterval: 60_000,
    // Table partagée avec data-dz : si une requête échoue, la cloche reste simplement vide.
    retry: 1,
  });
  const lecture = useMutation({ mutationFn: marquerLue, onSettled: () => client.invalidateQueries({ queryKey: cle }) });
  const toutLire = useMutation({ mutationFn: toutMarquerLu, onSettled: () => client.invalidateQueries({ queryKey: cle }) });

  if (!utilisateur) return null;
  const nonLues = data?.nonLues ?? 0;

  const ouvrir = (notification: NotificationIdee) => {
    if (!notification.lue) lecture.mutate(notification.id);
    setOuvert(false);
    const lien = lienInterne(notification.lien);
    if (lien) naviguer(lien);
  };

  return (
    <Popover
      open={ouvert}
      onOpenChange={(valeur) => {
        setOuvert(valeur);
        if (valeur) refetch();
      }}
    >
      <PopoverTrigger asChild>
        <button type="button" className="mb-pill mb-pill-glass mb-icon-btn mb-cloche relative" aria-label={t("notifications.titre", { count: nonLues })}>
          <Bell />
          {nonLues > 0 && (
            <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-900">
              {nonLues > 9 ? "9+" : nonLues}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/10">
          <p className="font-semibold">{t("notifications.entete")}</p>
          {nonLues > 0 && (
            <button type="button" onClick={() => toutLire.mutate()} className="inline-flex items-center gap-1 text-xs font-semibold text-[#0d8a59] hover:underline">
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {t("notifications.toutLire")}
            </button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {!data || data.liste.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              <span className="mb-2 block text-3xl" aria-hidden="true">
                🔔
              </span>
              {t("notifications.vide")}
            </div>
          ) : (
            <ul>
              {data.liste.map((notification) => {
                const { cle: cleTexte, valeurs } = texteNotification(notification);
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => ouvrir(notification)}
                      className={cn(
                        "flex w-full gap-3 px-4 py-3 text-start transition-colors hover:bg-gray-50 dark:hover:bg-white/5",
                        !notification.lue && "bg-[#e1f3ea]/50 dark:bg-emerald-400/5"
                      )}
                    >
                      <span className="mt-0.5 text-lg leading-none" aria-hidden="true">
                        {EMOJI_TYPE[notification.type] ?? "🔔"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm text-gray-800 dark:text-gray-100" dir="auto">
                          {t(cleTexte, valeurs)}
                        </span>
                        {notification.donnees.extrait && (
                          <span className="mt-0.5 line-clamp-1 text-xs italic text-gray-500" dir="auto">
                            « {notification.donnees.extrait} »
                          </span>
                        )}
                        <span className="mt-1 block text-xs text-gray-500">{ilYA(notification.cree_le, i18n.language)}</span>
                      </span>
                      {!notification.lue && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#0d8a59]" aria-label={t("notifications.nonLue")} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
