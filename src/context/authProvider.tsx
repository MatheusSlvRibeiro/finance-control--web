import { useEffect, useState } from 'react';
import { AuthContext, AuthContextType } from './authContext';
import * as authService from '@services/auth/authService';
import { useNavigate } from 'react-router-dom';

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [accessToken, setAccessToken] = useState<string | null>(authService.getToken);
	const isAuthenticated = Boolean(accessToken);

	const navigate = useNavigate();

	useEffect(() => {
		const handleStorage = () => setAccessToken(authService.getToken());
		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, []);

	const login: AuthContextType['login'] = async (email, password, rememberMe = false) => {
		const result = await authService.login(email, password, rememberMe);
		if (result.success) setAccessToken(result.accessToken ?? null);
		return result;
	};

	const logout: AuthContextType['logout'] = async () => {
		await authService.logout();
		setAccessToken(null);
	};

	useEffect(() => {
		const handleUnauthorized = () => {
			logout();
			navigate('/login');
		};
		window.addEventListener('unauthorized', handleUnauthorized);
		return () => window.removeEventListener('unauthorized', handleUnauthorized);
	}, [logout, navigate]);

	return (
		<AuthContext.Provider value={{ accessToken, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
