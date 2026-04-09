import { useState } from 'react'
import { Moon, Sun, Monitor, Download, Trash2 } from 'lucide-react'
import { useTheme, type Theme } from '@context/themeContext'
import { useAuth } from '@context/authContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { PageHeader } from '@components/layout/PageHeader/PageHeader'
import { BaseModal } from '@components/ui/modal/baseModal/BaseModal'
import { DeleteModal } from '@components/ui/modal/deleteModal/DeleteModal'
import { userService } from '@services/user/userService'
import { transactionService } from '@services/transactions/transactionService'
import styles from './SettingsPage.module.scss'

function SettingsBlock({
	title,
	description,
	children,
}: {
	title: string
	description?: string
	children: React.ReactNode
}) {
	return (
		<section className={styles.block}>
			<div className={styles.block__header}>
				<h2 className={styles.block__title}>{title}</h2>
				{description && <p className={styles.block__description}>{description}</p>}
			</div>
			<div className={styles.block__content}>{children}</div>
		</section>
	)
}

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
	{ value: 'light', label: 'Claro', icon: <Sun size={16} /> },
	{ value: 'dark', label: 'Escuro', icon: <Moon size={16} /> },
	{ value: 'system', label: 'Sistema', icon: <Monitor size={16} /> },
]

export default function SettingsPage() {
	const { theme, setTheme } = useTheme()
	const { logout } = useAuth()
	const navigate = useNavigate()

	const [weeklyEmail, setWeeklyEmail] = useState(false)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [exporting, setExporting] = useState<'csv' | 'xlsx' | null>(null)

	const handleExport = async (format: 'csv' | 'xlsx') => {
		setExporting(format)
		try {
			const transactions = await transactionService.exportAll()
			if (transactions.length === 0) {
				toast('Nenhuma transação encontrada para exportar.', { toastId: 'export-empty' })
				return
			}
			if (format === 'csv') {
				transactionService.exportCsv(transactions)
			} else {
				transactionService.exportXlsx(transactions)
			}
			toast(`Exportação ${format.toUpperCase()} concluída!`, { toastId: 'export-success' })
		} catch {
			toast('Erro ao exportar transações. Tente novamente.', { toastId: 'export-error' })
		} finally {
			setExporting(null)
		}
	}

	const handleDeleteAccount = async () => {
		await userService.deleteMe()
		await logout()
		navigate('/', { replace: true })
	}

	return (
		<div className={styles.settingsPage}>
			<PageHeader title="Configurações" subtitle="Gerencie suas preferências e conta" />

			<SettingsBlock
				title="Aparência"
				description="Escolha o tema da interface."
			>
				<div className={styles.themeGroup}>
					{THEME_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							className={`${styles.themeBtn} ${theme === opt.value ? styles.themeBtn__active : ''}`}
							onClick={() => setTheme(opt.value)}
							aria-pressed={theme === opt.value}
						>
							{opt.icon}
							{opt.label}
						</button>
					))}
				</div>
			</SettingsBlock>

			<SettingsBlock
				title="Localização"
				description="Idioma e formato de moeda utilizados na interface."
			>
				<div className={styles.fieldGroup}>
					<div className={styles.field}>
						<label className={styles.field__label}>Idioma</label>
						<select className={styles.field__select} disabled>
							<option>Português (Brasil)</option>
						</select>
						<span className={styles.field__hint}>Outros idiomas em breve.</span>
					</div>

					<div className={styles.field}>
						<label className={styles.field__label}>Formato de moeda</label>
						<select className={styles.field__select} disabled>
							<option>BRL — Real Brasileiro (R$)</option>
						</select>
						<span className={styles.field__hint}>Outras moedas em breve.</span>
					</div>
				</div>
			</SettingsBlock>

			<SettingsBlock
				title="Notificações"
				description="Preferências de comunicação por e-mail."
			>
				<label className={`${styles.checkboxRow} ${styles.checkboxRow__disabled}`}>
					<div className={styles.checkboxRow__info}>
						<span className={styles.checkboxRow__label}>Resumo semanal por e-mail</span>
						<span className={styles.checkboxRow__hint}>
							Receba um resumo das suas finanças toda segunda-feira. Disponível em breve.
						</span>
					</div>
					<input
						type="checkbox"
						className={styles.checkbox}
						checked={weeklyEmail}
						onChange={(e) => setWeeklyEmail(e.target.checked)}
						disabled
					/>
				</label>
			</SettingsBlock>

			<SettingsBlock
				title="Exportar dados"
				description="Baixe todas as suas transações."
			>
				<div className={styles.exportGroup}>
					<button
						type="button"
						className={styles.exportBtn}
						onClick={() => handleExport('csv')}
						disabled={exporting !== null}
					>
						<Download size={16} />
						{exporting === 'csv' ? 'Exportando...' : 'Exportar CSV'}
					</button>

					<button
						type="button"
						className={styles.exportBtn}
						onClick={() => handleExport('xlsx')}
						disabled={exporting !== null}
					>
						<Download size={16} />
						{exporting === 'xlsx' ? 'Exportando...' : 'Exportar Excel'}
					</button>
				</div>
			</SettingsBlock>

			<SettingsBlock
				title="Zona de perigo"
				description="Ações irreversíveis relacionadas à sua conta."
			>
				<div className={styles.dangerZone}>
					<div className={styles.dangerZone__info}>
						<span className={styles.dangerZone__label}>Excluir conta</span>
						<span className={styles.dangerZone__hint}>
							Remove permanentemente sua conta e todos os dados associados. Essa ação não pode ser desfeita.
						</span>
					</div>
					<button
						type="button"
						className={styles.dangerBtn}
						onClick={() => setDeleteModalOpen(true)}
					>
						<Trash2 size={16} />
						Excluir conta
					</button>
				</div>
			</SettingsBlock>

			<BaseModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
				<DeleteModal
					title="Excluir conta"
					message={
						<>
							Tem certeza que deseja excluir permanentemente sua conta?
							<br />
							Todos os seus dados serão removidos e essa ação <strong>não pode ser desfeita</strong>.
						</>
					}
					closeModal={() => setDeleteModalOpen(false)}
					deleteAction={handleDeleteAccount}
					deleteMessage="Conta excluída com sucesso."
				/>
			</BaseModal>
		</div>
	)
}
