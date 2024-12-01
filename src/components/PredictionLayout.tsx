import React, { useCallback, useMemo, useState } from 'react';
import { usePredictionStore } from '../store/predictionStore';
import { useLiveData } from '../hooks/useLiveData';
import { useAuth } from '../services/auth';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import PredictionResult from './PredictionResult';
import LeagueSelector from './LeagueSelector';
import ErrorMessage from './ErrorMessage';
import Header from './Header';

type Section = 'vision' | 'prop' | 'stock' | 'crypto';

export default function PredictionLayout() {
  const [activeSection, setActiveSection] = useState<Section>('vision');
  const [selectedLeague, setSelectedLeague] = useState<string>('nfl');
  const { isAuthenticated } = useAuth();
  
  const { 
    predictions, 
    loading,
    error: predictionError,
    clearError,
    clearPredictions,
    setPrediction,
    setLoading
  } = usePredictionStore();

  const handleSubmit = useCallback(() => {
    if (loading) return;
    setLoading(true);
    clearPredictions();
    clearError();
    window.dispatchEvent(new CustomEvent('fetch-prediction'));
  }, [loading, setLoading, clearPredictions, clearError]);

  const symbol = useMemo(() => 
    activeSection === 'crypto' ? 'BTC-USD' : 
    activeSection === 'stock' ? 'SPY' : 
    selectedLeague
  , [activeSection, selectedLeague]);

  const handleDataUpdate = useCallback((data: any) => {
    if (data) {
      setPrediction(symbol, JSON.stringify(data));
      setLoading(false);
    }
  }, [setPrediction, setLoading, symbol]);

  useLiveData(activeSection, symbol, handleDataUpdate);

  const handleSectionChange = useCallback((section: Section) => {
    setActiveSection(section);
    setSelectedLeague(section === 'vision' || section === 'prop' ? 'nfl' : '');
    clearPredictions();
    clearError();
  }, [clearPredictions, clearError]);

  const handleLeagueSelect = useCallback((league: string) => {
    setSelectedLeague(league);
    clearPredictions();
    clearError();
  }, [clearPredictions, clearError]);

  const currentPrediction = useMemo(() => {
    if (!predictions || Object.keys(predictions).length === 0) return '';
    return symbol ? predictions[symbol] : 
      Object.values(predictions).join('\n\n');
  }, [symbol, predictions]);

  const searchPlaceholder = useMemo(() => {
    if (!isAuthenticated) return 'Please sign in to view predictions';
    if (loading) return 'Processing request...';
    switch (activeSection) {
      case 'vision': return 'Click to analyze current odds and lines';
      case 'prop': return 'Click to analyze live player statistics';
      case 'crypto': return 'Click to analyze crypto market conditions';
      default: return 'Click to analyze market data';
    }
  }, [loading, activeSection, isAuthenticated]);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar
        activeSection={activeSection}
        selectedLeague={selectedLeague}
        onSectionChange={handleSectionChange}
      />
      
      <main className="flex-1 flex flex-col min-h-screen">
        <Header />

        <div className="flex-1 overflow-auto">
          <LeagueSelector
            onLeagueSelect={handleLeagueSelect}
            selectedLeague={selectedLeague}
            visible={activeSection === 'vision' || activeSection === 'prop'}
          />

          {predictionError ? (
            <ErrorMessage message={predictionError} />
          ) : (
            currentPrediction && (
              <PredictionResult 
                prediction={currentPrediction} 
                type={activeSection}
              />
            )
          )}
        </div>

        <footer className="sticky bottom-0 bg-black border-t border-green-500/10 p-6">
          <SearchBar
            placeholder={searchPlaceholder}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </footer>
      </main>
    </div>
  );
}