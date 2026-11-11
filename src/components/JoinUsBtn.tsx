import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faXTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Mail, PenLine, CheckCircle2, Loader2, Users } from "lucide-react";
import { Octokit } from "@octokit/core";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type JoinUsBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  [key: `data-${string}`]: string | undefined;
};

type InvitationStatus = "idle" | "sending" | "sent" | "error";

const JoinUsBtn = ({ className, children, ...buttonProps }: JoinUsBtnProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<InvitationStatus>("idle");

  const handleJoinOrganization = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const octokit = new Octokit({
        auth: import.meta.env.VITE_GITHUB_COLLABORATORS_TOKEN,
      });

      await octokit.request("POST /orgs/{org}/invitations", {
        org: "new-algeria",
        email: email,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      setStatus("sent");
    } catch (error) {
      console.error("Error sending invitation:", error);
      setStatus("error");
    }
  };

  const mailtoLink = `mailto:admin@newalgeria.org?subject=${encodeURIComponent(
    t("joinUs.emailSubject")
  )}&body=${encodeURIComponent(t("joinUs.emailBody"))}`;

  const socials = [
    { href: "https://github.com/new-algeria", icon: faGithub, label: "GitHub" },
    { href: "https://x.com/newalgeria_org", icon: faXTwitter, label: "X" },
    {
      href: "https://www.linkedin.com/company/106182021",
      icon: faLinkedin,
      label: "LinkedIn",
    },
  ];

  return (
    <>
      <button
        type="button"
        className={
          className ??
          "bg-[#0d8a59] text-white hover:bg-[#0b774d] py-2.5 px-6 rounded-full shadow-[0_8px_24px_-8px_rgba(13,138,89,0.6)] transition-transform hover:-translate-y-0.5"
        }
        onClick={() => setIsModalOpen(true)}
        {...buttonProps}
      >
        {children ?? <>✨ {t("joinUs.joinUs")}</>}
      </button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="dz-join w-[calc(100%-2rem)] max-w-xl gap-0 overflow-hidden rounded-[1.75rem] border-0 p-0 sm:rounded-[1.75rem]">
          <div className="dz-join-header">
            <span className="dz-join-flagbar" aria-hidden="true" />
            <span className="dz-join-dots" aria-hidden="true" />
            <span className="dz-join-icon" aria-hidden="true">
              <Users />
            </span>
            <DialogTitle className="dz-join-title font-display">
              {t("joinUs.modalTitle")}
            </DialogTitle>
            <DialogDescription className="dz-join-subtitle">
              {t("joinUs.modalSubtitle")}
            </DialogDescription>
          </div>

          <div className="dz-join-body">
            <p className="dz-join-intro">
              {t("joinUs.motivations")} {t("joinUs.motivations2")}
            </p>

            {/* 1. Rejoindre l'organisation GitHub */}
            <section className="dz-join-card">
              <span className="dz-join-step">1</span>
              <div className="dz-join-card-body">
                <h3 className="dz-join-card-title">
                  <FontAwesomeIcon icon={faGithub} /> {t("joinUs.joinGithub")}
                </h3>
                <p className="dz-join-card-desc">{t("joinUs.githubDescription")}</p>
                {status === "sent" ? (
                  <p className="dz-join-success">
                    <CheckCircle2 aria-hidden="true" />
                    {t("joinUs.invitationSent")}
                  </p>
                ) : (
                  <form className="dz-join-form" onSubmit={handleJoinOrganization}>
                    <label className="dz-join-input">
                      <Mail aria-hidden="true" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder={t("joinUs.emailPlaceholder")}
                        aria-label={t("joinUs.emailPlaceholder")}
                      />
                    </label>
                    <button
                      type="submit"
                      className="dz-btn dz-btn-primary dz-join-submit"
                      disabled={!email || status === "sending"}
                    >
                      {status === "sending" && (
                        <Loader2 className="animate-spin" aria-hidden="true" />
                      )}
                      {t("joinUs.join")}
                    </button>
                  </form>
                )}
                {status === "error" && (
                  <p className="dz-join-error">{t("joinUs.invitationFailure")}</p>
                )}
              </div>
            </section>

            {/* 2. Nous écrire */}
            <section className="dz-join-card">
              <span className="dz-join-step">2</span>
              <div className="dz-join-card-body">
                <h3 className="dz-join-card-title">{t("joinUs.writeUs")}</h3>
                <p className="dz-join-card-desc">{t("joinUs.writeDescription")}</p>
                <a href={mailtoLink} className="dz-btn dz-btn-soft">
                  <PenLine aria-hidden="true" />
                  {t("joinUs.writeToUs")}
                </a>
              </div>
            </section>

            {/* 3. Nous suivre */}
            <section className="dz-join-card">
              <span className="dz-join-step">3</span>
              <div className="dz-join-card-body">
                <h3 className="dz-join-card-title">{t("joinUs.connectWithUs")}</h3>
                <p className="dz-join-card-desc">{t("joinUs.followDescription")}</p>
                <div className="dz-join-socials">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="dz-join-social"
                    >
                      <FontAwesomeIcon icon={social.icon} />
                    </a>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JoinUsBtn;
