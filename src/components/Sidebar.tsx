import React from 'react';
import { TrendingUp, User2, BarChart, Bitcoin } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  selectedLeague: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, selectedLeague, onSectionChange }: SidebarProps) {
  const navItems = [
    { id: 'vision', icon: BarChart, label: 'VisionAI', enabled: true },
    { id: 'prop', icon: User2, label: 'PropAI', enabled: true },
    { id: 'stock', icon: TrendingUp, label: 'StockAI', enabled: true },
    { id: 'crypto', icon: Bitcoin, label: 'CryptoAI', enabled: true }
  ];

  return (
    <div className="w-72 min-h-screen glass-panel p-6 flex flex-col border-r border-green-500/10">
      <div className="space-y-3">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center space-x-3 p-4 rounded-lg neo-button ${
              activeSection === id 
                ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-lg shadow-green-900/30' 
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-green-400'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium font-display">{label}</span>
          </button>
        ))}
      </div>

      {selectedLeague && (activeSection === 'vision' || activeSection === 'prop') && (
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-zinc-950/90 to-zinc-900/50 border border-zinc-800/30">
          <span className="text-sm text-zinc-500 font-display">Selected League</span>
          <p className="text-green-400 font-medium mt-1 font-display">{selectedLeague.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
}