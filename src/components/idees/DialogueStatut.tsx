import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LONGUEUR_MAX_DESCRIPTION, STATUTS_IDEE, type Idee, type StatutIdee } from "@/lib/idees";
import { cn } from "@/lib/utils";
import { PASTILLE_STATUT } from "./elements";

interface DialogueStatutProps {
  idee: Idee | null;
  onFermer: () => void;
  envoi: boolean;
  onEnvoyer: (statut: StatutIdee, reponse: string) => void;
}

/** Équipe : faire avancer une idée et laisser un mot à la communauté. */
export const DialogueStatut = ({ idee, onFermer, envoi, onEnvoyer }: DialogueStatutProps) => {
  const { t } = useTranslation();
  const [statut, setStatut] = useState<StatutIdee>("nouvelle");
  const [reponse, setReponse] = useState("");

  useEffect(() => {
    if (!idee) return;
    setStatut(idee.statut);
    setReponse(idee.reponse_equipe ?? "");
  }, [idee]);

  return (
    <Dialog open={Boolean(idee)} onOpenChange={(ouvert) => !ouvert && onFermer()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("idees.equipe.titre")}</DialogTitle>
          <DialogDescription dir="auto" className="line-clamp-2">
            {idee?.titre}
          </DialogDescription>
        </DialogHeader>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">{t("idees.equipe.statut")}</legend>
          <div className="grid grid-cols-2 gap-2">
            {STATUTS_IDEE.map((code) => (
              <button
                key={code}
                type="button"
                aria-pressed={statut === code}
                onClick={() => setStatut(code)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-2 text-start text-sm transition-colors",
                  statut === code ? "border-[#0d8a59] bg-[#e1f3ea] font-semibold dark:bg-emerald-400/10" : "border-gray-200 dark:border-white/10"
                )}
              >
                <span className={cn("h-2 w-2 shrink-0 rounded-full", PASTILLE_STATUT[code])} aria-hidden="true" />
                {t(`idees.statuts.${code}`)}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="space-y-2">
          <Label htmlFor="reponse-equipe">{t("idees.equipe.reponse")}</Label>
          <Textarea
            id="reponse-equipe"
            value={reponse}
            onChange={(evenement) => setReponse(evenement.target.value)}
            placeholder={t("idees.equipe.exempleReponse")}
            rows={3}
            maxLength={LONGUEUR_MAX_DESCRIPTION}
            dir="auto"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={onFermer}>
            {t("idees.dialogue.annuler")}
          </Button>
          <Button onClick={() => onEnvoyer(statut, reponse)} disabled={envoi} className="gap-2 bg-[#0d8a59] text-white hover:bg-[#0b774d]">
            {envoi && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {t("idees.dialogue.enregistrer")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
