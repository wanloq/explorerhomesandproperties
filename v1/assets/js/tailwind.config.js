// Tailwind CDN (Play CDN) runtime configuration.
// This project intentionally ships without a build step — see README for the
// optional CLI-based production build that purges unused classes.
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0F3D2E",
        secondary: "#14532D",
        gold: "#D4AF37",
        cream: "#F8F6F2",
        ink: "#111827",
        slate: "#6B7280",
      },
      fontFamily: {
        display: ["Playfair Display", "ui-serif", "Georgia", "serif"],
        body: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "8xl": "90rem",
      },
      boxShadow: {
        premium: "0 30px 60px -25px rgba(15, 61, 46, 0.35)",
      },
    },
  },
};
