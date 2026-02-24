import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    useBusinessTransactions,
    useCreateBusinessTransaction,
    useUpdateBusinessTransaction,
    useDeleteBusinessTransaction,
} from '@/hooks/useBusinessTransactions';
import { useBusinesses } from '@/hooks/useBusinesses';
import type { BusinessTransaction } from '@/types';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Activity } from 'lucide-react';

/* ─── schema ─────────────────────────────────────────────── */
const transactionSchema = z.object({
    type: z.enum(['revenue', 'expense']),
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().optional(),
    amount: z.coerce.number().positive('Le montant doit être supérieur à 0'),
    category: z.string().optional(),
    date: z.string().min(1, 'La date est requise'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

/* ─── category labels ─────────────────────────────────────── */
const REVENUE_CATEGORIES = ['Produit', 'Service', 'Abonnement', 'Commission', 'Licence', 'Autre'];
const EXPENSE_CATEGORIES = [
    'Salaire', 'Loyer', 'Matières premières', 'Marketing', 'Logiciel',
    'Transport', 'Impôts', 'Équipement', 'Autre',
];

/* ─── helpers ─────────────────────────────────────────────── */
const compactFmt = (n: number) => {
    if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k€`;
    return `${n.toFixed(0)}€`;
};

const CurrencyTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border bg-background/95 p-3 shadow-xl text-sm">
            {label && <p className="font-semibold mb-1">{label}</p>}
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-muted-foreground">{p.name} :</span>
                    <span className="font-medium">{formatCurrency(p.value)}</span>
                </div>
            ))}
        </div>
    );
};

/* ─── Component ───────────────────────────────────────────── */
export default function BusinessDetail() {
    const { id: businessId = '' } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [editingTx, setEditingTx] = useState<BusinessTransaction | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    /* data */
    const { data: bizData, isLoading: bizLoading } = useBusinesses();
    const { data: txData, isLoading: txLoading } = useBusinessTransactions(businessId);
    const createMutation = useCreateBusinessTransaction(businessId);
    const updateMutation = useUpdateBusinessTransaction(businessId);
    const deleteMutation = useDeleteBusinessTransaction(businessId);

    const business = bizData?.businesses.find((b) => b._id === businessId);

    /* form */
    const form = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: 'revenue',
            title: '',
            description: '',
            amount: 0,
            category: '',
            date: new Date().toISOString().slice(0, 10),
        },
    });

    const resetForm = (tx?: BusinessTransaction) => {
        if (tx) {
            form.reset({
                type: tx.type,
                title: tx.title,
                description: tx.description ?? '',
                amount: tx.amount,
                category: tx.category ?? '',
                date: tx.date.slice(0, 10),
            });
        } else {
            form.reset({
                type: 'revenue',
                title: '',
                description: '',
                amount: 0,
                category: '',
                date: new Date().toISOString().slice(0, 10),
            });
        }
    };

    const handleAdd = () => { setEditingTx(null); resetForm(); setIsFormOpen(true); };
    const handleEdit = (tx: BusinessTransaction) => { setEditingTx(tx); resetForm(tx); setIsFormOpen(true); };
    const handleDelete = (tx: BusinessTransaction) => {
        if (window.confirm(`Supprimer la transaction "${tx.title}" ?`)) {
            deleteMutation.mutate(tx._id);
        }
    };

    const onSubmit = (values: TransactionFormValues) => {
        if (editingTx) {
            updateMutation.mutate({ txId: editingTx._id, data: values });
        } else {
            createMutation.mutate(values);
        }
        setIsFormOpen(false);
    };

    /* chart data: group by month */
    const chartData = (() => {
        if (!txData?.transactions.length) return [];
        const map = new Map<string, { month: string; Revenus: number; Dépenses: number }>();
        txData.transactions.forEach((tx) => {
            const d = new Date(tx.date);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
            const entry = map.get(key) ?? { month: label, Revenus: 0, Dépenses: 0 };
            if (tx.type === 'revenue') entry.Revenus += tx.amount;
            else entry.Dépenses += tx.amount;
            map.set(key, entry);
        });
        return Array.from(map.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([, v]) => v);
    })();

    const typeWatch = form.watch('type');
    const isLoading = bizLoading || txLoading;

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/businesses')}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Retour
                </Button>
                <div className="flex-1">
                    {isLoading ? (
                        <Skeleton className="h-8 w-48" />
                    ) : business ? (
                        <>
                            <h1 className="text-3xl font-bold">{business.name}</h1>
                            <p className="text-muted-foreground text-sm capitalize">
                                {business.type.replace('_', ' ')} · <span className={
                                    business.status === 'active' ? 'text-emerald-600' : 'text-amber-600'
                                }>{business.status}</span>
                            </p>
                        </>
                    ) : (
                        <h1 className="text-3xl font-bold">Entreprise introuvable</h1>
                    )}
                </div>
                <Button onClick={handleAdd}>+ Ajouter une transaction</Button>
            </div>

            {/* KPI cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenus</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        {txLoading ? <Skeleton className="h-8 w-28" /> : (
                            <p className="text-2xl font-bold text-emerald-600">
                                {formatCurrency(txData?.totalRevenue ?? 0)}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Dépenses</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        {txLoading ? <Skeleton className="h-8 w-28" /> : (
                            <p className="text-2xl font-bold text-red-500">
                                {formatCurrency(txData?.totalExpenses ?? 0)}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Profit Net</CardTitle>
                        <Activity className="h-4 w-4 text-sky-500" />
                    </CardHeader>
                    <CardContent>
                        {txLoading ? <Skeleton className="h-8 w-28" /> : (
                            <p className={`text-2xl font-bold ${(txData?.profit ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                {formatCurrency(txData?.profit ?? 0)}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bar chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenus vs Dépenses</CardTitle>
                    <CardDescription>Par mois</CardDescription>
                </CardHeader>
                <CardContent>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={compactFmt} tick={{ fontSize: 11 }} width={60} />
                                <Tooltip content={<CurrencyTooltip />} />
                                <Legend />
                                <Bar dataKey="Revenus" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Dépenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-muted-foreground">
                            Aucune transaction pour afficher un graphique
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transactions table */}
            <Card>
                <CardHeader>
                    <CardTitle>Toutes les transactions</CardTitle>
                    <CardDescription>{txData?.count ?? 0} transaction(s) enregistrée(s)</CardDescription>
                </CardHeader>
                <CardContent>
                    {txLoading ? (
                        <div className="space-y-2">
                            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                        </div>
                    ) : txData && txData.transactions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Titre</TableHead>
                                    <TableHead>Catégorie</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Montant</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {txData.transactions.map((tx) => (
                                    <TableRow key={tx._id}>
                                        <TableCell>{new Date(tx.date).toLocaleDateString('fr-FR')}</TableCell>
                                        <TableCell className="font-medium">{tx.title}</TableCell>
                                        <TableCell>{tx.category ?? '—'}</TableCell>
                                        <TableCell>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${tx.type === 'revenue'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.type === 'revenue' ? 'Revenu' : 'Dépense'}
                                            </span>
                                        </TableCell>
                                        <TableCell className={`text-right font-semibold ${tx.type === 'revenue' ? 'text-emerald-600' : 'text-red-500'
                                            }`}>
                                            {tx.type === 'revenue' ? '+' : '−'}{formatCurrency(tx.amount)}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="outline" size="sm"
                                                onClick={() => handleEdit(tx)}
                                            >Modifier</Button>
                                            <Button
                                                variant="destructive" size="sm"
                                                onClick={() => handleDelete(tx)}
                                                disabled={deleteMutation.isPending}
                                            >Supprimer</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-muted-foreground text-center py-10">
                            Aucune transaction pour cette entreprise.
                            <br />
                            <span className="text-sm">Cliquez sur « Ajouter une transaction » pour commencer.</span>
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Floating form panel */}
            {isFormOpen && (
                <Card className="fixed bottom-4 right-4 w-full max-w-md shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
                    <CardHeader>
                        <CardTitle>
                            {editingTx ? 'Modifier la transaction' : 'Ajouter une transaction'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                                {/* Type */}
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="revenue">Revenu</SelectItem>
                                                        <SelectItem value="expense">Dépense</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Title */}
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Titre</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Amount */}
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Montant (€)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number" step="0.01"
                                                    {...field}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Category */}
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Catégorie (optionnel)</FormLabel>
                                            <FormControl>
                                                <Select value={field.value ?? ''} onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choisir une catégorie" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {(typeWatch === 'revenue' ? REVENUE_CATEGORIES : EXPENSE_CATEGORIES).map(
                                                            (cat) => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Date */}
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl><Input type="date" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description (optionnel)</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                    >
                                        {editingTx ? 'Enregistrer' : 'Ajouter'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
