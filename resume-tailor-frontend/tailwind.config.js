/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B2545",
          soft: "#173A5A",
          line: "#2F4A69",
        },
        paper: {
          DEFAULT: "#F8FAFC",
          dim: "#EDF2F7",
        },
        proof: {
          red: "#B23A2F",
          green: "#117A65",
          gold: "#D69E2E",
        },
      },
      fontFamily: {
        display: ["'Poppins'", "sans-serif"],
        body: ["'Roboto'", "sans-serif"],
        mono: ["'Source Code Pro'", "monospace"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(11,37,69,0.02) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}

