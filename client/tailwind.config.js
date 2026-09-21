/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#23588f',
          'blue-dark': '#1a436e',
          'blue-light': '#3b73ae',
          orange: '#e48738',
          'orange-dark': '#cc7227',
          'orange-light': '#f49a4f',
          charcoal: '#4b5156',
          'charcoal-dark': '#303437',
          'charcoal-light': '#6c747a',
          neutral: '#f4f6f8',
          'neutral-dark': '#e7ecf0',
          slate: '#1e293b',
          'slate-dark': '#0f172a',
          white: '#ffffff',
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'Roboto',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'sans-serif'
        ],
      },
      borderRadius: {
        // High-contrast, sharp geometric cards (minimal border radius, e.g. rounded-md or rounded-lg)
        'DEFAULT': '0.25rem',
        'sm': '0.125rem',
        'md': '0.375rem',
        'lg': '0.5rem',
      },
      boxShadow: {
        'technical': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'technical-md': '0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        'technical-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.12), 0 4px 6px -4px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
