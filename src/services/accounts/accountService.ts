import type { Account } from '@appTypes/account';
import { NumericAccountField } from '@appTypes/numericAccountField';
import type { Transaction } from '@appTypes/transaction';
import api from '@services/api';
import GenericService from '@services/genericService';
import { transactionService } from '@services/transactions/transactionService';

const sumBy = (accounts: Account[], field: NumericAccountField) =>
	accounts.reduce((acc, a) => acc + (a[field] ?? 0), 0);

function getTransactionType(transaction: Transaction, categories: any[]) {
	if (transaction.type) return transaction.type;
	const category = categories.find((cat) => cat.uuid === transaction.category);
	return category ? category.type : undefined;
}

const sumTransactions = (
	transactions: Transaction[],
	categories: any[],
	accountId: string,
	type: 'income' | 'expense',
) =>
	transactions.reduce(
		(acc, t) =>
			t.account === accountId && getTransactionType(t, categories) === type
				? acc + t.value
				: acc,
		0,
	);

function normalizeAccount(account: any): Account {
	return {
		...account,
		type: account.account_type ?? account.type,
		openingBalance: Number(account.opening_balance),
	};
}

const withDerivedTotals = (
	account: Account,
	transactions: Transaction[],
	categories: any[],
): Account => {
	const incomes = sumTransactions(transactions, categories, account.uuid, 'income');
	const expenses = sumTransactions(transactions, categories, account.uuid, 'expense');
	const incomingTransfer = 0;
	const outgoingTransfers = 0;
	const balance =
		account.openingBalance + incomes + incomingTransfer - outgoingTransfers - expenses;

	return {
		...account,
		incomes,
		expenses,
		incomingTransfer,
		outgoingTransfers,
		balance,
	};
};

class AccountService extends GenericService<Account> {
	getAccountNameById(accounts: Account[], uuid: string | undefined | null): string {
		if (!uuid) return 'Sem conta';
		const acc = accounts.find((a) => a.uuid === uuid);
		return acc ? acc.name : 'Sem conta';
	}
	constructor() {
		super('accounts');
	}

	async getUserAccounts(): Promise<Account[]> {
		const response = await api.get('/api/v1/accounts');
		const accounts = Array.isArray(response.data.results) ? response.data.results : [];
		return accounts.map(normalizeAccount);
	}

	async getUserAccountsWithTotals(): Promise<Account[]> {
		const accounts = await this.getUserAccounts();
		const transactionRaw = await transactionService.getAll();
		const transaction = Array.isArray(transactionRaw) ? transactionRaw : [];
		const categoriesRaw = await api.get('/api/v1/categories');
		const categories = Array.isArray(categoriesRaw.data.results)
			? categoriesRaw.data.results
			: [];

		return accounts.map((account) => withDerivedTotals(account, transaction, categories));
	}

	async getTotals(): Promise<Record<NumericAccountField, number>> {
		const accounts = await this.getUserAccounts();
		const transactionRaw = await transactionService.getAll();
		const transaction = Array.isArray(transactionRaw) ? transactionRaw : [];
		const categoriesRaw = await api.get('/api/v1/categories');
		const categories = Array.isArray(categoriesRaw.data.results)
			? categoriesRaw.data.results
			: [];

		const accountsWithTotals = accounts.map((a) =>
			withDerivedTotals(a, transaction, categories),
		);

		return {
			openingBalance: sumBy(accountsWithTotals, 'openingBalance'),
			incomes: sumBy(accountsWithTotals, 'incomes'),
			incomingTransfer: sumBy(accountsWithTotals, 'incomingTransfer'),
			outgoingTransfers: sumBy(accountsWithTotals, 'outgoingTransfers'),
			expenses: sumBy(accountsWithTotals, 'expenses'),
			balance: sumBy(accountsWithTotals, 'balance'),
		};
	}

	async create(payload: { name: string; opening_balance: number; account_type: string }): Promise<void> {
		await api.post('/api/v1/accounts/', payload)
	}

	async update(uuid: string, payload: { name: string; opening_balance: number; account_type: string }): Promise<void> {
		await api.put(`/api/v1/accounts/${uuid}/`, payload)
	}

	async delete(uuid: string): Promise<void> {
		await api.delete(`/api/v1/accounts/${uuid}/`)
	}

	async getTotalsByAccount(account: Account): Promise<Record<NumericAccountField, number>> {
		const transactionRaw = await transactionService.getAll();
		const transaction = Array.isArray(transactionRaw) ? transactionRaw : [];
		const categoriesRaw = await api.get('/api/v1/categories');
		const categories = Array.isArray(categoriesRaw.data.results)
			? categoriesRaw.data.results
			: [];

		const derived = withDerivedTotals(account, transaction, categories);

		return {
			openingBalance: derived.openingBalance,
			incomes: derived.incomes,
			incomingTransfer: derived.incomingTransfer,
			outgoingTransfers: derived.outgoingTransfers,
			expenses: derived.expenses,
			balance: derived.balance,
		};
	}
}

export const accountService = new AccountService();
