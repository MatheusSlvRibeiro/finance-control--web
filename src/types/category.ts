import type { ReactNode } from 'react'

export type CategoryType = 'expense' | 'income'

export interface Category {
	uuid: string
	name: string
	type: CategoryType
	color: string
	icon: ReactNode
	colorKey?: string
	iconKey?: string
}
