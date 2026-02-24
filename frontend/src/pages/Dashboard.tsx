/**
 * Dashboard Principal — version avec graphiques Recharts
 */

import { useDashboardStats } from '@/hooks/useDashboardStats';
import type { DashboardBusiness } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Building2,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts';

/* ─── helpers ──────────────────────────────────────────────── */
const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

const compactFmt = (n: number) => {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M€`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k€`;
  return `${n.toFixed(0)}€`;
};

/* ─── colour palettes ───────────────────────────────────────── */
const EXPENSE_COLORS = [
  '#f43f5e', '#fb923c', '#facc15', '#4ade80',
  '#22d3ee', '#818cf8', '#e879f9', '#94a3b8', '#f97316',
];

const INCOME_COLORS = [
  '#10b981', '#06b6d4', '#6366f1', '#f59e0b',
  '#8b5cf6', '#3b82f6', '#ec4899',
];

/* ─── FR category labels ───────────────────────────────────── */
const EXPENSE_LABELS: Record<string, string> = {
  food: 'Alimentation', transport: 'Transport', housing: 'Logement',
  entertainment: 'Divertissement', health: 'Santé', shopping: 'Shopping',
  bills: 'Factures', education: 'Éducation', other: 'Autre',
};
const INCOME_LABELS: Record<string, string> = {
  salary: 'Salaire', freelance: 'Freelance', investment: 'Investissement',
  rental: 'Loyer', bonus: 'Prime', gift: 'Don', other: 'Autre',
};

