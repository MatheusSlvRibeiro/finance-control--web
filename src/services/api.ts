import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
	const isUserRegister =
		config.method === 'post' &&
		(config.url?.endsWith('/users/') || config.url?.endsWith('/token/'));
	if (isUserRegister) {
		delete config.headers.Authorization;
		return config;
	}

	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			window.dispatchEvent(new Event('unauthorized'));
		}
		return Promise.reject(error);
	},
);

export default api;
