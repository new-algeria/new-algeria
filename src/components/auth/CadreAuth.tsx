import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { PageInterne } from "@/components/PageInterne";

interface CadreAuthProps {
  titre: string;
  sousTitre?: string;
  children: ReactNode;
  pied?: ReactNode;
}

/** Mise en page commune des pages de connexion, d'inscription et de mot de passe. */
export const CadreAuth = ({ titre, sousTitre, children, pied }: CadreAuthProps) => (
  <PageInterne titre={titre}>
    <div className="relative flex min-h-[calc(100vh-76px)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 start-[-6rem] h-80 w-80 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-600/15" />
        <div className="absolute bottom-0 end-[-4rem] h-72 w-72 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-500/10" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-2xl border border-gray-200/80 bg-white/95 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur sm:p-8 dark:border-white/10 dark:bg-gray-900/95"
      >
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{titre}</h1>
        {sousTitre && <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{sousTitre}</p>}
        <div className="mt-6">{children}</div>
        {pied && <div className="mt-6 border-t border-gray-100 pt-5 text-center text-sm dark:border-white/10">{pied}</div>}
      </motion.div>
    </div>
  </PageInterne>
);
