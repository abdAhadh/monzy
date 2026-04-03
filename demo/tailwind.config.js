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
        // Stripe design tokens
        st: {
          bg:           '#F6F9FC',
          surface:      '#FFFFFF',
          border:       '#E3E8EF',
          'border-lt':  '#F0F4F8',
          text:         '#1A1F36',
          secondary:    '#425466',
          muted:        '#697386',
          placeholder:  '#8792A2',
          accent:       '#635BFF',
          'accent-bg':  '#F0EFFF',
          'accent-h':   '#5851E5',
          success:      '#1EA672',
          'success-bg': '#EBFAF3',
          'success-bd': '#C3E8D5',
          warning:      '#D97706',
          'warning-bg': '#FEF3C7',
          'warning-bd': '#FDE08A',
          danger:       '#E5424D',
          'danger-bg':  '#FDE8E9',
          'danger-bd':  '#F9C4C7',
          info:         '#3D9BE9',
          'info-bg':    '#E8F4FD',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'st-card': '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px 0 rgba(0,0,0,0.04)',
        'st-elevated': '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
}
