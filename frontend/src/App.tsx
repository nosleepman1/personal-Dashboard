/**
 * Composant principal de l'application
 * Configure le routing et les providers
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import MainLayout from '@/components/layout/MainLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Expenses from '@/pages/Expenses';
import Incomes from '@/pages/Incomes';
import Debts from '@/pages/Debts';
import Contributions from '@/pages/Contributions';
import Businesses from '@/pages/Businesses';
import Profile from '@/pages/Profile';

/**
 * Composant racine de l'application
 * Configure:
 * - Le router (react-router-dom)
 * - Le provider d'authentification
 * - Les routes de l'application
 */
function App() {
  return (
    <BrowserRouter>
      {/* Provider d'authentification - donne accès au contexte Auth dans toute l'application */}
      <AuthProvider>
        <Routes>
          {/* Route publique: Page de connexion */}
          <Route path="/login" element={<Login />} />
          
          {/* Route publique: Page d'inscription */}
          <Route path="/register" element={<Register />} />
          
          {/* Routes protégées: Nécessitent une authentification */}
          {/* Toutes ces routes sont enveloppées dans ProtectedRoute et MainLayout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Expenses />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/incomes"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Incomes />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/debts"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Debts />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contributions"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Contributions />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/businesses"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Businesses />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Profile />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Route par défaut: Redirige vers /dashboard si connecté, sinon /login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Route 404: Redirige vers /dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
