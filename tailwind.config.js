/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // REG-VAULT Brand Colors - Gold & Black Theme
        vault: {
          black: '#000000',
          'deep-black': '#0A0A0A',
          'surface': '#111111',
          'surface-elevated': '#1A1A1A',
          gold: '#D4AF37',
          'gold-light': '#F4D03F',
          'gold-dark': '#B8860B',
          'gold-muted': '#8B7355',
          white: '#FFFFFF',
          'gray-100': '#F5F5F5',
          'gray-200': '#E5E5E5',
          'gray-300': '#D4D4D4',
          'gray-400': '#A3A3A3',
          'gray-500': '#737373',
          'gray-600': '#525252',
          'gray-700': '#404040',
          'gray-800': '#262626',
          'gray-900': '#171717',
        },
        // Status Colors
        status: {
          success: '#10B981',
          'success-light': 'rgba(16, 185, 129, 0.15)',
          warning: '#F59E0B',
          'warning-light': 'rgba(245, 158, 11, 0.15)',
          danger: '#EF4444',
          'danger-light': 'rgba(239, 68, 68, 0.15)',
          info: '#3B82F6',
          'info-light': 'rgba(59, 130, 246, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-gold-strong': '0 0 40px rgba(212, 175, 55, 0.5)',
        'glow-gold-subtle': '0 0 10px rgba(212, 175, 55, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
        'gradient-gold-radial': 'radial-gradient(circle at center, #D4AF37 0%, #B8860B 100%)',
        'glass-dark': 'linear-gradient(135deg, rgba(17, 17, 17, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 175, 55, 0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow': {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        'scan': {
          '0%, 100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
