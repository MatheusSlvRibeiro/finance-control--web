import { Logo } from '@components/layout/logo/logo'
import styles from './header.module.scss'
import { Link } from 'react-router-dom'
import Button from '@components/ui/button/button'

export function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.headerContent}>
				<Logo />

				<nav className={styles.nav}>
					<Link to="/login">
						<Button size="sm" variant="login">
							Entrar
						</Button>
					</Link>
					<Link to="/register">
						<Button size="sm" variant="register">
							Criar conta grátis
						</Button>
					</Link>
				</nav>
			</div>
		</header>
	)
}
