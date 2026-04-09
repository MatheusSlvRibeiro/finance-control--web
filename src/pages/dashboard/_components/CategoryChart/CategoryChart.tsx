import { formatCurrency } from '@utils/formatCurrency/formatCurrency';
import { Pie, ResponsiveContainer, PieChart, Tooltip, Cell } from 'recharts';
import styles from './CategoryChart.module.scss';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@components/ui/button/button';
import { categoryService } from '@services/category/categoryService';
import { transactionService } from '@services/transactions/transactionService';
import type { Category } from '@appTypes/category';
import type { Transaction } from '@appTypes/transaction';
import { SkeletonLoader } from '@components/ui/skeletonLoader/skeletonLoader';

type ChartItem = {
	id: string;
	name: string;
	value: number;
	color: string;
};

// Tooltip customizado — mesmo padrão do ExpenseChart
const CustomTooltip = ({ active, payload }: any) => {
	if (!active || !payload?.length) return null;
	const {
		name,
		value,
		payload: { color },
	} = payload[0];
	return (
		<div
			style={{
				background: 'var(--bg-surface)',
				border: '1px solid var(--border)',
				borderRadius: 8,
				padding: '10px 14px',
				fontSize: 13,
			}}
		>
			<p style={{ margin: '0 0 4px', color, fontWeight: 600 }}>{name}</p>
			<p style={{ margin: 0, color: 'var(--text-muted)' }}>{formatCurrency(value)}</p>
		</div>
	);
};

export function CategoryChart() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [activeIndex, setActiveIndex] = useState<number | null>(null); // ← hover state

	const fetchAll = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const [txData, cats] = await Promise.all([
				transactionService.getAll({ params: { page_size: 1000 } }),
				categoryService.getAll(),
			]);
			setTransactions(Array.isArray(txData.results) ? txData.results : []);
			setCategories(cats);
		} catch (e) {
			setError(e instanceof Error ? e : new Error('Erro ao carregar dados'));
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAll();
	}, [fetchAll]);

	const chartData: ChartItem[] = useMemo(() => {
		const categoryByUuid = new Map<string, { name: string; color: string; type: string }>();
		categories.forEach((c) => {
			categoryByUuid.set(c.uuid, { name: c.name, color: c.color, type: c.type });
		});

		const expenses = transactions.filter((t) => {
			const type = t.type ?? categoryByUuid.get(String(t.category))?.type;
			return type === 'expense';
		});

		const totalsByUuid = new Map<string, number>();
		expenses.forEach((t) => {
			const key = String(t.category ?? 'unknown');
			const value = Number(t.value);
			totalsByUuid.set(
				key,
				(totalsByUuid.get(key) ?? 0) + (Number.isFinite(value) ? value : 0),
			);
		});

		return Array.from(totalsByUuid.entries())
			.map(([uuid, total]) => {
				const meta = categoryByUuid.get(uuid);
				return {
					id: uuid,
					name: meta?.name ?? 'Sem categoria',
					value: total,
					color: meta?.color ?? '#94a3b8',
				};
			})
			.filter((x) => x.value > 0)
			.sort((a, b) => b.value - a.value);
	}, [transactions, categories]);

	if (loading)
		return (
			<div className={styles.categoryChart}>
				<SkeletonLoader rows={4} />
			</div>
		);

	if (error) {
		return (
			<div className={styles.categoryChart}>
				<p>Falha ao carregar: {error.message}</p>
				<Button variant="default" size="md" onClick={fetchAll}>
					Tentar novamente
				</Button>
			</div>
		);
	}

	const emptyData = [{ name: '', value: 1, color: '#2e2e3e' }];
	const isEmpty = chartData.length === 0;
	const displayData = isEmpty ? emptyData : chartData;

	const total = chartData.reduce((acc, item) => acc + item.value, 0);

	return (
		<div className={styles.categoryChart}>
			<h3 className={styles.categoryChart__title}>Despesas por Categoria</h3>
			<div className={styles.categoryChart__Content}>
				{/* Pie com label central de total */}
				<div className={styles.pieChart} style={{ position: 'relative' }}>
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								dataKey="value"
								data={displayData}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={100}
								paddingAngle={isEmpty ? 0 : 3}
								strokeWidth={0} // remove borda branca entre fatias
								onMouseEnter={(_, index) => setActiveIndex(index)}
								onMouseLeave={() => setActiveIndex(null)}
							>
								{displayData.map((entry, index) => (
									<Cell
										key={`cell-${entry.name}`}
										fill={entry.color}
										opacity={
											activeIndex === null || activeIndex === index ? 1 : 0.4
										} // destaque no hover
										style={{
											cursor: isEmpty ? 'default' : 'pointer',
											transition: 'opacity 0.2s',
										}}
									/>
								))}
							</Pie>
							{!isEmpty && <Tooltip content={<CustomTooltip />} />}
						</PieChart>
					</ResponsiveContainer>

					{/* Label central */}
					{!isEmpty && (
						<div
							style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%)',
								textAlign: 'center',
								pointerEvents: 'none',
							}}
						>
							<p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Total</p>
							<p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
								{formatCurrency(total)}
							</p>
						</div>
					)}
				</div>

				<div className={styles.legend}>
					{isEmpty ? (
						<p className={styles.empty}>Nenhuma despesa encontrada</p>
					) : (
						chartData.map((item, index) => (
							<div
								key={item.id}
								className={styles.pieChart__infoList}
								style={{
									opacity:
										activeIndex === null || activeIndex === index ? 1 : 0.4,
									transition: 'opacity 0.2s',
									cursor: 'default',
								}}
								onMouseEnter={() => setActiveIndex(index)}
								onMouseLeave={() => setActiveIndex(null)}
							>
								<div className={styles.pieChart__category}>
									<div
										className={styles.pieChart__dot}
										style={{ backgroundColor: item.color }}
									/>
									<span className={styles.pieChart__infoType}>{item.name}</span>
								</div>
								<span className={styles.pieChart__infoValue}>
									{formatCurrency(item.value)}
								</span>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
