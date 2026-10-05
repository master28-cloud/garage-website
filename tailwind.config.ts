import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0A1A2F",
          blue: "#0B3D91",
          green: "#19C37D",
          sand: "#F4EFE6",
          ink: "#0E1116"
        }
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(25,195,125,0.35)",
        card: "0 10px 30px -12px rgba(10,26,47,0.25)"
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } }
      },
      animation: { shimmer: "shimmer 2.5s linear infinite" }
    }
  },
  plugins: []
};
export default config;
