// Boîte à idées : tables `idees` et `idees_votes` (migration 20261113000020_boite_idees.sql du dépôt data-dz,
// même projet Supabase). Le site n'écrit que le contenu d'une idée et les votes ; statut, réponse de l'équipe
// et masquage passent par les fonctions rpc réservées aux modérateurs.
import { supabase } from "./supabase";
import type { Profil } from "./profils";

export const CATEGORIES_IDEE = [
  "sante",
  "education",
  "transport",
  "economie",
  "environnement",
  "administration",
  "culture",
  "numerique",
  "autre",
] as const;
export type CategorieIdee = (typeof CATEGORIES_IDEE)[number];

/** Dans l'ordre de la vie d'une idée ; « écartée » à part. */
export const STATUTS_IDEE = ["nouvelle", "en_etude", "retenue", "en_cours", "realisee", "ecartee"] as const;
export type StatutIdee = (typeof STATUTS_IDEE)[number];

export const EMOJI_CATEGORIE: Record<CategorieIdee, string> = {
  sante: "🏥",
  education: "🎓",
  transport: "🚌",
  economie: "💼",
  environnement: "🌿",
  administration: "🏛️",
  culture: "🎭",
  numerique: "💻",
  autre: "✨",
};

// Mêmes limites que les contraintes de la table.
export const LONGUEUR_MIN_TITRE = 5;
export const LONGUEUR_MAX_TITRE = 120;
export const LONGUEUR_MAX_DESCRIPTION = 1000;

export interface Idee {
  id: string;
  titre: string;
  description: string;
  categorie: CategorieIdee;
  statut: StatutIdee;
  reponse_equipe: string | null;
  masquee: boolean;
  nb_votes: number;
  cree_le: string;
  auteur_id: string | null;
  auteur: Pick<Profil, "pseudo" | "nom_affiche" | "avatar_url"> | null;
}

export type ContenuIdee = Pick<Idee, "titre" | "description" | "categorie">;
export type TriIdees = "populaires" | "recentes";

const COLONNES =
  "id, titre, description, categorie, statut, reponse_equipe, masquee, nb_votes, cree_le, auteur_id, auteur:profils!idees_auteur_id_fkey ( pseudo, nom_affiche, avatar_url )";

/** Erreur levée quand la migration n'est pas encore appliquée (table inconnue). */
export class BoiteIdeesIndisponible extends Error {}

const tableAbsente = (erreur: { code?: string } | null) =>
  erreur?.code === "42P01" || erreur?.code === "PGRST205" || erreur?.code === "PGRST200";

/** Toutes les idées visibles (la RLS cache les idées masquées, sauf à leur auteur et à l'équipe). */
export async function chargerIdees(): Promise<Idee[]> {
  const { data, error } = await supabase
    .from("idees")
    .select(COLONNES)
    .order("nb_votes", { ascending: false })
    .order("cree_le", { ascending: false })
    .limit(500);
  if (tableAbsente(error)) throw new BoiteIdeesIndisponible();
  if (error) throw error;
  return (data ?? []) as unknown as Idee[];
}

/** Identifiants des idées pour lesquelles le membre a voté. */
export async function chargerMesVotes(): Promise<Set<string>> {
  const { data, error } = await supabase.from("idees_votes").select("idee_id");
  if (tableAbsente(error)) return new Set();
  if (error) throw error;
  return new Set((data ?? []).map((ligne) => ligne.idee_id as string));
}

export async function voterIdee(ideeId: string, pour: boolean) {
  const { error } = pour
    ? await supabase.from("idees_votes").insert({ idee_id: ideeId })
    : await supabase.from("idees_votes").delete().eq("idee_id", ideeId);
  // Double clic : le vote existe déjà, l'état voulu est atteint.
  if (error && error.code !== "23505") throw error;
}

export async function proposerIdee(contenu: ContenuIdee) {
  const { error } = await supabase.from("idees").insert(contenu);
  if (error) throw error;
}

export async function modifierIdee(id: string, contenu: ContenuIdee) {
  const { error } = await supabase.from("idees").update(contenu).eq("id", id);
  if (error) throw error;
}

export async function supprimerIdee(id: string) {
  const { error } = await supabase.from("idees").delete().eq("id", id);
  if (error) throw error;
}

export async function changerStatutIdee(id: string, statut: StatutIdee, reponse: string) {
  const { error } = await supabase.rpc("changer_statut_idee", { p_idee_id: id, p_statut: statut, p_reponse: reponse });
  if (error) throw error;
}

export async function masquerIdee(id: string, masquer: boolean) {
  const { error } = await supabase.rpc("masquer_idee", { p_idee_id: id, p_masquer: masquer });
  if (error) throw error;
}

export async function estModerateur(): Promise<boolean> {
  const { data, error } = await supabase.rpc("est_moderateur");
  if (error) return false;
  return data === true;
}

/** Tri fait dans le navigateur : toutes les idées sont chargées. */
export function trierIdees(idees: Idee[], tri: TriIdees): Idee[] {
  const parDate = (a: Idee, b: Idee) => b.cree_le.localeCompare(a.cree_le);
  return [...idees].sort(tri === "recentes" ? parDate : (a, b) => b.nb_votes - a.nb_votes || parDate(a, b));
}

/** Texte de recherche sans casse ni accents. */
export const normaliserRecherche = (texte: string) =>
  texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export function filtrerIdees(
  idees: Idee[],
  { categorie, statut, terme }: { categorie: CategorieIdee | null; statut: StatutIdee | null; terme: string }
): Idee[] {
  const recherche = normaliserRecherche(terme);
  return idees.filter(
    (idee) =>
      (!categorie || idee.categorie === categorie) &&
      (!statut || idee.statut === statut) &&
      (!recherche || normaliserRecherche(`${idee.titre} ${idee.description}`).includes(recherche))
  );
}

/** Message d'erreur (clé i18next `idees.erreurs.*`) pour une action sur les idées. */
export function cleErreurIdee(erreur: unknown): string {
  const { code, message } = (erreur ?? {}) as { code?: string; message?: string };
  if (code === "P0001" && message?.includes("Trop")) return "idees.erreurs.tropDIdees";
  if (code === "23514") return "idees.erreurs.contenuInvalide";
  if (code === "42501") return "idees.erreurs.nonAutorise";
  return "idees.erreurs.generique";
}
