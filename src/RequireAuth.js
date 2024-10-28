import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    loginWithRedirect();
    return <p>Prvo je potrebno ulogirati se.</p>;
  }

  return children;
};

export default RequireAuth;