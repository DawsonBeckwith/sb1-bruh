import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  loading: boolean;
  onSubmit: () => void;
}

export default function SearchBar({ placeholder, loading, onSubmit }: SearchBarProps) {
  return (
    <div className="max-w-4xl mx-auto flex items-center gap-4">
      <div className="flex-1 glass-panel rounded-lg px-6 py-4 text-green-400 prediction-text">
        {placeholder}
      </div>
      <button
        onClick={onSubmit}
        disabled={loading}
        className="neo-button bg-green-500/20 text-green-400 p-4 rounded-lg hover:bg-green-500/30 hover:shadow-lg hover:shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <Send className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}