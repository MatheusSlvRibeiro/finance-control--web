import { ReactNode, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { Transaction, TransactionType } from '@appTypes/transaction';
import styles from './TransactionsForm.module.scss';
import { Input } from '@components/ui/inputs/baseInput/input';
import { Select } from '@components/ui/select/Select';
import { DateInput } from '@components/ui/inputs/DateInput/DateInput';
import { CurrencyInput } from '@components/ui/inputs/currencyInput/CurrencyInput';
import { useCategories } from '@hooks/useCategories';
import { useAccounts } from '@hooks/useAccounts';

const transactionSchema = z.object({
	description: z.string().min(1, 'Descrição é obrigatória'),
	type: z.enum(['income', 'expense'], { error: 'Selecione o tipo' }),
	category: z.string().min(1, 'Selecione uma categoria'),
	account: z.string().min(1, 'Selecione uma conta'),
	date: z.string().min(1, 'Selecione uma data'),
	valueInCents: z.number().min(1, 'Insira um valor maior que zero'),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
type FormErrors = Partial<Record<keyof TransactionFormValues, string>>;

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
	const [errors, setErrors] = useState<FormErrors>({});

	const categoryOptions: SelectOption[] = useMemo(
		() =>
			categories
				.filter((c) => !type || c.type === type)
				.map((c) => ({ value: c.uuid, label: c.name, icon: c.icon })),
		[categories, type],
	);

	const accountOptions: SelectOption[] = useMemo(
		() => accounts.map((a) => ({ value: a.uuid, label: a.name })),
		[accounts],
	);

	useEffect(() => {
		setDescription(initialValues?.description ?? '');
		setType((initialValues?.type as TransactionType) ?? '');
		setCategory(initialValues?.category ?? '');
		setAccount(initialValues?.account ?? '');
		setDate(toDateInputValue(initialValues?.date));
		setValueInCents(Math.round((initialValues?.value ?? 0) * 100));
		setErrors({});
	}, [initialValues]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const result = transactionSchema.safeParse({ description, type, category, account, date, valueInCents });

		if (!result.success) {
			const fieldErrors: FormErrors = {};
			result.error.issues.forEach((issue) => {
				const key = issue.path[0] as keyof TransactionFormValues;
				if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
			});
			setErrors(fieldErrors);
			return;
		}

		setErrors({});
		onSubmit?.(result.data);
	};

	return (
		<form
			id={formId}
			action="submit"
			onSubmit={handleSubmit}
			className={styles.transactionForm}
		>
			<div>
				<Input
					id="description"
					name="description"
					label="Descrição"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				{errors.description && <p className={styles.fieldError}>{errors.description}</p>}
			</div>

			<div>
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
				{errors.type && <p className={styles.fieldError}>{errors.type}</p>}
			</div>

			<div>
				<Select
					id="category"
					name="category"
					label="Categoria"
					options={categoryOptions}
					value={category}
					onChange={setCategory}
				/>
				{errors.category && <p className={styles.fieldError}>{errors.category}</p>}
			</div>

			<div>
				<Select
					id="account"
					name="account"
					label="Conta"
					options={accountOptions}
					value={account}
					onChange={setAccount}
				/>
				{errors.account && <p className={styles.fieldError}>{errors.account}</p>}
			</div>

			<div>
				<DateInput
					id="date"
					name="date"
					label="Data"
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
				{errors.date && <p className={styles.fieldError}>{errors.date}</p>}
			</div>

			<div>
				<CurrencyInput
					id="value"
					name="value"
					label="Valor"
					valueInCents={valueInCents}
					onChangeInCents={setValueInCents}
				/>
				{errors.valueInCents && <p className={styles.fieldError}>{errors.valueInCents}</p>}
			</div>
		</form>
	);
}
