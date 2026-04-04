import { useMediaQuery } from 'react-responsive';
import styles from './TransactionsTable.module.scss';
import { TransactionsTableMobile } from './_components/TransactionsTableMobile/TransactionsTableMobile';
import { TransactionsTableDesktop } from './_components/TransactionsTableDesktop/TransactionsTableDesktop';
import { useAccounts } from '@hooks/useAccounts';
import { useCategoryLookup } from '@hooks/useCategoryLookup';
import { formatDate } from '@utils/formatDate/formatDate';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Transaction } from '@appTypes/transaction';
import { toast } from 'react-toastify';
import { TransactionsTableActionsModal } from '../TransactionsTableActionsModal/TransactionsTableActionsModal';
import { useTransactions } from '@hooks/useTransactions';
import Button from '@components/ui/button/button';
import { SkeletonLoader } from '@components/ui/skeletonLoader/skeletonLoader';
import type { ReactNode } from 'react';

export type TransactionsTableModalType = 'edit' | 'delete' | null;

export type TransactionsTableRow = {
	item: Transaction;
	categoryLabel: string;
	categoryBg?: string;
	categoryIcon?: ReactNode;
	accountLabel: string;
	valueNumber?: number;
	dateLabel: string;
};

type Props = {
	data: Transaction[];
};

export function TransactionsTable({ data }: Props) {
	const isMobile = useMediaQuery({ maxWidth: 768 });
	const { loading, error, reload } = useTransactions();
	const { data: accounts, reload: reloadAccounts } = useAccounts();
	const { getCategory } = useCategoryLookup();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalType, setModalType] = useState<TransactionsTableModalType>(null);
	const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

	const closeModal = () => {
		setIsModalOpen(false);
		setModalType(null);
		setSelectedTransaction(null);
	};

	const openEdit = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setModalType('edit');
		setIsModalOpen(true);
	};

	const openDelete = (transaction: Transaction) => {
		setSelectedTransaction(transaction);
		setModalType('delete');
		setIsModalOpen(true);
	};

	const handleUpdateSave = async () => {
		toast('Informações atualizadas com sucesso!', {
			toastId: 'transaction-info-success',
		});
		await reload();
		await reloadAccounts();
		closeModal();
	};

	const handleDeleteSave = async () => {
		await reload();
		await reloadAccounts();
		closeModal();
	};

	function formatDateSafe(date: string) {
		try {
			return formatDate(date);
		} catch {
			return 'Data inválida';
		}
	}

	const sortedData = [...data].sort((a, b) => {
		const aTime = a.date ? new Date(a.date).getTime() : 0;
		const bTime = b.date ? new Date(b.date).getTime() : 0;
		return bTime - aTime;
	});

	const rows: TransactionsTableRow[] = sortedData.map((item) => {
		try {
			const category = getCategory(item.category);
			const categoryLabel = category?.name ?? item.category ?? 'Sem categoria';
			const categoryBg = item.categoryColor ?? category?.color;
			const categoryIcon = category?.icon ?? null;

			type AccountField = string | { uuid?: string } | undefined | null;
			const accountField: AccountField = item.account as AccountField;
			let accountId: string | undefined;
			if (typeof accountField === 'string') {
				accountId = accountField;
			} else if (accountField && typeof accountField === 'object' && 'uuid' in accountField) {
				accountId = accountField.uuid;
			}

			const accountObj = (accounts ?? []).find((acc) => acc.uuid === accountId);
			const accountLabel = accountObj ? accountObj.name : 'Sem conta';

			const valueNumber = typeof item.value === 'string' ? Number(item.value) : item.value;

			const dateLabel =
				(item as { dateFormatted?: string }).dateFormatted ||
				(item.date ? formatDateSafe(item.date) : 'Sem data');

			return {
				item,
				categoryLabel,
				categoryBg,
				categoryIcon,
				accountLabel,
				valueNumber,
				dateLabel,
			};
		} catch (err) {
			console.error('Erro ao normalizar transação:', item, err);
			const valueNumber = typeof item.value === 'string' ? Number(item.value) : item.value;

			return {
				item,
				categoryLabel: item.category ?? 'Sem categoria',
				categoryBg: item.categoryColor,
				categoryIcon: null,
				accountLabel: 'Sem conta',
				valueNumber,
				dateLabel:
					(item as { dateFormatted?: string }).dateFormatted ||
					(item.date ? formatDateSafe(item.date) : 'Sem data'),
			};
		}
	});

	if (loading) {
		return (
			<div className={styles.transactionsTable}>
				<SkeletonLoader rows={4} />
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.transactionsTable}>
				<p>Falha ao carregar: {error.message}</p>
				<Button variant="default" size="md" onClick={reload}>
					Tentar novamente
				</Button>
			</div>
		);
	}

	if (rows.length === 0) {
		return (
			<div className={styles.transactionsTable}>
				<div className={styles.transactionsTable__empty}>
					<p className={styles.transactionsTable__emptyText}>
						Não há transações cadastradas!
					</p>
					<Button variant="default" size="md" onClick={() => navigate('/transactions')}>
						Adicionar transações
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.transactionsTable}>
			{isMobile ? (
				<TransactionsTableMobile rows={rows} onEdit={openEdit} onDelete={openDelete} />
			) : (
				<TransactionsTableDesktop rows={rows} onEdit={openEdit} onDelete={openDelete} />
			)}

			<TransactionsTableActionsModal
				isOpen={isModalOpen}
				modalType={modalType}
				selectedTransaction={selectedTransaction}
				onClose={closeModal}
				onUpdate={handleUpdateSave}
				onDelete={handleDeleteSave}
			/>
		</div>
	);
}
