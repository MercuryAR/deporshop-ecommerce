/** @type {import('tailwindcss').Config} */
// Tokens del Design System DeporShop (Figma · "Design System & UI Kit").
// Los nombres replican las variables de Figma: color/*, radius/*, space/*, Elevation/*.
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bosque: '#0B2318',
        esmeralda: {
          DEFAULT: '#0E7A4F',
          oscuro: '#095C3B',
        },
        lima: {
          DEFAULT: '#C8F05A',
          oscuro: '#9FCC2E',
        },
        musgo: '#4A6155',
        borde: '#D8E5DC',
        menta: '#E6F4EC',
        aire: '#F7FAF6',
        error: {
          DEFAULT: '#D92D20',
          suave: '#FDECEA',
        },
        aviso: '#F2A900',
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['"Archivo Black"', 'Archivo', 'sans-serif'],
        price: ['Archivo', 'Manrope', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['104px', { lineHeight: '0.92', letterSpacing: '-2px' }],
        'display-l': ['64px', { lineHeight: '0.95', letterSpacing: '-1.5px' }],
        h1: ['44px', { lineHeight: '1', letterSpacing: '-1px' }],
        h2: ['32px', { lineHeight: '1.05', letterSpacing: '-0.5px' }],
        h3: ['24px', { lineHeight: '1.25', letterSpacing: '-0.3px' }],
        h4: ['20px', { lineHeight: '1.3', letterSpacing: '-0.2px' }],
        'body-lg': ['18px', { lineHeight: '1.6' }],
        body: ['16px', { lineHeight: '1.6' }],
        'body-strong': ['16px', { lineHeight: '1.5' }],
        'body-sm': ['14px', { lineHeight: '1.5' }],
        label: ['15px', { lineHeight: '1.2' }],
        'label-sm': ['13px', { lineHeight: '1.3' }],
        overline: ['12px', { lineHeight: '1.3', letterSpacing: '1.2px' }],
        caption: ['12px', { lineHeight: '1.4' }],
        'price-lg': ['30px', { lineHeight: '1.1', letterSpacing: '-0.5px' }],
        price: ['20px', { lineHeight: '1.2', letterSpacing: '-0.3px' }],
        'price-old': ['13px', { lineHeight: '1.3' }],
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 2px 8px 0 rgba(11, 35, 24, 0.06)',
        floating: '0 16px 40px -8px rgba(11, 35, 24, 0.14)',
        focus: '0 0 0 4px rgba(14, 122, 79, 0.18)',
      },
      maxWidth: {
        content: '1328px',
      },
    },
  },
  plugins: [],
}
