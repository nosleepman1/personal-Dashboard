/**
 * Composant ProtectedRoute
 * Protège les routes nécessitant une authentification
 * Redirige vers /login si l'utilisateur n'est pas connecté
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Props pour ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Composant qui protège les routes authentifiées
 * 
 * @param children - Composants enfants à afficher si l'utilisateur est authentifié
 * @returns Les enfants si authentifié, sinon redirige vers /login
 * 
 * @example
 * ```tsx
 * <Routes>
 *   <Route path="/login" element={<Login />} />
 *   <Route path="/dashboard" element={
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   } />
 * </Routes>
 * ```
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Récupère l'état d'authentification depuis le contexte
  const { isAuthenticated, isLoading } = useAuth();

  // Affiche un skeleton pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, redirige vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur est authentifié, affiche les enfants
  return <>{children}</>;
}
