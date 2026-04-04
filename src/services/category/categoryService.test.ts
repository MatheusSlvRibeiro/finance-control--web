import { describe, expect, it, vi, beforeEach } from 'vitest'
import { categoryService } from './categoryService'
import type { CategoryRaw } from './categoryNormalizer'

const mockRawCategories: CategoryRaw[] = [
	{ uuid: 'uuid-1', name: 'Trabalho',      category_type: 'income',  category_color: 'green',  category_icon: 'briefcase' },
	{ uuid: 'uuid-2', name: 'Investimentos', category_type: 'income',  category_color: 'darkgreen', category_icon: 'trendingup' },
	{ uuid: 'uuid-3', name: 'Moradia',       category_type: 'expense', category_color: 'blue',   category_icon: 'home' },
	{ uuid: 'uuid-4', name: 'Alimentação',   category_type: 'expense', category_color: 'orange', category_icon: 'utensils' },
]

vi.mock('@services/api', () => ({
	default: {
		get: vi.fn(),
	},
}))

import api from '@services/api'

beforeEach(() => {
	vi.clearAllMocks()
	vi.mocked(api.get).mockResolvedValue({ data: { results: mockRawCategories } })
})

describe('categoryService', () => {
	describe('getAll', () => {
		it('deve retornar categorias normalizadas da API', async () => {
			const result = await categoryService.getAll()

			expect(result).toHaveLength(4)
			result.forEach((cat) => {
				expect(cat).toHaveProperty('uuid')
				expect(cat).toHaveProperty('name')
				expect(cat).toHaveProperty('type')
				expect(cat).toHaveProperty('color')
				expect(cat).toHaveProperty('icon')
			})
		})

		it('deve normalizar category_type para type', async () => {
			const result = await categoryService.getAll()
			expect(result[0].type).toBe('income')
			expect(result[2].type).toBe('expense')
		})

		it('deve normalizar category_color para hex', async () => {
			const result = await categoryService.getAll()
			expect(result[0].color).toBe('#4CAF50')
			expect(result[1].color).toBe('#2E7D32')
			expect(result[2].color).toBe('#1976D2')
		})

		it('deve retornar array vazio se results não for array', async () => {
			vi.mocked(api.get).mockResolvedValue({ data: {} })
			const result = await categoryService.getAll()
			expect(result).toEqual([])
		})

		it('deve usar o valor raw de color se não estiver no mapa', async () => {
			vi.mocked(api.get).mockResolvedValue({
				data: { results: [{ ...mockRawCategories[0], category_color: '#custom' }] },
			})
			const result = await categoryService.getAll()
			expect(result[0].color).toBe('#custom')
		})
	})

	describe('getByType', () => {
		it('deve retornar apenas categorias do tipo income', async () => {
			const result = await categoryService.getByType('income')
			expect(result).toHaveLength(2)
			expect(result.every((c) => c.type === 'income')).toBe(true)
		})

		it('deve retornar apenas categorias do tipo expense', async () => {
			const result = await categoryService.getByType('expense')
			expect(result).toHaveLength(2)
			expect(result.every((c) => c.type === 'expense')).toBe(true)
		})
	})
})
