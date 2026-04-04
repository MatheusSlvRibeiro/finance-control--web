import { formatCurrency } from '@utils/formatCurrency/formatCurrency'
import { Pie, ResponsiveContainer, PieChart, Tooltip, Cell } from 'recharts'
import styles from './CategoryChart.module.scss'
import { useMemo } from 'react'

import { useCategories } from '@hooks/useCategories'
import Button from '@components/ui/button/button'
import { useTransactions } from '@hooks/useTransactions'

type ChartItem = {
	id: string
	name: string
	value: number
	color: string
}

export function CategoryChart() {
	const {
		getTransactionByType,
		loading: txLoading,
		error: txError,
		reload: reloadTx,
	} = useTransactions()

	const {
		data: categories,
		loading: catLoading,
		error: catError,
		reload: reloadCat,
	} = useCategories()

	const loading = txLoading || catLoading
	const error = txError ?? catError

	const chartData: ChartItem[] = useMemo(() => {
		const expenses = getTransactionByType('expense')
		const totalsByCategoryName = new Map<string, number>()

		expenses.forEach((t) => {
			const key = (t.category ?? 'Sem categoria').trim() || 'Sem categoria'
			const current = totalsByCategoryName.get(key) ?? 0
			const value = Number.isFinite(t.value) ? t.value : 0
			totalsByCategoryName.set(key, current + value)
		})

		const categoryMetaByName = new Map<string, { id: string; color: string }>()

		categories.forEach((c) => {
			categoryMetaByName.set(c.name.toLowerCase(), {
				id: c.uuid,
				color: c.color,
			})
		})

		const result: ChartItem[] = Array.from(totalsByCategoryName.entries()).map(
			([name, total]) => {
				const meta = categoryMetaByName.get(name.toLowerCase())
				const fallbackColor =
					expenses.find((t) => t.category === name)?.categoryColor ?? '#94a3b8'

				return {
					id: meta?.id ?? name,
					name,
					value: total,
					color: meta?.color ?? fallbackColor,
				}
			},
		)

		return result.filter((x) => x.value > 0).sort((a, b) => b.value - a.value)
	}, [categories, getTransactionByType])

	if (loading) {
		return <div className={styles.container}>Carregando gráfico...</div>
	}

	if (error) {
		return (
			<div className={styles.container}>
				<p>Falha ao carregar: {error.message}</p>
				<Button
					variant="default"
					size="md"
					onClick={() => {
						reloadTx?.()
						reloadCat?.()
					}}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}

	return (
		<div className={styles.categoryChart}>
			<h3 className={styles.categoryChart__title}>Despesas por Categoria</h3>
			<div className={styles.categoryChart__Content}>
				<div className={styles.pieChart}>
					<ResponsiveContainer>
						<PieChart>
							<Pie
								dataKey="value"
								data={chartData}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={100}
								paddingAngle={2}
							>
								{chartData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip formatter={(v) => formatCurrency(Number(v) || 0)} />
						</PieChart>
					</ResponsiveContainer>
				</div>
				<div>
					{chartData.map((item) => (
						<div key={item.name} className={styles.pieChart__infoList}>
							<div className={styles.pieChart__category}>
								<div
									className={styles.pieChart__dot}
									style={{
										backgroundColor: item.color,
									}}
								></div>
								<span className={styles.pieChart__infoType}>{item.name}</span>
							</div>
							<span className={styles.pieChart__infoValue}>
								{formatCurrency(item.value)}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
