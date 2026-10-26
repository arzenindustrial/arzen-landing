import type { Config } from "tailwindcss";

// Tokens del Brand Book v1.0 §07. Azul = sistema/acción; verde, rojo, ámbar = resultado. Nunca intercambiables.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1621",
        paper: "#F6F4EF",
        alloy: "#4A5868",
        blue: "var(--blue)",
        s500: "#5B6672",
        s300: "#B9C0C8",
        s100: "#E6E8EB",
        pass: "var(--pass)",
        dev: "var(--dev)",
        warn: "var(--warn)",
        passbg: "var(--passbg)",
        devbg: "var(--devbg)",
        warnbg: "var(--warnbg)",
        infobg: "var(--infobg)",
        bg: "var(--bg)",
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        line: "var(--line)",
      },
      fontFamily: {
        display: ["var(--font-archivo)", "Arial Black", "sans-serif"],
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { DEFAULT: "4px", md: "6px", lg: "8px" },
      maxWidth: { page: "1120px" },
    },
  },
  plugins: [],
};
export default config;
