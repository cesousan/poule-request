/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#3b82f6",    // blue-500
          secondary: "#6b7280",  // gray-500
          accent: "#0ea5e9",     // sky-500
          neutral: "#1f2937",    // gray-800
          "base-100": "#111827", // gray-900
          "base-200": "#1f2937", // gray-800
          "base-300": "#374151", // gray-700
          "base-content": "#f3f4f6", // gray-100
          "--rounded-btn": "0.5rem",
          ".btn": {
            "text-transform": "none",
          },
        }
      }
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
  }
}