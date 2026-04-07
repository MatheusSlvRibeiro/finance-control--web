import type { ReactNode } from 'react'
import { Input } from '@components/ui/inputs/baseInput/input'
import { Select } from '@components/ui/select/Select'
import type { Category, CategoryType } from '@appTypes/category'
import { COLOR_OPTIONS } from '@services/category/categoryNormalizer'
import styles from './CategoryForm.module.scss'

export type CategoryFormState = {
	name: string
	type: CategoryType
	colorKey: string
	iconKey: string
}

export type CategoryIconOption = {
	value: string
	label: string
	icon: ReactNode
}

export const CATEGORY_TYPE_OPTIONS = [
	{ value: 'income', label: 'Receitas' },
	{ value: 'expense', label: 'Despesas' },
] as const

export function createEmptyCategoryForm(): CategoryFormState {
	return {
		name: '',
		type: 'income',
		colorKey: COLOR_OPTIONS[0].key,
		iconKey: '',
	}
}

export function createCategoryFormFromCategory(category: Category): CategoryFormState {
	return {
		name:     category.name,
		type:     category.type,
		colorKey: category.colorKey ?? COLOR_OPTIONS[0].key,
		iconKey:  category.iconKey ?? '',
	}
}

type CategoryFormProps = {
	value: CategoryFormState
	onChange: (next: CategoryFormState) => void
	iconOptions: CategoryIconOption[]
}

export function CategoryForm({ value, onChange, iconOptions }: CategoryFormProps) {
	return (
		<>
			<form className={styles.form}>
				<Input
					id="name"
					name="name"
					label="Nome"
					value={value.name}
					onChange={(e) =>
						onChange({
							...value,
							name: e.target.value,
						})
					}
				/>

				<Select
					id="type"
					name="type"
					label="Tipo"
					options={[...CATEGORY_TYPE_OPTIONS]}
					value={value.type}
					onChange={(nextValue) =>
						onChange({
							...value,
							type: nextValue as CategoryType,
						})
					}
				/>

				<div className={styles.picker}>
					<p className={styles.pickerLabel}>Cor</p>
					<div className={styles.colorRow}>
						{COLOR_OPTIONS.map(({ key, hex }) => {
							const selected = value.colorKey === key
							return (
								<button
									key={key}
									type="button"
									className={selected ? styles.colorSwatchSelected : styles.colorSwatch}
									style={{ backgroundColor: hex }}
									aria-label={`Selecionar cor ${key}`}
									aria-pressed={selected}
									onClick={() => onChange({ ...value, colorKey: key })}
								/>
							)
						})}
					</div>
				</div>

				<div className={styles.picker}>
					<p className={styles.pickerLabel}>Ícone</p>
					<div className={styles.iconGrid}>
						{iconOptions.map((opt) => {
							const selected = value.iconKey === opt.value
							return (
								<button
									key={opt.value}
									type="button"
									className={selected ? styles.iconButtonSelected : styles.iconButton}
									aria-label={`Selecionar ícone: ${opt.label}`}
									aria-pressed={selected}
									onClick={() => onChange({ ...value, iconKey: opt.value })}
								>
									{opt.icon}
								</button>
							)
						})}
					</div>
				</div>
			</form>
		</>
	)
}
