'use client';

import jwt from 'jsonwebtoken';
import { createContext } from 'react';
import { toast } from 'sonner';

/**
 * @interface AuthStateInterface
 * @description Interface for Auth State Context to manage auth state
 * @property {(email: string, password: string) => void} signInAdmin - Function to sign in with admin credentials
 * @property {(email: string, password: string) => void} signInClient - Function to sign in with client credentials
 * @property {} validateJwt - Function to validate JWT token
 */
interface AuthStateInterface {
  signInAdmin: (email: string, password: string) => void;
  signInClient: (email: string, password: string) => void;
  validateJwt: () => void;
}

// INITIAL STATE FOR AUTH CONTEXT
const AuthInitialState: AuthStateInterface = {
  signInAdmin: () => {},
  signInClient: () => {},
  validateJwt: () => {},
};

// CONTEXT TO MANAGE AUTH STATE
export const AuthContext = createContext<AuthStateInterface>(AuthInitialState);

// PROVIDER TO MANAGE AUTH STATE
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // SIGN IN WITH ADMIN CREDENTIALS
  const signInAdmin = async (email: string, password: string) => {
    try {
      // CALL API TO SIGN IN WITH ADMIN CREDENTIALS
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/admin/sign-in`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );

      // PARSE RESPONSE
      const data = await response.json();

      // CHECK IF RESPONSE IS OK
      if (response.ok) {
        // DISPLAY SUCCESS TOAST
        localStorage.setItem('tokenAdmin', data.token);
        toast.success('Signed in successfully');
        return data;
      } else {
        // DISPLAY ERROR TOAST
        localStorage.removeItem('tokenAdmin');
        toast.error(data.message);
      }
    } catch (error) {
      // DISPLAY ERROR TOAST
      localStorage.removeItem('tokenAdmin');
      toast.error('An error occurred');
    }
  };

  // SING IN WITH CLIENT CREDENTIALS
  const signInClient = async (email: string, password: string) => {
    try {
      // CALL API TO SIGN IN WITH CLIENT CREDENTIALS
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/client/sign-in`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );

      // PARSE RESPONSE
      const data = await response.json();

      // CHECK IF RESPONSE IS OK
      if (response.ok) {
        // DISPLAY SUCCESS TOAST
        localStorage.setItem('tokenClient', data.token);
        toast.success('Signed in successfully');
        return data;
      } else {
        // DISPLAY ERROR TOAST
        localStorage.removeItem('tokenClient');
        toast.error(data.message);
      }
    } catch (error) {
      // DISPLAY ERROR TOAST
      localStorage.removeItem('tokenClient');
      toast.error('An error occurred');
    }
  };

  // VALIDATE JWT TOKEN
  const validateJwt = async () => {
    // VALIDATE JWT TOKEN USING LOCAL STORAGE, AND USE JSONWEBTOKEN PACKAGE TO VALIDATE THE TOKEN
    const token = localStorage.getItem('token');
    if (token) {
      // verify a token symmetric
      jwt.verify(
        token,
        'imsadf87s6fsd5fdssj5higuwb698wb578w645g86w8b765',
        function (err, decoded) {
          console.log(decoded); // bar
        },
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signInAdmin,
        signInClient,
        validateJwt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
