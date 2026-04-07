import { Link } from 'react-router-dom'
import styles from './LatestExpenses.module.scss'
import { useTransactions } from '@hooks/useTransactions'
import { useMemo } from 'react'
import { Transaction } from '@appTypes/transaction'
import Button from '@components/ui/button/button'
import { SkeletonLoader } from '@components/ui/skeletonLoader/skeletonLoader'
import { TransactionsTable } from '@pages/transactions/_components/TransactionsTable/TransactionsTable'

export type LatestExpensesProps = {
	data: Transaction[]
	onEdit: (t: Transaction) => void
	onDelete: (t: Transaction) => void
}

export function LatestExpenses() {
	const { getTransactionByType, loading, error, reload } = useTransactions()

	const expenses = getTransactionByType('expense')

	const latestExpenses = useMemo(() => {
		return [...expenses]
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.slice(0, 4)
	}, [expenses])

	if (loading) {
		return (
			<div className={styles.latestExpenses}>
				<SkeletonLoader rows={4} />
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.latestExpenses}>
				<p>Falha ao carregar: {error.message}</p>
				<Button variant="default" size="md" onClick={reload}>
					Tentar novamente
				</Button>
			</div>
		)
	}

	return (
		<div className={styles.latestExpenses}>
			<div className={styles.latestExpenses__header}>
				<h3 className={styles.latestExpenses__title}>Transações Recentes</h3>

				<Link className={styles.latestExpenses__button} to="/transactions">
					Ver todas
				</Link>
			</div>

			<TransactionsTable data={latestExpenses} onReload={reload} />
		</div>
	)
}
