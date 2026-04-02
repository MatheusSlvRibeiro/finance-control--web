import { Logo } from '@components/layout/logo/logo'
import styles from './footer.module.scss'

export function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.footerContent}>
				<Logo />

				<span className={styles.copy}>
					&copy; 2026 Finance Control. Todos os direitos reservados.
				</span>
			</div>
		</footer>
	)
}
