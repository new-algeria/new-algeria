import React from "react";
import { useTranslation } from "react-i18next";

// Tailles de rendu des deux aperçus : le site est affiché à cette taille puis réduit, comme une vraie capture.
const BUREAU = { largeur: 1280, hauteur: 800 };
const MOBILE = { largeur: 390, hauteur: 844 };

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

/** Iframe réduite à la largeur de son cadre (le site est rendu à `largeur` × `hauteur`). */
const IframeReduite = ({
  url,
  titre,
  largeur,
  hauteur,
}: {
  url: string;
  titre: string;
  largeur: number;
  hauteur: number;
}) => {
  const cadre = React.useRef<HTMLDivElement>(null);
  const [echelle, setEchelle] = React.useState(0);
  const [chargee, setChargee] = React.useState(false);

  React.useEffect(() => {
    const element = cadre.current;
    if (!element) return;
    const mesurer = () => setEchelle(element.clientWidth / largeur);
    mesurer();
    const observateur = new ResizeObserver(mesurer);
    observateur.observe(element);
    return () => observateur.disconnect();
  }, [largeur]);

  return (
    <div
      ref={cadre}
      className="relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900"
      style={{ aspectRatio: `${largeur} / ${hauteur}` }}
    >
      {!chargee && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200/70 dark:bg-neutral-800/70" />
      )}
      {echelle > 0 && (
        <iframe
          src={url}
          title={titre}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          // Aperçu seulement : ni clic, ni défilement, ni focus dans le site affiché.
          sandbox="allow-scripts allow-same-origin"
          onLoad={() => setChargee(true)}
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{
            width: largeur,
            height: hauteur,
            transform: `scale(${echelle})`,
            opacity: chargee ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        />
      )}
    </div>
  );
};

/**
 * Aperçu en direct d'un site : un écran d'ordinateur et, posé devant, un téléphone.
 * Affiché seulement sur grand écran ; les iframes ne sont créées qu'à l'approche de la section.
 */
const ApercuSite = ({ url, nom }: { url: string; nom: string }) => {
  const { t } = useTranslation();
  const grandEcran = useGrandEcran();
  const zone = React.useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const element = zone.current;
    if (!grandEcran || !element || visible) return;
    const observateur = new IntersectionObserver(
      ([entree]) => entree.isIntersecting && setVisible(true),
      { rootMargin: "400px 0px" }
    );
    observateur.observe(element);
    return () => observateur.disconnect();
  }, [grandEcran, visible]);

  if (!grandEcran) return null;

  const adresse = url.replace(/^https?:\/\//, "");

  return (
    <a
      ref={zone}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("timeline.openSite", { name: nom })}
      className="group relative block pb-10 pr-16 lg:pr-24"
    >
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
        {visible ? (
          <IframeReduite url={url} titre={`${nom} (ordinateur)`} {...dimensions(BUREAU)} />
        ) : (
          <div className="bg-neutral-100 dark:bg-neutral-900" style={{ aspectRatio: `${BUREAU.largeur} / ${BUREAU.hauteur}` }} />
        )}
      </div>

      {/* Téléphone, posé devant en bas à droite */}
      <div className="absolute bottom-0 right-0 w-[22%] min-w-[120px] max-w-[170px] rounded-[1.6rem] border-[5px] border-neutral-900 bg-neutral-900 shadow-2xl transition-transform duration-300 group-hover:-translate-y-2 dark:border-neutral-700">
        <div className="overflow-hidden rounded-[1.25rem]">
          {visible ? (
            <IframeReduite url={url} titre={`${nom} (téléphone)`} {...dimensions(MOBILE)} />
          ) : (
            <div className="bg-neutral-100 dark:bg-neutral-900" style={{ aspectRatio: `${MOBILE.largeur} / ${MOBILE.hauteur}` }} />
          )}
        </div>
        <span className="absolute left-1/2 top-1.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-neutral-900 dark:bg-neutral-700" />
      </div>
    </a>
  );
};

const dimensions = (taille: { largeur: number; hauteur: number }) => ({
  largeur: taille.largeur,
  hauteur: taille.hauteur,
});

export default ApercuSite;
