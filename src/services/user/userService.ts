import { User } from '@appTypes/user';
import api from '@services/api';
import GenericService from '@services/genericService';

export type UpdateProfilePayload = {
	name?: string;
	email?: string;
};

export type UpdatePasswordPayload = {
	old_password: string;
	new_password: string;
	new_password_confirm: string;
};

class UserService extends GenericService<User> {
	constructor() {
		super('users');
	}

	async getMe(): Promise<User> {
		const response = await api.get('/api/v1/users/me/');
		return response.data;
	}

	async updateMe(payload: UpdateProfilePayload): Promise<User> {
		const response = await api.patch('/api/v1/users/me/', payload);
		return response.data;
	}

	async updatePassword(payload: UpdatePasswordPayload): Promise<void> {
		await api.post('/api/v1/users/me/change-password/', payload);
	}
}

export const userService = new UserService()