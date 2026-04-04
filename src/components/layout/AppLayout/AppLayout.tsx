import { Outlet } from 'react-router-dom'
import AppHeader from '@components/layout/AppLayout/_components/AppHeader/AppHeader'
import AppSidebar from '@components/layout/AppLayout/_components/AppSidebar/AppSidebar'
import styles from '@components/layout/AppLayout/AppLayout.module.scss'
import { useState } from 'react'

export default function AppLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const handleSidebarToggle = () => setSidebarOpen((open) => !open)
	const handleSidebarClose = () => setSidebarOpen(false)

	return (
		<div className={styles.applayout__container}>
			<AppHeader onMenuClick={handleSidebarToggle} sidebarOpen={sidebarOpen} />
			<AppSidebar open={sidebarOpen} onClose={handleSidebarClose} />

			<div className={styles.applayout__main_content}>
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	)
}
