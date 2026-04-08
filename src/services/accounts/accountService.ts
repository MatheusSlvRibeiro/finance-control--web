import type { Account, AccountType } from '@appTypes/account';
import type { NumericAccountField } from '@appTypes/numericAccountField';
import type { Transaction } from '@appTypes/transaction';
import api from '@services/api';
import GenericService from '@services/genericService';
import { transactionService } from '@services/transactions/transactionService';

export type AccountPayload = {
	name: string;
	opening_balance: number;
	account_type: string;
};

const sumBy = (accounts: Account[], field: NumericAccountField) =>
	accounts.reduce((acc, a) => acc + (a[field] ?? 0), 0);

const sumTransactions = (
	transactions: Transaction[],
	accountId: string,
	type: 'income' | 'expense',
) =>
	transactions.reduce(
		(acc, t) => (String(t.account) === accountId && t.type === type ? acc + Number(t.value) : acc),
		0,
	);

type AccountRaw = {
	uuid: string;
	name: string;
	account_type: AccountType;
	opening_balance: string | number;
};

function normalizeAccount(raw: AccountRaw): Account {
	return {
		uuid: raw.uuid,
		name: raw.name,
		type: raw.account_type,
		openingBalance: Number(raw.opening_balance),
		incomes: 0,
		expenses: 0,
		incomingTransfer: 0,
		outgoingTransfers: 0,
		balance: 0,
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
		return accounts.find((a) => a.uuid === uuid)?.name ?? 'Sem conta';
	}

	async getUserAccounts(): Promise<Account[]> {
		const { data } = await api.get<{ results: AccountRaw[] }>(this.url);
		return Array.isArray(data.results) ? data.results.map(normalizeAccount) : [];
	}

	private async fetchTransactions(): Promise<Transaction[]> {
		const res = await transactionService.getAll({ params: { page_size: 1000 } });
		return Array.isArray(res.results) ? res.results : [];
	}

	async getUserAccountsWithTotals(): Promise<Account[]> {
		const [accounts, transactions] = await Promise.all([
			this.getUserAccounts(),
			this.fetchTransactions(),
		]);
		return accounts.map((account) => withDerivedTotals(account, transactions));
	}

	async getTotals(): Promise<Record<NumericAccountField, number>> {
		const accounts = await this.getUserAccountsWithTotals();
		return {
			openingBalance: sumBy(accounts, 'openingBalance'),
			incomes: sumBy(accounts, 'incomes'),
			incomingTransfer: sumBy(accounts, 'incomingTransfer'),
			outgoingTransfers: sumBy(accounts, 'outgoingTransfers'),
			expenses: sumBy(accounts, 'expenses'),
			balance: sumBy(accounts, 'balance'),
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
}

export const accountService = new AccountService();
