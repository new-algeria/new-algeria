import { Trans } from "react-i18next";
import { routes } from "@/lib/routes";

const classeLien = "font-medium text-emerald-700 underline underline-offset-2 hover:no-underline dark:text-emerald-400";

/**
 * « En créant un compte, vous acceptez nos conditions d'utilisation et nos règles de confidentialité. »
 * Le compte est commun avec data-dz : on renvoie vers ses pages légales.
 */
export const AccordConditions = () => (
  <p className="text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400">
    <Trans
      i18nKey="legal.acceptation"
      components={{
        conditions: <a href={routes.conditions} target="_blank" rel="noopener noreferrer" className={classeLien} />,
        confidentialite: <a href={routes.confidentialite} target="_blank" rel="noopener noreferrer" className={classeLien} />,
      }}
    />
  </p>
);
