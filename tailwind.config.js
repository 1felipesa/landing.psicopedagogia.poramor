/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'jake-yellow': '#FFD52E',
                'finn-blue': '#258CF4',
                'lsp-purple': '#9C27B0',
                'grass-green': '#79C142',
            },
            fontFamily: {
                brand: ['Montserrat', 'sans-serif'],
                adventure: ['Bubblegum Sans', 'cursive'],
            },
        },
    },
    plugins: [],
}
