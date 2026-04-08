import api from '@services/api'
import type { Category, CategoryType } from '@appTypes/category'
import { type CategoryRaw, normalizeCategory } from './categoryNormalizer'

export type CategoryPayload = {
	name: string
	category_type: string
	category_color: string
	category_icon: string
}

const BASE_URL = `${import.meta.env.VITE_API_URL}api/v1/categories/`

class CategoryService {
	async getAll(): Promise<Category[]> {
		const { data } = await api.get<{ results: CategoryRaw[] }>(BASE_URL)
		return Array.isArray(data.results) ? data.results.map(normalizeCategory) : []
	}

	async getByType(type: CategoryType): Promise<Category[]> {
		const all = await this.getAll()
		return all.filter((c) => c.type === type)
	}

	async create(payload: CategoryPayload): Promise<Category> {
		const { data } = await api.post<CategoryRaw>(BASE_URL, payload)
		return normalizeCategory(data)
	}

	async update(uuid: string, payload: CategoryPayload): Promise<Category> {
		const { data } = await api.put<CategoryRaw>(`${BASE_URL}${uuid}/`, payload)
		return normalizeCategory(data)
	}

	async delete(uuid: string): Promise<void> {
		await api.delete(`${BASE_URL}${uuid}/`)
	}
}

export const categoryService = new CategoryService()
