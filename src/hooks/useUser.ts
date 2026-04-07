import { useEffect, useState } from 'react';
import { User } from '@appTypes/user';
import { userService } from '@services/user/userService';

export function useUser() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				setLoading(true);
				const data = await userService.getMe();
				setUser(data);
			} catch {
				setError('Erro ao buscar usuário');
			} finally {
				setLoading(false);
			}
		}
		fetchUser();
	}, []);

	return { user, loading, error };
}
