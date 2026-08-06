/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1720", // muted charcoal
          soft: "#273036",
          line: "#E6E0D6",
        },
        paper: {
          DEFAULT: "#F8F6F0", // warm cream
          dim: "#F1EDE6",
        },
        proof: {
          red: "#B23A2F",
          green: "#3F7666",
          gold: "#BFA24A",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(245,241,230,0.045) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}

