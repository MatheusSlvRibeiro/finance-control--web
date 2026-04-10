import { useEffect, useState } from 'react'
import { Logo } from '@components/layout/logo/logo'
import styles from './header.module.scss'
import { Link } from 'react-router-dom'
import Button from '@components/ui/button/button'

export function Header() {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20)
		window.addEventListener('scroll', handleScroll, { passive: true })
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<header className={[styles.header, scrolled ? styles.header__scrolled : ''].join(' ')}>
			<div className={styles.headerContent}>
				<Logo variant="white" />

				<nav className={styles.nav}>
					<Link to="/login">
						<Button size="sm" variant="ghost">
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
