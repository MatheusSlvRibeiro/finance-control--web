import { Banknote, Landmark, LayoutDashboardIcon, Settings, SquareChartGantt } from 'lucide-react'
import styles from './AppSidebar.module.scss'
import { NavLink } from 'react-router-dom'

interface Sidebar {
	open?: boolean
	onClose?: () => void
}

export default function AppSidebar({ open, onClose }: Sidebar) {
	const navItems = [
		{
			icon: <LayoutDashboardIcon />,
			name: 'Dashboard',
			path: '/dashboard',
		},
		{
			icon: <Landmark />,
			name: 'Contas',
			path: '/accounts',
		},
		{
			icon: <Banknote />,
			name: 'Transações',
			path: '/transactions',
		},
		{
			icon: <SquareChartGantt />,
			name: 'Categorias',
			path: '/categories',
		},
		{
			icon: <Settings />,
			name: 'Configurações',
			path: '/config',
		},
	]

	return (
		<nav className={open ? styles.sidebar__container : styles.sidebar__container_closed}>
			<ul className={styles.sidebar__list}>
				{navItems.map(({ name, path, icon }) => (
					<li key={name}>
						<NavLink
							to={path}
							className={({ isActive }) =>
								isActive ? styles.sidebar__item_active : styles.sidebar__item
							}
							onClick={onClose}
						>
							<div className={styles.sidebar__item_icon}>{icon}</div>
							<span className={styles.sidebar__item_name}>{name}</span>
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	)
}
