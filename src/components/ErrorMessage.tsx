import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-3 p-4 glass-panel rounded-lg border border-red-500/20 bg-red-500/5">
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
        <span className="text-sm text-red-400 font-mono">{message}</span>
      </div>
    </div>
  );
}