// Commentaires sous les idées : table `idees_commentaires` (migration 20261113000021 du dépôt data-dz).
// Un niveau de réponses ; un commentaire supprimé est vidé par la base et ne s'affiche que s'il a des réponses.
import { supabase } from "./supabase";
import type { Profil } from "./profils";

export const LONGUEUR_MAX_COMMENTAIRE = 2000;

export interface CommentaireIdee {
  id: string;
  idee_id: string;
  parent_id: string | null;
  auteur_id: string | null;
  contenu: string;
  supprime: boolean;
  masque: boolean;
  cree_le: string;
  modifie_le: string | null;
  auteur: Pick<Profil, "pseudo" | "nom_affiche" | "avatar_url"> | null;
}

/** Un commentaire principal et ses réponses, dans l'ordre. */
export interface FilCommentaires {
  commentaire: CommentaireIdee;
  reponses: CommentaireIdee[];
}

const COLONNES =
  "id, idee_id, parent_id, auteur_id, contenu, supprime, masque, cree_le, modifie_le, auteur:profils!idees_commentaires_auteur_id_fkey ( pseudo, nom_affiche, avatar_url )";

export async function chargerCommentaires(ideeId: string): Promise<CommentaireIdee[]> {
  const { data, error } = await supabase.from("idees_commentaires").select(COLONNES).eq("idee_id", ideeId).order("cree_le", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as CommentaireIdee[];
}

export async function ajouterCommentaire(ideeId: string, contenu: string, parentId: string | null = null) {
  const { error } = await supabase.from("idees_commentaires").insert({ idee_id: ideeId, contenu, parent_id: parentId });
  if (error) throw error;
}

export async function modifierCommentaire(id: string, contenu: string) {
  const { error } = await supabase.from("idees_commentaires").update({ contenu }).eq("id", id);
  if (error) throw error;
}

export async function supprimerCommentaire(id: string) {
  const { error } = await supabase.from("idees_commentaires").update({ supprime: true }).eq("id", id);
  if (error) throw error;
}

export async function masquerCommentaire(id: string, masquer: boolean) {
  const { error } = await supabase.rpc("masquer_commentaire_idee", { p_commentaire_id: id, p_masquer: masquer });
  if (error) throw error;
}

/**
 * Range les commentaires en fils : un commentaire principal suivi de ses réponses.
 * Un commentaire supprimé sans réponse disparaît ; avec des réponses, il reste (« Commentaire supprimé »).
 */
export function grouperEnFils(commentaires: CommentaireIdee[]): FilCommentaires[] {
  const reponses = new Map<string, CommentaireIdee[]>();
  for (const commentaire of commentaires) {
    if (!commentaire.parent_id || commentaire.supprime) continue;
    reponses.set(commentaire.parent_id, [...(reponses.get(commentaire.parent_id) ?? []), commentaire]);
  }
  return commentaires
    .filter((commentaire) => !commentaire.parent_id)
    .map((commentaire) => ({ commentaire, reponses: reponses.get(commentaire.id) ?? [] }))
    .filter((fil) => !fil.commentaire.supprime || fil.reponses.length > 0);
}

/** Message d'erreur (clé i18next) pour une action sur un commentaire. */
export function cleErreurCommentaire(erreur: unknown): string {
  const { code, message } = (erreur ?? {}) as { code?: string; message?: string };
  if (code === "P0001" && message?.includes("Trop")) return "idees.commentaires.erreurs.tropDeCommentaires";
  if (code === "23514") return "idees.commentaires.erreurs.vide";
  return "idees.erreurs.generique";
}
