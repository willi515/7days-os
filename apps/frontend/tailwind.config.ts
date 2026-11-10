import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 6 Official Approved Brand Colors from 01_Design_System_And_Visual_Identity.md
        'brand-primary': '#0F172A', // Royal Navy
        'brand-gold': '#D4AF37',    // Salon Gold Accent
        'brand-success': '#10B981', // Emerald Success
        'brand-warning': '#F59E0B', // Amber Warning
        'brand-danger': '#EF4444',  // Crimson Danger
        'brand-gps': '#2563EB',     // Cobalt GPS Blue
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        plex: ['IBM Plex Sans Arabic', 'sans-serif'],
      },
      minHeight: {
        'touch-target': '48px', // Minimum 48px Touch Target Rule
      },
      minWidth: {
        'touch-target': '48px',
      }
    },
  },
  plugins: [],
};

export default config;
