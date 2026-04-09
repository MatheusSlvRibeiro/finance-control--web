import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
	theme: Theme;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveApplied(theme: Theme): 'light' | 'dark' {
	if (theme === 'system') {
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}
	return theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(() => {
		const stored = localStorage.getItem('theme') as Theme | null;
		if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
		return 'light';
	});

	useEffect(() => {
		const apply = () => {
			document.documentElement.setAttribute('data-theme', resolveApplied(theme));
		};

		apply();
		localStorage.setItem('theme', theme);

		if (theme === 'system') {
			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			mq.addEventListener('change', apply);
			return () => mq.removeEventListener('change', apply);
		}
	}, [theme]);

	const setTheme = (next: Theme) => setThemeState(next);

	return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
	return ctx;
}
