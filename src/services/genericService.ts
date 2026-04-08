import api from '@services/api';
import type { AxiosRequestConfig } from 'axios';

const BASEURL = import.meta.env.VITE_API_URL;

export type PaginatedResponse<T> = {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
};

export default class GenericService<T> {
	protected readonly url: string;

	constructor(resource: string) {
		this.url = `${BASEURL}api/v1/${resource}/`;
	}

	async getAll(config?: AxiosRequestConfig): Promise<PaginatedResponse<T>> {
		const { data } = await api.get<PaginatedResponse<T>>(this.url, config);
		return data;
	}

	async getByType(config?: AxiosRequestConfig): Promise<T> {
		const { data } = await api.get<T>(this.url, config);
		return data;
	}

	async create<TPayload>(payload: TPayload): Promise<T> {
		const { data } = await api.post<T>(this.url, payload);
		return data;
	}

	async update<TPayload>(uuid: string, payload: TPayload): Promise<T> {
		const { data } = await api.put<T>(`${this.url}${uuid}/`, payload);
		return data;
	}

	async delete(uuid: string): Promise<void> {
		await api.delete(`${this.url}${uuid}/`);
	}
}
