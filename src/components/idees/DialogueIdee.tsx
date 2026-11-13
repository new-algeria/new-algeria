import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CATEGORIES_IDEE,
  EMOJI_CATEGORIE,
  LONGUEUR_MAX_DESCRIPTION,
  LONGUEUR_MAX_TITRE,
  LONGUEUR_MIN_TITRE,
  type CategorieIdee,
  type ContenuIdee,
} from "@/lib/idees";
import { cn } from "@/lib/utils";

interface DialogueIdeeProps {
  ouvert: boolean;
  onOuvertChange: (ouvert: boolean) => void;
  /** Idée à modifier ; sinon, nouvelle idée. */
  initial?: ContenuIdee;
  envoi: boolean;
  onEnvoyer: (contenu: ContenuIdee) => void;
}

/** Proposer ou modifier une idée : un titre, une catégorie, quelques lignes. Rien de plus. */
export const DialogueIdee = ({ ouvert, onOuvertChange, initial, envoi, onEnvoyer }: DialogueIdeeProps) => {
  const { t } = useTranslation();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState<CategorieIdee>("autre");

  useEffect(() => {
    if (!ouvert) return;
    setTitre(initial?.titre ?? "");
    setDescription(initial?.description ?? "");
    setCategorie(initial?.categorie ?? "autre");
  }, [ouvert, initial]);

  const longueurTitre = titre.trim().length;
  const valide = longueurTitre >= LONGUEUR_MIN_TITRE && longueurTitre <= LONGUEUR_MAX_TITRE && description.length <= LONGUEUR_MAX_DESCRIPTION;

  const envoyer = (evenement: FormEvent) => {
    evenement.preventDefault();
    if (valide && !envoi) onEnvoyer({ titre: titre.trim(), description: description.trim(), categorie });
  };

  return (
    <Dialog open={ouvert} onOpenChange={onOuvertChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{initial ? t("idees.dialogue.titreModifier") : t("idees.dialogue.titre")}</DialogTitle>
          <DialogDescription>{t("idees.dialogue.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={envoyer} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="titre-idee">{t("idees.dialogue.champTitre")}</Label>
              <span className={cn("text-xs tabular-nums", longueurTitre > LONGUEUR_MAX_TITRE ? "text-red-600" : "text-gray-500")}>
                {longueurTitre} / {LONGUEUR_MAX_TITRE}
              </span>
            </div>
            <Input
              id="titre-idee"
              value={titre}
              onChange={(evenement) => setTitre(evenement.target.value)}
              placeholder={t("idees.dialogue.exempleTitre")}
              maxLength={LONGUEUR_MAX_TITRE + 20}
              autoFocus
              dir="auto"
              className="text-base"
            />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">{t("idees.dialogue.champCategorie")}</legend>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES_IDEE.map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={categorie === code}
                  onClick={() => setCategorie(code)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                    categorie === code
                      ? "border-[#0d8a59] bg-[#0d8a59] text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#0d8a59]/50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                  )}
                >
                  <span aria-hidden="true">{EMOJI_CATEGORIE[code]}</span>
                  {t(`idees.categories.${code}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <Label htmlFor="description-idee">
                {t("idees.dialogue.champDescription")} <span className="font-normal text-gray-500">{t("idees.dialogue.facultatif")}</span>
              </Label>
              <span className={cn("text-xs tabular-nums", description.length > LONGUEUR_MAX_DESCRIPTION ? "text-red-600" : "text-gray-500")}>
                {description.length} / {LONGUEUR_MAX_DESCRIPTION}
              </span>
            </div>
            <Textarea
              id="description-idee"
              value={description}
              onChange={(evenement) => setDescription(evenement.target.value)}
              placeholder={t("idees.dialogue.exempleDescription")}
              rows={4}
              dir="auto"
              className="text-base"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="ghost" onClick={() => onOuvertChange(false)}>
              {t("idees.dialogue.annuler")}
            </Button>
            <Button type="submit" disabled={!valide || envoi} className="gap-2 bg-[#0d8a59] text-white hover:bg-[#0b774d]">
              {envoi && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {initial ? t("idees.dialogue.enregistrer") : t("idees.dialogue.publier")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
