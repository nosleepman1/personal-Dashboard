/**
 * Layout principal de l'application
 * Contient la navigation et le contenu principal
 * Utilisé pour toutes les pages authentifiées
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Wallet, TrendingDown, TrendingUp, Building2, PiggyBank, CreditCard, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

/**
 * Props pour MainLayout
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Composant de layout principal
 * Affiche la navigation latérale et le header avec le menu utilisateur
 * 
 * @param children - Contenu à afficher dans le layout
 */
export default function MainLayout({ children }: MainLayoutProps) {
  // Récupère l'utilisateur et la méthode logout depuis le contexte
  const { user, logout } = useAuth();
  
  // Hook de navigation pour rediriger après la déconnexion
  const navigate = useNavigate();
  
  // Récupère la route actuelle pour mettre en surbrillance le lien actif
  const location = useLocation();

  /**
   * Gère la déconnexion
   * Appelle logout du contexte et redirige vers /login
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Génère les initiales de l'utilisateur pour l'avatar
   * 
   * @returns String avec les initiales (ex: "JD" pour Jean Dupont)
   */
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
  };

  /**
   * Vérifie si une route est active
   * 
   * @param path - Chemin à vérifier
   * @returns true si la route est active
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Dashboard Personnel</h1>
          </div>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Navigation latérale */}
        <aside className="w-64 border-r bg-card min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {/* Lien Dashboard */}
            <Link to="/dashboard">
              <Button
                variant={isActive('/dashboard') ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            {/* Lien Dépenses */}
            <Link to="/expenses">
              <Button
                variant={isActive('/expenses') ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                Dépenses
              </Button>
            </Link>

            {/* Lien Recettes */}
            <Link to="/incomes">
              <Button
                variant={isActive('/incomes') ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Recettes
              </Button>
            </Link>

            {/* Lien Dettes */}
            <Link to="/debts">
              <Button
                variant={isActive('/debts') ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Dettes
              </Button>
            </Link>

            {/* Lien Apports */}
            <Link to="/contributions">
              <Button
                variant={isActive('/contributions') ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <PiggyBank className="mr-2 h-4 w-4" />
                Apports
              </Button>
            </Link>

            {/* Lien Entreprises */}
            <Link to="/businesses">
              <Button
                variant={isActive('/businesses') ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Entreprises
              </Button>
            </Link>

            {/* Lien Profil */}
            <Link to="/profile">
              <Button
                variant={isActive('/profile') ? 'secondary' : 'ghost'}
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Profil
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
