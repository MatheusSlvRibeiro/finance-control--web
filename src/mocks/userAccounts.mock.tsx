import { Account } from '@appTypes/account'

export const userAccounts: Account[] = [
	{
		uuid:'nubank',
		name: 'Nubank',
		type: 'checking',
		openingBalance: 5000,
		incomes: 500,
		incomingTransfer: 0,
		outgoingTransfers: 100,
		expenses: 50,
		balance: 5350,
	},
	{
		uuid:'inter',
		name: 'Inter',
		type: 'investments',
		openingBalance: 500,
		incomes: 500,
		incomingTransfer: 100,
		outgoingTransfers: 0,
		expenses: 1100,
		balance: 0,
	},
	{
		uuid:'carteira',
		name: 'Carteira',
		type: 'wallet',
		openingBalance: 100,
		incomes: 300,
		incomingTransfer: 0,
		outgoingTransfers: 0,
		expenses: 70,
		balance: 330,
	},
]
