import React from 'react';

interface HeaderProps {
    subtitle: string;
}

// FIX: Changed return type from JSX.Element to React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
export function Header({ subtitle }: HeaderProps): React.ReactElement {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-800">
          JockesTeAIcher
        </h1>
      </div>
      <div className="text-center pb-4 px-4">
         <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </header>
  );
}
