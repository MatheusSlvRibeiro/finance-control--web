import type { Transaction, TransactionType } from '@appTypes/transaction';
import { CategoryType } from '@appTypes/category';
import GenericService from '@services/genericService';
import api from '@services/api';

type TransactionPayload = {
	description: string;
	category: string;
	account: string;
	date?: string;
	value: number;
	type: TransactionType;
};

class TransactionService extends GenericService<Transaction> {
	constructor() {
		super('transactions');
	}

	async getTotalByType(type: CategoryType): Promise<number> {
		const data = await this.getAll({ params: { type, page_size: 1000 } });
		return data.results.reduce((sum, t) => sum + Number(t.value), 0);
	}

	async create(payload: TransactionPayload): Promise<Transaction> {
		const { data } = await api.post<Transaction>(this.url, payload);
		return data;
	}

	async update(uuid: string, payload: TransactionPayload) {
		const { data } = await api.put<Transaction>(`${this.url}${uuid}/`, payload);
		return data;
	}

	async delete(uuid: string) {
		await api.delete(`${this.url}${uuid}/`);
	}
}

export const transactionService = new TransactionService();
