import React, { useState } from 'react';
import { Subject, AppMode } from './types';
import { SUBJECT_CONFIGS } from './constants';
import Solver from './components/Solver';
import Theory from './components/Theory';
import Game from './components/Game';

const App: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeMode, setActiveMode] = useState<AppMode>(AppMode.HOME);

  // Helper to get active component
  const renderContent = () => {
    if (!activeSubject) return renderHome();

    switch (activeMode) {
      case AppMode.SOLVER:
        return <Solver subject={activeSubject} />;
      case AppMode.THEORY:
        return <Theory subject={activeSubject} />;
      case AppMode.GAME:
        return <Game subject={activeSubject} />;
      default:
        return renderHome();
    }
  };

  const renderHome = () => (
    <div className="max-w-6xl mx-auto pt-10 px-4 pb-24 overflow-y-auto h-full scrollbar-hide">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-4xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 mb-6">
          OmniScience Tutor
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Domina el universo de las ciencias exactas. Resuelve problemas, aprende teoría y juega con IA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pb-10">
        {Object.values(SUBJECT_CONFIGS).map((config) => (
          <button
            key={config.id}
            onClick={() => {
              setActiveSubject(config.id);
              setActiveMode(AppMode.SOLVER);
            }}
            className="group relative bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-lg"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-5xl md:text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {config.icon}
              </span>
              <h2 className="text-2xl font-bold text-white mb-2">{config.id}</h2>
              <p className="text-slate-400 text-center text-sm">
                Explora el mundo de la {config.id.toLowerCase()}.
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar (Desktop Only) */}
      {activeSubject && (
        <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex-col transition-all duration-300">
          <div className="p-6 border-b border-slate-800 flex items-center justify-start gap-3">
             <div onClick={() => setActiveSubject(null)} className="cursor-pointer flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white">OS</div>
                 <span className="font-bold text-lg">OmniScience</span>
             </div>
          </div>

          <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
             <div className="mb-6">
                 <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                     Asignatura
                 </p>
                 <div className={`rounded-xl p-3 bg-slate-800/50 border border-slate-700 flex items-center gap-3 ${SUBJECT_CONFIGS[activeSubject].color}`}>
                     <span className="text-xl">{SUBJECT_CONFIGS[activeSubject].icon}</span>
                     <span className="font-semibold">{activeSubject}</span>
                 </div>
                 <div className="flex gap-2 mt-2">
                     {Object.values(SUBJECT_CONFIGS).map(s => (
                         s.id !== activeSubject && (
                             <button 
                                key={s.id} 
                                onClick={() => setActiveSubject(s.id)}
                                className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-lg transition-colors border border-slate-700"
                                title={s.id}
                            >
                                {s.icon}
                             </button>
                         )
                     ))}
                 </div>
             </div>

             <div className="space-y-1">
                <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                     Modo
                 </p>
                {[
                  { id: AppMode.SOLVER, label: 'Resolver', icon: '🧠' },
                  { id: AppMode.THEORY, label: 'Aprender', icon: '📖' },
                  { id: AppMode.GAME, label: 'Jugar', icon: '🎮' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id as AppMode)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeMode === mode.id
                        ? `bg-slate-800 text-white shadow-lg border border-slate-700`
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="text-xl">{mode.icon}</span>
                    <span className="font-medium">{mode.label}</span>
                  </button>
                ))}
             </div>
          </div>
          
          <div className="p-4 border-t border-slate-800">
             <button onClick={() => setActiveSubject(null)} className="flex items-center gap-3 text-slate-500 hover:text-white transition-colors w-full px-4 py-2">
                 <span>⬅</span>
                 <span>Volver al Inicio</span>
             </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col w-full">
          {/* Mobile Top Bar */}
          {activeSubject && (
              <header className="md:hidden h-14 bg-slate-900/95 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 z-20 flex-shrink-0">
                   <div className="flex items-center gap-2 font-bold text-white">
                        <span className="text-xl">{SUBJECT_CONFIGS[activeSubject].icon}</span>
                        <span className="text-base truncate">{activeSubject}</span>
                   </div>
                   <button onClick={() => setActiveSubject(null)} className="text-xs font-medium text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                      Inicio
                   </button>
              </header>
          )}

          <div className="flex-1 overflow-hidden h-full relative w-full">
             <div className="absolute inset-0 p-3 md:p-6 overflow-hidden">
                {renderContent()}
             </div>
          </div>

          {/* Mobile Bottom Navigation Bar */}
          {activeSubject && (
            <nav className="md:hidden bg-slate-900 border-t border-slate-800 pb-safe z-30 flex justify-around items-center h-16 flex-shrink-0">
               {[
                  { id: AppMode.SOLVER, label: 'Resolver', icon: '🧠' },
                  { id: AppMode.THEORY, label: 'Aprender', icon: '📖' },
                  { id: AppMode.GAME, label: 'Jugar', icon: '🎮' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id as AppMode)}
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                      activeMode === mode.id ? 'text-blue-400' : 'text-slate-500'
                    }`}
                  >
                    <span className={`text-xl ${activeMode === mode.id ? 'transform scale-110' : ''}`}>{mode.icon}</span>
                    <span className="text-[10px] font-medium">{mode.label}</span>
                  </button>
                ))}
            </nav>
          )}
      </main>
    </div>
  );
};

export default App;