/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Cores definidas como variáveis (tripletos RGB) em index.css,
                // para que o modo de alto contraste possa trocá-las em um lugar só.
                'acl-cream': 'rgb(var(--acl-cream) / <alpha-value>)',
                'acl-ink': 'rgb(var(--acl-ink) / <alpha-value>)',
                'acl-ink-soft': 'rgb(var(--acl-ink-soft) / <alpha-value>)',
                'acl-muted': 'rgb(var(--acl-muted) / <alpha-value>)',
                'acl-gold': 'rgb(var(--acl-gold) / <alpha-value>)',
                'acl-gold-deep': 'rgb(var(--acl-gold-deep) / <alpha-value>)',
                // Dourado para TEXTO sobre fundo claro (contraste mínimo de 4,5:1)
                'acl-gold-text': 'rgb(var(--acl-gold-text) / <alpha-value>)',
                'acl-wine': 'rgb(var(--acl-wine) / <alpha-value>)',
                'acl-line': 'rgb(var(--acl-line) / <alpha-value>)',
                // Borda de campos de formulário (contraste mínimo de 3:1)
                'acl-field': 'rgb(var(--acl-field) / <alpha-value>)',
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