/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Fundo principal (marfim, não branco puro — papel, não tela)
                'acl-cream': '#F6F1E7',

                // Preto quente, usado em seções de destaque (não preto puro)
                'acl-ink': '#2A211A',
                'acl-ink-soft': '#5C5142',

                // Texto terciário / legendas
                'acl-muted': '#7A6F5A',

                // Acento principal — dourado antigo (medalha, não construção)
                'acl-gold': '#C9A45C',
                'acl-gold-deep': '#9C7A3C',

                // Acento secundário, uso esparso (tags, variação visual)
                'acl-wine': '#8C4A3D',

                // Linhas/divisórias sobre o creme
                'acl-line': '#D8CFB8',
            },
            fontFamily: {
                // Serifa editorial para títulos — substitui o display neobrutalista
                serif: ['Fraunces', 'Georgia', 'serif'],
                // Sans para UI e corpo de texto
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            borderRadius: {
                'sm': '2px',
            },
        },
    },
    plugins: [],
}