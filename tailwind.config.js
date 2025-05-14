// tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primaryBlue: '#005DF4',
      },
      fontFamily: {
        pacifico: ['Pacifico', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
