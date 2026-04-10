import { Wallet } from 'lucide-react'
import styles from './logo.module.scss'

type LogoProps = {
	variant?: 'white' | 'default'
}

export function Logo({ variant = 'default' }: LogoProps) {
	return (
		<div className={[styles.logo, variant === 'white' ? styles.logo__white : ''].join(' ')}>
			<div>
				<Wallet />
			</div>
			<span className={styles.name}>FinControl</span>
		</div>
	)
}
