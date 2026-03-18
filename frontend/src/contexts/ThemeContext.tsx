import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { normalizeLanguage } from "../i18n/catalog";

export type Theme = "light" | "dark" | "auto";
export type Lang  = "pt" | "en" | "fr";

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: "light" | "dark";
  lang: Lang;
  setLang: (l: Lang) => void;
  fontSize: number;        // 14 | 16 | 18 | 20
  setFontSize: (s: number) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  spacing: "compact" | "comfortable" | "wide";
  setSpacing: (s: "compact" | "comfortable" | "wide") => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light", setTheme: () => {},
  resolvedTheme: "light",
  lang: "pt",  setLang: () => {},
  fontSize: 16,   setFontSize: () => {},
  highContrast: false, setHighContrast: () => {},
  reducedMotion: false, setReducedMotion: () => {},
  spacing: "comfortable", setSpacing: () => {},
});

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}
function save<T>(key: string, value: T) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme,        setThemeState]   = useState<Theme>(() => load("twala_theme", "light"));
  const [lang,         setLangState]    = useState<Lang>(() => normalizeLanguage(load<string>("twala_lang", "pt")));
  const [fontSize,     setFontSizeState] = useState<number>(() => load("twala_font", 16));
  const [highContrast, setHCState]      = useState<boolean>(() => load("twala_hc", false));
  const [reducedMotion,setRMState]      = useState<boolean>(() => load("twala_rm", false));
  const [spacing,      setSpacingState] = useState<"compact"|"comfortable"|"wide">(() => load("twala_spacing", "comfortable"));
  const [sysDark, setSysDark]           = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);

  /* Acompanha preferência do SO para modo "auto" */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSysDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const resolvedTheme: "light" | "dark" =
    theme === "auto" ? (sysDark ? "dark" : "light") : theme;

  /* Aplica atributos no <html> */
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.setAttribute("data-theme", resolvedTheme);
    root.style.fontSize = `${fontSize}px`;
    if (highContrast) root.classList.add("twala-hc");
    else root.classList.remove("twala-hc");
    if (reducedMotion) root.classList.add("twala-rm");
    else root.classList.remove("twala-rm");
    root.setAttribute("data-spacing", spacing);
    root.setAttribute("lang", lang);
  }, [resolvedTheme, fontSize, highContrast, reducedMotion, spacing, lang]);

  const setTheme = useCallback((t: Theme) => { setThemeState(t); save("twala_theme", t); }, []);
  const setLang  = useCallback((l: Lang)  => { setLangState(l);  save("twala_lang",  normalizeLanguage(l)); }, []);
  const setFontSize = useCallback((s: number) => { setFontSizeState(s); save("twala_font", s); }, []);
  const setHighContrast = useCallback((v: boolean) => { setHCState(v); save("twala_hc", v); }, []);
  const setReducedMotion = useCallback((v: boolean) => { setRMState(v); save("twala_rm", v); }, []);
  const setSpacing = useCallback((s: "compact"|"comfortable"|"wide") => { setSpacingState(s); save("twala_spacing", s); }, []);

  return (
    <ThemeContext.Provider value={{
      theme, setTheme, resolvedTheme,
      lang, setLang,
      fontSize, setFontSize,
      highContrast, setHighContrast,
      reducedMotion, setReducedMotion,
      spacing, setSpacing,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
