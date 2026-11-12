import React from "react";
import { useTranslation } from "react-i18next";
import { Loader2, MonitorPlay } from "lucide-react";

// Tailles de rendu des deux aperçus : le site est affiché à cette taille puis réduit, comme une vraie capture.
const BUREAU = { largeur: 1280, hauteur: 800 };
const MOBILE = { largeur: 390, hauteur: 844 };

/** Temps pendant lequel l'aperçu doit rester visible avant de se charger : un défilement rapide ne charge rien. */
const ATTENTE_VISIBLE_MS = 350;
/** Au-delà, une iframe qui ne répond pas libère la file d'attente (le chargement continue en arrière-plan). */
const DELAI_MAX_IFRAME_MS = 8000;

/**
 * File d'attente commune à tous les aperçus : un seul site se charge à la fois.
 * Chaque aperçu y entre quand il devient visible et en sort quand ses deux iframes ont fini.
 */
let fileAttente: Promise<void> = Promise.resolve();
const attendreSonTour = () => {
  let liberer!: () => void;
  const fin = new Promise<void>((resoudre) => (liberer = resoudre));
  const tour = fileAttente.then(() => liberer);
  fileAttente = tour.then(() => fin);
  return tour;
};

/** Vrai à partir de `md` (768 px) : sur téléphone, aucun aperçu n'est chargé. */
const useGrandEcran = () => {
  const requete = "(min-width: 768px)";
  const [grand, setGrand] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia(requete).matches
  );
  React.useEffect(() => {
    const media = window.matchMedia(requete);
    const changer = () => setGrand(media.matches);
    media.addEventListener("change", changer);
    return () => media.removeEventListener("change", changer);
  }, []);
  return grand;
};

/** Économie de données ou connexion lente : l'aperçu attend un clic. */
const connexionEconome = () => {
  const connexion = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(connexion?.saveData) || /(^|-)2g$/.test(connexion?.effectiveType ?? "");
};

/** Iframe réduite à la largeur de son cadre (le site est rendu à `largeur` × `hauteur`). */
const IframeReduite = ({
  url,
  titre,
  largeur,
  hauteur,
  charger,
  onFini,
}: {
  url: string;
  titre: string;
  largeur: number;
  hauteur: number;
  charger: boolean;
  onFini: () => void;
}) => {
  const { t } = useTranslation();
  const cadre = React.useRef<HTMLDivElement>(null);
  const [echelle, setEchelle] = React.useState(0);
  const [chargee, setChargee] = React.useState(false);
  const fini = React.useRef(onFini);
  fini.current = onFini;

  React.useEffect(() => {
    const element = cadre.current;
    if (!element) return;
    const mesurer = () => setEchelle(element.clientWidth / largeur);
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(element);
    return () => observateur.disconnect();
  }, [largeur]);

  // Une iframe qui tarde ne bloque pas les aperçus suivants.
  React.useEffect(() => {
    if (!charger || chargee) return;
    const minuteur = window.setTimeout(() => fini.current(), DELAI_MAX_IFRAME_MS);
    return () => window.clearTimeout(minuteur);
  }, [charger, chargee]);

  return (
    <div
      ref={cadre}
      className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900"
      style={{ aspectRatio: `${largeur} / ${hauteur}` }}
    >
      {!chargee && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-neutral-100 to-neutral-200/80 text-neutral-400 dark:from-neutral-900 dark:to-neutral-800/80 dark:text-neutral-500">
          <span className="absolute inset-0 animate-pulse bg-white/30 dark:bg-white/5" />
          {charger && <Loader2 className="relative h-6 w-6 animate-spin" aria-hidden="true" />}
          {charger && largeur > 600 && (
            <span className="relative text-xs font-medium">{t("timeline.previewLoading")}</span>
          )}
        </div>
      )}
      {charger && echelle > 0 && (
        <iframe
          src={url}
          title={titre}
          tabIndex={-1}
          aria-hidden="true"
          // Aperçu seulement : ni clic, ni défilement, ni focus dans le site affiché.
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => {
            setChargee(true);
            fini.current();
          }}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: largeur,
            height: hauteur,
            transform: `scale(${echelle})`,
            opacity: chargee ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}
    </div>
  );
};

