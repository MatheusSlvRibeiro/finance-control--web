import type { ReactNode } from 'react'
import { Input } from '@components/ui/inputs/baseInput/input'
import { Select } from '@components/ui/select/Select'
import type { Category, CategoryType } from '@appTypes/category'
import styles from './CategoryForm.module.scss'

export type CategoryFormState = {
	name: string
	type: CategoryType
	color: string
	iconId: string
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

export const CATEGORY_COLORS = [
	'#22c55e', // green
	'#ef4444', // red
	'#3b82f6', // blue
	'#f97316', // orange
	'#a855f7', // purple
	'#64748b', // gray
] as const

export function createEmptyCategoryForm(): CategoryFormState {
	return {
		name: '',
		type: 'income',
		color: CATEGORY_COLORS[0],
		iconId: '',
	}
}

export function createCategoryFormFromCategory(category: Category): CategoryFormState {
	return {
		name: category.name,
		type: category.type,
		color: category.color,
		iconId: category.uuid,
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
						{CATEGORY_COLORS.map((color) => {
							const selected = value.color === color
							return (
								<button
									key={color}
									type="button"
									className={
										selected ? styles.colorSwatchSelected : styles.colorSwatch
									}
									style={{ backgroundColor: color }}
									aria-label={`Selecionar cor ${color}`}
									aria-pressed={selected}
									onClick={() => onChange({ ...value, color })}
								/>
							)
						})}
					</div>
				</div>

				<div className={styles.picker}>
					<p className={styles.pickerLabel}>Ícone</p>

					{iconOptions.length === 0 ? (
						<p className={styles.empty}>
							Nenhum ícone disponível (cadastre categorias primeiro).
						</p>
					) : (
						<div className={styles.iconGrid}>
							{iconOptions.map((opt) => {
								const selected = value.iconId === opt.value
								return (
									<button
										key={opt.value}
										type="button"
										className={
											selected ? styles.iconButtonSelected : styles.iconButton
										}
										aria-label={`Selecionar ícone: ${opt.label}`}
										aria-pressed={selected}
										onClick={() =>
											onChange({
												...value,
												iconId: opt.value,
											})
										}
									>
										{opt.icon}
									</button>
								)
							})}
						</div>
					)}
				</div>
			</form>
		</>
	)
}
