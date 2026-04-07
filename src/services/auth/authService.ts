import api from '@services/api';
import { AxiosError } from 'axios';

export type LoginResult = {
	success: boolean;
	message?: string;
	accessToken?: string;
};

export async function login(email: string, password: string): Promise<LoginResult> {
	try {
		const response = await api.post('/api/token/', { email, password });
		const { access, refresh } = response.data;
		localStorage.setItem('token', access);
		localStorage.setItem('refreshToken', refresh);
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
	localStorage.removeItem('token');
}

export function getToken() {
	return localStorage.getItem('token');
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
