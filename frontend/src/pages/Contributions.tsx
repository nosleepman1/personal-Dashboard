import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useContributions,
  useCreateContribution,
  useUpdateContribution,
  useDeleteContribution,
} from '@/hooks/useContributions';
import type { Contribution } from '@/types';
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

const contributionSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  amount: z.coerce.number().positive('Le montant doit être supérieur à 0'),
  category: z.enum(['investment', 'savings', 'loan', 'donation', 'subscription', 'other']),
  date: z.string().min(1, 'La date est requise'),
  recipient: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled']),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

const CATEGORY_LABELS: Record<string, string> = {
  investment: 'Investissement',
  savings: 'Épargne',
  loan: 'Prêt',
  donation: 'Don',
  subscription: 'Abonnement',
  other: 'Autre',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  completed: 'Complété',
  cancelled: 'Annulé',
};

export default function Contributions() {
  const [editingContribution, setEditingContribution] = useState<Contribution | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading } = useContributions();
  const createMutation = useCreateContribution();
  const updateMutation = useUpdateContribution();
  const deleteMutation = useDeleteContribution();

  const form = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      category: 'other',
      date: new Date().toISOString().slice(0, 10),
      recipient: '',
      status: 'pending',
    },
  });

  const resetForm = (contribution?: Contribution) => {
    if (contribution) {
      form.reset({
        title: contribution.title,
        description: contribution.description ?? '',
        amount: contribution.amount,
        category: contribution.category,
        date: contribution.date.slice(0, 10),
        recipient: contribution.recipient ?? '',
        status: contribution.status,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        amount: 0,
        category: 'other',
        date: new Date().toISOString().slice(0, 10),
        recipient: '',
        status: 'pending',
      });
    }
  };

  const handleAddClick = () => {
    setEditingContribution(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditClick = (contribution: Contribution) => {
    setEditingContribution(contribution);
    resetForm(contribution);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (contribution: Contribution) => {
    if (window.confirm(`Supprimer l'apport "${contribution.title}" ?`)) {
      deleteMutation.mutate(contribution._id);
    }
  };

  const onSubmit = (values: ContributionFormValues) => {
    if (editingContribution) {
      updateMutation.mutate({ id: editingContribution._id, data: values });
    } else {
      createMutation.mutate(values);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Apports</h1>
        <Button onClick={handleAddClick}>Ajouter un apport</Button>
      </div>

      {/* Résumé */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total des apports</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-semibold">{formatCurrency(data?.total ?? 0)}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nombre d'apports</CardTitle>
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
          <CardTitle>Liste des apports</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : data && data.contributions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Bénéficiaire</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.contributions.map((contribution) => (
                  <TableRow key={contribution._id}>
                    <TableCell>
                      {new Date(contribution.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>{contribution.title}</TableCell>
                    <TableCell>
                      {CATEGORY_LABELS[contribution.category] ?? contribution.category}
                    </TableCell>
                    <TableCell>{contribution.recipient ?? '—'}</TableCell>
                    <TableCell>
                      <span
                        className={
                          contribution.status === 'completed'
                            ? 'text-green-600 font-medium'
                            : contribution.status === 'cancelled'
                              ? 'text-red-600 font-medium'
                              : 'text-yellow-600 font-medium'
                        }
                      >
                        {STATUS_LABELS[contribution.status]}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(contribution.amount)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(contribution)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(contribution)}
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
              Aucun apport pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Formulaire */}
      {isFormOpen && (
        <Card className="fixed bottom-4 right-4 w-full max-w-md shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>
              {editingContribution ? "Modifier l'apport" : 'Ajouter un apport'}
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
                            <SelectItem value="investment">Investissement</SelectItem>
                            <SelectItem value="savings">Épargne</SelectItem>
                            <SelectItem value="loan">Prêt</SelectItem>
                            <SelectItem value="donation">Don</SelectItem>
                            <SelectItem value="subscription">Abonnement</SelectItem>
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
                  name="recipient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bénéficiaire (optionnel)</FormLabel>
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
                            <SelectItem value="completed">Complété</SelectItem>
                            <SelectItem value="cancelled">Annulé</SelectItem>
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
                    {editingContribution ? 'Enregistrer' : 'Ajouter'}
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
