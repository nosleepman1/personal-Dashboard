import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  useBusinesses,
  useCreateBusiness,
  useUpdateBusiness,
  useDeleteBusiness,
} from '@/hooks/useBusinesses';
import type { Business } from '@/types';
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

const businessSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  type: z.enum(['sole_proprietorship', 'partnership', 'corporation', 'llc', 'other']),
  status: z.enum(['active', 'inactive', 'suspended', 'closed']),
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  startDate: z.string().optional(),
  contactEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  contactWebsite: z.string().optional(),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

const TYPE_LABELS: Record<string, string> = {
  sole_proprietorship: 'Entreprise individuelle',
  partnership: 'Société de personnes',
  corporation: 'Société par actions',
  llc: 'SARL',
  other: 'Autre',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspendue',
  closed: 'Fermée',
};

export default function Businesses() {
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading } = useBusinesses();
  const createMutation = useCreateBusiness();
  const updateMutation = useUpdateBusiness();
  const deleteMutation = useDeleteBusiness();

  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'other',
      status: 'active',
      registrationNumber: '',
      taxId: '',
      startDate: '',
      contactEmail: '',
      contactPhone: '',
      contactWebsite: '',
    },
  });

  const resetForm = (business?: Business) => {
    if (business) {
      form.reset({
        name: business.name,
        description: business.description ?? '',
        type: business.type,
        status: business.status,
        registrationNumber: business.registrationNumber ?? '',
        taxId: business.taxId ?? '',
        startDate: business.startDate ? business.startDate.slice(0, 10) : '',
        contactEmail: business.contact?.email ?? '',
        contactPhone: business.contact?.phone ?? '',
        contactWebsite: business.contact?.website ?? '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        type: 'other',
        status: 'active',
        registrationNumber: '',
        taxId: '',
        startDate: '',
        contactEmail: '',
        contactPhone: '',
        contactWebsite: '',
      });
    }
  };

  const handleAddClick = () => {
    setEditingBusiness(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleEditClick = (business: Business) => {
    setEditingBusiness(business);
    resetForm(business);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (business: Business) => {
    if (window.confirm(`Supprimer l'entreprise "${business.name}" ?`)) {
      deleteMutation.mutate(business._id);
    }
  };

  const onSubmit = (values: BusinessFormValues) => {
    const { contactEmail, contactPhone, contactWebsite, ...rest } = values;
    const payload = {
      ...rest,
      contact: {
        email: contactEmail || undefined,
        phone: contactPhone || undefined,
        website: contactWebsite || undefined,
      },
    };
    if (editingBusiness) {
      updateMutation.mutate({ id: editingBusiness._id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
    setIsFormOpen(false);
  };

  const businesses = data?.businesses ?? [];
  const activeCount = businesses.filter((b) => b.status === 'active').length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Entreprises</h1>
        <Button onClick={handleAddClick}>Ajouter une entreprise</Button>
      </div>

      {/* Résumé */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total d'entreprises</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-semibold">{businesses.length}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Entreprises actives</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-semibold text-green-600">{activeCount}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des entreprises</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : businesses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business._id}>
                    <TableCell className="font-medium">{business.name}</TableCell>
                    <TableCell>{TYPE_LABELS[business.type] ?? business.type}</TableCell>
                    <TableCell>
                      <span
                        className={
                          business.status === 'active'
                            ? 'text-green-600 font-medium'
                            : business.status === 'closed'
                              ? 'text-red-600 font-medium'
                              : 'text-yellow-600 font-medium'
                        }
                      >
                        {STATUS_LABELS[business.status]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {business.startDate
                        ? new Date(business.startDate).toLocaleDateString('fr-FR')
                        : '—'}
                    </TableCell>
                    <TableCell>{business.contact?.email ?? '—'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/businesses/${business._id}`)}
                      >
                        Détail
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(business)}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(business)}
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
              Aucune entreprise pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Formulaire */}
      {isFormOpen && (
        <Card className="fixed bottom-4 right-4 w-full max-w-md shadow-lg z-50 max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>
              {editingBusiness ? "Modifier l'entreprise" : 'Ajouter une entreprise'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir un type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sole_proprietorship">Entreprise individuelle</SelectItem>
                            <SelectItem value="partnership">Société de personnes</SelectItem>
                            <SelectItem value="corporation">Société par actions</SelectItem>
                            <SelectItem value="llc">SARL</SelectItem>
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspendue</SelectItem>
                            <SelectItem value="closed">Fermée</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de création (optionnel)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro d'enregistrement (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de TVA / identifiant fiscal (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact (optionnel)</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site web (optionnel)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://…" />
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
                    {editingBusiness ? 'Enregistrer' : 'Ajouter'}
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
