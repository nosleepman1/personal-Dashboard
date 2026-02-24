import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useIncomes, useCreateIncome, useUpdateIncome, useDeleteIncome } from '@/hooks/useIncomes';
import type { Income } from '@/types';
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

const incomeSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  amount: z.coerce.number().positive('Le montant doit être supérieur à 0'),
  category: z.enum(['salary', 'freelance', 'investment', 'rental', 'bonus', 'gift', 'other']),
  date: z.string().min(1, 'La date est requise'),
  source: z.string().optional(),
});

type IncomeFormValues = z.infer<typeof incomeSchema>;

const CATEGORY_LABELS: Record<string, string> = {
  salary: 'Salaire',
  freelance: 'Freelance',
  investment: 'Investissement',
  rental: 'Loyer',
  bonus: 'Prime',
  gift: 'Don',
  other: 'Autre',
};

export default function Incomes() {
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading } = useIncomes();
  const createMutation = useCreateIncome();
  const updateMutation = useUpdateIncome();
  const deleteMutation = useDeleteIncome();

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      category: 'other',
      date: new Date().toISOString().slice(0, 10),
      source: '',
    },
  });

  const resetForm = (income?: Income) => {
    if (income) {
      form.reset({
        title: income.title,
        description: income.description ?? '',
        amount: income.amount,
        category: income.category,
        date: income.date.slice(0, 10),
        source: income.source ?? '',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        amount: 0,
        category: 'other',
        date: new Date().toISOString().slice(0, 10),
        source: '',
      });
    }
  };

  const handleAddClick = () => {
    setEditingIncome(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditClick = (income: Income) => {
    setEditingIncome(income);
    resetForm(income);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (income: Income) => {
    if (window.confirm(`Supprimer la recette "${income.title}" ?`)) {
      deleteMutation.mutate(income._id);
    }
  };

  const onSubmit = (values: IncomeFormValues) => {
    if (editingIncome) {
      updateMutation.mutate({ id: editingIncome._id, data: values });
    } else {
      createMutation.mutate(values);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Recettes</h1>
        <Button onClick={handleAddClick}>Ajouter une recette</Button>
      </div>

      {/* Résumé */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total des recettes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-semibold text-green-600">
                {formatCurrency(data?.total ?? 0)}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nombre de recettes</CardTitle>
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

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des recettes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : data && data.incomes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.incomes.map((income) => (
                  <TableRow key={income._id}>
                    <TableCell>
                      {new Date(income.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{income.title}</TableCell>
                    <TableCell>{CATEGORY_LABELS[income.category] ?? income.category}</TableCell>
                    <TableCell>{income.source ?? '—'}</TableCell>
                    <TableCell className="text-right text-green-600 font-medium">
                      {formatCurrency(income.amount)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(income)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(income)}
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
              Aucune recette pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Formulaire */}
      {isFormOpen && (
        <Card className="fixed bottom-4 right-4 w-full max-w-md shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>
              {editingIncome ? 'Modifier une recette' : 'Ajouter une recette'}
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salary">Salaire</SelectItem>
                            <SelectItem value="freelance">Freelance</SelectItem>
                            <SelectItem value="investment">Investissement</SelectItem>
                            <SelectItem value="rental">Loyer</SelectItem>
                            <SelectItem value="bonus">Prime</SelectItem>
                            <SelectItem value="gift">Don</SelectItem>
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
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ex: Entreprise ABC" />
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
                    {editingIncome ? 'Enregistrer' : 'Ajouter'}
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
