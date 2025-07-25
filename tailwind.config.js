/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#127769", // Your preferred green color
          600: "#127769", // Use your primary color for consistency
          700: "#0e5d52", // Darker shade for hover
          800: "#0a4a3f",
          900: "#073a2f",
          950: "#042a20",
        },
        primarily: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#127769", // Your preferred green color
          600: "#127769", // Use your primary color for consistency
          700: "#0e5d52", // Darker shade for hover
          800: "#0a4a3f",
          900: "#073a2f",
          950: "#042a20",
        },
        // Primarily uses indigo/purple colors in their UI
        indigo: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // Primary indigo color for Primarily-like UI
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
      },
      boxShadow: {
        primarily: "0 2px 5px 0 rgba(0,0,0,0.05)",
        "primarily-md": "0 4px 10px 0 rgba(0,0,0,0.08)",
        "primarily-lg": "0 10px 15px -3px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        primarily: "0.5rem",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideIn: "slideIn 0.3s ease-in-out",
        scaleIn: "scaleIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
