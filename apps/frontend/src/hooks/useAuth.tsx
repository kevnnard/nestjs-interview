import { useContext } from 'react';

import { AuthContext } from '@ocmi/frontend/contexts/Auth.context';

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) throw new Error('useAuth must be used within an AuthProvider');

  return context;
}
