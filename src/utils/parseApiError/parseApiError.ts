/**
 * Extracts a readable error message from a DRF/Axios error.
 *
 * Handles the following shapes:
 *   { field: ["message"] }           — field validation errors
 *   { non_field_errors: ["message"] } — non-field validation errors
 *   { detail: "message" }            — authentication / permission errors
 *   string                           — services that re-throw error.response?.data directly
 */
export function parseApiError(error: unknown, fallback = 'Ocorreu um erro inesperado.'): string {
	if (typeof error === 'string') return error

	if (error && typeof error === 'object') {
		const data = (error as { response?: { data?: unknown } })?.response?.data ?? error

		if (typeof data === 'string') return data

		if (typeof data === 'object' && data !== null) {
			if (typeof data.detail === 'string') return data.detail

			if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
				return data.non_field_errors[0]
			}

			const fieldKeys = Object.keys(data).filter((k) => k !== 'non_field_errors')
			for (const key of fieldKeys) {
				const val = data[key]
				if (Array.isArray(val) && val.length > 0) return val[0]
				if (typeof val === 'string') return val
			}
		}
	}

	return fallback
}
