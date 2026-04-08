import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle, ChartPie, Wallet } from 'lucide-react';
import { Footer } from '@components/layout/footer';
import Button from '@components/ui/button/button';
import { BenefitsCard } from './_components/BenefitsCard/BenefitsCard';
import EmblaCarousel from './_components/EmblaCarousel/EmblaCarousel';
import { Header } from './_components/Header/header';
import styles from './Landing.module.scss';

const CAROUSEL_SLIDES = [
	{ path: '/images/print1.png' },
	{ path: '/images/print2.png' },
	{ path: '/images/print3.png' },
	{ path: '/images/print4.png' },
];

const HOW_IT_WORKS = [
	{
		step: '01',
		title: 'Crie sua conta',
		description: 'Cadastro em menos de 2 minutos. Sem cartão de crédito, sem complicação.',
	},
	{
		step: '02',
		title: 'Registre suas transações',
		description: 'Adicione receitas e despesas e organize por categorias personalizadas.',
	},
	{
		step: '03',
		title: 'Visualize e decida melhor',
		description: 'Gráficos em tempo real mostram para onde vai cada real do seu dinheiro.',
	},
];

const STATS = [
	{ icon: <BarChart3 size={22} />, value: 'Dashboard', label: 'completo em tempo real' },
	{ icon: <ChartPie size={22} />, value: 'Categorias', label: 'personalizadas' },
	{ icon: <Wallet size={22} />, value: 'Multi-contas', label: 'em um só lugar' },
];

export default function Landing() {
	return (
		<div className={styles.page}>
			<Header />

			<section className={styles.hero}>
				<div className={styles.hero__inner}>
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
							<Button size="md" variant="default">
								Já tenho conta
							</Button>
						</Link>
					</div>

					<ul className={styles.hero__trust}>
						{['Grátis para sempre', 'Setup em 2 minutos', 'Dados protegidos'].map(
							(item) => (
								<li key={item}>
									<CheckCircle size={15} />
									{item}
								</li>
							),
						)}
					</ul>
				</div>
			</section>

			<section className={styles.stats}>
				{STATS.map((s) => (
					<div key={s.value} className={styles.stats__item}>
						<span className={styles.stats__icon}>{s.icon}</span>
						<div>
							<p className={styles.stats__value}>{s.value}</p>
							<p className={styles.stats__label}>{s.label}</p>
						</div>
					</div>
				))}
			</section>

			<section className={styles.howItWorks}>
				<div className={styles.section__header}>
					<h2 className={styles.section__title}>Simples assim</h2>
					<p className={styles.section__subtitle}>
						Três passos para organizar suas finanças de uma vez por todas
					</p>
				</div>

				<div className={styles.steps}>
					{HOW_IT_WORKS.map((item) => (
						<div key={item.step} className={styles.step}>
							<span className={styles.step__number}>{item.step}</span>
							<h3 className={styles.step__title}>{item.title}</h3>
							<p className={styles.step__desc}>{item.description}</p>
						</div>
					))}
				</div>
			</section>

			<section className={styles.benefits}>
				<div className={styles.section__header}>
					<h2 className={styles.section__title}>Tudo que você precisa</h2>
					<p className={styles.section__subtitle}>
						Ferramentas pensadas para quem quer resultados, não complicação
					</p>
				</div>
				<BenefitsCard />
			</section>

			<section className={styles.screenshots}>
				<div className={styles.section__header}>
					<h2 className={styles.section__title}>Veja em ação</h2>
					<p className={styles.section__subtitle}>
						Dashboard poderoso e intuitivo, direto ao ponto
					</p>
				</div>
				<EmblaCarousel slides={CAROUSEL_SLIDES} options={{}} />
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
