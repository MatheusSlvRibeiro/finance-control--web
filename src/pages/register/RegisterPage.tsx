import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@components/layout/logo/logo';
import { Check, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Button from '@components/ui/button/button';
import styles from './RegisterPage.module.scss';
import { registerUser } from '@services/auth/authService';
import { parseApiError } from '@utils/parseApiError/parseApiError';
import { useAuth } from '@context/authContext';
import { toast } from 'react-toastify';

export default function Register() {
	const benefits = [
		{ text: 'Dashboard completo com gráficos' },
		{ text: 'Gestão de múltiplas contas' },
		{ text: 'Categorização inteligente' },
		{ text: 'Relatórios detalhados' },
	];

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		password_confirm: '',
	});
	const navigate = useNavigate();

	const passwordRequirements = [
		{ label: 'Mínimo 8 caracteres', passed: formData.password.length >= 8 },
		{
			label: 'Uma letra maiúscula',
			passed: /[A-Z]/.test(formData.password),
		},
		{ label: 'Um número', passed: /[0-9]/.test(formData.password) },
		{
			label: 'Um caractere especial',
			passed: /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(formData.password),
		},
	];

	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setApiError(null);
		try {
			await registerUser(formData);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const loginResult = await login(formData.email, formData.password);
			if (loginResult.success) {
				toast('Conta criada com sucesso!', {
					toastId: 'user-post-success',
				});
				setTimeout(() => {
					navigate('/dashboard');
				}, 2000);
			} else {
				toast('Conta criada, mas não foi possível autenticar!', {
					toastId: 'user-login-error',
				});
			}
		} catch (error) {
			setApiError(parseApiError(error, 'Erro ao criar conta. Tente novamente!'));
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={styles.registerPage__container}>
			<section className={styles.registerPage__section}>
				<div className={styles.registerPage__logo}>
					<Logo />
				</div>

				<div className={styles.registerPage__header}>
					<h1 className={styles.registerPage__headerTitle}>Criar Conta</h1>
					<p className={styles.registerPage__headerSubtitle}>
						Preencha os dados abaixo para começar
					</p>
				</div>

				<form onSubmit={handleSubmit} className={styles.register__form}>
					<div className={styles.register__form_box}>
						<div className={styles.register__form_input}>
							<label htmlFor="name">Nome completo</label>
							<input
								id="name"
								type="text"
								value={formData.name}
								onChange={(e) => setFormData({ ...formData, name: e.target.value })}
								placeholder="Seu nome completo"
								required
							/>
						</div>

						<div className={styles.register__form_input}>
							<label htmlFor="email">E-mail</label>
							<input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								placeholder="seu@email.com"
								required
							/>
						</div>

						<div className={styles.register__form_input}>
							<label htmlFor="password">Senha</label>
							<div className={styles.input__wrapper}>
								<input
									id="password"
									value={formData.password}
									onChange={(e) =>
										setFormData({
											...formData,
											password: e.target.value,
										})
									}
									type={showPassword ? 'text' : 'password'}
									placeholder="******"
									required
								/>
								<button
									className={styles.show_password}
									type="button"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? <EyeOff /> : <Eye />}
								</button>
							</div>

							<div className={styles.password__status}>
								{passwordRequirements.map((req, item) => (
									<span
										key={item}
										className={
											req.passed
												? styles.password__passed
												: styles.password__muted
										}
									>
										{req.passed}
										{req.label}
									</span>
								))}
							</div>
						</div>

						<div className={styles.register__form_input}>
							<label htmlFor="confirmPassword">Confirmar senha</label>
							<div className={styles.input__wrapper}>
								<input
									id="confirmPassword"
									value={formData.password_confirm}
									onChange={(e) =>
										setFormData({
											...formData,
											password_confirm: e.target.value,
										})
									}
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder="******"
									required
								/>
								<button
									className={styles.show_password}
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? <EyeOff /> : <Eye />}
								</button>
							</div>
							{formData.password_confirm &&
								formData.password !== formData.password_confirm && (
									<p className={styles.password__error}>
										As senhas não coincidem
									</p>
								)}
						</div>
					</div>
					{apiError && <p className={styles.password__error}>{apiError}</p>}

					<Button
						type="submit"
						variant="register"
						disabled={isLoading || formData.password !== formData.password_confirm}
					>
						{isLoading ? 'Criando conta' : 'Criar conta'}
					</Button>
				</form>

				<p className={styles.registerPage__btn}>
					Já tem conta?{' '}
					<Link to="/login">
						<span>Entrar</span>
					</Link>
				</p>
			</section>
			<section className={styles.registerPage__decorativeSection}>
				<div className={styles.registerPage__decorativeContent}>
					<h2 className={styles.registerPage__decorativeTitle}>
						Comece sua jornada financeira
					</h2>

					<p className={styles.registerPage__decorativeSubtitle}>
						Crie sua conta gratuita e tenha acesso a todas as ferramentas para organizar
						suas finanças pessoais.
					</p>

					<div className={styles.registerPage__decorativeBenefits}>
						{benefits.map((item) => (
							<div
								className={styles.registerPage__decorativeBenefitsItem}
								key={item.text}
							>
								<Check />
								<p>{item.text}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
