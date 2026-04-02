export type AccountType = 'checking' | 'investments' | 'wallet'

export interface Account {
	id: string
	name: string
	type: AccountType
	openingBalance: number
	incomes: number
	incomingTransfer: number
	outgoingTransfers: number
	expenses: number
	balance: number
}
