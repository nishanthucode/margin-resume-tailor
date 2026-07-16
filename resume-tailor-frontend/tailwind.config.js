/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14181A",
          soft: "#1D2422",
          line: "#2A322F",
        },
        paper: {
          DEFAULT: "#F5F1E6",
          dim: "#EAE5D6",
        },
        proof: {
          red: "#B23A2F",
          green: "#4C7A63",
          gold: "#C9A227",
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

