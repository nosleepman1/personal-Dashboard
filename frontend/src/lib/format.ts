/**
 * Fonctions utilitaires de formatage
 * Centralise les fonctions de formatage utilisées dans l'application
 */

/**
 * Formate un montant en format monétaire (EUR)
 * 
 * @param amount - Montant à formater
 * @returns String formatée (ex: "1 234,56 €")
 * 
 * @example
 * ```typescript
 * formatCurrency(1234.56) // "1 234,56 €"
 * formatCurrency(0) // "0,00 €"
 * formatCurrency(-100) // "-100,00 €"
 * ```
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Formate une date en format français
 * 
 * @param dateString - Date au format ISO string
 * @returns String formatée (ex: "15/01/2024")
 * 
 * @example
 * ```typescript
 * formatDate('2024-01-15T10:30:00.000Z') // "15/01/2024"
 * ```
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formate une date avec l'heure en format français
 * 
 * @param dateString - Date au format ISO string
 * @returns String formatée (ex: "15/01/2024 à 10:30")
 * 
 * @example
 * ```typescript
 * formatDateTime('2024-01-15T10:30:00.000Z') // "15/01/2024 à 10:30"
 * ```
 */
export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
