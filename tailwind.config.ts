import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['please-display-vf', 'sans-serif'],
        body: ['proxima-nova', 'sans-serif'],
        chinese: ['source-han-sans-traditional', 'sans-serif'],
      },
      fontWeight: {
        medium: '500',
      },
    },
  },
  plugins: [],
}

export default config
