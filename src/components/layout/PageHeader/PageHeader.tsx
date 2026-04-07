import styles from './PageHeader.module.scss'
import { useUser } from '@hooks/useUser'

function getGreeting(name: string): string {
	const hour = new Date().getHours()
	const period = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
	return `${period}, ${name}`
}

interface PageHeader {
	title: string
	subtitle?: string
	children?: React.ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeader) {
	const { user } = useUser()

	return (
		<div className={styles.pageHeader__container}>
			<div className={styles.pageHeader__text}>
				{user?.name && (
					<span className={styles.pageHeader__greeting}>{getGreeting(user.name)}</span>
				)}
				<h2 className={styles.pageHeader__title}>{title}</h2>
				{subtitle && <span className={styles.pageHeader__subtitle}>{subtitle}</span>}
			</div>

			<div className={styles.pageHeader__button}>{children}</div>
		</div>
	)
}
