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
				/* Shared product palette aliases */
				paper: 'hsl(var(--background) / <alpha-value>)',
				'bone-wash': 'hsl(var(--secondary) / <alpha-value>)',
				bone: 'hsl(var(--border) / <alpha-value>)',
				'bone-strong': 'var(--bone-strong)',
				ink: 'hsl(var(--foreground) / <alpha-value>)',
				charcoal: 'hsl(var(--muted-foreground) / <alpha-value>)',
				'ink-muted': 'hsl(var(--muted-foreground) / <alpha-value>)',
				'ink-faint': 'hsl(var(--faint-foreground) / <alpha-value>)',
				brass: 'hsl(var(--primary) / <alpha-value>)',
				'brass-text': 'hsl(var(--primary) / <alpha-value>)',
				'document-white': 'hsl(var(--card) / <alpha-value>)',
				vellum: 'hsl(var(--popover) / <alpha-value>)',
				zebra: 'hsl(var(--secondary) / <alpha-value>)',
				wash: 'hsl(var(--section-alt) / <alpha-value>)',
				'code-surface': 'hsl(var(--secondary) / <alpha-value>)',
				'row-hover': 'hsl(var(--accent) / <alpha-value>)',
				'disabled-fill': 'hsl(var(--muted) / <alpha-value>)',
				'faint-rule': 'hsl(var(--border) / <alpha-value>)',
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
					highlight: 'hsl(var(--accent) / <alpha-value>)',
					wash: 'hsl(var(--secondary) / <alpha-value>)',
					marker: 'hsl(var(--primary) / <alpha-value>)'
				},
				'owl-purple': {
					DEFAULT: 'hsl(var(--primary-light) / <alpha-value>)',
					deep: 'hsl(var(--primary) / <alpha-value>)'
				},
				chart: {
					1: 'var(--chart-1)',
					2: 'var(--chart-2)',
					3: 'var(--chart-3)',
					4: 'var(--chart-4)',
					5: 'var(--chart-5)',
					6: 'var(--chart-6)'
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
