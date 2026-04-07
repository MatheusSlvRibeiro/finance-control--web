import type { Account } from '@appTypes/account';
import { NumericAccountField } from '@appTypes/numericAccountField';
import type { Transaction } from '@appTypes/transaction';
import api from '@services/api';
import GenericService from '@services/genericService';
import { transactionService } from '@services/transactions/transactionService';

const sumBy = (accounts: Account[], field: NumericAccountField) =>
	accounts.reduce((acc, a) => acc + (a[field] ?? 0), 0);

const sumTransactions = (
	transactions: Transaction[],
	accountId: string,
	type: 'income' | 'expense',
) =>
	transactions.reduce(
		(acc, t) => (t.account === accountId && t.type === type ? acc + Number(t.value) : acc),
		0,
	);

function normalizeAccount(account: any): Account {
	return {
		...account,
		type: account.account_type ?? account.type,
		openingBalance: Number(account.opening_balance),
	};
}

const withDerivedTotals = (account: Account, transactions: Transaction[]): Account => {
	const incomes = sumTransactions(transactions, account.uuid, 'income');
	const expenses = sumTransactions(transactions, account.uuid, 'expense');
	const incomingTransfer = 0;
	const outgoingTransfers = 0;
	const balance = account.openingBalance + incomes + incomingTransfer - outgoingTransfers - expenses;

	return { ...account, incomes, expenses, incomingTransfer, outgoingTransfers, balance };
};

class AccountService extends GenericService<Account> {
	constructor() {
		super('accounts');
	}

	getAccountNameById(accounts: Account[], uuid: string | undefined | null): string {
		if (!uuid) return 'Sem conta';
		const acc = accounts.find((a) => a.uuid === uuid);
		return acc ? acc.name : 'Sem conta';
	}

	async getUserAccounts(): Promise<Account[]> {
		const response = await api.get('/api/v1/accounts');
		const accounts = Array.isArray(response.data.results) ? response.data.results : [];
		return accounts.map(normalizeAccount);
	}

	private async fetchTransactions(): Promise<Transaction[]> {
		const raw = await transactionService.getAll();
		return Array.isArray(raw.results) ? raw.results : [];
	}

	async getUserAccountsWithTotals(): Promise<Account[]> {
		const [accounts, transactions] = await Promise.all([
			this.getUserAccounts(),
			this.fetchTransactions(),
		]);
		return accounts.map((account) => withDerivedTotals(account, transactions));
	}

	async getTotals(): Promise<Record<NumericAccountField, number>> {
		const [accounts, transactions] = await Promise.all([
			this.getUserAccounts(),
			this.fetchTransactions(),
		]);
		const accountsWithTotals = accounts.map((a) => withDerivedTotals(a, transactions));
		return {
			openingBalance: sumBy(accountsWithTotals, 'openingBalance'),
			incomes: sumBy(accountsWithTotals, 'incomes'),
			incomingTransfer: sumBy(accountsWithTotals, 'incomingTransfer'),
			outgoingTransfers: sumBy(accountsWithTotals, 'outgoingTransfers'),
			expenses: sumBy(accountsWithTotals, 'expenses'),
			balance: sumBy(accountsWithTotals, 'balance'),
		};
	}

	async getTotalsByAccount(account: Account): Promise<Record<NumericAccountField, number>> {
		const transactions = await this.fetchTransactions();
		const derived = withDerivedTotals(account, transactions);
		return {
			openingBalance: derived.openingBalance,
			incomes: derived.incomes,
			incomingTransfer: derived.incomingTransfer,
			outgoingTransfers: derived.outgoingTransfers,
			expenses: derived.expenses,
			balance: derived.balance,
		};
	}

	async create(payload: { name: string; opening_balance: number; account_type: string }): Promise<void> {
		await api.post('/api/v1/accounts/', payload);
	}

	async update(uuid: string, payload: { name: string; opening_balance: number; account_type: string }): Promise<void> {
		await api.put(`/api/v1/accounts/${uuid}/`, payload);
	}

	async delete(uuid: string): Promise<void> {
		await api.delete(`/api/v1/accounts/${uuid}/`);
	}
}

export const accountService = new AccountService();