/* ─── Custom tooltip ───────────────────────────────────────── */
const CurrencyTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-background/95 p-3 shadow-xl text-sm backdrop-blur-sm">
      {label && <p className="font-semibold mb-1 text-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.name} :</span>
          <span className="font-medium">{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Skeleton ──────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32 mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
            <CardContent><Skeleton className="h-64 w-full" /></CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────── */
export default function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Erreur</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  /* ── derived data ── */

  // Cash-flow bar data: income vs expense (by category, simplified as totals)
  const cashFlowData = [
    {
      name: 'Recettes',
      value: stats.summary.totalIncomes,
      fill: '#10b981',
    },
    {
      name: 'Dépenses',
      value: stats.summary.totalExpenses,
      fill: '#f43f5e',
    },
    {
      name: 'Apports',
      value: stats.summary.totalContributions,
      fill: '#6366f1',
    },
    {
      name: 'Dettes',
      value: stats.summary.totalDebts,
      fill: '#f59e0b',
    },
  ];

  // Expense pie
  const expensePieData = Object.entries(stats.expenses.byCategory).map(
    ([cat, amt], i) => ({
      name: EXPENSE_LABELS[cat] ?? cat,
      value: amt as number,
      color: EXPENSE_COLORS[i % EXPENSE_COLORS.length],
    }),
  );

  // Income pie
  const incomePieData = Object.entries(stats.incomes.byCategory).map(
    ([cat, amt], i) => ({
      name: INCOME_LABELS[cat] ?? cat,
      value: amt as number,
      color: INCOME_COLORS[i % INCOME_COLORS.length],
    }),
  );

  // Business bar
  const businessBarData = stats.businesses.map((b: DashboardBusiness) => ({
    name: b.name.length > 12 ? b.name.slice(0, 12) + '…' : b.name,
    Revenus: b.revenue,
    Dépenses: b.expenses,
    Profit: b.profit,
  }));

  // Debt radial
  const debtRadialData = [
    { name: 'En attente', value: stats.debts.byStatus.pending, fill: '#f59e0b' },
    { name: 'Payées', value: stats.debts.byStatus.paid, fill: '#10b981' },
    { name: 'En retard', value: stats.debts.byStatus.overdue, fill: '#f43f5e' },
  ];

  // Area chart: synthetic monthly from recent records (last 5)
  const buildAreaData = () => {
    interface AreaPoint { month: string; Recettes: number; Dépenses: number }
    const map = new Map<string, AreaPoint>();

    const addEntry = (date: string, incAmt: number, expAmt: number) => {
      const d = new Date(date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      const existing = map.get(key) ?? { month: label, Recettes: 0, Dépenses: 0 };
      existing.Recettes += incAmt;
      existing.Dépenses += expAmt;
      map.set(key, existing);
    };

    stats.incomes.recent.forEach((r) => addEntry(r.date, r.amount, 0));
    stats.expenses.recent.forEach((e) => addEntry(e.date, 0, e.amount));

    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v);
  };

  const areaData = buildAreaData();

  const netPositive = stats.summary.netBalance >= 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de vos finances
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${netPositive
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
            }`}
        >
          {netPositive ? (
            <ArrowUpRight className="h-4 w-4" />
          ) : (
            <ArrowDownRight className="h-4 w-4" />
          )}
          Balance : {fmt(stats.summary.netBalance)}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          {
            title: 'Balance Nette',
            value: fmt(stats.summary.netBalance),
            sub: 'Recettes − Dépenses − Apports',
            icon: <Wallet className="h-4 w-4" />,
            color: netPositive ? 'text-emerald-600' : 'text-red-600',
          },
          {
            title: 'Total Recettes',
            value: fmt(stats.summary.totalIncomes),
            sub: `${stats.counts.incomes} recette${stats.counts.incomes > 1 ? 's' : ''}`,
            icon: <TrendingUp className="h-4 w-4 text-emerald-600" />,
            color: 'text-emerald-600',
          },
          {
            title: 'Total Dépenses',
            value: fmt(stats.summary.totalExpenses),
            sub: `${stats.counts.expenses} dépense${stats.counts.expenses > 1 ? 's' : ''}`,
            icon: <TrendingDown className="h-4 w-4 text-red-500" />,
            color: 'text-red-500',
          },
          {
            title: 'Dettes Actives',
            value: fmt(stats.summary.totalDebts),
            sub: `${stats.debts.byStatus.pending} en attente`,
            icon: <CreditCard className="h-4 w-4 text-amber-500" />,
            color: 'text-amber-500',
          },
          {
            title: 'Total Apports',
            value: fmt(stats.summary.totalContributions),
            sub: `${stats.counts.contributions} apport${stats.counts.contributions > 1 ? 's' : ''}`,
            icon: <PiggyBank className="h-4 w-4 text-violet-500" />,
            color: 'text-violet-500',
          },
          {
            title: 'Revenus Business',
            value: fmt(stats.summary.totalBusinessRevenue),
            sub: `Profit : ${fmt(stats.summary.totalBusinessProfit)}`,
            icon: <Building2 className="h-4 w-4 text-sky-500" />,
            color: 'text-sky-500',
          },
        ].map((kpi) => (
          <Card
            key={kpi.title}
            className="hover:shadow-md transition-shadow duration-200"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {kpi.title}
              </CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Row 1: Area + Bar overview ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Flux de trésorerie Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Flux de trésorerie
            </CardTitle>
            <CardDescription>
              Évolution recettes vs dépenses (données récentes)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {areaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={areaData} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="colorRecettes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="90%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="10%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="90%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={compactFmt} tick={{ fontSize: 11 }} width={60} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Recettes"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorRecettes)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Dépenses"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#colorDepenses)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Pas encore de données
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overview bar */}
        <Card>
          <CardHeader>
            <CardTitle>Vue d'ensemble financière</CardTitle>
            <CardDescription>Comparaison de tous vos flux</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={cashFlowData}
                margin={{ top: 4, right: 8, bottom: 0, left: 4 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={compactFmt} tick={{ fontSize: 11 }} width={60} />
                <Tooltip content={<CurrencyTooltip />} />
                <Bar dataKey="value" name="Montant" radius={[6, 6, 0, 0]}>
                  {cashFlowData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Pie charts ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Expense pie */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
            <CardDescription>Par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            {expensePieData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={expensePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expensePieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [fmt(value), 'Montant']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 min-w-[140px]">
                  {expensePieData.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ background: e.color }}
                      />
                      <span className="text-muted-foreground truncate">{e.name}</span>
                      <span className="ml-auto font-medium">{compactFmt(e.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-muted-foreground">
                Pas encore de dépenses
              </div>
            )}
          </CardContent>
        </Card>

        {/* Income pie */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des recettes</CardTitle>
            <CardDescription>Par catégorie</CardDescription>
          </CardHeader>
          <CardContent>
            {incomePieData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={incomePieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {incomePieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [fmt(value), 'Montant']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 min-w-[140px]">
                  {incomePieData.map((e, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ background: e.color }}
                      />
                      <span className="text-muted-foreground truncate">{e.name}</span>
                      <span className="ml-auto font-medium">{compactFmt(e.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-muted-foreground">
                Pas encore de recettes
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Debt radial + Business grouped bar ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Debt radial */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des dettes</CardTitle>
            <CardDescription>Répartition par état</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {stats.counts.debts > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={90}
                    data={debtRadialData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={6}
                      background={{ fill: '#f1f5f9' }}
                      label={{ position: 'insideStart', fill: '#fff', fontSize: 11 }}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [value, name]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="flex gap-6 mt-2">
                  {debtRadialData.map((d, i) => (
                    <div key={i} className="flex flex-col items-center text-xs">
                      <span
                        className="h-3 w-3 rounded-full mb-1"
                        style={{ background: d.fill }}
                      />
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="font-bold text-base">{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                Aucune dette enregistrée
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business bar */}
        <Card>
          <CardHeader>
            <CardTitle>Performance des entreprises</CardTitle>
            <CardDescription>Revenus, dépenses et profit</CardDescription>
          </CardHeader>
          <CardContent>
            {businessBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={businessBarData}
                  margin={{ top: 4, right: 8, bottom: 0, left: 4 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={compactFmt} tick={{ fontSize: 11 }} width={60} />
                  <Tooltip content={<CurrencyTooltip />} />
                  <Legend />
                  <Bar dataKey="Revenus" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Dépenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-muted-foreground">
                Aucune entreprise enregistrée
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 4: Recent activities ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Dépenses récentes</CardTitle>
            <CardDescription>5 dernières entrées</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.expenses.recent.length > 0 ? (
              <div className="space-y-3">
                {stats.expenses.recent.map((e, i) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: EXPENSE_COLORS[i % EXPENSE_COLORS.length] }}
                      >
                        {e.title.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{e.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                          {EXPENSE_LABELS[e.category] ?? e.category} ·{' '}
                          {new Date(e.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-red-500">
                      -{fmt(e.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Aucune dépense récente</p>
            )}
          </CardContent>
        </Card>

        {/* Recent incomes */}
        <Card>
          <CardHeader>
            <CardTitle>Recettes récentes</CardTitle>
            <CardDescription>5 dernières entrées</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.incomes.recent.length > 0 ? (
              <div className="space-y-3">
                {stats.incomes.recent.map((inc, i) => (
                  <div
                    key={inc.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: INCOME_COLORS[i % INCOME_COLORS.length] }}
                      >
                        {inc.title.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{inc.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                          {INCOME_LABELS[inc.category] ?? inc.category} ·{' '}
                          {new Date(inc.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">
                      +{fmt(inc.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Aucune recette récente</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 5: Recent debts + contributions ── */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Debts */}
        <Card>
          <CardHeader>
            <CardTitle>Dettes récentes</CardTitle>
            <CardDescription>5 dernières dettes</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.debts.recent.length > 0 ? (
              <div className="space-y-3">
                {stats.debts.recent.map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{d.title}</p>
                      {d.dueDate && (
                        <p className="text-xs text-muted-foreground">
                          Échéance : {new Date(d.dueDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-amber-600">
                        {fmt(d.amount)}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${d.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : d.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                      >
                        {d.status === 'paid'
                          ? 'Payée'
                          : d.status === 'overdue'
                            ? 'En retard'
                            : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Aucune dette récente</p>
            )}
          </CardContent>
        </Card>

        {/* Contributions */}
        <Card>
          <CardHeader>
            <CardTitle>Apports récents</CardTitle>
            <CardDescription>5 derniers apports</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.contributions.recent.length > 0 ? (
              <div className="space-y-3">
                {stats.contributions.recent.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: '#8b5cf6' }}
                      >
                        {c.title.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{c.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                          {c.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-semibold text-violet-600">
                        {fmt(c.amount)}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${c.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : c.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                      >
                        {c.status === 'completed'
                          ? 'Complété'
                          : c.status === 'cancelled'
                            ? 'Annulé'
                            : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">Aucun apport récent</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
