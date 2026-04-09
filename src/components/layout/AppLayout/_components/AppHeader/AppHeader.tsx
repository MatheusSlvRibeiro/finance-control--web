import { useMediaQuery } from 'react-responsive';
import { Logo } from '@components/layout/logo/logo';
import { ExternalLinkIcon, Menu, User, X } from 'lucide-react';
import styles from './AppHeader.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/authContext';
import { useState, useRef, useEffect } from 'react';
import { useUserContext as useUser } from '@context/userContext';

interface HeaderProps {
	onMenuClick?: () => void;
	sidebarOpen?: boolean;
}

const navItems = [
	{ name: 'Perfil', path: '/perfil' },
	{ name: 'Configurações', path: '/config' },
];

export default function AppHeader({ onMenuClick, sidebarOpen }: HeaderProps) {
	const isMobile = useMediaQuery({ maxWidth: 992 });
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { user } = useUser();

	const [open, setOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const logoutTimerRef = useRef<number | null>(null);

	const handleToggleDropdown = () => setOpen((prev) => !prev);

	const handleNavItem = (path: string) => {
		setOpen(false);
		navigate(path);
	};

	const handleLogout = async () => {
		if (isLoggingOut) return;
		setIsLoggingOut(true);

		logoutTimerRef.current = window.setTimeout(async () => {
			await logout();
			setOpen(false);
			navigate('/login', { replace: true });
		}, 800);
	};

	useEffect(() => {
		return () => {
			if (logoutTimerRef.current) window.clearTimeout(logoutTimerRef.current);
		};
	}, []);

	useEffect(() => {
		const onMouseDown = (event: MouseEvent) => {
			if (!dropdownRef.current) return;
			if (!dropdownRef.current.contains(event.target as Node)) setOpen(false);
		};

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};

		document.addEventListener('mousedown', onMouseDown);
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('mousedown', onMouseDown);
			document.removeEventListener('keydown', onKeyDown);
		};
	}, []);

	return (
		<header className={isMobile ? styles.header__Mobile : styles.header__Desktop}>
			{isMobile && (
				<button
					type="button"
					className={styles.mobile__menu}
					onClick={onMenuClick}
					aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
				>
					{sidebarOpen ? <X /> : <Menu />}
				</button>
			)}

			<Logo />

			<div className={styles.header__actions}>
				<div className={styles.user__wrapper} ref={dropdownRef}>
					<button
						type="button"
						className={styles.user__content}
						onClick={handleToggleDropdown}
						aria-haspopup="menu"
						aria-expanded={open}
						aria-label="Menu do usuário"
						disabled={isLoggingOut}
					>
						{!isMobile && <p className={styles.user__name}>{user?.name}</p>}

						<div className={styles.user__avatar}>
							<User size={18} />
						</div>
					</button>

					{open && (
						<ul className={styles.dropdown} role="menu">
							<li className={styles.dropdown__header} role="none">
								<p className={styles.dropdown__name}>{user?.email}</p>
							</li>

							{navItems.map((item) => (
								<li key={item.path} role="none">
									<button
										type="button"
										className={styles.dropdown__item}
										role="menuitem"
										onClick={() => handleNavItem(item.path)}
									>
										{item.name}
									</button>
								</li>
							))}

							<li className={styles.dropdown__divider} role="none" />

							<li role="none">
								<button
									type="button"
									className={styles.logout}
									role="menuitem"
									onClick={handleLogout}
									disabled={isLoggingOut}
								>
									<ExternalLinkIcon size={16} />
									{isLoggingOut ? 'Saindo...' : 'Sair'}
								</button>
							</li>
						</ul>
					)}
				</div>
			</div>
		</header>
	);
}
