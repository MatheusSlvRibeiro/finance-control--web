import { PageHeader } from '@components/layout/PageHeader/PageHeader'
import { StatsCard } from './_components/statsCard/StatsCard'
import { ExpenseChart } from './_components/ExpenseChart/ExpenseChart'
import { CategoryChart } from './_components/CategoryChart/CategoryChart'
import { LatestExpenses } from './_components/LatestExpenses/LatestExpenses'
import styles from './Dashboard.module.scss'

export default function Dashboard() {
	return (
		<div className={styles.dashboard}>
			<PageHeader title="Dashboard" subtitle="Visão geral das suas finanças" />

			<StatsCard />

			<section className={styles.dashboard__charts}>
				<ExpenseChart />

				<CategoryChart />
			</section>

			<section>
				<LatestExpenses />
			</section>
		</div>
	)
}
