import { useContext, createContext } from 'react'
import type { LoginResult } from '@services/auth/authService'

export type AuthContextType = {
	accessToken: string | null
	isAuthenticated: boolean
	login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResult>
	logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}
