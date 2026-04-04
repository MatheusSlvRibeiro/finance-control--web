import { useId, useState } from 'react';
import { formatCurrency } from '@utils/formatCurrency/formatCurrency';
import type { Account } from '@appTypes/account';
import { BaseModal } from '@components/ui/modal/baseModal/BaseModal';
import { EditAccountsModal } from './_components/EditAccountModal/EditAccountModal';
import { DeleteModal } from '@components/ui/modal/deleteModal/DeleteModal';
import styles from './AccountsCard.module.scss';
import { currentBalanceRow, getAmountClassName, metricRows } from './helpers';
import { AccountHeader } from './_components/AccountHeader/AccountHeader';
import { AccountMetrics } from './_components/AccountMetrics/AccountMetrics';
import { useAccounts } from '@hooks/useAccounts';
import { ACCOUNT_TYPE_OPTIONS_ARRAY } from 'src/constants/accountTypes.constants';
import { FormModal } from '@components/ui/modal/formModal/FormModal';
import { TransactionForm } from '@pages/transactions/_components/TransactionsForm/TransactionsForm';
import { toast } from 'react-toastify';
import { transactionService } from '@services/transactions/transactionService';
import { useTransactions } from '@hooks/useTransactions';

type ModalType = 'edit' | 'delete' | 'income' | 'expense' | null;

export default function AccountsCard() {
	const { data, reload } = useAccounts();
	const { reload: reloadTransactions } = useTransactions();
	const formId = useId();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<ModalType>(null);
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

	const closeModal = () => {
		setIsModalOpen(false);
		setModalType(null);
		setSelectedAccount(null);
	};

	const openEdit = (account: Account) => {
		setSelectedAccount(account);
		setModalType('edit');
		setIsModalOpen(true);
	};

	const openDelete = (account: Account) => {
		setSelectedAccount(account);
		setModalType('delete');
		setIsModalOpen(true);
	};

	const openAddExpense = (account: Account) => {
		setSelectedAccount(account);
		setModalType('expense');
		setIsModalOpen(true);
	};

	const openAddIncome = (account: Account) => {
		setSelectedAccount(account);
		setModalType('income');
		setIsModalOpen(true);
	};

	const handleTransactionSave = async (values: {
		description: string;
		type: 'income' | 'expense' | '';
		category: string;
		account: string;
		date: string;
		valueInCents: number;
	}) => {
		console.log('Form submitted with values:', values);

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
			await reloadTransactions();
			closeModal();
		} catch (error) {
			console.error('Erro ao criar transação:', error);
			toast('Erro ao criar transação. Tente novamente!', {
				toastId: 'transaction-error',
			});
		}
	};

	const accountTypes = ACCOUNT_TYPE_OPTIONS_ARRAY;
	const accountTypesMap = Object.fromEntries(accountTypes.map((t) => [t.value, t]));

	return (
		<>
			<div className={styles.accountsGrid}>
				{data.map((item) => {
					const accountType = accountTypesMap[item.type] || accountTypes[0];

					return (
						<div className={styles.accountsCard} key={item.name}>
							<AccountHeader
								icon={accountType.icon}
								name={item.name}
								type={accountType.label ?? item.type}
								item={item}
								openEdit={() => openEdit(item)}
								openDelete={() => openDelete(item)}
								openAddExpense={() => openAddExpense(item)}
								openAddIncome={() => openAddIncome(item)}
							/>

							<div className={styles.accountsCard__metrics}>
								{metricRows.map((row) => {
									const value = row.getValue(item);
									const amountClassName = getAmountClassName(row.id, value);

									return (
										<AccountMetrics
											key={row.id}
											id={row.id}
											label={row.label}
											className={amountClassName}
											value={value}
										/>
									);
								})}
							</div>

							{currentBalanceRow
								? (() => {
										const currentBalanceValue =
											currentBalanceRow.getValue(item);
										const currentBalanceClassName = getAmountClassName(
											currentBalanceRow.id,
											currentBalanceValue,
										);

										return (
											<div className={styles.accountsCard__currentBalance}>
												<div
													className={
														styles.accountsCard__currentBalanceLabel
													}
												>
													{currentBalanceRow.label}
												</div>
												<div
													className={
														styles.accountsCard__currentBalanceValue +
														(currentBalanceClassName
															? ` ${currentBalanceClassName}`
															: '')
													}
												>
													{formatCurrency(currentBalanceValue)}
												</div>
											</div>
										);
									})()
								: null}
						</div>
					);
				})}
			</div>

			<BaseModal isOpen={isModalOpen} onClose={closeModal}>
				{modalType === 'edit' && selectedAccount && (
					<EditAccountsModal
						closeModal={closeModal}
						accountName={selectedAccount.name}
						openingBalance={selectedAccount.openingBalance}
						type={selectedAccount.type}
					/>
				)}

				{modalType === 'delete' && selectedAccount && (
					<DeleteModal
						title="Excluir conta"
						message={
							<>
								Tem certeza que deseja excluir a conta{' '}
								<strong>{selectedAccount.name}</strong>?
								<br />
								Essa ação não pode ser desfeita.
							</>
						}
						closeModal={closeModal}
						deleteMessage="Conta excluída com sucesso!"
					/>
				)}

				{(modalType === 'income' || modalType === 'expense') && selectedAccount && (
					<FormModal
						title={modalType === 'income' ? 'Nova receita' : 'Nova despesa'}
						message="Cadastre as informacoes da transacao"
						closeModal={closeModal}
						handleSave={() => undefined}
						formId={formId}
					>
						<TransactionForm
							formId={formId}
							initialValues={{
								account: selectedAccount.uuid,
								type: modalType,
							}}
							onSubmit={handleTransactionSave}
						/>
					</FormModal>
				)}
			</BaseModal>
		</>
	);
}
