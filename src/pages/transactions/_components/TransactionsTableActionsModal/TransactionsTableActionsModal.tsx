import { Transaction } from '@appTypes/transaction';
import { BaseModal } from '@components/ui/modal/baseModal/BaseModal';
import { FormModal } from '@components/ui/modal/formModal/FormModal';
import { TransactionForm, TransactionFormValues } from '../TransactionsForm/TransactionsForm';
import { DeleteModal } from '@components/ui/modal/deleteModal/DeleteModal';
import { TransactionsTableModalType } from '../TransactionsTable/TransactionsTable';
import { useId } from 'react';
import { transactionService } from '@services/transactions/transactionService';

type Props = {
	isOpen: boolean;
	modalType: TransactionsTableModalType;
	selectedTransaction: Transaction | null;
	onClose: () => void;
	onUpdate: () => void;
	onDelete: () => void;
	editTitle?: string;
	editMessage?: string;
};

export function TransactionsTableActionsModal({
	isOpen,
	modalType,
	selectedTransaction,
	onClose,
	onUpdate,
	onDelete,
	editTitle,
	editMessage,
}: Props) {
	const formId = useId();

	const handleSubmit = async (values: TransactionFormValues) => {
		if (!selectedTransaction?.uuid) return;

		await transactionService.update(selectedTransaction.uuid, {
			description: values.description,
			category: values.category,
			account: values.account,
			date: values.date,
			value: values.valueInCents / 100,
			type: values.type as 'income' | 'expense',
		});

		onUpdate();
	};

	const handleDelete = async () => {
		if (!selectedTransaction?.uuid) return;

		try {
			await transactionService.delete(selectedTransaction.uuid);
			onDelete();
		} catch {
			alert('Erro ao deletar transação. Tente novamente.');
		}
	};

	return (
		<BaseModal isOpen={isOpen} onClose={onClose}>
			{modalType === 'edit' && selectedTransaction && (
				<FormModal
					title={editTitle}
					message={editMessage}
					closeModal={onClose}
					handleSave={() => undefined}
					formId={formId}
				>
					<TransactionForm
						initialValues={selectedTransaction}
						formId={formId}
						onSubmit={handleSubmit}
					/>
				</FormModal>
			)}

			{modalType === 'delete' && selectedTransaction && (
				<DeleteModal
					title="Excluir transação"
					message={
						<>
							Tem certeza que deseja excluir a transação{' '}
							<strong>{selectedTransaction.description}</strong>?
							<br />
							Essa ação não pode ser desfeita.
						</>
					}
					closeModal={onClose}
					deleteAction={handleDelete}
					deleteMessage="Transação excluída com sucesso!"
				/>
			)}
		</BaseModal>
	);
}
