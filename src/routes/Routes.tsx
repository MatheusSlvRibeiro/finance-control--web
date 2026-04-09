import AppLayout from '@components/layout/AppLayout/AppLayout';
import AccountsPage from '@pages/accounts/AccountsPage';
import CategoriesPage from '@pages/categories/CategoriesPage';
import Dashboard from '@pages/dashboard/Dashboard';
import TransactionsPage from '@pages/transactions/TransactionsPage';
import PerfilPage from '@pages/perfil/PerfilPage';
import SettingsPage from '@pages/settings/SettingsPage';
import ForgotPasswordPage from '@pages/forgotPassword/ForgotPasswordPage';
import Login from '@pages/login/LoginPage';
import Register from '@pages/register/RegisterPage';
import Landing from '@pages/Landing/Landing';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from '@context/authContext';
import { AuthProvider } from '@context/authProvider';

export function ProtectedRoute() {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <Outlet />;
}

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />

					<Route element={<ProtectedRoute />}>
						<Route element={<AppLayout />}>
							<Route path="/dashboard" element={<Dashboard />} />
							<Route path="/accounts" element={<AccountsPage />} />
							<Route path="/transactions" element={<TransactionsPage />} />
							<Route path="/categories" element={<CategoriesPage />} />
							<Route path="/perfil" element={<PerfilPage />} />
							<Route path="/config" element={<SettingsPage />} />
						</Route>
					</Route>

					<Route path="/*" element={<Landing />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}
