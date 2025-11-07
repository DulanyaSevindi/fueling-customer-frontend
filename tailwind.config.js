/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Open Sans", "sans-serif"],
                poppins: ["Poppins", "sans-serif"],
                "work-sans": ["Work Sans", "sans-serif"],
            },
            animation: {
                stripLoader: "moveStrips 1s linear infinite",
                stripe: "stripe 1.5s linear infinite",
            },
            keyframes: {
                moveStrips: {
                    "0%": { backgroundPosition: "0 0" },
                    "100%": { backgroundPosition: "40px 40px" },
                },
                stripe: {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" },
                },
            },
        },
    },
    darkMode: ["class", '[data-theme="dark"]'],
    plugins: [typography, daisyui],
    daisyui: {
        themes: ["light"],
    },
};
