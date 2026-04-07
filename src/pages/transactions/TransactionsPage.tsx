import { PageHeader } from '@components/layout/PageHeader/PageHeader';
import Button from '@components/ui/button/button';
import { Plus } from 'lucide-react';
import styles from './TransactionsPage.module.scss';
import { TransactionsTable } from './_components/TransactionsTable/TransactionsTable';
import { BaseModal } from '@components/ui/modal/baseModal/BaseModal';
import { TransactionForm } from './_components/TransactionsForm/TransactionsForm';
import { FormModal } from '@components/ui/modal/formModal/FormModal';
import { useId, useState } from 'react';
import { toast } from 'react-toastify';
import { useTransactions } from '@hooks/useTransactions';
import { transactionService } from '@services/transactions/transactionService';
import { parseApiError } from '@utils/parseApiError/parseApiError';

export default function TransactionsPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data, reload, count, totalPages, page, setPage } = useTransactions();
	const formId = useId();

	const openModal = () => {
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handleSubmit = async (values: {
		description: string;
		type: 'income' | 'expense' | '';
		category: string;
		account: string;
		date: string;
		valueInCents: number;
	}) => {
		if (!values.type) {
			toast('Selecione um tipo de transação!', { toastId: 'type-error' });
			return;
		}

		if (!values.description) {
			toast('Descrição é obrigatória!', { toastId: 'description-error' });
			return;
		}

		if (!values.category) {
			toast('Selecione uma categoria!', { toastId: 'category-error' });
			return;
		}

		if (!values.account) {
			toast('Selecione uma conta!', { toastId: 'account-error' });
			return;
		}

		if (!values.valueInCents || values.valueInCents <= 0) {
			toast('Insira um valor válido!', { toastId: 'value-error' });
			return;
		}

		try {
			await transactionService.create({
				description: values.description,
				type: values.type,
				category: values.category,
				account: values.account,
				date: values.date || undefined,
				value: values.valueInCents / 100,
			});
			toast('Transação cadastrada com sucesso!', {
				toastId: 'transaction-add-success',
			});
			await reload();
			setIsModalOpen(false);
		} catch (error) {
			toast(parseApiError(error, 'Erro ao criar transação. Tente novamente!'), {
				toastId: 'transaction-error',
			});
		}
	};

	return (
		<div className={styles.transactionsPage}>
			<PageHeader title="Transações" subtitle="Gerencie suas receitas e despesas">
				<Button size="sm" variant="register" onClick={openModal}>
					<Plus />
					Nova transação
				</Button>
			</PageHeader>

			<TransactionsTable data={data} />

			{totalPages > 1 && (
				<div className={styles.pagination}>
					<button
						className={styles.pagination__btn}
						onClick={() => setPage((p) => p - 1)}
						disabled={page <= 1}
					>
						← Anterior
					</button>

					<span className={styles.pagination__info}>
						Página {page} de {totalPages}
						<span className={styles.pagination__count}> ({count} resultados)</span>
					</span>

					<button
						className={styles.pagination__btn}
						onClick={() => setPage((p) => p + 1)}
						disabled={page >= totalPages}
					>
						Próxima →
					</button>
				</div>
			)}

			<BaseModal isOpen={isModalOpen} onClose={closeModal}>
				<FormModal
					title="Nova transação"
					message="Cadastre as informações da transação"
					closeModal={closeModal}
					handleSave={() => undefined}
					formId={formId}
				>
					<TransactionForm formId={formId} onSubmit={handleSubmit} />
				</FormModal>
			</BaseModal>
		</div>
	);
}
