import type { Transaction } from '@appTypes/transaction';
import type { CategoryType } from '@appTypes/category';
import GenericService from '@services/genericService';
import * as XLSX from 'xlsx';

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

	async exportAll(): Promise<Transaction[]> {
		const data = await this.getAll({ params: { page_size: 10000 } });
		return data.results;
	}

	exportCsv(transactions: Transaction[]): void {
		const TYPE_LABEL: Record<string, string> = { income: 'Receita', expense: 'Despesa' };
		const header = ['Data', 'Descrição', 'Tipo', 'Valor (R$)'];
		const rows = transactions.map((t) => [
			t.date,
			t.description,
			TYPE_LABEL[t.type] ?? t.type,
			Number(t.value).toFixed(2).replace('.', ','),
		]);

		const csv = [header, ...rows]
			.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
			.join('\r\n');

		const bom = '\uFEFF';
		const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
		this._download(blob, 'transacoes.csv');
	}

	exportXlsx(transactions: Transaction[]): void {
		const TYPE_LABEL: Record<string, string> = { income: 'Receita', expense: 'Despesa' };
		const rows = transactions.map((t) => ({
			Data: t.date,
			Descrição: t.description,
			Tipo: TYPE_LABEL[t.type] ?? t.type,
			'Valor (R$)': Number(t.value),
		}));

		const ws = XLSX.utils.json_to_sheet(rows);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Transações');
		XLSX.writeFile(wb, 'transacoes.xlsx');
	}

	private _download(blob: Blob, filename: string): void {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
}

export const transactionService = new TransactionService();
