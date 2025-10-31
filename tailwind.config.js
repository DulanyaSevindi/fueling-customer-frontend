/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",], // ✅ Includes JSX
    theme: {
        extend: {
            fontFamily: {
                sans: ['Open Sans', 'sans-serif'], // Use as primary sans-serif font
                poppins: ['Poppins', 'sans-serif'], // Specific class for Poppins
                'work-sans': ['Work Sans', 'sans-serif'] // Specific class for Work Sans
            },
            animation: {
                stripLoader: 'moveStrips 1s linear infinite',
                stripe: 'stripe 1.5s linear infinite',
            },
            keyframes: {
                moveStrips: {
                    '0%': { backgroundPosition: '0 0' },
                    '100%': { backgroundPosition: '40px 40px' },
                },
                stripe: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
            },
        }
    },
    darkMode: ["class", '[data-theme="dark"]'],
    plugins: [require("@tailwindcss/typography"), require("daisyui")],
    daisyui: {
        themes: ["light"],
    },
};