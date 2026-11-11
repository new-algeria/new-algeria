import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { Mail, PenLine, CheckCircle2, Loader2, Users, ChevronRight } from "lucide-react";
import { Octokit } from "@octokit/core";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAuth } from "@/contexte/ContexteAuth";
type InvitationStatus = "idle" | "sending" | "sent" | "error";

interface DialogueRejoindreProps {
  ouvert: boolean;
  onOuvertChange: (ouvert: boolean) => void;
}

/** Fenêtre « Rejoignez New Algeria » : invitation dans l'organisation GitHub, ou nous écrire. */
export const DialogueRejoindre = ({ ouvert, onOuvertChange }: DialogueRejoindreProps) => {
  const { t } = useTranslation();
  const { utilisateur } = useAuth();
  const [email, setEmail] = useState("");
  // Membre connecté : son email est déjà rempli (il peut le changer pour celui de son compte GitHub).
  useEffect(() => {
    if (utilisateur?.email) setEmail((actuel) => actuel || utilisateur.email!);
  }, [utilisateur?.email]);
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

  return (
    <Dialog open={ouvert} onOpenChange={onOuvertChange}>
      <DialogContent className="dz-join w-[calc(100%-2rem)] max-w-xl gap-0 overflow-hidden rounded-[1.75rem] border-0 p-0 sm:rounded-[1.75rem]">
        <div className="dz-join-header">
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
          {/* Rejoindre l'organisation GitHub */}
          <section className="dz-join-card">
            <h3 className="dz-join-card-title">
              <FontAwesomeIcon icon={faGithub} /> {t("joinUs.joinGithub")}
            </h3>
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
          </section>

          {/* Nous écrire */}
          <a href={mailtoLink} className="dz-join-card dz-join-write">
            <span className="dz-join-write-icon" aria-hidden="true">
              <PenLine />
            </span>
            <span className="dz-join-write-text">
              <span className="dz-join-card-title">{t("joinUs.writeUs")}</span>
              <span className="dz-join-card-desc">{t("joinUs.writeDescription")}</span>
            </span>
            <ChevronRight className="dz-join-write-arrow" aria-hidden="true" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};
