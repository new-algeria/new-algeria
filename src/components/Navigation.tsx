import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { t } from "i18next";

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
      setHasScrolled(window.scrollY > 0); // Vérifie si la page est défilée
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const handleContact = () => {
    const mailtoLink = `mailto:admin@newalgeria.org?subject=${encodeURIComponent(
      t("contact.subject")
    )}&body=${encodeURIComponent(t("contact.body"))}`;
    window.location.href = mailtoLink;
  };

  const menuItems = [
    //{ key: "home", label: t("nav.home") },
    { key: "services", label: t("nav.services") },
    { key: "developers", label: t("nav.developers") },
  ];

  return (
    <nav
      className={`fixed w-full z-50 backdrop-blur-sm border-b border-primary/10 transition-colors duration-300 ${
        hasScrolled ? "bg-white/50 shadow-md" : "bg-background/90"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <a
            href="#home"
            className="text-2xl font-bold text-primary dark:text-accent"
          >
            <div className="text-2xl font-bold text-primary dark:text-accent flex flex-row items-center space-x-2">
              <img
                src="/assets/img/logo.png"
                alt="Logo"
                className="h-12 rounded-full opacity-75"
              />
              <h3>New Algeria</h3>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.key}
                href={`#${item.key}`}
                className="text-foreground hover:text-primary dark:hover:text-accent transition-colors "
              >
                {item.label}
              </a>
            ))}

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="mr-4"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            <a href="https://github.com/new-algeria" target="_blank">
              <button className="bg-black text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:hover:bg-accent/90 py-2 px-4 rounded-lg">
                <span>
                  <FontAwesomeIcon icon={faGithub} /> {""}
                  {t("timeline.joinTeam")}
                </span>
              </button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("ar")}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <button
              className="text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-sm py-4 border-b border-primary/10">
            <div className="flex flex-col space-y-4 px-4">
              {menuItems.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.key}`}
                  className="text-foreground hover:text-primary dark:hover:text-accent transition-colors "
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
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
        )}
      </div>
    </nav>
  );
};

export default Navigation;
