export function formatDate(date: string): string {
	try {
		const d = new Date(date);
		if (isNaN(d.getTime())) return 'Data inválida';

		const formatted = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' });
		return formatted.replace('.', '');
	} catch {
		return 'Data inválida';
	}
}
