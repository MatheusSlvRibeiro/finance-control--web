import type { Category } from '@appTypes/category'
import { useCallback } from 'react'
import { useCategories } from './useCategories'

function normalize(raw: string) {
	return raw.trim().toLowerCase()
}

export function useCategoryLookup() {
	const { data: categories, loading, error, reload } = useCategories()

	const getCategory = useCallback(
		(raw?: string): Category | undefined => {
			if (!raw) return undefined

			const normalized = normalize(raw)

			return (
				categories.find((c) => c.uuid === raw) ??
				categories.find((c) => c.name === raw) ??
				categories.find((c) => normalize(c.uuid) === normalized) ??
				categories.find((c) => normalize(c.name) === normalized)
			)
		},
		[categories],
	)

	return { categories, getCategory, loading, error, reload }
}
