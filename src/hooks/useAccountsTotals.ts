import { AccountTotals } from '@appTypes/numericAccountField'
import { accountService } from '@services/accounts/accountService'
import { useCallback, useEffect, useMemo, useState } from 'react'

export function useAccountsTotals() {
	const [totals, setTotals] = useState<AccountTotals | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>()

	const reload = useCallback(async (signal?: AbortSignal) => {
		setLoading(true)
		setError(null)

		try {
			const t = await accountService.getTotals()
			if (signal?.aborted) return
			setTotals(t)
		} catch (e) {
			if (signal?.aborted) return
			setError(e instanceof Error ? e : new Error('Erro ao carregar totais'))
		} finally {
			if (!signal?.aborted) setLoading(false)
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		reload(controller.signal)
		return () => controller.abort()
	}, [reload])

	const derived = useMemo(() => {
		const t = totals ?? {
			openingBalance: 0,
			incomes: 0,
			incomingTransfer: 0,
			outgoingTransfers: 0,
			expenses: 0,
			balance: 0,
		}

		return {
			openingBalance: t.openingBalance,
			incomes: t.incomes,
			incomingTransfer: t.incomingTransfer,
			outgoingTransfers: t.outgoingTransfers,
			expenses: t.expenses,
			balance: t.balance,
		}
	}, [totals])

	return { totals, ...derived, loading, error, reload }
}
