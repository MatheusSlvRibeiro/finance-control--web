import { describe, expect, it } from 'vitest'
import { categoryService } from './categoryService'
import { categories } from '@mocks/categories.mock'
import { CategoryType } from '@appTypes/category'

describe('categoryService', () => {
	describe('getAll', () => {
		it('deve retornar todas as categorias cadastradas', async () => {
			const allCategories = await categoryService.getAll()
			expect(allCategories.length).toBe(categories.length)

			allCategories.forEach((cat) => {
				expect(cat).toHaveProperty('uuid')
				expect(cat).toHaveProperty('name')
				expect(cat).toHaveProperty('type')
			})
		})
	})

	describe('getByType', () => {
		const types: CategoryType[] = ['income', 'expense']

		types.forEach((type) => {
			it(`deve retornar apenas categorias do tipo ${type}`, async () => {
				const result = await categoryService.getByType(type)

				expect(result.every((cat) => cat.type === type)).toBe(true)

				expect(result.length).toBeGreaterThan(0)
			})
		})
	})
})
