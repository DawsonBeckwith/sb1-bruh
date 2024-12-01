import React from 'react';
import UsageMeter from './UsageMeter';
import UserInfo from './UserInfo';

export default function Header() {
  return (
    <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-green-500/10 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <UsageMeter />
        <UserInfo />
      </div>
    </div>
  );
}