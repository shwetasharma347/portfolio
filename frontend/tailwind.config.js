/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-error-container": "#991b1b",
        "on-primary": "#ffffff",
        "on-secondary-fixed-variant": "#404252",
        "on-primary-container": "#e0e2ff",
        "secondary-fixed-dim": "#b8baca",
        "primary-container": "#818cf8",
        "on-surface-variant": "#585a68",
        "on-background": "#2e3040",
        "on-surface": "#2e3040",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        "on-primary-fixed": "#1e1b4b",
        "on-secondary-container": "#585a68",
        "surface-bright": "#edeef4",
        "outline-variant": "#d0d2dc",
        "secondary": "#6c6e7e",
        "on-tertiary-fixed-variant": "#5b21b6",
        "inverse-surface": "#2e3040",
        "surface-container-high": "#dcdee4",
        "surface": "#e8eaf0",
        "on-primary-fixed-variant": "#4338ca",
        "surface-container": "#e2e4ea",
        "surface-container-lowest": "#f0f2f8",
        "primary-fixed": "#e0e2ff",
        "background": "#e8eaf0",
        "on-tertiary-container": "#3b1f63",
        "surface-tint": "#6366f1",
        "surface-container-highest": "#d6d8de",
        "inverse-primary": "#a5b4fc",
        "on-tertiary-fixed": "#2e1065",
        "on-secondary-fixed": "#1a1b26",
        "secondary-fixed": "#d8dae6",
        "error": "#dc2626",
        "outline": "#8a8c9a",
        "primary-fixed-dim": "#a5b4fc",
        "inverse-on-surface": "#e8eaf0",
        "surface-container-low": "#e5e7ed",
        "tertiary-fixed": "#ede9fe",
        "tertiary": "#7c3aed",
        "error-container": "#fee2e2",
        "surface-dim": "#d4d6dc",
        "tertiary-container": "#a78bfa",
        "on-error": "#ffffff",
        "surface-variant": "#dcdee4",
        "secondary-container": "#d8dae6",
        "tertiary-fixed-dim": "#c4b5fd",
        "primary": "#6366f1"
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px"
      },
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Plus Jakarta Sans", "sans-serif"],
        label: ["Plus Jakarta Sans", "sans-serif"]
      },
      boxShadow: {
        "neo-raised": "6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.6)",
        "neo-raised-hover": "8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.7)",
        "neo-inset": "inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.5)",
        "neo-pressed": "inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.5)",
        "neo-footer": "-6px -6px 12px rgba(255,255,255,0.6)",
        "neo-header": "6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.6)"
      }
    }
  },
  plugins: []
}
