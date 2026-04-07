import type { Account } from '@appTypes/account';
import { accountService } from '@services/accounts/accountService';
import { useCallback, useEffect, useState } from 'react';

export function useAccounts() {
	const [data, setData] = useState<Account[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	const reload = useCallback(async (signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		try {
			const list = await accountService.getUserAccountsWithTotals();
			if (signal?.aborted) return;
			setData(Array.isArray(list) ? list : []);
		} catch (e) {
			if (signal?.aborted) return;
			setError(e instanceof Error ? e : new Error('Erro ao carregar contas'));
		} finally {
			if (!signal?.aborted) setLoading(false);
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		reload(controller.signal);
		return () => controller.abort();
	}, [reload]);

	return { data, loading, error, reload };
}
