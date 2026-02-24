/**
 * Types TypeScript pour l'application Dashboard Personnel
 * Tous les types sont centralisés ici pour une meilleure maintenabilité
 */

/**
 * Type utilisateur
 */
export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Type pour l'authentification (login/register)
 */
export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

/**
 * Type pour les dettes
 */
export interface Debt {
  _id: string;
  user: string;
  title: string;
  description?: string;
  amount: number;
  creditor?: string;
  dueDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DebtFormData {
  title: string;
  description?: string;
  amount: number;
  creditor?: string;
  dueDate?: string;
  status?: 'pending' | 'paid' | 'overdue';
  category?: string;
}

/**
 * Type pour les dépenses
 */
export interface Expense {
  _id: string;
  user: string;
  title: string;
  description?: string;
  amount: number;
  category: 'food' | 'transport' | 'housing' | 'entertainment' | 'health' | 'shopping' | 'bills' | 'education' | 'other';
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile_payment' | 'other';
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseFormData {
  title: string;
  description?: string;
  amount: number;
  category?: Expense['category'];
  date?: string;
  paymentMethod?: Expense['paymentMethod'];
  recurring?: boolean;
  recurringFrequency?: Expense['recurringFrequency'];
}

export interface ExpensesResponse {
  expenses: Expense[];
  total: number;
  count: number;
}

/**
 * Type pour les recettes
 */
export interface Income {
  _id: string;
  user: string;
  title: string;
  description?: string;
  amount: number;
  category: 'salary' | 'freelance' | 'investment' | 'rental' | 'bonus' | 'gift' | 'other';
  date: string;
  source?: string;
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt?: string;
  updatedAt?: string;
}

export interface IncomeFormData {
  title: string;
  description?: string;
  amount: number;
  category?: Income['category'];
  date?: string;
  source?: string;
  recurring?: boolean;
  recurringFrequency?: Income['recurringFrequency'];
}

export interface IncomesResponse {
  incomes: Income[];
  total: number;
  count: number;
}

/**
 * Type pour les entreprises
 */
export interface BusinessAddress {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface BusinessContact {
  email?: string;
  phone?: string;
  website?: string;
}

export interface Business {
  _id: string;
  user: string;
  name: string;
  description?: string;
  type: 'sole_proprietorship' | 'partnership' | 'corporation' | 'llc' | 'other';
  registrationNumber?: string;
  taxId?: string;
  address?: BusinessAddress;
  contact?: BusinessContact;
  startDate?: string;
  status: 'active' | 'inactive' | 'suspended' | 'closed';
  totalRevenue: number;
  totalExpenses: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessFormData {
  name: string;
  description?: string;
  type?: Business['type'];
  registrationNumber?: string;
  taxId?: string;
  address?: BusinessAddress;
  contact?: BusinessContact;
  startDate?: string;
  status?: Business['status'];
}

/**
 * Type pour les apports
 */
export interface Contribution {
  _id: string;
  user: string;
  title: string;
  description?: string;
  amount: number;
  category: 'investment' | 'savings' | 'loan' | 'donation' | 'subscription' | 'other';
  date: string;
  recipient?: string;
  status: 'pending' | 'completed' | 'cancelled';
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt?: string;
  updatedAt?: string;
}

export interface ContributionFormData {
  title: string;
  description?: string;
  amount: number;
  category?: Contribution['category'];
  date?: string;
  recipient?: string;
  status?: Contribution['status'];
  recurring?: boolean;
  recurringFrequency?: Contribution['recurringFrequency'];
}

export interface ContributionsResponse {
  contributions: Contribution[];
  total: number;
  count: number;
}

/**
 * Type pour les transactions d'entreprise
 */
export interface BusinessTransaction {
  _id: string;
  business: string;
  user: string;
  type: 'revenue' | 'expense';
  title: string;
  description?: string;
  amount: number;
  category?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessTransactionFormData {
  type: 'revenue' | 'expense';
  title: string;
  description?: string;
  amount: number;
  category?: string;
  date?: string;
}

export interface BusinessTransactionsResponse {
  transactions: BusinessTransaction[];
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  count: number;
}

/**
 * Type pour le dashboard - statistiques agrégées
 */
export interface DashboardSummary {
  totalDebts: number;
  totalExpenses: number;
  totalIncomes: number;
  totalContributions: number;
  netBalance: number;
  totalBusinessRevenue: number;
  totalBusinessExpenses: number;
  totalBusinessProfit: number;
}

export interface DashboardCounts {
  debts: number;
  expenses: number;
  incomes: number;
  businesses: number;
  contributions: number;
}

export interface DashboardDebts {
  total: number;
  byStatus: {
    pending: number;
    paid: number;
    overdue: number;
  };
  recent: Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    dueDate?: string;
  }>;
}

export interface DashboardExpenses {
  total: number;
  byCategory: Record<string, number>;
  recent: Array<{
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
  }>;
}

export interface DashboardIncomes {
  total: number;
  byCategory: Record<string, number>;
  recent: Array<{
    id: string;
    title: string;
    amount: number;
    category: string;
    date: string;
  }>;
}

export interface DashboardBusiness {
  id: string;
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface DashboardContributions {
  total: number;
  recent: Array<{
    id: string;
    title: string;
    amount: number;
    category: string;
    status: string;
  }>;
}

export interface DashboardStats {
  summary: DashboardSummary;
  counts: DashboardCounts;
  debts: DashboardDebts;
  expenses: DashboardExpenses;
  incomes: DashboardIncomes;
  businesses: DashboardBusiness[];
  contributions: DashboardContributions;
}

/**
 * Type pour les erreurs API
 */
export interface ApiError {
  error: string;
  details?: string[];
}

/**
 * Réponse lors du rafraîchissement du token d'accès
 */
export interface RefreshTokenResponse {
  accessToken: string;
}
