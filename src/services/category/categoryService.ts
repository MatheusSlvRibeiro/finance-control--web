import api from '@services/api'
import type { Category, CategoryType } from '@appTypes/category'
import { type CategoryRaw, normalizeCategory } from './categoryNormalizer'

type CategoryPayload = {
	name: string
	category_type: string
	category_color: string
	category_icon: string
}

export const categoryService = {
	async getAll(): Promise<Category[]> {
		const { data } = await api.get<{ results: CategoryRaw[] }>('/api/v1/categories/')
		return Array.isArray(data.results) ? data.results.map(normalizeCategory) : []
	},

	async getByType(type: CategoryType): Promise<Category[]> {
		const all = await this.getAll()
		return all.filter((c) => c.type === type)
	},

	async create(payload: CategoryPayload): Promise<Category> {
		const { data } = await api.post<CategoryRaw>('/api/v1/categories/', payload)
		return normalizeCategory(data)
	},

	async update(uuid: string, payload: CategoryPayload): Promise<Category> {
		const { data } = await api.put<CategoryRaw>(`/api/v1/categories/${uuid}/`, payload)
		return normalizeCategory(data)
	},

	async delete(uuid: string): Promise<void> {
		await api.delete(`/api/v1/categories/${uuid}/`)
	},
}
