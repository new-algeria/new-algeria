// Notifications de la boîte à idées (table `notifications`, partagée avec data-dz ; types « idee_* » créés par la base,
// migration 20261113000021). New Algeria n'affiche que celles-ci : les autres concernent data-dz et ont leurs liens là-bas.
import { supabase } from "./supabase";
import type { StatutIdee } from "./idees";

export const PREFIXE_IDEES = "idee_";
export const NB_NOTIFICATIONS_AFFICHEES = 20;

export interface NotificationIdee {
  id: string;
  type: "idee_statut" | "idee_commentaire" | "idee_reponse" | string;
  donnees: {
    idee_id?: string;
    titre?: { fr?: string; en?: string; ar?: string } | null;
    statut?: StatutIdee;
    ancien_statut?: StatutIdee;
    reponse?: string | null;
    auteur?: string | null;
    extrait?: string | null;
  };
  lien: string | null;
  lue: boolean;
  cree_le: string;
}

export interface BoiteNotifications {
  liste: NotificationIdee[];
  nonLues: number;
}

export async function chargerNotifications(): Promise<BoiteNotifications> {
  const [liste, compte] = await Promise.all([
    supabase
      .from("notifications")
      .select("id, type, donnees, lien, lue, cree_le")
      .like("type", `${PREFIXE_IDEES}%`)
      .order("cree_le", { ascending: false })
      .limit(NB_NOTIFICATIONS_AFFICHEES),
    supabase.from("notifications").select("id", { count: "exact", head: true }).eq("lue", false).like("type", `${PREFIXE_IDEES}%`),
  ]);
  if (liste.error) throw liste.error;
  if (compte.error) throw compte.error;
  return { liste: (liste.data ?? []) as NotificationIdee[], nonLues: compte.count ?? 0 };
}

export async function marquerLue(id: string) {
  const { error } = await supabase.from("notifications").update({ lue: true }).eq("id", id);
  if (error) throw error;
}

export async function toutMarquerLu() {
  const { error } = await supabase.from("notifications").update({ lue: true }).eq("lue", false).like("type", `${PREFIXE_IDEES}%`);
  if (error) throw error;
}

/** N'accepte qu'un chemin interne du site (pas de redirection vers un autre domaine). */
export const lienInterne = (lien: string | null): string | null =>
  lien && lien.startsWith("/") && !lien.startsWith("//") && !lien.includes("\\") ? lien : null;

/** Clé i18next et valeurs du texte d'une notification. */
export function texteNotification(n: NotificationIdee): { cle: string; valeurs: Record<string, string> } {
  const titre = n.donnees.titre?.fr || n.donnees.titre?.en || n.donnees.titre?.ar || "";
  switch (n.type) {
    case "idee_statut":
      return n.donnees.statut && n.donnees.statut !== n.donnees.ancien_statut
        ? { cle: `notifications.statut.${n.donnees.statut}`, valeurs: { titre } }
        : { cle: "notifications.messageEquipe", valeurs: { titre } };
    case "idee_commentaire":
      return { cle: "notifications.commentaire", valeurs: { titre, auteur: n.donnees.auteur || "" } };
    case "idee_reponse":
      return { cle: "notifications.reponse", valeurs: { titre, auteur: n.donnees.auteur || "" } };
    default:
      return { cle: "notifications.autre", valeurs: { titre } };
  }
}
