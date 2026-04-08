import { useRef, useState } from 'react';
import { Camera, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { PageHeader } from '@components/layout/PageHeader/PageHeader';
import { useUserContext as useUser } from '@context/userContext';
import { userService } from '@services/user/userService';
import type { UpdatePasswordPayload } from '@services/user/userService';
import { parseApiError } from '@utils/parseApiError/parseApiError';
import styles from './PerfilPage.module.scss';

const passwordRequirements = (password: string) => [
	{ label: 'Mínimo 8 caracteres', passed: password.length >= 8 },
	{ label: 'Uma letra maiúscula', passed: /[A-Z]/.test(password) },
	{ label: 'Um número', passed: /[0-9]/.test(password) },
	{ label: 'Um caractere especial', passed: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password) },
];

export default function PerfilPage() {
	const { user, refreshUser } = useUser();


	// --- Bloco 1: informações pessoais ---
	const [profileForm, setProfileForm] = useState({
		name: user?.name ?? '',
		email: user?.email ?? '',
	});
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [isSavingProfile, setIsSavingProfile] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// --- Bloco 2: senha ---
	const [passwordForm, setPasswordForm] = useState({
		old_password: '',
		new_password: '',
		new_password_confirm: '',
	});
	const [showOld, setShowOld] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isSavingPassword, setIsSavingPassword] = useState(false);

	const handleAvatarClick = () => fileInputRef.current?.click();

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setAvatarPreview(URL.createObjectURL(file));
	};

	const handleProfileSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSavingProfile(true);
		try {
			await userService.updateMe({
				name: profileForm.name,
				email: profileForm.email,
			});
			refreshUser();
			toast('Perfil atualizado com sucesso!', { toastId: 'profile-success' });
		} catch (error) {
			toast.error(parseApiError(error, 'Erro ao atualizar perfil.'), {
				toastId: 'profile-error',
			});
		} finally {
			setIsSavingProfile(false);
		}
	};

	const handlePasswordSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (passwordForm.new_password !== passwordForm.new_password_confirm) return;
		setIsSavingPassword(true);
		try {
			await userService.updatePassword(passwordForm as UpdatePasswordPayload);
			toast('Senha atualizada com sucesso!', { toastId: 'password-success' });
			setPasswordForm({ old_password: '', new_password: '', new_password_confirm: '' });
		} catch (error) {
			toast.error(parseApiError(error, 'Erro ao atualizar senha.'), {
				toastId: 'password-error',
			});
		} finally {
			setIsSavingPassword(false);
		}
	};

	const reqs = passwordRequirements(passwordForm.new_password);
	const passwordsMatch =
		!passwordForm.new_password_confirm ||
		passwordForm.new_password === passwordForm.new_password_confirm;

	return (
		<div className={styles.perfil}>
			<PageHeader title="Meu Perfil" subtitle="Gerencie suas informações pessoais e senha" />

			{/* ── Bloco 1: Informações pessoais ─────────────────── */}
			<section className={styles.block}>
				<div className={styles.block__header}>
					<h3 className={styles.block__title}>Informações Pessoais</h3>
					<p className={styles.block__subtitle}>Atualize seu nome, e-mail e foto de perfil</p>
				</div>

				<form onSubmit={handleProfileSubmit} className={styles.block__form}>
					{/* Avatar */}
					<div className={styles.avatar__row}>
						<button
							type="button"
							className={styles.avatar__button}
							onClick={handleAvatarClick}
							aria-label="Alterar foto de perfil"
						>
							{avatarPreview ? (
								<img
									src={avatarPreview}
									alt="Foto de perfil"
									className={styles.avatar__image}
								/>
							) : (
								<span className={styles.avatar__initials}>
									{user?.name?.charAt(0).toUpperCase() ?? '?'}
								</span>
							)}
							<div className={styles.avatar__overlay}>
								<Camera size={18} />
							</div>
						</button>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className={styles.avatar__input}
							onChange={handleAvatarChange}
						/>

						<div>
							<p className={styles.avatar__hint}>Clique na foto para alterar</p>
							<p className={styles.avatar__hint_sub}>JPG, PNG ou WEBP · máx. 2 MB</p>
						</div>
					</div>

					{/* Campos */}
					<div className={styles.fields}>
						<div className={styles.field}>
							<label htmlFor="name">Nome completo</label>
							<input
								id="name"
								type="text"
								value={profileForm.name}
								onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
								placeholder="Seu nome completo"
								required
							/>
						</div>

						<div className={styles.field}>
							<label htmlFor="email">E-mail</label>
							<input
								id="email"
								type="email"
								value={profileForm.email}
								onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
								placeholder="seu@email.com"
								required
							/>
						</div>
					</div>

					<div className={styles.block__footer}>
						<button
							type="submit"
							className={styles.btn__primary}
							disabled={isSavingProfile}
						>
							{isSavingProfile ? 'Salvando...' : 'Salvar alterações'}
						</button>
					</div>
				</form>
			</section>

			{/* ── Bloco 2: Alterar senha ────────────────────────── */}
			<section className={styles.block}>
				<div className={styles.block__header}>
					<h3 className={styles.block__title}>Alterar Senha</h3>
					<p className={styles.block__subtitle}>
						Use uma senha forte com letras, números e símbolos
					</p>
				</div>

				<form onSubmit={handlePasswordSubmit} className={styles.block__form}>
					<div className={styles.fields}>
						{/* Senha antiga */}
						<div className={styles.field}>
							<label htmlFor="old_password">Senha atual</label>
							<div className={styles.input__wrapper}>
								<input
									id="old_password"
									type={showOld ? 'text' : 'password'}
									value={passwordForm.old_password}
									onChange={(e) =>
										setPasswordForm({ ...passwordForm, old_password: e.target.value })
									}
									placeholder="••••••••"
									required
								/>
								<button
									type="button"
									className={styles.eye__button}
									onClick={() => setShowOld((v) => !v)}
									aria-label={showOld ? 'Ocultar senha' : 'Mostrar senha'}
								>
									{showOld ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
						</div>

						{/* Nova senha */}
						<div className={styles.field}>
							<label htmlFor="new_password">Nova senha</label>
							<div className={styles.input__wrapper}>
								<input
									id="new_password"
									type={showNew ? 'text' : 'password'}
									value={passwordForm.new_password}
									onChange={(e) =>
										setPasswordForm({ ...passwordForm, new_password: e.target.value })
									}
									placeholder="••••••••"
									required
								/>
								<button
									type="button"
									className={styles.eye__button}
									onClick={() => setShowNew((v) => !v)}
									aria-label={showNew ? 'Ocultar senha' : 'Mostrar senha'}
								>
									{showNew ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>

							{passwordForm.new_password && (
								<div className={styles.password__requirements}>
									{reqs.map((req) => (
										<span
											key={req.label}
											className={req.passed ? styles.req__passed : styles.req__muted}
										>
											{req.label}
										</span>
									))}
								</div>
							)}
						</div>

						{/* Confirmar nova senha */}
						<div className={styles.field}>
							<label htmlFor="new_password_confirm">Confirmar nova senha</label>
							<div className={styles.input__wrapper}>
								<input
									id="new_password_confirm"
									type={showConfirm ? 'text' : 'password'}
									value={passwordForm.new_password_confirm}
									onChange={(e) =>
										setPasswordForm({
											...passwordForm,
											new_password_confirm: e.target.value,
										})
									}
									placeholder="••••••••"
									required
								/>
								<button
									type="button"
									className={styles.eye__button}
									onClick={() => setShowConfirm((v) => !v)}
									aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
								>
									{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
								</button>
							</div>
							{!passwordsMatch && (
								<p className={styles.field__error}>As senhas não coincidem</p>
							)}
						</div>
					</div>

					<div className={styles.block__footer}>
						<button
							type="submit"
							className={styles.btn__primary}
							disabled={isSavingPassword || !passwordsMatch}
						>
							{isSavingPassword ? 'Atualizando...' : 'Atualizar senha'}
						</button>
					</div>
				</form>
			</section>
		</div>
	);
}
