import { useState, useEffect } from 'react';
import { Phrase, UserProgressData, PhraseProgress } from '../types';
import { PHRASES, CATEGORIES } from '../data/phrases';
import { getPronunciationGuide, playTextToSpeech, parsePhonetic } from '../utils/pronunciation';
import { FormatPronunciationTip } from './FormatPronunciationTip';
import { 
  Brain, 
  Sparkles, 
  HelpCircle, 
  Check, 
  RotateCcw, 
  Volume2, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Bell, 
  BellRing, 
  Clock, 
  ArrowRight,
  BookmarkPlus,
  Play,
  VolumeX,
  Languages,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpacedRepetitionProps {
  progress: UserProgressData;
  onUpdateProgress: (updated: UserProgressData) => void;
  onNavigateToTab: (tab: any) => void;
}

export default function SpacedRepetition({ progress, onUpdateProgress, onNavigateToTab }: SpacedRepetitionProps) {
  // Tabs for the SRS component: 'review' (study) or 'deck' (all cards list / settings)
  const [srsTab, setSrsTab] = useState<'study' | 'deck' | 'settings'>('study');
  
  // Flashcard states
  const [duePhrases, setDuePhrases] = useState<Phrase[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [srsPronunciationExpanded, setSrsPronunciationExpanded] = useState<boolean>(false);
  const [isSlowSpeech, setIsSlowSpeech] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // Collapse pronunciation guide on card changes
  useEffect(() => {
    setSrsPronunciationExpanded(false);
  }, [currentCardIndex, isFlipped]);
  
  // Stats
  const [srsStats, setSrsStats] = useState({
    totalActive: 0,
    dueCount: 0,
    learnedCount: 0,
    newCount: 500
  });

  // Notification States
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean>(false);
  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(() => {
    return localStorage.getItem('srs_notifications_enabled') === 'true';
  });
  const [notificationTime, setNotificationTime] = useState<string>(() => {
    return localStorage.getItem('srs_notification_time') || '09:00';
  });
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Sync and calculate active/due decks
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    let active = 0;
    let dueList: Phrase[] = [];
    let learned = 0;

    PHRASES.forEach(phrase => {
      const stats = progress.phraseStats[phrase.id];
      if (stats && stats.srsNextReviewDate) {
        active++;
        if (stats.srsNextReviewDate <= todayStr) {
          dueList.push(phrase);
        }
        if (stats.srsInterval && stats.srsInterval >= 14) {
          learned++;
        }
      }
    });

    // Filter by category if selected
    if (selectedCategory !== 'Todos') {
      dueList = dueList.filter(p => p.category === selectedCategory);
    }

    setDuePhrases(dueList);
    setSrsStats({
      totalActive: active,
      dueCount: dueList.length,
      learnedCount: learned,
      newCount: 500 - active
    });

    // Check actual notification permission status
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
    }
  }, [progress, selectedCategory]);

  // Request browser notification permissions
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showToast('⚠️ Seu navegador ou dispositivo não oferece suporte a notificações Web.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasNotificationPermission(granted);
      if (granted) {
        showToast('🔔 Permissão de notificação concedida com sucesso!');
        localStorage.setItem('srs_notifications_enabled', 'true');
        setNotificationEnabled(true);
        triggerNotificationSample("Inglês Master - Notificações Ativadas!", "Excelente escolha! Enviaremos avisos rápidos quando você tiver cartões pendentes de memorização.");
      } else {
        showToast('❌ Permissão de notificação negada.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleNotifications = (checked: boolean) => {
    setNotificationEnabled(checked);
    localStorage.setItem('srs_notifications_enabled', checked ? 'true' : 'false');
    if (checked && !hasNotificationPermission) {
      requestNotificationPermission();
    } else if (checked) {
      showToast('🔔 Lembretes de memorização ativados para às ' + notificationTime + '.');
    } else {
      showToast('🔕 Notificações desativadas.');
    }
  };

  const handleTimeChange = (time: string) => {
    setNotificationTime(time);
    localStorage.setItem('srs_notification_time', time);
    showToast(`⏰ Lembrete agendado diariamente para às ${time}.`);
  };

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => {
      setNotificationToast(null);
    }, 4000);
  };

  const triggerNotificationSample = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: 'https://cdn-icons-png.flaticon.com/512/3898/3898082.png'
        });
      } catch (e) {
        // Fallback for secure frame context blocks
        console.warn("Could not display native notification inside secure frame. Using in-app dialog fallback.", e);
      }
    }
  };

  // Add a phrase to the spaced repetition study deck manually
  const addToSrsDeck = (phraseId: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedStats = { ...progress.phraseStats };
    
    const existing = updatedStats[phraseId] || { correct: 0, incorrect: 0, status: 'unreached' };
    
    updatedStats[phraseId] = {
      ...existing,
      srsInterval: 1,
      srsEaseFactor: 2.5,
      srsRepetitions: 1,
      srsNextReviewDate: todayStr, // immediately due!
    };

    const nextProgress: UserProgressData = {
      ...progress,
      phraseStats: updatedStats
    };

    onUpdateProgress(nextProgress);
    showToast(`📚 Frase #${phraseId} adicionada ao seu Baralho de Memorização!`);
  };

  // Quick fill: add 10 random unpracticed phrases to SRS deck
  const quickAddUnreachedCards = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const updatedStats = { ...progress.phraseStats };
    let addedCount = 0;

    for (const phrase of PHRASES) {
      if (addedCount >= 10) break;
      const stats = updatedStats[phrase.id];
      if (!stats || !stats.srsNextReviewDate) {
        const existing = stats || { correct: 0, incorrect: 0, status: 'unreached' };
        updatedStats[phrase.id] = {
          ...existing,
          srsInterval: 1,
          srsEaseFactor: 2.5,
          srsRepetitions: 1,
          srsNextReviewDate: todayStr
        };
        addedCount++;
      }
    }

    if (addedCount > 0) {
      const nextProgress: UserProgressData = {
        ...progress,
        phraseStats: updatedStats
      };
      onUpdateProgress(nextProgress);
      showToast(`⚡ ${addedCount} novas expressões foram integradas ao seu Baralho!`);
    } else {
      showToast(`😊 Todas as 500 expressões já estão ativas ou não há espaço.`);
    }
  };

  // SM-2 Spaced Repetition Scheduling algorithm implementation
  const handleRateCard = (quality: number) => {
    if (duePhrases.length === 0) return;
    const currentCard = duePhrases[currentCardIndex];
    const today = new Date();
    
    const updatedStats = { ...progress.phraseStats };
    const currentStats = updatedStats[currentCard.id] || { correct: 0, incorrect: 0, status: 'reviewing' };

    // Default starting values if undefined
    let reps = currentStats.srsRepetitions || 0;
    let interval = currentStats.srsInterval || 1;
    let ease = currentStats.srsEaseFactor || 2.5;

    if (quality < 3) {
      // Incorrect / Reset
      reps = 0;
      interval = 1; // repeat tomorrow (or today in session)
      currentStats.incorrect++;
    } else {
      // Correct
      reps++;
      currentStats.correct++;
      
      if (reps === 1) {
        interval = 1; // 1 day
      } else if (reps === 2) {
        interval = 3; // 3 days
      } else {
        // SM-2 multiplier
        interval = Math.round(interval * ease);
      }

      // Adjust ease factor based on rating (SuperMemo SM-2 formula)
      ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (ease < 1.3) ease = 1.3; // safe minimum
    }

    // Scale final intervals to give user pleasant spacing experience
    if (quality === 5) {
      // Easy card gets an extra boost
      interval = Math.round(interval * 1.5);
    }

    // Calculate due date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(today.getDate() + interval);
    const nextReviewStr = nextReviewDate.toISOString().split('T')[0];

    updatedStats[currentCard.id] = {
      ...currentStats,
      status: reps >= 3 ? 'learned' : 'reviewing',
      srsInterval: interval,
      srsRepetitions: reps,
      srsEaseFactor: parseFloat(ease.toFixed(2)),
      srsNextReviewDate: nextReviewStr,
      lastPracticedAt: today.toISOString().split('T')[0]
    };

    const nextProgress: UserProgressData = {
      ...progress,
      phraseStats: updatedStats
    };

    onUpdateProgress(nextProgress);

    // Dynamic congratulatory message
    let ratingLabel = "Bom";
    if (quality < 3) ratingLabel = "Revisar em Breve";
    else if (quality === 3) ratingLabel = "Difícil (Amanhã)";
    else if (quality === 4) ratingLabel = `Bom (+${interval} dias)`;
    else if (quality === 5) ratingLabel = `Fácil (+${interval} dias)`;

    showToast(`✅ Classificado como "${ratingLabel}"!`);

    // Advance index smoothly
    setIsFlipped(false);
    setTimeout(() => {
      if (currentCardIndex + 1 >= duePhrases.length) {
        // Done with current batch
        setCurrentCardIndex(0);
        // Double check if there's any notifications to show
        triggerNotificationSample(
          "Parabéns! Sessão Concluída", 
          "Você revisou com sucesso todas as frases pendentes para o dia de hoje!"
        );
      } else {
        setCurrentCardIndex(prev => prev + 1);
      }
    }, 350);
  };

  const activeCard = duePhrases[currentCardIndex];
  const activePronunciation = activeCard ? getPronunciationGuide(activeCard.english) : null;

  return (
    <div id="spaced-repetition-tab" className="space-y-5 relative">
      
      {/* Dynamic Toast feedback element */}
      <AnimatePresence>
        {notificationToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 bg-slate-900 border border-slate-800 text-white p-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-3 text-xs font-semibold"
          >
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping shrink-0" />
            <p className="flex-1">{notificationToast}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel Box */}
      <div className="bg-white rounded-2xl border border-blue-50 p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Brain className="w-5.5 h-5.5 text-pink-500" />
              Memorização Espaçada (SRS)
            </h3>
            <p className="text-xs text-slate-500">
              Sistema inteligente de revisão espaçada ativa (baseado no algoritmo SuperMemo-2). Otimiza o tempo de estudo programando cada frase de acordo com seu grau de fixação.
            </p>
          </div>

          {/* Settings / Mode bar */}
          <div className="flex bg-slate-50 border border-slate-200/50 rounded-lg p-1 text-xs font-semibold self-start md:self-auto shrink-0">
            <button
              onClick={() => setSrsTab('study')}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                srsTab === 'study' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Estudo Diário
            </button>
            <button
              onClick={() => setSrsTab('deck')}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                srsTab === 'deck' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Baralho ({srsStats.totalActive})
            </button>
            <button
              onClick={() => setSrsTab('settings')}
              className={`py-1.5 px-3 rounded-md transition-all cursor-pointer ${
                srsTab === 'settings' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Reminders 🔔
            </button>
          </div>
        </div>

        {/* Dashboard Mini-Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center font-bold text-pink-600 text-sm">
              {srsStats.dueCount}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block leading-none uppercase">Pendentes Hoje</span>
              <p className="text-xs font-bold text-slate-700 mt-1">Revisão obrigatória</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-sm">
              {srsStats.totalActive}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block leading-none uppercase">Baralho Ativo</span>
              <p className="text-xs font-bold text-slate-700 mt-1">Sendo memorizados</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center font-bold text-green-600 text-sm">
              {srsStats.learnedCount}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block leading-none uppercase">Fixação Forte</span>
              <p className="text-xs font-bold text-slate-700 mt-1">Intervalos &gt;= 14d</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50/60 border border-slate-100 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
              {srsStats.newCount}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block leading-none uppercase">Frases Novas</span>
              <p className="text-xs font-bold text-slate-700 mt-1">Prontas na lista</p>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER TAB 1: STUDY SESSION CARD */}
      {srsTab === 'study' && (
        <div className="space-y-4">
          
          {duePhrases.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 md:p-12 text-center border border-slate-100 flex flex-col items-center justify-center space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center shadow-inner relative">
                <Check className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-800 text-lg">Seu baralho está em dia!</h4>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed mx-auto">
                  Parabéns! Você já revisou todas as suas expressões registradas para o dia de hoje. Volte amanhã para novos ciclos de memorização espaçada.
                </p>
              </div>

              <div className="pt-2 w-full flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={quickAddUnreachedCards}
                  className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] transition-all"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  Inserir +10 Frases no Baralho
                </button>
                <button
                  onClick={() => onNavigateToTab('frases')}
                  className="py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Languages className="w-4 h-4" />
                  Explorar Lista de 500 Frases
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto space-y-4">
              
              {/* Category select filter while studying */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Cartão <strong>{currentCardIndex + 1}</strong> de <strong>{duePhrases.length}</strong> nesta rodada</span>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentCardIndex(0);
                  }}
                  className="bg-white border border-slate-200 text-slate-600 font-medium px-2.5 py-1 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Todos">Todas Categorias</option>
                  {CATEGORIES.filter(c => c !== 'Todos').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* FLIP CARD MECHANIC */}
              <div 
                className="perspective-1000 w-full min-h-[340px] cursor-pointer"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className={`relative w-full h-full min-h-[340px] transition-transform duration-500 transform-style-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}>
                  
                  {/* FRONT SIDE (English Challenge) */}
                  <div className="absolute w-full h-full min-h-[340px] backface-hidden bg-white border border-blue-50 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-md">
                    
                    {/* Header bar */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100/60 pb-3">
                      <span>Expressão em Inglês</span>
                      <span className="text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full font-sans">
                        {activeCard.category}
                      </span>
                    </div>

                    {/* Central Word Container */}
                    <div className="flex-1 flex flex-col items-center justify-center py-6 text-center space-y-4">
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-snug">
                        {activeCard.english}
                      </h2>
                      
                      {/* Audio Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTextToSpeech(activeCard.english, false);
                            setSrsPronunciationExpanded(true);
                          }}
                          className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-full transition-all flex items-center justify-center shadow-xs animate-pulse-subtle"
                          title="Ouvir Normal"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playTextToSpeech(activeCard.english, true);
                            setSrsPronunciationExpanded(true);
                          }}
                          className="py-1.5 px-3 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-xl font-bold text-xs flex items-center gap-1 transition-all"
                          title="Ouvir Devagar"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Ouvir Devagar
                        </button>
                      </div>
                    </div>

                    {/* Footer Guide prompt */}
                    <div className="flex items-center justify-center gap-2 border-t border-slate-100/60 pt-4 text-center">
                      <div className="text-[11px] font-bold text-blue-500 animate-pulse flex items-center gap-1">
                        <span>Clique no cartão para REVELAR A TRADUÇÃO</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE (Translation, meaning & rating controls) */}
                  <div className="absolute w-full h-full min-h-[340px] backface-hidden rotate-y-180 bg-white border-2 border-blue-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-lg">
                    
                    {/* Header bar */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100/60 pb-3">
                      <span>Significado & Tutorial</span>
                      <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-sans">
                        #{activeCard.id}
                      </span>
                    </div>

                    {/* Expanded details container */}
                    <div className="flex-1 py-4 text-left space-y-4 overflow-y-auto max-h-[220px] pr-1">
                      
                      {/* Phrase & Translation */}
                      <div className="space-y-0.5">
                        <h4 className="text-lg font-extrabold text-blue-600 leading-none">{activeCard.english}</h4>
                        <p className="text-sm font-extrabold text-slate-800 italic mt-1">Tradução: {activeCard.translation}</p>
                      </div>

                      {/* Explanation */}
                      <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                        <div>
                          <strong className="text-[10px] uppercase font-bold text-slate-400 font-mono">Significado:</strong>
                          <p className="text-slate-600 font-medium mt-0.5">{activeCard.meaning}</p>
                        </div>
                        <div>
                          <strong className="text-[10px] uppercase font-bold text-slate-400 font-mono">Exemplo:</strong>
                          <p className="text-slate-700 italic font-bold mt-0.5">"{activeCard.example}"</p>
                          <p className="text-slate-500 pl-2 mt-0.5">({activeCard.exampleTranslation})</p>
                        </div>
                      </div>

                      {/* TUTORIAL DE PRONÚNCIA */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSrsPronunciationExpanded(!srsPronunciationExpanded);
                        }}
                        className={`bg-amber-50/55 hover:bg-amber-50/85 border border-amber-200/50 rounded-2xl p-4 transition-all duration-300 cursor-pointer ${
                          srsPronunciationExpanded ? 'shadow-xs border-amber-300/80' : 'hover:border-amber-300/50'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100/70 pb-2">
                          <span className="font-extrabold text-amber-900 flex items-center gap-1.5 text-xs">
                            <Sparkle className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
                            Guia de Pronúncia Prática
                            <span className="text-[10px] bg-amber-100 text-amber-850 px-2 py-0.5 rounded-full font-bold ml-1.5">
                              {srsPronunciationExpanded ? 'Clique para fechar ▲' : 'Clique para ver dicas fáceis ▼'}
                            </span>
                          </span>
                          <span className="font-mono text-[10px] font-extrabold text-amber-800 bg-amber-100/50 px-2.5 py-1 rounded-xl border border-amber-200/50 shrink-0 flex flex-wrap items-center gap-0.5 leading-none shadow-3xs">
                            <span>Sons aproximados:</span>
                            <div className="inline-flex items-center gap-0.5 ml-1 bg-white px-2 py-0.5 rounded-lg border border-amber-200/60 shadow-2xs">
                              {activePronunciation && parsePhonetic(activePronunciation.phoneticSpelling).map((part, pIdx) => {
                                if (part.isSpace) return <span key={pIdx}> </span>;
                                if (part.isHyphen) return <span key={pIdx} className="text-amber-450 px-0.5">-</span>;
                                return (
                                  <span 
                                    key={pIdx} 
                                    className={part.isStressed 
                                      ? "text-pink-600 font-extrabold bg-pink-100/85 px-1.5 py-0.5 rounded border border-pink-200/60 shadow-3xs" 
                                      : "text-slate-800 font-bold"
                                    }
                                  >
                                    {part.text}
                                  </span>
                                );
                              })}
                            </div>
                          </span>
                        </div>

                        {srsPronunciationExpanded && (
                          <div className="mt-3 pt-3 space-y-2.5 animate-slide-down">
                            {activePronunciation?.tips.map((tip, i) => (
                              <div key={i} className="pl-2.5 border-l-2 border-amber-400 hover:border-pink-400 transition-colors">
                                <FormatPronunciationTip tip={tip} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* CARD RATING BUTTONS ROW - Clicking inside must not re-flip, use e.stopPropagation() */}
                    <div 
                      className="border-t border-slate-100/60 pt-4 flex gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleRateCard(1)}
                        className="flex-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-extrabold text-xs transition-all cursor-pointer flex flex-col items-center justify-center leading-none"
                        title="Esqueci totalmente ou errei a tradução"
                      >
                        <span>Errei</span>
                        <span className="text-[9px] text-red-500 font-bold mt-1">Amanhã</span>
                      </button>
                      <button
                        onClick={() => handleRateCard(3)}
                        className="flex-1 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-600 font-extrabold text-xs transition-all cursor-pointer flex flex-col items-center justify-center leading-none"
                        title="Lembrei com extrema dificuldade"
                      >
                        <span>Difícil</span>
                        <span className="text-[9px] text-amber-500 font-bold mt-1">1-2 dias</span>
                      </button>
                      <button
                        onClick={() => handleRateCard(4)}
                        className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 font-extrabold text-xs transition-all cursor-pointer flex flex-col items-center justify-center leading-none"
                        title="Lembrei após pensar alguns segundos"
                      >
                        <span>Bom</span>
                        <span className="text-[9px] text-blue-500 font-bold mt-1">3-7 dias</span>
                      </button>
                      <button
                        onClick={() => handleRateCard(5)}
                        className="flex-1 py-2 rounded-xl bg-green-50 hover:bg-green-100 border border-green-200 text-green-600 font-extrabold text-xs transition-all cursor-pointer flex flex-col items-center justify-center leading-none"
                        title="Resposta imediata sem esforço cognitivo"
                      >
                        <span>Fácil</span>
                        <span className="text-[9px] text-green-500 font-bold mt-1">10+ dias</span>
                      </button>
                    </div>

                  </div>

                </div>
              </div>

              {/* Skip and speech guide advice */}
              <p className="text-[10px] text-slate-400 text-center italic">
                O SRS é auto-gerenciado. Classifique com honestidade para treinar seu subconsciente!
              </p>

            </div>
          )}

        </div>
      )}

      {/* RENDER TAB 2: SRS DECK MANAGEMENT */}
      {srsTab === 'deck' && (
        <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
            <div>
              <h4 className="font-extrabold text-slate-800 text-sm">Controle de Frases Ativas</h4>
              <p className="text-[11px] text-slate-400">Total de expressões cadastradas para acompanhamento espaçado.</p>
            </div>
            
            <button
              onClick={quickAddUnreachedCards}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
            >
              <BookmarkPlus className="w-3.5 h-3.5" />
              Adicionar +10 Novas
            </button>
          </div>

          {/* Quick list view */}
          <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2">
            {PHRASES.map(phrase => {
              const stats = progress.phraseStats[phrase.id];
              const isRegistered = !!(stats && stats.srsNextReviewDate);
              
              return (
                <div 
                  key={phrase.id} 
                  className={`p-3 rounded-xl border flex items-center justify-between gap-4 text-xs transition-all ${
                    isRegistered 
                      ? 'bg-slate-50 border-blue-100/60 hover:bg-blue-50/20' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] text-slate-400">#{phrase.id}</span>
                      <h5 className="font-bold text-slate-800 leading-none">{phrase.english}</h5>
                    </div>
                    <p className="text-[11px] text-slate-500">{phrase.translation}</p>
                    
                    {isRegistered && (
                      <div className="flex items-center gap-3 pt-1 text-[9px] font-bold text-slate-400">
                        <span className="text-blue-500 font-bold bg-blue-50 px-1 rounded-sm leading-none">
                          Intervalo: {stats.srsInterval}d
                        </span>
                        <span>Próximo review: {stats.srsNextReviewDate}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    {isRegistered ? (
                      <span className="text-[10px] text-green-600 bg-green-50 border border-green-100 rounded-full px-2.5 py-0.5 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500 shrink-0" />
                        No Baralho
                      </span>
                    ) : (
                      <button
                        onClick={() => addToSrsDeck(phrase.id)}
                        className="py-1 px-2.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 border border-slate-200 hover:border-blue-500 rounded-lg text-[10px] font-extrabold cursor-pointer transition-all flex items-center gap-1"
                      >
                        <BookmarkPlus className="w-3 h-3" />
                        Inserir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RENDER TAB 3: REMINDER NOTIFICATIONS CONFIG */}
      {srsTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-blue-50 p-5 shadow-xs space-y-5 max-w-xl mx-auto">
          
          <div className="space-y-1.5 text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <BellRing className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">Notificações de Lembrete Diário</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Garanta sua regularidade ativando lembretes diários. O cérebro precisa de contatos programados e repetitivos para atingir a fluência total.
            </p>
          </div>

          <div className="space-y-4 pt-3 border-t border-slate-100">
            {/* Permission Control block */}
            <div className="flex items-center justify-between p-4 bg-slate-50/60 border border-slate-200/40 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-700 block">Status da Permissão no Navegador</span>
                <span className="text-[11px] text-slate-400">Necessário autorizar no navegador para enviar avisos.</span>
              </div>
              <div>
                {hasNotificationPermission ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-lg flex items-center gap-1 leading-none">
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    Autorizado
                  </span>
                ) : (
                  <button
                    onClick={requestNotificationPermission}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs cursor-pointer transition-all shadow-sm"
                  >
                    Ativar no Navegador
                  </button>
                )}
              </div>
            </div>

            {/* Notification Toggle options */}
            <div className="flex items-center justify-between p-4 bg-slate-50/60 border border-slate-200/40 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-700 block">Lembrete Diário Inteligente</span>
                <span className="text-[11px] text-slate-400">Sinaliza quando você tiver revisões espaçadas pendentes.</span>
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationEnabled}
                    onChange={(e) => toggleNotifications(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Hour time selector */}
            <div className="flex items-center justify-between p-4 bg-slate-50/60 border border-slate-200/40 rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-slate-700 block">Horário Preferencial de Aviso</span>
                <span className="text-[11px] text-slate-400">Sugestão de horário ideal para receber alertas silenciosos.</span>
              </div>
              <div>
                <input
                  type="time"
                  value={notificationTime}
                  disabled={!notificationEnabled}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-700 font-extrabold focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Test alert trigger button */}
            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  if (!notificationEnabled) {
                    alert('Por favor, ative a chave de lembrete diário acima para testar!');
                    return;
                  }
                  triggerNotificationSample(
                    "Inglês Master - Teste Concluído!",
                    `Pronto! Alerta sincronizado para disparar às ${notificationTime}. Você tem ${duePhrases.length} frases prontas para estudar agora!`
                  );
                  showToast("🔔 Teste enviado para seu centro de notificações!");
                }}
                className="py-2 px-5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-extrabold cursor-pointer transition-all text-slate-600 flex items-center justify-center gap-2 mx-auto"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                Testar Alerta Imediato
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
