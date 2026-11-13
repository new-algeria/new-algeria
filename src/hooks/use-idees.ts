import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAuth } from "@/contexte/ContexteAuth";
import { BoiteIdeesIndisponible, chargerIdees, chargerMesVotes, cleErreurIdee, estModerateur, voterIdee, type Idee } from "@/lib/idees";
import { avecSuite, routes } from "@/lib/routes";

/** Toutes les idées visibles. Clé React Query : ["idees"]. */
export const useIdees = () =>
  useQuery({
    queryKey: ["idees"],
    queryFn: chargerIdees,
    staleTime: 30_000,
    // Migration absente : inutile d'insister.
    retry: (essai, erreur) => !(erreur instanceof BoiteIdeesIndisponible) && essai < 2,
  });

/** Idées pour lesquelles le membre a voté. Clé : ["idees-votes", uid]. */
export const useMesVotesIdees = () => {
  const { utilisateur } = useAuth();
  return useQuery({
    queryKey: ["idees-votes", utilisateur?.id],
    queryFn: chargerMesVotes,
    enabled: Boolean(utilisateur),
  });
};

/** L'équipe (modérateurs, admins) voit les actions de modération. Simple confort : la base décide. */
export const useEstModerateur = () => {
  const { utilisateur } = useAuth();
  return useQuery({
    queryKey: ["est-moderateur", utilisateur?.id],
    queryFn: estModerateur,
    enabled: Boolean(utilisateur),
    staleTime: 5 * 60_000,
  });
};

/**
 * Vote « pour » une idée, avec mise à jour immédiate du compteur puis retour en arrière en cas d'erreur.
 * Visiteur : envoyé vers la connexion, il revient ensuite sur la même page.
 */
export const useVoterIdee = () => {
  const { t } = useTranslation();
  const { utilisateur } = useAuth();
  const client = useQueryClient();
  const naviguer = useNavigate();
  const emplacement = useLocation();
  const cleVotes = ["idees-votes", utilisateur?.id];

  const mutation = useMutation({
    mutationFn: ({ idee, pour }: { idee: Idee; pour: boolean }) => voterIdee(idee.id, pour),
    onMutate: async ({ idee, pour }) => {
      await Promise.all([client.cancelQueries({ queryKey: ["idees"] }), client.cancelQueries({ queryKey: cleVotes })]);
      const idees = client.getQueryData<Idee[]>(["idees"]);
      const votes = client.getQueryData<Set<string>>(cleVotes);
      client.setQueryData<Idee[]>(["idees"], (liste) =>
        liste?.map((element) => (element.id === idee.id ? { ...element, nb_votes: Math.max(0, element.nb_votes + (pour ? 1 : -1)) } : element))
      );
      client.setQueryData<Set<string>>(cleVotes, (actuels) => {
        const suivants = new Set(actuels);
        if (pour) suivants.add(idee.id);
        else suivants.delete(idee.id);
        return suivants;
      });
      return { idees, votes };
    },
    onError: (erreur, _variables, avant) => {
      if (avant) {
        client.setQueryData(["idees"], avant.idees);
        client.setQueryData(cleVotes, avant.votes);
      }
      toast.error(t(cleErreurIdee(erreur)));
    },
  });

  return (idee: Idee, dejaVote: boolean) => {
    if (!utilisateur) {
      naviguer(avecSuite(routes.connexion, `${emplacement.pathname}${emplacement.search}`));
      return;
    }
    if (mutation.isPending) return;
    mutation.mutate({ idee, pour: !dejaVote });
  };
};
