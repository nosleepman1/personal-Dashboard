import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from '@/hooks/useExpenses';
import type { Expense } from '@/types';
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

const expenseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  amount: z.coerce.number().positive('Le montant doit être supérieur à 0'),
  category: z.enum([
    'food',
    'transport',
    'housing',
    'entertainment',
    'health',
    'shopping',
    'bills',
    'education',
    'other',
  ]),
  date: z.string().min(1, 'La date est requise'),
  paymentMethod: z.enum(['cash', 'card', 'bank_transfer', 'mobile_payment', 'other']),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export default function Expenses() {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading } = useExpenses();
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const deleteMutation = useDeleteExpense();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      category: 'other',
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'card',
    },
  });

  const resetForm = (expense?: Expense) => {
    if (expense) {
      form.reset({
        title: expense.title,
        description: expense.description ?? '',
        amount: expense.amount,
        category: expense.category,
        date: expense.date.slice(0, 10),
        paymentMethod: expense.paymentMethod,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        amount: 0,
        category: 'other',
        date: new Date().toISOString().slice(0, 10),
        paymentMethod: 'card',
      });
    }
  };

  const handleAddClick = () => {
    setEditingExpense(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    resetForm(expense);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    // Confirmation simple avant suppression.
    if (window.confirm(`Supprimer la dépense "${expense.title}" ?`)) {
      deleteMutation.mutate(expense._id);
    }
  };

  const onSubmit = (values: ExpenseFormValues) => {
    if (editingExpense) {
      updateMutation.mutate({
        id: editingExpense._id,
        data: values,
      });
    } else {
      createMutation.mutate(values);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dépenses</h1>
        <Button onClick={handleAddClick}>Ajouter une dépense</Button>
      </div>

      {/* Résumé rapide */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-semibold">
                {formatCurrency(data?.total ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nombre de dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-semibold">{data?.count ?? 0}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tableau des dépenses */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des dépenses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : data && data.expenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead>Moyen de paiement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.expenses.map((expense) => (
                  <TableRow key={expense._id}>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell className="capitalize">{expense.category}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                    <TableCell className="capitalize">
                      {expense.paymentMethod}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(expense)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(expense)}
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
              Aucune dépense pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Formulaire d'ajout / édition */}
      {isFormOpen && (
        <Card className="fixed bottom-4 right-4 w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>
              {editingExpense ? 'Modifier une dépense' : 'Ajouter une dépense'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
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
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                        />
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
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="food">Alimentation</SelectItem>
                            <SelectItem value="transport">Transport</SelectItem>
                            <SelectItem value="housing">Logement</SelectItem>
                            <SelectItem value="entertainment">
                              Divertissement
                            </SelectItem>
                            <SelectItem value="health">Santé</SelectItem>
                            <SelectItem value="shopping">
                              Shopping
                            </SelectItem>
                            <SelectItem value="bills">Factures</SelectItem>
                            <SelectItem value="education">Éducation</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moyen de paiement</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un moyen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Espèces</SelectItem>
                            <SelectItem value="card">Carte</SelectItem>
                            <SelectItem value="bank_transfer">
                              Virement
                            </SelectItem>
                            <SelectItem value="mobile_payment">
                              Paiement mobile
                            </SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
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
                    {editingExpense ? 'Enregistrer' : 'Ajouter'}
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

