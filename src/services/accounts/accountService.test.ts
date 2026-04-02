import { describe, it, expect } from 'vitest'
import { accountService } from './accountService'
import { userAccounts } from '@mocks/userAccounts.mock'

const camposEsperados = [
	'openingBalance',
	'incomes',
	'incomingTransfer',
	'outgoingTransfers',
	'expenses',
	'balance',
]

describe('accountService', () => {
	describe('getAll', () => {
		it('deve retornar todas as contas com campos derivados', async () => {
			const contas = await accountService.getAll()

			expect(contas.length).toBe(userAccounts.length)

			contas.forEach((conta) => {
				camposEsperados.forEach((campo) => {
					expect(conta).toHaveProperty(campo)
					expect(typeof conta[campo as keyof typeof conta]).toBe('number')
				})
			})
		})
	})

	describe.each(['checking', 'wallet', 'investments'] as const)('getByType: %s', (type) => {
		it('deve retornar a conta do tipo correto com totais', async () => {
			const contas = await accountService.getByType(type)

			expect(contas.length).toBeGreaterThan(0)
			expect(contas.every((t) => t.type === type)).toBe(true)

			const conta = contas[0]

			camposEsperados.forEach((campo) => {
				expect(typeof conta[campo as keyof typeof conta]).toBe('number')
			})
		})

		it('deve retornar array vazio para tipo inexistente', async () => {
			const contas = await accountService.getByType('tipoInvalido' as any)
			expect(contas).toEqual([])
		})
	})

	describe('getTotals', () => {
		camposEsperados.forEach((campo) => {
			it(`deve retornar o total do campo ${campo} de todas as contas somadas`, async () => {
				const totais = await accountService.getTotals()

				expect(totais).toHaveProperty(campo)

				expect(typeof totais[campo as keyof typeof totais]).toBe('number')
			})
		})
	})

	describe('getTotalsByAccount', () => {
		it('deve retornar os totais corretos para uma conta específica', async () => {
			const conta = userAccounts[0]

			const totais = await accountService.getTotalsByAccount(conta)

			camposEsperados.forEach((campo) => {
				expect(totais).toHaveProperty(campo)
				expect(typeof totais[campo as keyof typeof totais]).toBe('number')
			})
		})
	})
})
