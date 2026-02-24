import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDebts, useCreateDebt, useUpdateDebt, useDeleteDebt } from '@/hooks/useDebts';
import type { Debt } from '@/types';
import { formatCurrency } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const debtSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  amount: z.coerce.number().positive('Le montant doit être supérieur à 0'),
  creditor: z.string().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['pending', 'paid', 'overdue']),
  category: z.string().optional(),
});

type DebtFormValues = z.infer<typeof debtSchema>;

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  paid: 'Payée',
  overdue: 'En retard',
};

export default function Debts() {
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading } = useDebts();
  const createMutation = useCreateDebt();
  const updateMutation = useUpdateDebt();
  const deleteMutation = useDeleteDebt();

  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      creditor: '',
      dueDate: '',
      status: 'pending',
      category: '',
    },
  });

  const resetForm = (debt?: Debt) => {
    if (debt) {
      form.reset({
        title: debt.title,
        description: debt.description ?? '',
        amount: debt.amount,
        creditor: debt.creditor ?? '',
        dueDate: debt.dueDate ? debt.dueDate.slice(0, 10) : '',
        status: debt.status,
        category: debt.category ?? '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        amount: 0,
        creditor: '',
        dueDate: '',
        status: 'pending',
        category: '',
      });
    }
  };

  const handleAddClick = () => {
    setEditingDebt(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditClick = (debt: Debt) => {
    setEditingDebt(debt);
    resetForm(debt);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (debt: Debt) => {
    if (window.confirm(`Supprimer la dette "${debt.title}" ?`)) {
      deleteMutation.mutate(debt._id);
    }
  };

  const onSubmit = (values: DebtFormValues) => {
    if (editingDebt) {
      updateMutation.mutate({ id: editingDebt._id, data: values });
    } else {
      createMutation.mutate(values);
    }
    setIsFormOpen(false);
  };

  const debts = data?.debts ?? [];
  const totalPending = debts
    .filter((d) => d.status === 'pending' || d.status === 'overdue')
    .reduce((sum, d) => sum + d.amount, 0);
  const totalPaid = debts
    .filter((d) => d.status === 'paid')
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dettes</h1>
        <Button onClick={handleAddClick}>Ajouter une dette</Button>
      </div>

      {/* Résumé */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total des dettes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-semibold">{formatCurrency(totalPending)}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total remboursé</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-semibold text-green-600">{formatCurrency(totalPaid)}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nombre de dettes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-semibold">{debts.length}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des dettes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : debts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Créancier</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debts.map((debt) => (
                  <TableRow key={debt._id}>
                    <TableCell>{debt.title}</TableCell>
                    <TableCell>{debt.creditor ?? '—'}</TableCell>
                    <TableCell className="text-right">{formatCurrency(debt.amount)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          debt.status === 'paid'
                            ? 'text-green-600 font-medium'
                            : debt.status === 'overdue'
                              ? 'text-red-600 font-medium'
                              : 'text-yellow-600 font-medium'
                        }
                      >
                        {STATUS_LABELS[debt.status]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {debt.dueDate
                        ? new Date(debt.dueDate).toLocaleDateString('fr-FR')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(debt)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(debt)}
                        disabled={deleteMutation.isPending}
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucune dette pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Formulaire d'ajout / édition */}
      {isFormOpen && (
        <Card className="fixed bottom-4 right-4 w-full max-w-md shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>
              {editingDebt ? 'Modifier une dette' : 'Ajouter une dette'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="creditor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Créancier (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Statut</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="paid">Payée</SelectItem>
                            <SelectItem value="overdue">En retard</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date d'échéance (optionnel)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ex: immobilier, auto…" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingDebt ? 'Enregistrer' : 'Ajouter'}
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
