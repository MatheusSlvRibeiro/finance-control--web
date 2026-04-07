import { useMediaQuery } from 'react-responsive'
import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import styles from './ExpenseChart.module.scss'
import { useTransactions } from '@hooks/useTransactions'
import { useMemo } from 'react'
import Button from '@components/ui/button/button'
import { SkeletonLoader } from '@components/ui/skeletonLoader/skeletonLoader'
import { formatCurrency } from '@utils/formatCurrency/formatCurrency'

export function ExpenseChart() {
	const { data: transactions = [], loading, error, reload } = useTransactions()

	type ChartPoint = {
		month: string
		receitas: number
		despesas: number
	}

	const evolutionData: ChartPoint[] = useMemo(() => {
		const MONTH_LABELS = [
			'Jan',
			'Fev',
			'Mar',
			'Abr',
			'Mai',
			'Jun',
			'Jul',
			'Ago',
			'Set',
			'Out',
			'Nov',
			'Dez',
		] as const

		const now = new Date()
		const points: Array<ChartPoint & { key: string }> = []
		const pointByKey = new Map<string, ChartPoint & { key: string }>()

		for (let offset = 5; offset >= 0; offset--) {
			const d = new Date(now.getFullYear(), now.getMonth() - offset, 1)
			const key = `${d.getFullYear()}-${d.getMonth()}`
			const point: ChartPoint & { key: string } = {
				key,
				month: MONTH_LABELS[d.getMonth()] ?? '',
				receitas: 0,
				despesas: 0,
			}
			points.push(point)
			pointByKey.set(key, point)
		}

		transactions.forEach((t) => {
			const value = Number(t.value)
			const date = new Date(t.date)
			if (!Number.isFinite(date.getTime())) return

			const key = `${date.getFullYear()}-${date.getMonth()}`
			const point = pointByKey.get(key)
			if (!point) return

			if (t.type === 'income') point.receitas += value
			else point.despesas += value
		})

		return points.map(({ key: _key, ...rest }) => rest)
	}, [transactions])

	const isMobile = useMediaQuery({ maxWidth: 425 })
	const charHeight = isMobile ? 200 : 300

	if (loading) {
		return (
			<div className={styles.monthExpense}>
				<SkeletonLoader rows={4} />
			</div>
		)
	}

	if (error) {
		return (
			<div className={styles.monthExpense}>
				<p>Falha ao carregar: {error.message}</p>
				<Button variant="default" size="md" onClick={reload}>
					Tentar novamente
				</Button>
			</div>
		)
	}

	return (
		<div className={styles.monthExpense}>
			<h3 className={styles.monthExpense__title}>Evolução Financeira</h3>
			<div style={{ width: '100%', height: charHeight }}>
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={evolutionData}>
						<CartesianGrid />
						<XAxis dataKey="month" />
						<YAxis tickFormatter={(v) => formatCurrency(Number(v) || 0)} />
						<Tooltip formatter={(v) => formatCurrency(Number(v) || 0)} />
						<Line dataKey="receitas" name="Receitas" stroke="#16a149" />
						<Line dataKey="despesas" name="Despesas" stroke="#dc2828" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
