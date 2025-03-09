/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{hbs,html,ts}", // Include Handlebars, HTML, and TS files
        "./templates/**/*.{hbs,html}", // Your templates directory
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
