import { categoryService } from '@services/category/categoryService'
import { useCallback, useEffect, useState } from 'react'
import type { Category } from '@appTypes/category'

export function useCategories() {
	const [data, setData] = useState<Category[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	const reload = useCallback(async (signal?: AbortSignal) => {
		setLoading(true)
		setError(null)

		try {
			const list = await categoryService.getAll()
			if (signal?.aborted) return
			setData(Array.isArray(list) ? list : [])
		} catch (e) {
			if (signal?.aborted) return
			setError(e instanceof Error ? e : new Error('Erro ao carregar categorias'))
		} finally {
			if (!signal?.aborted) setLoading(false)
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		reload(controller.signal)
		return () => controller.abort()
	}, [reload])

	return { data, loading, error, reload }
}
