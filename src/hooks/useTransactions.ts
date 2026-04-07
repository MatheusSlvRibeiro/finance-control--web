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

	const fetchPage = useCallback(async (pageNumber: number, signal?: AbortSignal) => {
		setLoading(true);
		setError(null);

		try {
			const list = await transactionService.getAll({ params: { page: pageNumber } });
			if (signal?.aborted) return;
			const transactions = Array.isArray(list.results) ? list.results : [];
			setData(normalizeTransactions(transactions));
			setCount(list.count ?? 0);
		} catch (e) {
			if (signal?.aborted) return;
			setError(e instanceof Error ? e : new Error('Erro ao carregar transações'));
		} finally {
			if (!signal?.aborted) setLoading(false);
		}
	}, []);

	useEffect(() => {
		const controller = new AbortController();
		fetchPage(page, controller.signal);
		return () => controller.abort();
	}, [page, fetchPage]);

	const reload = useCallback(() => fetchPage(page), [fetchPage, page]);

	const getTransactionByType = useCallback(
		(type: Transaction['type']) => data.filter((item) => item.type === type),
		[data],
	);

	return { data, loading, error, count, totalPages, page, setPage, reload, getTransactionByType };
}
