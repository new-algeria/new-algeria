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

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { t, i18n } = useTranslation();

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
    <nav className={`mb-nav ${hasScrolled || isOpen ? "is-scrolled" : ""}`}>
      <a href="#home" className="mb-logo font-display" data-enter="drop" data-enter-at="0">
        <img src="/assets/img/logo.png" alt="" />
        <span>New Algeria</span>
      </a>

      {/* Desktop Menu */}
      <div className="mb-nav-pill" data-enter="drop" data-enter-at="80">
        {menuItems.map((item) => (
          <a key={item.key} href={`#${item.key}`}>
            {item.label}
          </a>
        ))}
      </div>

      <div className="mb-nav-actions" data-enter="drop" data-enter-at="160">
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

        <JoinUsBtn className="mb-pill mb-pill-white mb-nav-join">
          {t("joinUs.joinUs")}
        </JoinUsBtn>

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
            <a key={item.key} href={`#${item.key}`} onClick={() => setIsOpen(false)}>
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
