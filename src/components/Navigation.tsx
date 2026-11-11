import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import JoinUsBtn from "./JoinUsBtn";
import { MenuCompte } from "./auth/MenuCompte";
import { routes } from "@/lib/routes";
import { useAuth } from "@/contexte/ContexteAuth";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

interface NavigationProps {
  /** Barre toujours opaque (pages hors accueil, sans le hero derrière). */
  solide?: boolean;
}

const Navigation = ({ solide = false }: NavigationProps) => {
  // L'animation d'entrée n'est jouée que sur l'accueil (useEntrance dans le hero) : ailleurs, la barre s'affiche directement.
  const entree = (debut: string) => (solide ? {} : { "data-enter": "drop", "data-enter-at": debut });

  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { session } = useAuth();

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 24); // Vérifie si la page est défilée
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const menuItems = [
    { key: "services", label: t("nav.services") },
    { key: "projets", label: t("nav.projects") },
    { key: "developers", label: t("nav.developers") },
    { key: "contact", label: t("nav.contact") },
  ];

  return (
    <nav className={`mb-nav ${solide || hasScrolled || isOpen ? "is-scrolled" : ""}`}>
      <a href={routes.accueil} className="mb-logo font-display" {...entree("0")}>
        <img src="/assets/img/logo.png" alt="" />
        <span>New Algeria</span>
      </a>

      {/* Desktop Menu */}
      <div className="mb-nav-pill" {...entree("80")}>
        {menuItems.map((item) => (
          <a key={item.key} href={routes.section(item.key)}>
            {item.label}
          </a>
        ))}
      </div>

      <div className="mb-nav-actions" {...entree("160")}>
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="mb-pill mb-pill-glass mb-icon-btn"
              aria-label="Language"
            >
              <Languages />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          className="mb-pill mb-pill-glass mb-icon-btn"
          onClick={toggleTheme}
          aria-label="Theme"
        >
          {isDark ? <Sun /> : <Moon />}
        </button>

        {/* Visiteur : « Rejoignez-nous » mène à la connexion. Membre : sa photo de profil, qui ouvre le menu du compte. */}
        {session ? (
          <MenuCompte />
        ) : (
          <JoinUsBtn className="mb-pill mb-pill-green mb-nav-join">
            {t("joinUs.joinUs")}
          </JoinUsBtn>
        )}

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mb-pill mb-pill-glass mb-burger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mb-mobile-menu">
          {menuItems.map((item) => (
            <a key={item.key} href={routes.section(item.key)} onClick={() => setIsOpen(false)}>
              {item.label}
            </a>
          ))}
          <div className="mb-mobile-row">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
              >
                {lang.label}
              </button>
            ))}
            <button type="button" onClick={toggleTheme} aria-label="Theme">
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
