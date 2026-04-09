import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@components/layout/logo/logo'
import { sendPasswordResetCode, validateResetCode } from '@services/auth/authService'
import { toast } from 'react-toastify'
import { ArrowLeft, Mail, KeyRound, CheckCircle2 } from 'lucide-react'
import Button from '@components/ui/button/button'
import styles from './ForgotPasswordPage.module.scss'

type Step = 'email' | 'code' | 'success'

const RESEND_SECONDS = 60
const CODE_LENGTH = 6

export default function ForgotPasswordPage() {
	const navigate = useNavigate()

	const [step, setStep] = useState<Step>('email')
	const [email, setEmail] = useState('')
	const [code, setCode] = useState('')
	const [loading, setLoading] = useState(false)
	const [codeError, setCodeError] = useState<string | null>(null)
	const [resendTimer, setResendTimer] = useState(0)
	const timerRef = useRef<number | null>(null)
	const codeInputRef = useRef<HTMLInputElement>(null)

	// Countdown para reenvio
	const startTimer = () => {
		setResendTimer(RESEND_SECONDS)
		timerRef.current = window.setInterval(() => {
			setResendTimer((t) => {
				if (t <= 1) {
					clearInterval(timerRef.current!)
					return 0
				}
				return t - 1
			})
		}, 1000)
	}

	useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

	// ── Etapa 1: envio de email ──────────────────────────────
	const handleSendEmail = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		try {
			await sendPasswordResetCode(email)
			setStep('code')
			startTimer()
			setTimeout(() => codeInputRef.current?.focus(), 100)
		} catch {
			toast('Erro ao enviar o e-mail. Tente novamente.', { toastId: 'forgot-error' })
		} finally {
			setLoading(false)
		}
	}

	// ── Etapa 2: validação do código ─────────────────────────
	const handleValidateCode = async (e: React.FormEvent) => {
		e.preventDefault()
		setCodeError(null)
		setLoading(true)
		try {
			const valid = await validateResetCode(code)
			if (!valid) {
				setCodeError('Código inválido. Verifique e tente novamente.')
				return
			}
			setStep('success')
		} finally {
			setLoading(false)
		}
	}

	const handleResend = async () => {
		if (resendTimer > 0) return
		setLoading(true)
		try {
			await sendPasswordResetCode(email)
			startTimer()
			toast('Código reenviado para o seu e-mail.', { toastId: 'resend-ok' })
		} catch {
			toast('Erro ao reenviar. Tente novamente.', { toastId: 'resend-error' })
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<div className={styles.card__logo}>
					<Logo />
				</div>

				{/* ── Etapa 1: E-mail ── */}
				{step === 'email' && (
					<>
						<div className={styles.card__icon}>
							<Mail size={28} />
						</div>

						<div className={styles.card__header}>
							<h1 className={styles.card__title}>Recuperar senha</h1>
							<p className={styles.card__subtitle}>
								Informe seu e-mail e enviaremos um código de verificação.
							</p>
						</div>

						<form onSubmit={handleSendEmail} className={styles.form}>
							<div className={styles.form__field}>
								<label htmlFor="email" className={styles.form__label}>
									E-mail
								</label>
								<input
									id="email"
									type="email"
									autoComplete="email"
									placeholder="seu@email.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={styles.form__input}
								/>
							</div>

							<Button type="submit" variant="register" disabled={loading}>
								{loading ? 'Enviando...' : 'Enviar código'}
							</Button>
						</form>

						<Link to="/login" className={styles.backLink}>
							<ArrowLeft size={14} />
							Voltar para o login
						</Link>
					</>
				)}

				{/* ── Etapa 2: Código ── */}
				{step === 'code' && (
					<>
						<div className={styles.card__icon}>
							<KeyRound size={28} />
						</div>

						<div className={styles.card__header}>
							<h1 className={styles.card__title}>Verifique seu e-mail</h1>
							<p className={styles.card__subtitle}>
								Enviamos um código de 6 dígitos para{' '}
								<strong>{email}</strong>.
							</p>
							<p className={styles.card__mock}>
								(Ambiente de testes — use o código{' '}
								<strong className={styles.card__mockCode}>123456</strong>)
							</p>
						</div>

						<form onSubmit={handleValidateCode} className={styles.form}>
							<div className={styles.form__field}>
								<label htmlFor="code" className={styles.form__label}>
									Código de verificação
								</label>
								<input
									ref={codeInputRef}
									id="code"
									type="text"
									inputMode="numeric"
									pattern="\d*"
									maxLength={CODE_LENGTH}
									placeholder="000000"
									required
									value={code}
									onChange={(e) => {
										setCodeError(null)
										setCode(e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH))
									}}
									className={`${styles.form__input} ${styles.form__inputCode}`}
								/>
								{codeError && <span className={styles.form__error}>{codeError}</span>}
							</div>

							<Button
								type="submit"
								variant="register"
								disabled={loading || code.length < CODE_LENGTH}
							>
								{loading ? 'Validando...' : 'Verificar código'}
							</Button>
						</form>

						<div className={styles.resend}>
							{resendTimer > 0 ? (
								<span className={styles.resend__timer}>
									Reenviar código em {resendTimer}s
								</span>
							) : (
								<button
									type="button"
									className={styles.resend__btn}
									onClick={handleResend}
									disabled={loading}
								>
									Reenviar código
								</button>
							)}
						</div>

						<button
							type="button"
							className={styles.backLink}
							onClick={() => { setStep('email'); setCode(''); setCodeError(null) }}
						>
							<ArrowLeft size={14} />
							Usar outro e-mail
						</button>
					</>
				)}

				{/* ── Etapa 3: Sucesso ── */}
				{step === 'success' && (
					<>
						<div className={`${styles.card__icon} ${styles.card__icon__success}`}>
							<CheckCircle2 size={28} />
						</div>

						<div className={styles.card__header}>
							<h1 className={styles.card__title}>Identidade confirmada!</h1>
							<p className={styles.card__subtitle}>
								Sua identidade foi verificada com sucesso. A funcionalidade de redefinição
								de senha estará disponível em breve.
							</p>
						</div>

						<Button variant="register" onClick={() => navigate('/login')}>
							Voltar ao login
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
