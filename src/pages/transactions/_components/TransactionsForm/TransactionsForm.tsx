import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Transaction, TransactionType } from '@appTypes/transaction';
import styles from './TransactionsForm.module.scss';
import { Input } from '@components/ui/inputs/baseInput/input';
import { Select } from '@components/ui/select/Select';
import { DateInput } from '@components/ui/inputs/DateInput/DateInput';
import { CurrencyInput } from '@components/ui/inputs/currencyInput/CurrencyInput';
import { useCategories } from '@hooks/useCategories';
import { useAccounts } from '@hooks/useAccounts';

type TransactionFormValues = {
	description: string;
	type: TransactionType | '';
	category: string;
	account: string;
	date: string;
	valueInCents: number;
};

type TransactionFormProps = {
	initialValues?: Partial<Transaction>;
	onSubmit?: (values: TransactionFormValues) => void;
	formId?: string;
};

type SelectOption = {
	value: string;
	label: string;
	icon?: ReactNode;
};

function findOptionValue(options: Array<{ value: string; label: string }>, raw?: string) {
	if (!raw) return '';

	const byValue = options.find((o) => o.value === raw);
	if (byValue) return byValue.value;

	const byLabel = options.find((o) => o.label === raw);
	return byLabel?.value ?? '';
}

function toDateInputValue(raw?: string) {
	if (!raw) return '';
	if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
	if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) return raw.slice(0, 10);

	const br = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
	if (br) {
		const [, dd, mm, yyyy] = br;
		return `${yyyy}-${mm}-${dd}`;
	}

	return '';
}

export function TransactionForm({ initialValues, onSubmit, formId }: TransactionFormProps) {
	const { data: categories } = useCategories();
	const { data: accounts } = useAccounts();

	const [description, setDescription] = useState('');
	const [type, setType] = useState<TransactionType | ''>('');
	const [category, setCategory] = useState('');
	const [account, setAccount] = useState('');
	const [valueInCents, setValueInCents] = useState(0);
	const [date, setDate] = useState('');

	const categoryOptions: SelectOption[] = useMemo(
		() =>
			categories
				.filter((c) => !type || c.type === type)
				.map((c) => ({
					value: c.uuid,
					label: c.name,
					icon: c.icon,
				})),
		[categories, type],
	);

	const accountOptions: SelectOption[] = useMemo(
		() =>
			accounts.map((a) => ({
				value: a.uuid,
				label: a.name,
			})),
		[accounts],
	);

	useEffect(() => {
		setDescription(initialValues?.description ?? '');
		setType((initialValues?.type as TransactionType) ?? '');
		setCategory('');
		setAccount('');
		setDate(toDateInputValue(initialValues?.date));
		setValueInCents(Math.round(((initialValues as any)?.value ?? 0) * 100));
	}, [initialValues]);

	useEffect(() => {
		const rawCategory = (initialValues as any)?.categoryId ?? (initialValues as any)?.category;
		const rawAccount = (initialValues as any)?.accountId ?? (initialValues as any)?.account;

		if (!category && rawCategory) {
			setCategory(findOptionValue(categoryOptions, rawCategory));
		}

		if (!account && rawAccount) {
			setAccount(findOptionValue(accountOptions, rawAccount));
		}
	}, [initialValues, categoryOptions, accountOptions, category, account]);

	useEffect(() => {
		if (!category) return;
		if (categoryOptions.some((opt) => opt.value === category)) return;
		setCategory('');
	}, [category, categoryOptions]);

	return (
		<form
			id={formId}
			action="submit"
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit?.({
					description,
					type,
					category,
					account,
					date,
					valueInCents,
				});
			}}
			className={styles.transactionForm}
		>
			<Input
				id="description"
				name="description"
				label="Descrição"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<Select
				id="type"
				name="type"
				label="Tipo"
				options={[
					{ value: 'income', label: 'Receita' },
					{ value: 'expense', label: 'Despesa' },
				]}
				value={type}
				onChange={(next) => setType(next as TransactionType | '')}
			/>
			<Select
				id="category"
				name="category"
				label="Categoria"
				options={categoryOptions}
				value={category}
				onChange={setCategory}
			/>
			<Select
				id="account"
				name="account"
				label="Conta"
				options={accountOptions}
				value={account}
				onChange={setAccount}
			/>

			<DateInput
				id="date"
				name="date"
				label="Data"
				value={date}
				onChange={(e) => setDate(e.target.value)}
			/>

			<CurrencyInput
				id="value"
				name="value"
				label="Valor"
				valueInCents={valueInCents}
				onChangeInCents={setValueInCents}
			/>
		</form>
	);
}
