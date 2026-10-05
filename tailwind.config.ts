import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink:    { DEFAULT: "#0C0D0E", soft: "#17191C", mute: "#2A2D32" },
        paper:  { DEFAULT: "#FBFAF8", warm: "#F2EFEA", line: "#E3DED6" },
        signal: { DEFAULT: "#FF5A1F", dark: "#E6440C", light: "#FF8454" },
        steel:  { DEFAULT: "#5A6069", light: "#8A9099" }
      },
      fontFamily: {
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      letterSpacing: { tightest: "-0.045em" },
      maxWidth: { content: "78rem" },
      transitionTimingFunction: { smooth: "cubic-bezier(0.22, 1, 0.36, 1)" }
    }
  },
  plugins: []
};
export default config;
