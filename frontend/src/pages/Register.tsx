/**
 * Page d'inscription
 * Permet aux nouveaux utilisateurs de créer un compte
 * Utilise le contexte d'authentification pour gérer l'inscription
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { RegisterRequest } from '@/types';

/**
 * Composant de la page d'inscription
 * Gère le formulaire d'inscription et l'appel à l'API
 */
export default function Register() {
  // Hook de navigation pour rediriger après l'inscription
  const navigate = useNavigate();
  
  // Récupère les méthodes d'authentification depuis le contexte
  const { register } = useAuth();
  
  // État du formulaire
  const [formData, setFormData] = useState<RegisterRequest>({
    firstname: '',
    lastname: '',
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
   * Appelle l'API d'inscription via le contexte d'authentification
   * 
   * @param e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Vérifie que le mot de passe fait au moins 6 caractères
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        setIsLoading(false);
        return;
      }
      
      // Appelle la méthode register du contexte d'authentification
      // Cette méthode appelle POST /api/auth/register
      await register(formData);
      
      // En cas de succès, redirige vers le dashboard
      navigate('/dashboard');
    } catch (err: any) {
      // En cas d'erreur, affiche le message d'erreur
      setError(err.message || 'Erreur lors de l\'inscription');
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
            Inscription
          </CardTitle>
          <CardDescription className="text-center">
            Créez votre compte pour commencer à gérer vos finances
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
            
            {/* Champ prénom */}
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Jean"
                value={formData.firstname}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
            {/* Champ nom */}
            <div className="space-y-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Dupont"
                value={formData.lastname}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
            
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
                minLength={6}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 6 caractères
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            {/* Bouton d'inscription */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
            
            {/* Lien vers la page de connexion */}
            <div className="text-sm text-center text-muted-foreground">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
