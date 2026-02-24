import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-6 space-y-2">
      <h1 className="text-3xl font-bold mb-2">Profil</h1>
      {user ? (
        <>
          <p className="text-lg">
            <span className="font-semibold">Nom :</span> {user.firstname} {user.lastname}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email :</span> {user.email}
          </p>
        </>
      ) : (
        <p className="text-muted-foreground">Aucun utilisateur chargé.</p>
      )}
    </div>
  );
}

