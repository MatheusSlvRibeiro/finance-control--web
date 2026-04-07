import { useMediaQuery } from 'react-responsive'
import { formatCurrency } from '@utils/formatCurrency/formatCurrency'
import { ArrowRightLeft, Landmark, Minus, Plus } from 'lucide-react'
import styles from './statsCard.module.scss'
import { useAccountsTotals } from '@hooks/useAccountsTotals'
import { SkeletonLoader } from '@components/ui/skeletonLoader/skeletonLoader'
import Button from '@components/ui/button/button'

export function StatsCard() {
	type StatsLabel = 'Contas' | 'Receitas' | 'Despesas' | 'Transferências'

	const isTablet = useMediaQuery({ minWidth: 576 })

	const { balance, incomes, expenses, incomingTransfer, loading, error, reload } =
		useAccountsTotals()

	const classMap: Record<StatsLabel, { card: string; icon: string }> = {
		Contas: {
			card: styles.contentAccount,
			icon: styles.icon_accounts,
		},
		Receitas: {
			card: styles.contentIncomes,
			icon: styles.icon_incomes,
		},
		Despesas: {
			card: styles.contentExpenses,
			icon: styles.icon_expenses,
		},
		Transferências: {
			card: styles.contentTransfers,
			icon: styles.icon_transfers,
		},
	}

	const stats: {
		label: StatsLabel
		amount: number
		icon: React.ReactNode
	}[] = [
		{
			label: 'Contas',
			amount: balance,
			icon: <Landmark />,
		},
		{
			label: 'Receitas',
			amount: incomes,
			icon: <Plus />,
		},
		{
			label: 'Despesas',
			amount: expenses,
			icon: <Minus />,
		},
		{
			label: 'Transferências',
			amount: incomingTransfer,
			icon: <ArrowRightLeft />,
		},
	]

	if (loading) {
		return (
			<div className={styles.StatsCard}>
				<SkeletonLoader rows={4} />
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.StatsCard}>
				<p>Falha ao carregar: {error.message}</p>
				<Button variant="default" size="md" onClick={reload}>
					Tentar novamente
				</Button>
			</div>
		)
	}

	return (
		<section className={styles.StatsCard}>
			{!isTablet && <p className={styles.StatsCard__title}>Visão Geral</p>}

			{stats.map((item) => (
				<div key={item.label} className={classMap[item.label].card}>
					<div className={classMap[item.label].icon}>{item.icon}</div>
					<div className={styles.statsCard__type}>
						<p className={styles.statsCard__label}>{item.label}</p>
						<p className={styles.statsCard__amount}>
							{formatCurrency(item.amount)}
						</p>
					</div>
				</div>
			))}
		</section>
	)
}
