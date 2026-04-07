import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@context/themeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider>
			<ToastContainer position="top-right" autoClose={2000} />
			<App />
		</ThemeProvider>
	</React.StrictMode>,
);
