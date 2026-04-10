import { Logo } from '@components/layout/logo/logo';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@context/authContext';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@components/ui/button/button';
import styles from './LoginPage.module.scss';

type LoginFormState = {
	email: string;
	password: string;
};

export default function Login() {
	const cards = [
		{ title: '10k+', value: 'Usuários ativos' },
		{ title: 'R$ 50M', value: 'Em movimentações financeiras' },
		{ title: '99,9%', value: 'Disponibilidade da plataforma' },
		{ title: '4.9 ⭐', value: 'Avaliação média dos usuários' },
	];

	const [values, setValues] = useState<LoginFormState>({ email: '', password: '' });
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const navigate = useNavigate();
	const { login } = useAuth();

	function onChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { value, name } = event.target;
		setValues((prev) => ({ ...prev, [name]: value }));
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		const result = await login(values.email, values.password, rememberMe);

		if (result.success) {
			toast('Autenticado com sucesso!', { toastId: 'login-successfull' });
			navigate('/dashboard');
			return;
		}

		setError(result.message ?? 'Não foi possível fazer login');
	};

	return (
		<div className={styles.loginPage__container}>
			<section className={styles.loginPage__section}>
				<div className={styles.loginPage__logo}>
					<Logo />
				</div>

				<div className={styles.loginPage__header}>
					<h1 className={styles.loginPage__headerTitle}>Bem-vindo de volta</h1>
					<p className={styles.loginPage__headerSubtitle}>
						Entre na sua conta para continuar
					</p>
				</div>

				<form onSubmit={handleSubmit} className={styles.loginForm__form}>
					<div className={styles.loginForm__box}>
						<div className={styles.loginForm__input}>
							<label htmlFor="email">E-mail</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								placeholder="seu@email.com"
								required
								onChange={onChange}
								value={values.email}
							/>
						</div>

						<div className={styles.loginForm__input}>
							<div className={styles.loginForm__labelRow}>
								<label htmlFor="password">Senha</label>
							</div>
							<div className={styles.loginForm__inputWrapper}>
								<input
									id="password"
									name="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									autoComplete="current-password"
									required
									onChange={onChange}
									value={values.password}
								/>
								<button
									className={styles.loginForm__showPassword}
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									tabIndex={-1}
									aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
						</div>

						<label className={styles.loginForm__remember}>
							<input
								type="checkbox"
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
								className={styles.loginForm__checkbox}
							/>
							Lembrar de mim
						</label>

						{error && <p className={styles.error}>{error}</p>}
					</div>
					<Button type="submit" variant="register" className={styles.loginForm__submit}>
						Entrar
					</Button>

					<Link to="/forgot-password" className={styles.loginForm__forgotLink}>
						Esqueci minha senha
					</Link>
				</form>

				<p className={styles.loginPage__btnRegister}>
					Não tem uma conta?{' '}
					<Link to="/register">
						<span>Criar conta</span>
					</Link>
				</p>
			</section>

			<section className={styles.loginPage__decorativeSection}>
				<div className={styles.loginPage__decorativeContent}>
					<h2 className={styles.loginPage__decorativeTitle}>
						Controle total das suas finanças
						<span> em um único lugar</span>
					</h2>

					<p className={styles.loginPage__decorativeSubtitle}>
						Acompanhe receitas, despesas e investimentos em um só lugar. Tome decisões
						financeiras mais inteligentes.
					</p>

					<div className={styles.loginPage__decorativeCardGrid}>
						{cards.map((item) => (
							<div key={item.title} className={styles.loginPage__decorativeCard}>
								<span className={styles.loginPage__cardTitle}>{item.title}</span>
								<p className={styles.loginPage__cardValue}>{item.value}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
