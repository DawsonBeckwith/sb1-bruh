import React from 'react';
import { useAuth } from '../../services/auth';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import EyeOfSauron from '../EyeOfSauron';

export default function AuthContainer() {
  const { showingSignup } = useAuth();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-black to-zinc-950">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="mb-4 flex justify-center">
              <EyeOfSauron />
            </div>
            <h1 className="text-2xl font-bold text-green-400 mb-2 text-center">
              {showingSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-zinc-400 text-center max-w-sm">
              {showingSignup 
                ? 'Create your account to get started' 
                : 'Sign in to continue to your predictions'}
            </p>
          </div>
          
          <div className="w-full">
            {showingSignup ? <SignupForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </div>
  );
}