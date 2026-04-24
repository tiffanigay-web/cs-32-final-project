import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fffaf2",
          100: "#f9f1e5",
        },
        moss: {
          500: "#5c9c72",
          700: "#3d6f52",
        },
        blossom: "#ffbfd8",
        bark: "#8a6d52",
      },
      boxShadow: {
        soft: "0 12px 30px rgba(60, 45, 28, 0.08)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
