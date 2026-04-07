export function formatDate(date: string): string {
	try {
		const d = new Date(date);
		if (isNaN(d.getTime())) return 'Data inválida';

		const day = d.toLocaleDateString('pt-BR', { day: '2-digit', timeZone: 'UTC' });
		const month = d.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', '');
		return `${day}/${month}`;
	} catch {
		return 'Data inválida';
	}
}
