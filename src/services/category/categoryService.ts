import api from '@services/api'
import type { Category, CategoryType } from '@appTypes/category'
import { type CategoryRaw, normalizeCategory } from './categoryNormalizer'

export const categoryService = {
	async getAll(): Promise<Category[]> {
		const { data } = await api.get<{ results: CategoryRaw[] }>('/api/v1/categories/')
		return Array.isArray(data.results) ? data.results.map(normalizeCategory) : []
	},

	async getByType(type: CategoryType): Promise<Category[]> {
		const all = await this.getAll()
		return all.filter((c) => c.type === type)
	},
}
