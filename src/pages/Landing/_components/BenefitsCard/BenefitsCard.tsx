import { TrendingUp, ChartPie, Shield, Layers } from 'lucide-react'
import styles from './benefitsCard.module.scss'

const items = [
	{
		icon: <TrendingUp />,
		title: 'Dashboard em tempo real',
		content:
			'Gráficos de evolução financeira, saldo consolidado e últimas movimentações em um único painel.',
	},
	{
		icon: <ChartPie />,
		title: 'Categorias personalizadas',
		content:
			'Entenda para onde vai cada real. Crie categorias do seu jeito e visualize por tipo de gasto.',
	},
	{
		icon: <Layers />,
		title: 'Múltiplas contas',
		content:
			'Gerencie conta corrente, poupança e carteiras em um só lugar. Visão integrada do seu patrimônio.',
	},
	{
		icon: <Shield />,
		title: 'Seus dados protegidos',
		content:
			'Autenticação segura com JWT. Seus dados financeiros nunca são compartilhados com terceiros.',
	},
]

export function BenefitsCard() {
	return (
		<div className={styles.grid}>
			{items.map((item) => (
				<div key={item.title} className={styles.card}>
					<div className={styles.card__icon}>{item.icon}</div>
					<h3 className={styles.card__title}>{item.title}</h3>
					<p className={styles.card__content}>{item.content}</p>
				</div>
			))}
		</div>
	)
}
