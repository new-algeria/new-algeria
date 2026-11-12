import React from "react";
import { useTranslation, Trans } from "react-i18next";
import AvatarCircles from "@/components/ui/avatar-circles";
import { Timeline } from "@/components/ui/timeline";
import { AnimatedTooltip } from "./ui/animates-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import JoinUsBtn from "./JoinUsBtn";
import ApercuSite from "./ApercuSite";

interface Collaborator {
  id: number;
  name: string;
  designation: string;
  image: string;
  profileUrl: string;
  founder?: boolean;
  specialEmoji?: string;
}

const TimelineSection = () => {
  const { t } = useTranslation();
  const founders: Collaborator[] = [
    {
      id: 1,
      name: "Prosabd",
      designation: "Founder",
      image: "https://avatars.githubusercontent.com/u/102315258?v=4",
      profileUrl: "https://github.com/prosabd",
      founder: true,
    },
    {
      id: 2,
      name: "Berachem",
      designation: "Founder",
      image: "https://avatars.githubusercontent.com/u/61350744?v=4",
      profileUrl: "https://github.com/Berachem",
      founder: true,
    },
  ];
  const specialCollaborators: Collaborator[] = [
    {
      id: 3,
      name: "Hani",
      designation: "Geomatician",
      image: "https://avatars.githubusercontent.com/u/195878584?v=4",
      profileUrl: "https://github.com/HaniBAHIDJ",
      specialEmoji: "🌍",
    },
  ];

  const [collaborators, setCollaborators] = React.useState<Collaborator[]>([]);

  // Fonction pour récupérer les membres d'une organisation via l'API GitHub
  React.useEffect(() => {
    const fetchCollaborators = async () => {
      const orgName = "new-algeria";
      const token = import.meta.env.VITE_GITHUB_COLLABORATORS_TOKEN;
      const url = `https://api.github.com/orgs/${orgName}/members`;

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          let formattedCollaborators = data.map((member: any) => ({
            id: member.id,
            name: member.login,
            designation: "Member", // Vous pouvez remplacer par des données spécifiques si disponibles
            image: member.avatar_url,
            profileUrl: member.html_url,
          }));

          // on enlève les fondateurs de la liste des collaborateurs
          formattedCollaborators = formattedCollaborators.filter(
            (collaborator: Collaborator) =>
              !founders.find(
                (founder) =>
                  founder.profileUrl.toString().toLowerCase() ===
                  collaborator.profileUrl.toString().toLowerCase()
              ) &&
              !specialCollaborators.find(
                (specialCollaborator) =>
                  specialCollaborator.profileUrl.toString().toLowerCase() ===
                  collaborator.profileUrl.toString().toLowerCase()
              )
          );
          setCollaborators([
            ...founders,
            ...specialCollaborators,
            ...formattedCollaborators,
          ]);
        } else {
          console.error("Failed to fetch collaborators", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching collaborators:", error);
      }
    };

    fetchCollaborators();
  }, []);

  // Même logo et même nom que dans la section « Projets » (teinte violette pour l'API, bleue pour DjazAI).
  const logoProjet = (teinte: string, nom: React.ReactNode, alt: string) => (
    <span className="dz-timeline-logo">
      <img src="/assets/img/data-dz-logo.png" alt={alt} className={`dz-project-logo-img ${teinte}`} />
      <span className="dz-project-name font-display">{nom}</span>
    </span>
  );

  const lienTexte = (href: string) => [
    <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-primary dark:text-accent" />,
    <b></b>,
  ];

  const realisations = [
    {
      title: "nov 2026",
      url: "https://www.data-dz.com/djazai",
      nom: "DjazAI",
      cle: "timeline.djazai",
      logo: logoProjet("dz-logo-blue", <>Djaz<span className="text-[#2f80ed]">AI</span></>, "Logo DjazAI"),
    },
    {
      title: "jan 2025",
      url: "https://www.data-dz.com/api",
      nom: "data-dz/api",
      cle: "timeline.apiPlatform",
      logo: logoProjet(
        "dz-logo-violet",
        <>data<span className="text-[#10b981]">-dz</span><span className="text-[#8b5cf6]">/api</span></>,
        "Logo data-dz/api"
      ),
    },
    {
      title: "dec 2024",
      url: "https://www.data-dz.com",
      nom: "data-dz",
      cle: "timeline.builtAndLaunched",
      logo: logoProjet("", <>data<span className="text-[#10b981]">-dz</span></>, "Logo data-dz"),
    },
  ];

  const timelineData = realisations.map((realisation) => ({
    title: realisation.title,
    logo: realisation.logo,
    content: (
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal md:mb-8">
          <Trans i18nKey={realisation.cle} components={lienTexte(realisation.url)} />
        </p>
        {/* Aperçu en direct, ordinateur et téléphone : sur grand écran seulement */}
        <ApercuSite url={realisation.url} nom={realisation.nom} />
      </div>
    ),
  }));

  return (
    <section className="py-24" id="developers">
      <div className="container">
        <h2 className="mb-section-title font-display mb-10 text-center">
          <Trans
            i18nKey="timeline.digitalExcellence"
            components={[<span className="mb-highlight" />]}
          />
        </h2>
        <div className="max-w-2xl mx-auto flex flex-col justify-center items-center gap-2">
          {/* Nous */}
          <div className="flex items-center gap-2">
            <AnimatedTooltip items={collaborators} />
          </div>
          {/* Rejoignez l'équipe Github ! */}
          <div className="flex items-center gap-2 mt-4">
            <JoinUsBtn />
          </div>
        </div>
        <Timeline data={timelineData} />
      </div>
    </section>
  );
};

export default TimelineSection;
