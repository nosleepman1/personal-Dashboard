/**
 * Contexte d'authentification
 * Gère l'état d'authentification global de l'application
 * Fournit les méthodes pour login, register, logout, et les informations utilisateur
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api';
import type { User, LoginRequest, RegisterRequest } from '@/types';
import { setAccessToken } from '@/lib/auth-token';

/**
 * Interface pour le contexte d'authentification
 */
interface AuthContextType {
  // État utilisateur
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Méthodes d'authentification
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  
  // Méthode pour recharger les données utilisateur
  refreshUser: () => Promise<void>;
}

/**
 * Crée le contexte d'authentification
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props pour le AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider d'authentification
 * Gère l'état d'authentification et fournit les méthodes aux composants enfants
 * 
 * @param children - Composants enfants qui auront accès au contexte
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // État utilisateur - null si non connecté, User si connecté
  const [user, setUser] = useState<User | null>(null);
  
  // État de chargement - true pendant l'initialisation
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Vérifie si l'utilisateur est authentifié
   * Basé sur la présence d'un utilisateur dans l'état
   */
  const isAuthenticated = !!user;

  /**
   * Initialise l'état d'authentification au chargement de l'application
   * Récupère le token et les données utilisateur depuis le localStorage
   * Si un token existe, récupère les données utilisateur depuis l'API
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
      // Tente de récupérer le profil utilisateur.
      // Si un refresh token httpOnly est présent, l'intercepteur axios
      // renouvellera d'abord le token d'accès puis la requête réussira.
      const userData = await authService.getProfile();
      setUser(userData);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      } finally {
        // Marque le chargement comme terminé
        setIsLoading(false);
      }
    };

    // Appelle la fonction d'initialisation
    initAuth();
  }, []);

  /**
   * Connecte un utilisateur
   * POST /api/auth/login
   * 
   * @param data - Données de connexion (email, password)
   * @throws Error si la connexion échoue
   * 
   * @example
   * ```typescript
   * try {
   *   await login({ email: 'user@example.com', password: 'password123' });
   *   // L'utilisateur est maintenant connecté
   * } catch (error) {
   *   console.error('Erreur de connexion:', error);
   * }
   * ```
   */
  const login = async (data: LoginRequest): Promise<void> => {
    try {
      // Appelle le service d'authentification pour se connecter
      const response = await authService.login(data);
      
      // Stocke le token d'accès uniquement en mémoire
      setAccessToken(response.accessToken);
      
      // Met à jour l'état utilisateur
      setUser(response.user);
    } catch (error: any) {
      // En cas d'erreur, la propage pour que le composant puisse la gérer
      throw error;
    }
  };

  /**
   * Inscrit un nouvel utilisateur
   * POST /api/auth/register
   * 
   * @param data - Données d'inscription (firstname, lastname, email, password)
   * @throws Error si l'inscription échoue
   * 
   * @example
   * ```typescript
   * try {
   *   await register({
   *     firstname: 'Jean',
   *     lastname: 'Dupont',
   *     email: 'jean@example.com',
   *     password: 'password123'
   *   });
   *   // L'utilisateur est maintenant inscrit et connecté
   * } catch (error) {
   *   console.error('Erreur d\'inscription:', error);
   * }
   * ```
   */
  const register = async (data: RegisterRequest): Promise<void> => {
    try {
      // Appelle le service d'authentification pour s'inscrire
      const response = await authService.register(data);
      
      // Stocke le token d'accès uniquement en mémoire
      setAccessToken(response.accessToken);
      
      // Met à jour l'état utilisateur
      setUser(response.user);
    } catch (error: any) {
      // En cas d'erreur, la propage pour que le composant puisse la gérer
      throw error;
    }
  };

  /**
   * Déconnecte l'utilisateur
   * Supprime le token et les données utilisateur du localStorage
   * Réinitialise l'état utilisateur à null
   * 
   * @example
   * ```typescript
   * logout();
   * // L'utilisateur est maintenant déconnecté
   * ```
   */
  const logout = (): void => {
    // Réinitialise le token d'accès en mémoire
    setAccessToken(null);
    // Réinitialise l'état utilisateur
    setUser(null);
    // Informe le backend pour supprimer le refresh token httpOnly
    void authService.logout();
  };

  /**
   * Met à jour les informations de l'utilisateur connecté
   * PUT /api/users/profile
   * 
   * @param userData - Données à mettre à jour (firstname, lastname, email)
   * @throws Error si la mise à jour échoue
   * 
   * @example
   * ```typescript
   * try {
   *   await updateUser({ firstname: 'Jean-Pierre', email: 'nouveau@example.com' });
   *   // Les informations utilisateur sont maintenant mises à jour
   * } catch (error) {
   *   console.error('Erreur de mise à jour:', error);
   * }
   * ```
   */
  const updateUser = async (userData: Partial<Pick<User, 'firstname' | 'lastname' | 'email'>>): Promise<void> => {
    try {
      // Appelle le service d'authentification pour mettre à jour le profil
      const updatedUser = await authService.updateProfile(userData);
      
      // Met à jour l'état utilisateur
      setUser(updatedUser);
      
    } catch (error: any) {
      // En cas d'erreur, la propage pour que le composant puisse la gérer
      throw error;
    }
  };

  /**
   * Recharge les données utilisateur depuis l'API
   * GET /api/users/profile
   * Utile pour rafraîchir les données après une mise à jour ailleurs dans l'application
   * 
   * @example
   * ```typescript
   * try {
   *   await refreshUser();
   *   // Les données utilisateur sont maintenant à jour
   * } catch (error) {
   *   console.error('Erreur de rafraîchissement:', error);
   * }
   * ```
   */
  const refreshUser = async (): Promise<void> => {
    try {
      // Récupère les données utilisateur depuis l'API
      const userData = await authService.getProfile();
      
      // Met à jour l'état utilisateur
      setUser(userData);
      
    } catch (error: any) {
      // En cas d'erreur, déconnecte l'utilisateur (token invalide)
      console.error('Erreur lors du rafraîchissement:', error);
      logout();
      throw error;
    }
  };

  /**
   * Valeur du contexte
   * Contient l'état et les méthodes d'authentification
   */
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  /**
   * Retourne le provider avec la valeur du contexte
   */
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * 
 * @returns AuthContextType - Le contexte d'authentification
 * @throws Error si utilisé en dehors du AuthProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { user, isAuthenticated, login, logout } = useAuth();
 *   
 *   if (!isAuthenticated) {
 *     return <div>Non connecté</div>;
 *   }
 *   
 *   return <div>Bienvenue {user?.firstname}!</div>;
 * }
 * ```
 */
export const useAuth = (): AuthContextType => {
  // Récupère le contexte
  const context = useContext(AuthContext);
  
  // Si le contexte est undefined, c'est qu'il est utilisé en dehors du provider
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};
