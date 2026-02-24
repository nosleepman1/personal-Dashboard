/**
 * Layout principal — responsive + dark-mode toggle
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Wallet,
  TrendingDown,
  TrendingUp,
  Building2,
  PiggyBank,
  CreditCard,
  LogOut,
  User,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/expenses', label: 'Dépenses', Icon: TrendingDown },
  { to: '/incomes', label: 'Recettes', Icon: TrendingUp },
  { to: '/debts', label: 'Dettes', Icon: CreditCard },
  { to: '/contributions', label: 'Apports', Icon: PiggyBank },
  { to: '/businesses', label: 'Entreprises', Icon: Building2 },
  { to: '/profile', label: 'Profil', Icon: User },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  const NavItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map(({ to, label, Icon }) => (
        <Link key={to} to={to} onClick={onItemClick}>
          <Button
            variant={isActive(to) ? 'default' : 'ghost'}
            className={`w-full justify-start gap-3 transition-all ${isActive(to)
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'hover:bg-accent hover:text-accent-foreground'
              }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Button>
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-14 items-center justify-between px-4 md:px-6">
          {/* Left: Logo + mobile hamburger */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-8 w-8 p-0"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2 select-none">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-base hidden sm:block tracking-tight">
                FinDash
              </span>
            </Link>
          </div>

          {/* Right: theme toggle + user menu */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={toggleTheme}
              aria-label="Basculer le thème"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">
                      {user?.firstname} {user?.lastname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r bg-sidebar">
          <div className="flex-1 overflow-y-auto">
            <NavItems />
          </div>

          {/* Bottom: user info */}
          <div className="border-t p-3">
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
              <Avatar className="h-6 w-6 border border-border">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Mobile Sidebar overlay ── */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <aside className="fixed left-0 top-14 bottom-0 z-40 w-64 bg-sidebar border-r shadow-xl flex flex-col md:hidden animate-in slide-in-from-left duration-200">
              <div className="flex-1 overflow-y-auto">
                <NavItems onItemClick={() => setMobileOpen(false)} />
              </div>
              {/* Bottom: user info */}
              <div className="border-t p-3">
                <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
                  <Avatar className="h-6 w-6 border">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {user?.firstname} {user?.lastname}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
