/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        roboto:  ["Roboto",  "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        /* TwalaCare brand colors */
        "twala-green":     "#2c5530",
        "twala-secondary": "#4a7856",
        "twala-gold":      "#c7a252",
        "twala-gold-light":"#e8c97c",
        "twala-bg":        "#faf7f2",
        "twala-text":      "#2c3e2c",
        "twala-error":     "#d45a5a",
        "twala-surface":   "#f5f5f5",

        /* Shadcn/UI tokens via CSS var */
        border:     "var(--border)",
        input:      "var(--input)",
        ring:       "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT:    "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT:            "var(--sidebar)",
          foreground:         "var(--sidebar-foreground)",
          primary:            "var(--sidebar-primary)",
          "primary-foreground":"var(--sidebar-primary-foreground)",
          accent:             "var(--sidebar-accent)",
          "accent-foreground":"var(--sidebar-accent-foreground)",
          border:             "var(--sidebar-border)",
          ring:               "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "twala-card":  "0 4px 6px rgba(0, 0, 0, 0.05)",
        "twala-hover": "0 8px 24px rgba(44, 85, 48, 0.12)",
        "twala-lg":    "0 16px 40px rgba(44, 85, 48, 0.15)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "twala-page-enter": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "twala-fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "twala-slide-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "twala-capsule-spin": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "twala-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%":       { transform: "translateX(-3px)" },
          "40%":       { transform: "translateX(3px)" },
          "60%":       { transform: "translateX(-2px)" },
          "80%":       { transform: "translateX(2px)" },
        },
      },
      animation: {
        "accordion-down":    "accordion-down 0.2s ease-out",
        "accordion-up":      "accordion-up 0.2s ease-out",
        "twala-enter":       "twala-page-enter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "twala-fade":        "twala-fade-in 0.3s ease",
        "twala-slide-down":  "twala-slide-down 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "twala-capsule":     "twala-capsule-spin 0.7s linear infinite",
        "twala-shake":       "twala-shake 0.3s ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
