/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    // theme.css already provides a global CSS reset/typography for the
    // whole site - Tailwind's preflight would clobber that on every page,
    // not just the ones that opt into Tailwind utility classes.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
