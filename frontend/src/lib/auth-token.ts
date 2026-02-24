/**
 * Stockage en mémoire du token d'accès JWT.
 * 
 * Le but est de conserver le token uniquement en mémoire (et non dans le localStorage)
 * pour limiter l'impact en cas de compromission du stockage persistant.
 */

let accessToken: string | null = null;

/**
 * Définit le token d'accès courant en mémoire.
 * @param token - Nouveau token ou null pour le réinitialiser
 */
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

/**
 * Récupère le token d'accès courant depuis la mémoire.
 * @returns Le token d'accès ou null s'il n'est pas défini
 */
export const getAccessToken = (): string | null => {
  return accessToken;
};

