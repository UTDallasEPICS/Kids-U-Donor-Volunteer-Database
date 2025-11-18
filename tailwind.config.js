/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "variable-collection-color": "var(--variable-collection-color)",
        "variable-collection-old-dashboard-colors-border": "var(--variable-collection-old-dashboard-colors-border)",
        "variable-collection-old-dashboard-colors-font-color":
          "var(--variable-collection-old-dashboard-colors-font-color)",
        "variable-collection-old-dashboard-colors-kidsulogoblue":
          "var(--variable-collection-old-dashboard-colors-kidsulogoblue)",
        "variable-collection-old-dashboard-colors-kidsulogored":
          "var(--variable-collection-old-dashboard-colors-kidsulogored)",
      },
      boxShadow: {
        shade: "var(--shade)",
      },
    },
  },
  plugins: [],
};
