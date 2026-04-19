/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        saffron: { 50:'#fff7ed', 100:'#ffedd5', 400:'#fb923c', 500:'#f97316', 600:'#ea580c', 700:'#c2410c' },
        jade:    { 50:'#f0fdf4', 100:'#dcfce7', 400:'#4ade80', 500:'#22c55e', 600:'#16a34a', 700:'#15803d' },
        ink:     { 50:'#f8f9ff', 100:'#eff1ff', 800:'#1e2040', 900:'#0f1128', 950:'#080920' },
      },
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
      }
    }
  },
  plugins: []
}
