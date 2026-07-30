import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'space': ['Space Grotesk', 'system-ui', 'sans-serif'],
				'montserrat': ['Montserrat', 'system-ui', 'sans-serif'],
			},
			colors: {
				/* Editorial Stationery raw tokens */
				paper: '#FCFAF7',
				'bone-wash': '#F1EBDE',
				bone: '#E8E1D4',
				'bone-strong': '#D8CDB6',
				ink: '#2D2D2D',
				charcoal: '#56514A',
				'ink-muted': '#6E6A62',
				'ink-faint': '#8A8478',
				brass: '#B4914F',
				'brass-text': '#8E7133',
				'document-white': '#FFFFFF',
				vellum: '#FFFDFA',
				zebra: '#FAF7F2',
				'code-surface': '#F7F3EC',
				'row-hover': '#F4EFE4',
				'disabled-fill': '#F4F0E9',
				'faint-rule': '#EDE5D6',
				danger: {
					DEFAULT: '#9C4A38',
					bg: '#F7EAE5',
					border: '#E4C6BD',
					solid: '#7E3A2C'
				},
				success: {
					DEFAULT: '#5E6B33',
					bg: '#EDEFE0',
					border: '#D2D8BC',
					solid: '#4A5527'
				},
				warning: {
					DEFAULT: '#8F5A14',
					bg: '#F7EDDC',
					border: '#E6D2AE',
					solid: '#74480F'
				},
				lavender: {
					highlight: '#EDE3FB',
					wash: '#F3EFFA',
					marker: '#5B3A96'
				},
				'owl-purple': {
					DEFAULT: '#8B5CF6',
					deep: '#7C3AED'
				},
				chart: {
					1: '#B4914F',
					2: '#56514A',
					3: '#5E6B33',
					4: '#9C4A38',
					5: '#8A8478',
					6: '#7A5C8A'
				},

				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					light: 'hsl(var(--primary-light))'
				},
				brand: {
					orange: 'hsl(var(--brand-orange))',
					'orange-foreground': 'hsl(var(--brand-orange-foreground))'
				},
				'accent-amber': {
					DEFAULT: 'hsl(var(--accent-amber))',
					foreground: 'hsl(var(--accent-amber-foreground))'
				},
				'accent-teal': {
					DEFAULT: 'hsl(var(--accent-teal))',
					foreground: 'hsl(var(--accent-teal-foreground))'
				},
				'accent-rose': {
					DEFAULT: 'hsl(var(--accent-rose))',
					foreground: 'hsl(var(--accent-rose-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				filter: {
					active: 'hsl(var(--filter-active))',
					'active-foreground': 'hsl(var(--filter-active-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
