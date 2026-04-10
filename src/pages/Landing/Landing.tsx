import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, UserPlus, ReceiptText, BarChart2 } from 'lucide-react';
import { Footer } from '@components/layout/footer';
import Button from '@components/ui/button/button';
import { BenefitsCard } from './_components/BenefitsCard/BenefitsCard';
import { Header } from './_components/Header/header';
import styles from './Landing.module.scss';

const HOW_IT_WORKS = [
	{
		step: '01',
		icon: <UserPlus size={20} />,
		title: 'Crie sua conta',
		description: 'Cadastro em menos de 2 minutos. Sem cartão de crédito, sem complicação.',
	},
	{
		step: '02',
		icon: <ReceiptText size={20} />,
		title: 'Registre suas transações',
		description: 'Adicione receitas e despesas e organize por categorias personalizadas.',
	},
	{
		step: '03',
		icon: <BarChart2 size={20} />,
		title: 'Visualize e decida melhor',
		description: 'Gráficos em tempo real mostram para onde vai cada real do seu dinheiro.',
	},
];

export default function Landing() {
	return (
		<div className={styles.page}>
			<Header />

			<section className={styles.hero}>
				<div className={styles.hero__inner}>
					<div className={styles.hero__left}>
						<h1 className={styles.hero__title}>
							Pare de perder dinheiro
							<br />
							<span>sem saber para onde ele vai</span>
						</h1>

						<p className={styles.hero__subtitle}>
							Visualize receitas, despesas e saldo em um dashboard intuitivo. Tome
							decisões financeiras mais inteligentes a partir de hoje.
						</p>

						<div className={styles.hero__ctas}>
							<Link to="/register">
								<Button size="lg" variant="register">
									Criar conta grátis
									<ArrowRight size={18} />
								</Button>
							</Link>

							<Link to="/login">
								<Button size="md" variant="ghost">
									Já tenho conta
								</Button>
							</Link>
						</div>

						<ul className={styles.hero__trust}>
							{[
								'Dashboard em tempo real',
								'Setup em 2 minutos',
								'Dados protegidos',
							].map((item) => (
								<li key={item}>
									<CheckCircle size={15} />
									{item}
								</li>
							))}
						</ul>
					</div>

					<div className={styles.hero__right}>
						<div className={styles.hero__screenshotWrapper}>
							<img
								src="/images/print1.png"
								alt="Dashboard FinControl"
								className={styles.hero__screenshot}
							/>
						</div>
					</div>
				</div>

				<div className={styles.howItWorks}>
					<div className={styles.section__header}>
						<h2 className={styles.section__title}>Simples assim</h2>
						<p className={styles.section__subtitle}>
							Três passos para organizar suas finanças de uma vez por todas
						</p>
					</div>

					<div className={styles.steps}>
						{HOW_IT_WORKS.map((item) => (
							<div key={item.step} className={styles.step}>
								<div className={styles.step__header}>
									<span className={styles.step__number}>{item.step}</span>
									<span className={styles.step__icon}>{item.icon}</span>
								</div>
								<h3 className={styles.step__title}>{item.title}</h3>
								<p className={styles.step__desc}>{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className={styles.benefits}>
				<div className={styles.benefits__inner}>
					<div className={styles.section__header}>
						<h2 className={styles.section__title}>Tudo que você precisa</h2>
						<p className={styles.section__subtitle}>
							Ferramentas pensadas para quem quer resultados, não complicação
						</p>
					</div>
					<BenefitsCard />
				</div>
			</section>

			<section className={styles.finalCta}>
				<div className={styles.finalCta__inner}>
					<h2 className={styles.finalCta__title}>
						Pronto para assumir o controle das suas finanças?
					</h2>
					<p className={styles.finalCta__subtitle}>
						Crie sua conta agora e tenha clareza financeira em minutos
					</p>

					<Link to="/register">
						<Button size="lg" variant="register">
							Começar agora, é grátis
							<ArrowRight size={18} />
						</Button>
					</Link>

					<p className={styles.finalCta__disclaimer}>
						Sem compromisso. Cancele quando quiser.
					</p>
				</div>
			</section>

			<Footer />
		</div>
	);
}
