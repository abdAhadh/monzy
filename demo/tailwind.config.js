/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        // Monzy design tokens
        st: {
          bg:           '#FAF9F6',
          surface:      '#FFFFFF',
          border:       '#E8E4DC',
          'border-lt':  '#F0EDE6',
          text:         '#111111',
          secondary:    '#555555',
          muted:        '#777777',
          placeholder:  '#999999',
          accent:       '#A87C28',
          'accent-bg':  '#FDF6E8',
          'accent-h':   '#8B6520',
          success:      '#1EA672',
          'success-bg': '#EBFAF3',
          'success-bd': '#C3E8D5',
          warning:      '#D97706',
          'warning-bg': '#FEF3C7',
          'warning-bd': '#FDE08A',
          danger:       '#E5424D',
          'danger-bg':  '#FDE8E9',
          'danger-bd':  '#F9C4C7',
          info:         '#A87C28',
          'info-bg':    '#FDF6E8',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'st-card': '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'st-elevated': '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
