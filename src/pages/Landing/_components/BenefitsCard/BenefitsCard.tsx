import { TrendingUp, ChartPie, Shield, Zap } from 'lucide-react'
import styles from './benefitsCard.module.scss'

export function BenefitsCard() {
	const items = [
		{
			icon: <TrendingUp />,
			title: 'Visão Completa',
			content: 'Acompanhe receitas, despesas e saldo em tempo real com gráficos intuitivos.',
		},
		{
			icon: <ChartPie />,
			title: 'Categorização',
			content:
				'Organize transações por categorias personalizadas e entenda para onde vai seu dinheiro.',
		},
		{
			icon: <Shield />,
			title: 'Segurança',
			content: 'Seus dados financeiros protegidos com criptografia de ponta a ponta.',
		},
		{
			icon: <Zap />,
			title: 'Simplicidade',
			content: 'Interface limpa e fácil de usar. Sem complicação, direto ao ponto.',
		},
	]

	return (
		<div className={styles.cardContainer}>
			{items.map((item) => (
				<div key={item.title} className={styles.cardContent}>
					<div className={styles.cardIcon}>{item.icon}</div>
					<span className={styles.title}>{item.title}</span>
					<p className={styles.content}>{item.content}</p>
				</div>
			))}
		</div>
	)
}
