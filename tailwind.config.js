/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cl-yellow': '#FFD700',
                'cl-pink': '#FF006E',
                'cl-lime': '#CCFF00',
                'cl-dark': '#1a1a1a',
            },
            fontFamily: {
                'display': ['system-ui', '-apple-system', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'neo-sm': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
                'neo': '8px 8px 0px 0px rgba(0, 0, 0, 1)',
                'neo-md': '12px 12px 0px 0px rgba(0, 0, 0, 1)',
                'neo-lg': '16px 16px 0px 0px rgba(0, 0, 0, 1)',
                'neo-hover': '4px 4px 0px 0px rgba(0, 0, 0, 1)',
            },
        },
    },
    plugins: [],
    safelist: [
        'bg-yellow-400',
        'bg-pink-500',
        'bg-lime-400',
        'border-8',
        'border-black',
    ],
}
