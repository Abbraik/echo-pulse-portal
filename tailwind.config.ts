
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
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
				inter: ["Inter", "sans-serif"],
				noto: ["Noto Sans", "sans-serif"],
				"noto-arabic": ["Noto Naskh Arabic", "serif"]
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
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
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
                navy: {
                  DEFAULT: '#1E293B',
                  50: '#F8FAFC',
                  100: '#F1F5F9',
                  200: '#E2E8F0',
                  300: '#CBD5E1',
                  400: '#94A3B8',
                  500: '#64748B',
                  600: '#475569',
                  700: '#334155',
                  800: '#1E293B',
                  900: '#0F172A',
                },
                teal: {
                  DEFAULT: '#14B8A6',
                  50: '#F0FDFA',
                  100: '#CCFBF1',
                  200: '#99F6E4',
                  300: '#5EEAD4',
                  400: '#2DD4BF',
                  500: '#14B8A6',
                  600: '#0D9488',
                  700: '#0F766E',
                  800: '#115E59',
                  900: '#134E4A',
                },
                blue: {
                  DEFAULT: '#2563EB',
                  50: '#EFF6FF',
                  100: '#DBEAFE',
                  200: '#BFDBFE',
                  300: '#93C5FD',
                  400: '#60A5FA',
                  500: '#3B82F6',
                  600: '#2563EB',
                  700: '#1D4ED8',
                  800: '#1E40AF',
                  900: '#1E3A8A',
                },
                gold: {
                  DEFAULT: '#FFC542',
                  50: '#FFFAF0',
                  100: '#FEEBC8',
                  200: '#FDD88A',
                  300: '#FFC542',
                  400: '#FFB816',
                  500: '#EDA200',
                  600: '#C48500',
                  700: '#9C6A00',
                  800: '#755000',
                  900: '#4D3500',
                },
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
                'fade-in': {
                  '0%': { opacity: '0', transform: 'translateY(10px)' },
                  '100%': { opacity: '1', transform: 'translateY(0)' }
                },
                'fade-out': {
                  '0%': { opacity: '1', transform: 'translateY(0)' },
                  '100%': { opacity: '0', transform: 'translateY(10px)' }
                },
                'scale-in': {
                  '0%': { transform: 'scale(0.95)', opacity: '0' },
                  '100%': { transform: 'scale(1)', opacity: '1' }
                },
                'scale-out': {
                  from: { transform: 'scale(1)', opacity: '1' },
                  to: { transform: 'scale(0.95)', opacity: '0' }
                },
                'slide-in-right': {
                  '0%': { transform: 'translateX(100%)' },
                  '100%': { transform: 'translateX(0)' }
                },
                'slide-out-right': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(100%)' }
                },
                'pulse': {
                  '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                  '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                },
                'breathe': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                },
                'text-shimmer': {
                  '0%': { backgroundPosition: '-200% 0' },
                  '100%': { backgroundPosition: '200% 0' },
                },
                'float': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                },
                'float-subtle': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-5px)' },
                },
                'particle-trail': {
                  '0%': { transform: 'translateY(0) scale(1)', opacity: '0.8' },
                  '100%': { transform: 'translateY(-20px) scale(0)', opacity: '0' },
                },
                'ripple': {
                  '0%': { transform: 'scale(0)', opacity: '1' },
                  '100%': { transform: 'scale(4)', opacity: '0' },
                },
                'letter-spacing': {
                  '0%': { letterSpacing: '-0.5em', opacity: '0' },
                  '40%': { opacity: '0.6' },
                  '100%': { letterSpacing: 'normal', opacity: '1' },
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'fade-out': 'fade-out 0.3s ease-out',
                'scale-in': 'scale-in 0.2s ease-out',
                'scale-out': 'scale-out 0.2s ease-out',
                'slide-in-right': 'slide-in-right 0.3s ease-out',
                'slide-out-right': 'slide-out-right 0.3s ease-out',
                'enter': 'fade-in 0.3s ease-out, scale-in 0.2s ease-out',
                'exit': 'fade-out 0.3s ease-out, scale-out 0.2s ease-out',
                'pulse': 'pulse 3s ease-in-out infinite',
                'breathe': 'breathe 4s ease-in-out infinite',
                'text-shimmer': 'text-shimmer 2.5s ease-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-subtle': 'float-subtle 4s ease-in-out infinite',
                'ripple': 'ripple 1s ease-out forwards',
                'letter-spacing': 'letter-spacing 1.2s ease-out',
			},
            backgroundSize: {
              '200%': '200% 200%',
              '300%': '300% 300%',
            },
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