/**
 * Aperçu en direct d'un site : un écran d'ordinateur et, posé devant, un téléphone. Sur grand écran seulement.
 * Chargement : quand l'aperçu reste visible un instant, à son tour dans la file commune, l'ordinateur puis le téléphone.
 */
const ApercuSite = ({ url, nom }: { url: string; nom: string }) => {
  const { t } = useTranslation();
  const grandEcran = useGrandEcran();
  const zone = React.useRef<HTMLDivElement>(null);
  const [econome] = React.useState(() => typeof navigator !== "undefined" && connexionEconome());
  const [demande, setDemande] = React.useState(false); // visible assez longtemps, ou clic en économie de données
  const [etape, setEtape] = React.useState<"attente" | "bureau" | "mobile" | "fini">("attente");
  const liberer = React.useRef<(() => void) | null>(null);

  // Visible au moins à 30 % pendant ATTENTE_VISIBLE_MS.
  React.useEffect(() => {
    const element = zone.current;
    if (!grandEcran || econome || demande || !element) return;
    let minuteur = 0;
    const observateur = new IntersectionObserver(
      ([entree]) => {
        window.clearTimeout(minuteur);
        if (entree.isIntersecting) minuteur = window.setTimeout(() => setDemande(true), ATTENTE_VISIBLE_MS);
      },
      { threshold: 0.3 }
    );
    observateur.observe(element);
    return () => {
      window.clearTimeout(minuteur);
      observateur.disconnect();
    };
  }, [grandEcran, econome, demande]);

  // Entrée dans la file commune ; sortie à la fin (ou si le composant disparaît).
  React.useEffect(() => {
    if (!demande) return;
    let actif = true;
    attendreSonTour().then((liberation) => {
      if (!actif) return liberation();
      liberer.current = liberation;
      setEtape("bureau");
    });
    return () => {
      actif = false;
      liberer.current?.();
      liberer.current = null;
    };
  }, [demande]);

  const bureauFini = React.useCallback(() => setEtape((e) => (e === "bureau" ? "mobile" : e)), []);
  const mobileFini = React.useCallback(() => {
    setEtape("fini");
    liberer.current?.();
    liberer.current = null;
  }, []);

  if (!grandEcran) return null;

  const adresse = url.replace(/^https?:\/\//, "");
  const chargerBureau = etape !== "attente";
  const chargerMobile = etape === "mobile" || etape === "fini";

  return (
    <div ref={zone} className="group relative pb-10 pr-16 lg:pr-24">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("timeline.openSite", { name: nom })}
        className="absolute inset-0 z-10 rounded-xl"
      />

      {/* Ordinateur */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl transition-transform duration-300 group-hover:-translate-y-1 dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center gap-2 border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 flex-1 truncate rounded-md bg-neutral-100 px-3 py-0.5 text-left text-xs text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400" dir="ltr">
            {adresse}
          </span>
        </div>
        <IframeReduite url={url} titre={`${nom} (ordinateur)`} {...BUREAU} charger={chargerBureau} onFini={bureauFini} />
      </div>

      {/* Téléphone, posé devant en bas à droite */}
      <div className="absolute bottom-0 right-0 w-[22%] min-w-[120px] max-w-[170px] rounded-[1.6rem] border-[5px] border-neutral-900 bg-neutral-900 shadow-2xl transition-transform duration-300 group-hover:-translate-y-2 dark:border-neutral-700">
        <div className="overflow-hidden rounded-[1.25rem]">
          <IframeReduite url={url} titre={`${nom} (téléphone)`} {...MOBILE} charger={chargerMobile} onFini={mobileFini} />
        </div>
      </div>

      {/* Économie de données : rien ne se charge sans clic */}
      {econome && !demande && (
        <button
          type="button"
          onClick={() => setDemande(true)}
          className="absolute left-1/2 top-[40%] z-20 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-lg ring-1 ring-black/5 transition hover:bg-neutral-50 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
        >
          <MonitorPlay className="h-4 w-4" aria-hidden="true" />
          {t("timeline.previewShow")}
        </button>
      )}
    </div>
  );
};

export default ApercuSite;
