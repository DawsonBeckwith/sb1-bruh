import React from 'react';

interface LeagueSelectorProps {
  onLeagueSelect: (league: string) => void;
  selectedLeague: string;
  visible: boolean;
}

export default function LeagueSelector({ onLeagueSelect, selectedLeague, visible }: LeagueSelectorProps) {
  if (!visible) return null;

  const leagues = [
    { id: 'nfl', name: 'NFL', active: true },
    { id: 'nba', name: 'NBA', active: true },
    { id: 'nhl', name: 'NHL', active: true },
    { id: 'ncaaf', name: 'NCAAF', active: true },
    { id: 'ncaab', name: 'NCAAB', active: true },
    { id: 'ufc', name: 'UFC', active: true },
    { id: 'mlb', name: 'MLB', active: false }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto p-4">
      {leagues.map(league => (
        <button
          key={league.id}
          onClick={() => league.active && onLeagueSelect(league.id)}
          disabled={!league.active}
          className={`group flex items-center justify-center p-4 glass-panel rounded-lg neo-button transition-all duration-300 ${
            !league.active ? 'opacity-50 cursor-not-allowed' : 
            selectedLeague === league.id ? 'bg-green-500/30 shadow-lg shadow-green-500/20 border-green-400/30' :
            'hover:shadow-lg hover:shadow-green-900/20'
          }`}
        >
          <span className={`text-lg font-medium font-display ${
            selectedLeague === league.id ? 'text-green-300' :
            league.active ? 'text-green-400 group-hover:text-green-300' : 
            'text-zinc-500'
          }`}>
            {league.name}
            {!league.active && ' (Off)'}
          </span>
        </button>
      ))}
    </div>
  );
}