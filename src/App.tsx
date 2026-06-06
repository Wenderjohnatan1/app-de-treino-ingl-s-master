import { useState, useEffect } from 'react';
import { User, UserProgressData, AppTab, Phrase, PhraseProgress } from './types';
import { PHRASES } from './data/phrases';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import PhraseBook from './components/PhraseBook';
import PracticeSession from './components/PracticeSession';
import ProgressStats from './components/ProgressStats';
import { BookOpen, Award, Flame, LogOut, CheckCircle2, LayoutDashboard, Settings2, BarChart3, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Default progress constructor helper
const createInitialProgress = (userId: string): UserProgressData => ({
  userId,
  correctCount: 0,
  incorrectCount: 0,
  streak: 0,
  phraseStats: {},
  incorrectPhraseIds: [],
  history: []
});

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgressData>(createInitialProgress(''));
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [instantPhrase, setInstantPhrase] = useState<Phrase | null>(null);

  // 1. Core hook: Handle User authentication loads
  useEffect(() => {
    try {
      const activeUser = localStorage.getItem('ingles_master_active_user');
      if (activeUser) {
        const parsed: User = JSON.parse(activeUser);
        setCurrentUser(parsed);
        loadUserProgress(parsed.id);
      }
    } catch (e) {
      console.error("Error recovering session:", e);
    }
  }, []);

  const loadUserProgress = (userId: string) => {
    try {
      const stored = localStorage.getItem(`ingles_master_progress_${userId}`);
      if (stored) {
        setProgress(JSON.parse(stored));
      } else {
        const fresh = createInitialProgress(userId);
        // Default streak 1 if brand new account to make user motivated
        fresh.streak = 1;
        setProgress(fresh);
        localStorage.setItem(`ingles_master_progress_${userId}`, JSON.stringify(fresh));
      }
    } catch {
      const fresh = createInitialProgress(userId);
      setProgress(fresh);
    }
  };

  const handleLogin = (user: User) => {
    localStorage.setItem('ingles_master_active_user', JSON.stringify(user));
    setCurrentUser(user);
    loadUserProgress(user.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('ingles_master_active_user');
    setCurrentUser(null);
    setProgress(createInitialProgress(''));
    setActiveTab('dashboard');
  };

  // 2. Core hook: Save active progress state on change
  const saveProgressData = (updated: UserProgressData) => {
    setProgress(updated);
    if (currentUser) {
      localStorage.setItem(`ingles_master_progress_${currentUser.id}`, JSON.stringify(updated));
    }
  };

  // Core handler: update statistics after a quiz session finishes
  const handleSessionComplete = (correctIds: number[], incorrectIds: number[]) => {
    if (!currentUser) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const updatedStats = { ...progress.phraseStats };
    const errorIdsSet = new Set<number>(progress.incorrectPhraseIds);

    // Process correctness
    correctIds.forEach(id => {
      const prev: PhraseProgress = updatedStats[id] || { correct: 0, incorrect: 0, status: 'unreached' };
      const nextCorrect = prev.correct + 1;
      
      updatedStats[id] = {
        ...prev,
        correct: nextCorrect,
        // Mark learned if correct 2 or more times
        status: nextCorrect >= 2 ? 'learned' : 'reviewing',
        lastPracticedAt: todayStr
      };

      // Correctly resolved errors are removed from active error tracker
      errorIdsSet.delete(id);
    });

    // Process errors
    incorrectIds.forEach(id => {
      const prev: PhraseProgress = updatedStats[id] || { correct: 0, incorrect: 0, status: 'unreached' };
      updatedStats[id] = {
        ...prev,
        incorrect: prev.incorrect + 1,
        status: 'reviewing',
        lastPracticedAt: todayStr
      };

      // Adds to active error list
      errorIdsSet.add(id);
    });

    // Handle interactive streaks
    let currentStreak = progress.streak;
    const lastActive = progress.lastActiveDate;
    if (lastActive !== todayStr) {
      currentStreak += 1;
    }

    // Process daily history row
    const updatedHistory = [...progress.history];
    const existingIndex = updatedHistory.findIndex(h => h.date === todayStr);

    if (existingIndex >= 0) {
      updatedHistory[existingIndex] = {
        date: todayStr,
        correct: updatedHistory[existingIndex].correct + correctIds.length,
        incorrect: updatedHistory[existingIndex].incorrect + incorrectIds.length
      };
    } else {
      updatedHistory.push({
        date: todayStr,
        correct: correctIds.length,
        incorrect: incorrectIds.length
      });
    }

    const nextProgress: UserProgressData = {
      userId: currentUser.id,
      correctCount: progress.correctCount + correctIds.length,
      incorrectCount: progress.incorrectCount + incorrectIds.length,
      streak: currentStreak === 0 ? 1 : currentStreak,
      lastActiveDate: todayStr,
      phraseStats: updatedStats,
      incorrectPhraseIds: Array.from(errorIdsSet),
      history: updatedHistory
    };

    saveProgressData(nextProgress);
    setInstantPhrase(null); // clear temporary instant practice state
  };

  // Direct practice on a specific selected error
  const handleRetrainError = (phraseId: number) => {
    const target = PHRASES.find(p => p.id === phraseId);
    if (target) {
      setInstantPhrase(target);
      setActiveTab('treinar');
    }
  };

  // Force clean active error deck
  const handleClearErrors = () => {
    if (confirm('Tem certeza que deseja limpar todo o seu banco de erros cadastrados no momento?')) {
      const cleared: UserProgressData = {
        ...progress,
        incorrectPhraseIds: []
      };
      saveProgressData(cleared);
    }
  };

  // Immediate single-phrase test
  const handleInstantPractice = (phrase: Phrase) => {
    setInstantPhrase(phrase);
    setActiveTab('treinar');
  };

  return (
    <div id="main-container" className="min-h-screen bg-slate-50 flex flex-col font-sans select-none antialiased text-slate-800">
      
      {/* 1. Global Navigation Top Header */}
      <header className="bg-white border-b border-blue-50 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 leading-none tracking-tight text-sm sm:text-base">Inglês Master</h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">As 500 Frases do Dia a Dia</p>
            </div>
          </div>

          {/* Connected User Badge */}
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-slate-700 leading-none">{currentUser.name}</p>
                <span className="text-[9px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                  🔥 {progress.streak} Dias
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100/80 border border-blue-200.5 flex items-center justify-center text-xs font-black text-blue-700 sm:w-9 sm:h-9">
                {currentUser.name[0]?.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 2. Main content container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 pb-24 md:pb-6 space-y-6">
        
        {/* If user is not authenticated: Gate with signup form */}
        <AnimatePresence mode="wait">
          {!currentUser ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-md mx-auto pt-6"
            >
              <AuthModal 
                currentUser={currentUser} 
                onLogin={handleLogin} 
                onLogout={handleLogout} 
              />
            </motion.div>
          ) : (
            // Authenticated Application Deck
            <motion.div
              key="app"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Desktop Side Bar controls */}
              <aside className="lg:col-span-3 hidden lg:flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-blue-50 p-4 shadow-sm space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mb-1">Navegação</span>
                  
                  <button
                    onClick={() => { setActiveTab('dashboard'); setInstantPhrase(null); }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                      activeTab === 'dashboard' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Início Panel
                  </button>

                  <button
                    onClick={() => { setActiveTab('treinar'); }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                      activeTab === 'treinar' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <Languages className="w-4 h-4" />
                    Treinar Fala & Escuta
                  </button>

                  <button
                    onClick={() => { setActiveTab('frases'); setInstantPhrase(null); }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                      activeTab === 'frases' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Consultar 500 Frases
                  </button>

                  <button
                    onClick={() => { setActiveTab('progresso'); setInstantPhrase(null); }}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center gap-2.5 transition-all text-left cursor-pointer ${
                      activeTab === 'progresso' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Seu Progresso
                  </button>
                </div>

                {/* Account card directly in sidebar */}
                <AuthModal 
                  currentUser={currentUser} 
                  onLogin={handleLogin} 
                  onLogout={handleLogout} 
                />
              </aside>

              {/* Central Dynamic View Tab Panel */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Active View Selector */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'dashboard' && (
                      <Dashboard 
                        progress={progress} 
                        activeTab={setActiveTab}
                        onRetrainError={handleRetrainError}
                        onClearErrors={handleClearErrors}
                      />
                    )}

                    {activeTab === 'treinar' && (
                      <PracticeSession 
                        progress={progress}
                        initialInstantPhrase={instantPhrase}
                        onSessionComplete={handleSessionComplete}
                        onGoBack={() => { setActiveTab('dashboard'); setInstantPhrase(null); }}
                      />
                    )}

                    {activeTab === 'frases' && (
                      <PhraseBook 
                        progress={progress} 
                        onInstantPractice={handleInstantPractice}
                      />
                    )}

                    {activeTab === 'progresso' && (
                      <ProgressStats progress={progress} />
                    )}
                  </motion.div>
                </AnimatePresence>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 3. Mobile Navigation Bottom Control Bar - Otimizado para Mobile */}
      {currentUser && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-blue-50 px-4 py-2 flex justify-around items-center z-40 shadow-xl">
          <button
            onClick={() => { setActiveTab('dashboard'); setInstantPhrase(null); }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              activeTab === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] leading-none">Início</span>
          </button>

          <button
            onClick={() => { setActiveTab('treinar'); }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              activeTab === 'treinar' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Languages className="w-5 h-5" />
            <span className="text-[10px] leading-none">Treinar</span>
          </button>

          <button
            onClick={() => { setActiveTab('frases'); setInstantPhrase(null); }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              activeTab === 'frases' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] leading-none">Listas</span>
          </button>

          <button
            onClick={() => { setActiveTab('progresso'); setInstantPhrase(null); }}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              activeTab === 'progresso' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="text-[10px] leading-none">Progresso</span>
          </button>

          {/* Mini logout trigger to accommodate mobile logout accessibility */}
          <button
            onClick={() => {
              if (confirm('Deseja realmente sair da sua sessão?')) {
                handleLogout();
              }
            }}
            className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-red-500 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] leading-none">Sair</span>
          </button>
        </nav>
      )}

    </div>
  );
}
