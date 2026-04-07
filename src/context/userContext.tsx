import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { User } from '@appTypes/user'
import { userService } from '@services/user/userService'

type UserContextType = {
	user: User | null
	loading: boolean
	error: string | null
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchUser = useCallback(async (signal: AbortSignal) => {
		setLoading(true)
		setError(null)
		try {
			const data = await userService.getMe()
			if (!signal.aborted) setUser(data)
		} catch {
			if (!signal.aborted) setError('Erro ao buscar usuário')
		} finally {
			if (!signal.aborted) setLoading(false)
		}
	}, [])

	useEffect(() => {
		const controller = new AbortController()
		fetchUser(controller.signal)
		return () => controller.abort()
	}, [fetchUser])

	return <UserContext.Provider value={{ user, loading, error }}>{children}</UserContext.Provider>
}

export function useUserContext(): UserContextType {
	const ctx = useContext(UserContext)
	if (!ctx) throw new Error('useUserContext must be used within UserProvider')
	return ctx
}
