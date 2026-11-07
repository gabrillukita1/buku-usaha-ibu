/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F5F3F0",
        surface: "#FFFEFC",
        ink: "#20212A",
        muted: "#74737B",
        line: "#E8E4DF",
        navy: "#24232D",
        primary: "#6254D9",
        "violet-soft": "#EEEAFE",
        brambang: "#D97745",
        "orange-soft": "#FBEDE5",
        supplier: "#168B78",
        mint: "#E5F3EE",
        success: "#27845B",
        warning: "#B7791F",
        danger: "#C44F55",
        neutral: "#68717B",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        app: "18px",
        control: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(32,33,42,.04), 0 10px 24px rgba(36,35,45,.05)",
        float: "0 18px 44px rgba(32,33,42,.16)",
      },
    },
  },
  plugins: [],
}
