import React from "react";
import { useTranslation, Trans } from "react-i18next";
import AvatarCircles from "@/components/ui/avatar-circles";
import { Timeline } from "@/components/ui/timeline";
import { AnimatedTooltip } from "./ui/animates-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

interface Collaborator {
  id: number;
  name: string;
  designation: string;
  image: string;
  profileUrl: string;
  founder?: boolean;
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
              )
          );
          setCollaborators([...founders, ...formattedCollaborators]);
        } else {
          console.error("Failed to fetch collaborators", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching collaborators:", error);
      }
    };

    fetchCollaborators();
  }, []);

  const timelineData = [
    {
      title: "jan 2025",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            <Trans
              i18nKey="timeline.apiPlatform"
              components={[
                <a
                  href="https://data-dz.com/api"
                  className="underline text-primary dark:text-accent"
                />,
                <b></b>,
              ]}
            />
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <video
              src="https://github.com/newalgeria/new-algeria/releases/download/0.0.0/data-dz.mp4"
              autoPlay
              loop
              muted
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow"
            />
          </div>
        </div>
      ),
    },
    {
      title: "dec 2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            <Trans
              i18nKey="timeline.builtAndLaunched"
              components={[
                <a
                  href="https://data-dz.com"
                  className="underline text-primary dark:text-accent"
                />,
              ]}
            />
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
            <img
              src="/assets/img/data-dz-1.png"
              alt="startup template"
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow"
            />
            <video
              src="https://github.com/newalgeria/new-algeria/releases/download/0.0.0/data-dz.mp4"
              autoPlay
              loop
              muted
              className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full shadow"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20" id="developers">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          <Trans
            i18nKey="timeline.digitalExcellence"
            components={[<span className="text-primary dark:text-accent" />]}
          />
        </h2>
        <div className="max-w-2xl mx-auto flex flex-col justify-center items-center gap-2">
          {/* Nous */}
          <div className="flex items-center gap-2">
            <AnimatedTooltip items={collaborators} />
          </div>
          {/* Rejoignez l'équipe Github ! */}
          <div className="flex items-center gap-2">
            <a href="https://github.com/new-algeria" target="_blank">
              <button className="bg-black text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 py-2 px-4 rounded-lg">
                <span>
                  <FontAwesomeIcon icon={faGithub} /> {""}
                  {t("timeline.joinTeam")}
                </span>
              </button>
            </a>
          </div>
        </div>
        <Timeline data={timelineData} />
      </div>
    </section>
  );
};

export default TimelineSection;
