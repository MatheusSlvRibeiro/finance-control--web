import { Logo } from '@components/layout/logo/logo'
import styles from './footer.module.scss'

export function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				<Logo variant="white" />

				<div className={styles.footerInfo}>
					<span className={styles.copy}>
						&copy; 2026 FinControl. Todos os direitos reservados.
					</span>
					<span className={styles.cnpj}>CNPJ: 38.491.027/0001-84</span>
				</div>
			</div>
		</footer>
	)
}
