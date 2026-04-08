import type { Transaction } from '@appTypes/transaction';
import type { CategoryType } from '@appTypes/category';
import GenericService from '@services/genericService';

export type TransactionPayload = {
	description: string;
	category: string;
	account: string;
	date?: string;
	value: number;
	type: string;
};

class TransactionService extends GenericService<Transaction> {
	constructor() {
		super('transactions');
	}

	async getTotalByType(type: CategoryType): Promise<number> {
		const data = await this.getAll({ params: { type, page_size: 1000 } });
		return data.results.reduce((sum, t) => sum + Number(t.value), 0);
	}
}

export const transactionService = new TransactionService();
