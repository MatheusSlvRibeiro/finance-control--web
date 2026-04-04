import { describe, it, beforeEach, expect, vi } from 'vitest'
import { login, logout } from './authService'

vi.mock('@services/api', () => ({
	default: {
		post: vi.fn(),
	},
}))

import api from '@services/api'

beforeEach(() => {
	localStorage.clear()
	vi.clearAllMocks()
})

describe('authService', () => {
	describe('login', () => {
		it('deve retornar sucesso e armazenar token quando credenciais corretas', async () => {
			vi.mocked(api.post).mockResolvedValue({
				data: { access: 'jwt-access-token', refresh: 'jwt-refresh-token' },
			})

			const result = await login('user@example.com', 'password123')

			expect(result.success).toBe(true)
			expect(result.accessToken).toBe('jwt-access-token')
			expect(localStorage.getItem('token')).toBe('jwt-access-token')
			expect(localStorage.getItem('refreshToken')).toBe('jwt-refresh-token')
		})

		it('deve retornar sucesso false quando credenciais incorretas', async () => {
			vi.mocked(api.post).mockRejectedValue({
				response: { data: { detail: 'No active account found with the given credentials' } },
			})

			const result = await login('wrong@example.com', 'wrongpass')

			expect(result.success).toBe(false)
			expect(result.message).toBe('No active account found with the given credentials')
			expect(localStorage.getItem('token')).toBe(null)
		})

		it('deve retornar mensagem padrão quando erro não tem detail', async () => {
			vi.mocked(api.post).mockRejectedValue({})

			const result = await login('user@example.com', 'password123')

			expect(result.success).toBe(false)
			expect(result.message).toBe('Erro ao fazer login')
		})
	})

	describe('logout', () => {
		it('deve remover o token ao deslogar', async () => {
			localStorage.setItem('token', 'jwt-access-token')

			await logout()

			expect(localStorage.getItem('token')).toBe(null)
		})
	})
})
