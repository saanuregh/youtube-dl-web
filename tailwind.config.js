module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  plugins: [],
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        shine: "shine 15s ease infinite",
      },
      backgroundSize: {
        "100%": "400% 100%",
      },
      colors: {
        bunker: {
          100: "#E8E8E8",
          200: "#C5C6C6",
          300: "#A3A3A4",
          400: "#5D5F5F",
          50: "#F3F4F4",
          500: "#181A1B",
          600: "#161718",
          700: "#0E1010",
          800: "#0B0C0C",
          900: "#070808",
        },
      },
      keyframes: {
        shine: {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
      },
    },
  },
  variants: {
    animation: ["responsive", "hover", "focus"],
    backgroundPosition: ["responsive", "hover", "focus"],
  },
};
