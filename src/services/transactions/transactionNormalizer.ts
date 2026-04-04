import type { Transaction } from '@appTypes/transaction';
import { formatDate } from '@utils/formatDate/formatDate';

type NormalizedTransaction = Transaction & {
	dateFormatted?: string;
};

export function normalizeTransaction(transaction: Transaction): NormalizedTransaction {
	return {
		...transaction,
		dateFormatted: transaction.date ? formatDate(transaction.date) : '',
	};
}

export function normalizeTransactions(transactions: Transaction[]): NormalizedTransaction[] {
	return transactions.map(normalizeTransaction);
}
