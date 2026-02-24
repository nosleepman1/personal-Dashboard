/**
 * Page Dashboard Principal
 * Affiche toutes les statistiques financières agrégées
 * Utilise le service dashboardService pour récupérer les données
 */

import { useEffect, useState } from 'react';
import { dashboardService } from '@/services/api';
import type { DashboardStats } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, Building2, PiggyBank } from 'lucide-react';

/**
 * Composant principal du Dashboard
 * Affiche les statistiques financières complètes de l'utilisateur
 */
export default function Dashboard() {
  // État pour stocker les statistiques du dashboard
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // État de chargement - true pendant la requête API
  const [isLoading, setIsLoading] = useState(true);
  
  // État d'erreur - message d'erreur à afficher
  const [error, setError] = useState<string>('');

  /**
   * Charge les statistiques du dashboard au chargement du composant
   * GET /api/dashboard
   */
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        // Appelle le service dashboard pour récupérer toutes les statistiques
        // Cette méthode appelle GET /api/dashboard
        const data = await dashboardService.getStats();
        
        // Met à jour l'état avec les données reçues
        setStats(data);
      } catch (err: any) {
        // En cas d'erreur, affiche le message d'erreur
        setError(err.message || 'Erreur lors du chargement des statistiques');
      } finally {
        // Remet le chargement à false dans tous les cas
        setIsLoading(false);
      }
    };

    // Appelle la fonction de chargement
    loadStats();
  }, []);

  /**
   * Formate un montant en format monétaire
   * 
   * @param amount - Montant à formater
   * @returns String formatée (ex: "1 234,56 €")
   */
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  /**
   * Calcule un pourcentage sécurisé (évite les divisions par zéro)
   */
  const getPercent = (value: number, total: number): number => {
    if (!total || total <= 0) return 0;
    return (value / total) * 100;
  };

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Si aucune statistique n'est disponible
  if (!stats) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête du dashboard */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de vos finances
        </p>
      </div>

      {/* Cartes de résumé financier */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Carte: Balance nette */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Balance Nette
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(stats.summary.netBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Recettes - Dépenses - Apports
            </p>
          </CardContent>
        </Card>

        {/* Carte: Total Recettes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Recettes
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.summary.totalIncomes)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.counts.incomes} recette{stats.counts.incomes > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Carte: Total Dépenses */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Dépenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.summary.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.counts.expenses} dépense{stats.counts.expenses > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Carte: Total Dettes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dettes Actives
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.summary.totalDebts)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.debts.byStatus.pending} en attente
            </p>
          </CardContent>
        </Card>

        {/* Carte: Total Apports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Apports
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.summary.totalContributions)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.counts.contributions} apport{stats.counts.contributions > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        {/* Carte: Revenus Business */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenus Business
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.summary.totalBusinessRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Profit: {formatCurrency(stats.summary.totalBusinessProfit)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vue graphique synthétique */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Ratio Recettes vs Dépenses */}
        <Card>
          <CardHeader>
            <CardTitle>Flux de trésorerie</CardTitle>
            <CardDescription>
              Comparaison entre vos recettes et vos dépenses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Recettes</span>
              <span className="font-medium text-green-600">
                {formatCurrency(stats.summary.totalIncomes)}
              </span>
            </div>
            <Progress
              value={getPercent(
                stats.summary.totalIncomes,
                stats.summary.totalIncomes + stats.summary.totalExpenses
              )}
              className="h-2"
            />
            <div className="flex items-center justify-between text-sm pt-2">
              <span className="text-muted-foreground">Dépenses</span>
              <span className="font-medium text-red-600">
                {formatCurrency(stats.summary.totalExpenses)}
              </span>
            </div>
            <Progress
              value={getPercent(
                stats.summary.totalExpenses,
                stats.summary.totalIncomes + stats.summary.totalExpenses
              )}
              className="h-2 bg-red-100"
            />

            <div className="mt-4 rounded-lg border p-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-wide">
                  Résumé mensuel
                </p>
                <p className="text-sm text-muted-foreground">
                  Solde après dépenses
                </p>
              </div>
              <div className={`text-lg font-semibold ${stats.summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(stats.summary.netBalance)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aperçu Business */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des entreprises</CardTitle>
            <CardDescription>
              Revenus, dépenses et profits par business
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.businesses.length > 0 ? (
              <div className="space-y-4">
                {stats.businesses.map((business) => (
                  <div
                    key={business.id}
                    className="space-y-2 rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {business.name}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          business.profit >= 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {business.profit >= 0 ? 'Profit' : 'Perte'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">Revenus</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(business.revenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dépenses</p>
                        <p className="font-semibold text-red-600">
                          {formatCurrency(business.expenses)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Résultat</p>
                        <p
                          className={`font-semibold ${
                            business.profit >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(business.profit)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Aucune entreprise enregistrée
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section: Dépenses récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Dépenses Récentes</CardTitle>
          <CardDescription>
            Vos 5 dernières dépenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.expenses.recent.length > 0 ? (
            <div className="space-y-4">
              {stats.expenses.recent.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {expense.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      {formatCurrency(expense.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucune dépense récente
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section: Répartition par catégorie (dépenses & recettes) */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Dépenses par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
            <CardDescription>
              Montants dépensés par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(stats.expenses.byCategory).length > 0 ? (
              Object.entries(stats.expenses.byCategory).map(
                ([category, amount]) => {
                  const percent = getPercent(
                    amount,
                    stats.expenses.total
                  );
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize text-muted-foreground">
                          {category}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(amount)}{' '}
                          <span className="text-xs text-muted-foreground">
                            ({percent.toFixed(1)}%)
                          </span>
                        </span>
                      </div>
                      <Progress value={percent} className="h-2" />
                    </div>
                  );
                }
              )
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Pas encore de dépenses catégorisées
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recettes par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des recettes</CardTitle>
            <CardDescription>
              Montants reçus par catégorie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.keys(stats.incomes.byCategory).length > 0 ? (
              Object.entries(stats.incomes.byCategory).map(
                ([category, amount]) => {
                  const percent = getPercent(
                    amount,
                    stats.incomes.total
                  );
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize text-muted-foreground">
                          {category}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(amount)}{' '}
                          <span className="text-xs text-muted-foreground">
                            ({percent.toFixed(1)}%)
                          </span>
                        </span>
                      </div>
                      <Progress
                        value={percent}
                        className="h-2 bg-emerald-100"
                      />
                    </div>
                  );
                }
              )
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Pas encore de recettes catégorisées
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section: Recettes récentes */}
      <Card>
        <CardHeader>
          <CardTitle>Recettes Récentes</CardTitle>
          <CardDescription>
            Vos 5 dernières recettes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.incomes.recent.length > 0 ? (
            <div className="space-y-4">
              {stats.incomes.recent.map((income) => (
                <div key={income.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{income.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {income.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatCurrency(income.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(income.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucune recette récente
            </p>
          )}
        </CardContent>
      </Card>

      {/* Section: Dettes par statut */}
      <Card>
        <CardHeader>
          <CardTitle>Statut des Dettes</CardTitle>
          <CardDescription>
            Répartition de vos dettes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">{stats.debts.byStatus.pending}</p>
              <p className="text-sm text-muted-foreground">En attente</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.debts.byStatus.paid}</p>
              <p className="text-sm text-muted-foreground">Payées</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold text-red-600">{stats.debts.byStatus.overdue}</p>
              <p className="text-sm text-muted-foreground">En retard</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
