import styles from './CategoriesList.module.scss'
import { Category } from '@appTypes/category'
import { Dropdown } from '@components/ui/dropdown/Dropdown'

type CategoriesListProps = {
	categories: Category[]
	onEdit: (category: Category) => void
	onDelete: (category: Category) => void
}

export function CategoriesList({ categories, onEdit, onDelete }: CategoriesListProps) {
	if (categories.length === 0) {
		return <div className={styles.empty}>Nenhuma categoria encontrada.</div>
	}

	return (
		<div className={styles.grid}>
			{categories.map((category) => (
				<div key={category.uuid} className={styles.card}>
					<div className={styles.cardLeft}>
						<span
							className={styles.colorDot}
							style={{ backgroundColor: category.color }}
							aria-hidden
						/>
						<div className={styles.label}>{category.name}</div>
					</div>

					<Dropdown>
						<button type="button" role="menuitem" onClick={() => onEdit(category)}>
							Editar
						</button>
						<button type="button" role="menuitem" onClick={() => onDelete(category)}>
							Excluir
						</button>
					</Dropdown>
				</div>
			))}
		</div>
	)
}
