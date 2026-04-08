import styles from './PageHeader.module.scss';

interface PageHeader {
	title: string;
	subtitle?: string;
	children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeader) {
	return (
		<div className={styles.pageHeader__container}>
			<div className={styles.pageHeader__text}>
				<h2 className={styles.pageHeader__title}>{title}</h2>
				{subtitle && <span className={styles.pageHeader__subtitle}>{subtitle}</span>}
			</div>

			<div className={styles.pageHeader__button}>{children}</div>
		</div>
	);
}
