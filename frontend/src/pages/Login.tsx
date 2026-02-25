/**
 * Page de connexion
 * Permet aux utilisateurs de se connecter avec leur email et mot de passe
 * Utilise le contexte d'authentification pour gérer la connexion
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { LoginRequest } from '@/types';


export default function Login() {
  // Hook de navigation pour rediriger après la connexion
  const navigate = useNavigate();

  // Récupère les méthodes d'authentification depuis le contexte
  const { login } = useAuth();

  // État du formulaire
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  // État de chargement - true pendant la requête API
  const [isLoading, setIsLoading] = useState(false);

  // État d'erreur - message d'erreur à afficher
  const [error, setError] = useState<string>('');

  /**
   * Gère le changement de valeur dans les champs du formulaire
   * Met à jour l'état du formulaire avec la nouvelle valeur
   * 
   * @param e - Événement de changement d'input
   */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Efface l'erreur lorsqu'un champ est modifié
    if (error) setError('');
  };

  /**
   * Gère la soumission du formulaire
   * Appelle l'API de connexion via le contexte d'authentification
   * 
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Appelle la méthode login du contexte d'authentification
      // Cette méthode appelle POST /api/auth/login
      await login(formData);

      // En cas de succès, redirige vers le dashboard
      navigate('/dashboard');
    } catch (err: any) {
      // En cas d'erreur, affiche le message d'erreur
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      // Remet le chargement à false dans tous les cas
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Connexion
          </CardTitle>
          <CardDescription className="text-center">
            Entrez vos identifiants pour accéder à votre dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Message d'erreur */}
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Champ email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="votre.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            {/* Champ mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 my-4">
            {/* Bouton de connexion */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

            {/* Lien vers la page d'inscription */}
            <div className="text-sm text-center text-muted-foreground">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                S'inscrire
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
