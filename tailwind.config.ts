import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#06060e',
        'bg-secondary': '#0c0c18',
        'text-primary': '#eaeaf4',
        'text-secondary': '#a0a0c0',
        'text-muted': '#6868a0',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7c3aed, #3b82f6, #06b6d4)',
        'gradient-text': 'linear-gradient(135deg, #c084fc, #60a5fa, #22d3ee)',
      },
      animation: {
        'float': 'float 15s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 0.7s steps(40, end)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  plugins: [],
}
export default config
