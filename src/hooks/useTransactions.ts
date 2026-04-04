import type { Transaction } from '@appTypes/transaction';
import { useCallback, useEffect, useState } from 'react';
import { transactionService } from '@services/transactions/transactionService';
import { normalizeTransactions } from '@services/transactions/transactionNormalizer';

const PAGE_SIZE = 10;

export function useTransactions() {
	const [data, setData] = useState<(Transaction & { dateFormatted?: string })[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [page, setPage] = useState(1);
	const [count, setCount] = useState(0);

	const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

	const fetchPage = useCallback(async (pageNumber: number) => {
		setLoading(true);
		setError(null);

		try {
			const list = await transactionService.getAll({ params: { page: pageNumber } });
			const transactions = Array.isArray(list.results) ? list.results : [];
			setData(normalizeTransactions(transactions));
			setCount(list.count ?? 0);
		} catch (e) {
			setError(e instanceof Error ? e : new Error('Erro ao carregar transações'));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		let alive = true;

		(async () => {
			setLoading(true);
			setError(null);

			try {
				const list = await transactionService.getAll({ params: { page } });
				const transactions = Array.isArray(list.results) ? list.results : [];
				if (alive) {
					setData(normalizeTransactions(transactions));
					setCount(list.count ?? 0);
				}
			} catch (e) {
				if (alive)
					setError(e instanceof Error ? e : new Error('Erro ao carregar transações'));
			} finally {
				if (alive) setLoading(false);
			}
		})();

		return () => {
			alive = false;
		};
	}, [page]);

	const reload = useCallback(() => fetchPage(page), [fetchPage, page]);

	const getTransactionByType = useCallback(
		(type: Transaction['type']) => data.filter((item) => item.type === type),
		[data],
	);

	return { data, loading, error, count, totalPages, page, setPage, reload, getTransactionByType };
}
