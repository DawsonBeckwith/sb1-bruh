import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

interface LayoutProps {
  children: React.ReactNode;
  loading: boolean;
  searchPlaceholder: string;
}

export default function Layout({ children, loading, searchPlaceholder }: LayoutProps) {
  return (
    <div className="app-container">
      <div className="sidebar-area">
        <Sidebar />
      </div>
      
      <main className="content-area">
        <Header />
        
        <div className="prediction-content">
          {children}
        </div>

        <footer className="footer-area">
          <SearchBar
            placeholder={searchPlaceholder}
            loading={loading}
            onSubmit={() => null}
          />
        </footer>
      </main>
    </div>
  );
}