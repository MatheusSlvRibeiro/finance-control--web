import api from '@services/api';
import { AxiosError } from 'axios';

export type LoginResult = {
	success: boolean;
	message?: string;
	accessToken?: string;
};

const TOKEN_KEY = 'token';
const REFRESH_KEY = 'refreshToken';
const REMEMBER_KEY = 'rememberMe';

/** Retorna o token de qualquer storage onde estiver. */
export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export async function login(
	email: string,
	password: string,
	rememberMe = false,
): Promise<LoginResult> {
	try {
		const response = await api.post('/api/token/', { email, password });
		const { access, refresh } = response.data;

		const storage = rememberMe ? localStorage : sessionStorage;
		storage.setItem(TOKEN_KEY, access);
		storage.setItem(REFRESH_KEY, refresh);
		localStorage.setItem(REMEMBER_KEY, String(rememberMe));

		return { success: true, accessToken: access };
	} catch (error) {
		const message =
			error instanceof AxiosError
				? error.response?.data?.detail ?? 'Erro ao fazer login'
				: 'Erro ao fazer login';
		return { success: false, message };
	}
}

export async function logout() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(REFRESH_KEY);
	localStorage.removeItem(REMEMBER_KEY);
	sessionStorage.removeItem(TOKEN_KEY);
	sessionStorage.removeItem(REFRESH_KEY);
}

export async function registerUser(data: {
	name: string;
	email: string;
	password: string;
	password_confirm: string;
}) {
	try {
		const response = await api.post('/api/v1/users/', data);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) throw error.response?.data ?? error;
		throw error;
	}
}

// ── Senha (mock) ─────────────────────────────────────────────────────────────

const MOCK_CODE = '123456';

/** Simula envio de e-mail com código de recuperação. */
export async function sendPasswordResetCode(email: string): Promise<void> {
	// Simula latência de rede
	await new Promise((r) => setTimeout(r, 800));
	// Guarda o email em memória para validação posterior (em produção seria JWT/token)
	sessionStorage.setItem('resetEmail', email);
	console.info(`[mock] Código de recuperação para ${email}: ${MOCK_CODE}`);
}

/** Valida o código digitado pelo usuário. */
export async function validateResetCode(code: string): Promise<boolean> {
	await new Promise((r) => setTimeout(r, 500));
	return code === MOCK_CODE;
}
