import { useState, useEffect, useRef } from 'react';
import { Phrase, UserProgressData } from '../types';
import { PHRASES } from '../data/phrases';
import { 
  Volume2, 
  Mic, 
  Check, 
  X, 
  ArrowLeft, 
  RefreshCw, 
  Layers, 
  Bot, 
  User as UserIcon, 
  Send,
  HelpCircle,
  Sparkles,
  Info,
  Eye
} from 'lucide-react';

function getLevenshteinDistance(a: string, b: string): number {
  const tmp = [];
  let i, j, val;
  for (i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (i = 1; i <= a.length; i++) {
    for (j = 1; j <= b.length; j++) {
      val = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + val
      );
    }
  }
  return tmp[a.length][b.length];
}

interface PracticeSessionProps {
  progress: UserProgressData;
  initialInstantPhrase: Phrase | null;
  onSessionComplete: (correctIds: number[], incorrectIds: number[]) => void;
  onGoBack: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user';
  text: string;
  timestamp: string;
  // Metadata for rendering customized rich contents
  isGreeting?: boolean;
  phraseChallenge?: Phrase;
  audioTextToPlay?: string;
  isCorrection?: boolean;
  isCorrect?: boolean;
  isAlmostCorrect?: boolean;
  isFinishAction?: boolean;
  spokenSimilarity?: number;
}

export default function PracticeSession({ progress, initialInstantPhrase, onSessionComplete, onGoBack }: PracticeSessionProps) {
  // Config & Session State
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [sessionPhrases, setSessionPhrases] = useState<Phrase[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sessionActive, setSessionActive] = useState<boolean>(false);

  // Peek Hint Stats for 5 seconds countdown
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
  const [peekRemainingSeconds, setPeekRemainingSeconds] = useState<number>(0);
  const peekIntervalRef = useRef<any>(null);

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const currentPhrase = sessionPhrases[currentIndex];

  // Real-time user input in the chat bar
  const [userInput, setUserInput] = useState<string>('');
  const [spokenInput, setSpokenInput] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

  // Microphones and vocal assessment
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechFeedback, setSpeechFeedback] = useState<string>('');
  const [isMicBlocked, setIsMicBlocked] = useState<boolean>(false);

  // Keep track of accuracy lists
  const [correctList, setCorrectList] = useState<number[]>([]);
  const [incorrectList, setIncorrectList] = useState<number[]>([]);
  const [sessionCompletedSummary, setSessionCompletedSummary] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll chat to newest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording, speechFeedback]);

  // Load single phrase if requested from the Book list
  useEffect(() => {
    if (initialInstantPhrase) {
      setSessionPhrases([initialInstantPhrase]);
      setSessionActive(true);
      initializeChatSession([initialInstantPhrase]);
    }
  }, [initialInstantPhrase]);

  // Clear peek on transitions/unmount
  useEffect(() => {
    return () => {
      if (peekIntervalRef.current) clearInterval(peekIntervalRef.current);
    };
  }, []);

  const triggerPeek = () => {
    if (isPeeking || isAnswered) return;
    setIsPeeking(true);
    setPeekRemainingSeconds(5);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // Ignored
    }

    if (peekIntervalRef.current) clearInterval(peekIntervalRef.current);

    let sec = 5;
    peekIntervalRef.current = setInterval(() => {
      sec -= 1;
      setPeekRemainingSeconds(sec);
      if (sec <= 0) {
        clearInterval(peekIntervalRef.current);
        setIsPeeking(false);
      }
    }, 1000);
  };

  const getCurrentTimeStr = () => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Sound effects generator
  const playSfx = (isSuccess: boolean) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Ignored
    }
  };

  // Pronounce TTS in English
  const triggerTextToSpeech = (engText: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(engText);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const startSession = () => {
    let filtered = PHRASES;
    if (selectedCategory !== 'Todos') {
      filtered = PHRASES.filter(p => p.category === selectedCategory);
    }

    // Pick random 8 phrases
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    const subset = shuffled.slice(0, 8);

    if (subset.length === 0) {
      alert('Categoria vazia correspondente!');
      return;
    }

    setSessionPhrases(subset);
    setCurrentIndex(0);
    setCorrectList([]);
    setIncorrectList([]);
    setSessionActive(true);
    setSessionCompletedSummary(false);
    initializeChatSession(subset);
  };

  // Boot the chat sequence
  const initializeChatSession = (phrasesList: Phrase[]) => {
    const firstPhrase = phrasesList[0];
    const greetingMsg: ChatMessage = {
      id: `tutor-pre-${Date.now()}-1`,
      sender: 'tutor',
      text: 'Olá! Serei seu tutor de conversação hoje. Preparei um circuito de conversação completo para fixação. Em cada rodada você fará as três atividades integradas: ouvir a fonética, digitar a escrita correta e praticar sua fala com microfone!',
      timestamp: getCurrentTimeStr(),
      isGreeting: true
    };

    const firstChallengeMsg: ChatMessage = {
      id: `tutor-pre-${Date.now()}-2`,
      sender: 'tutor',
      text: `Aqui está nossa primeira expressão! Por favor, traduza para o inglês, clique para ouvir a pronúncia correta e fale para ajustar sua fluência:`,
      timestamp: getCurrentTimeStr(),
      phraseChallenge: firstPhrase,
      audioTextToPlay: firstPhrase.english
    };

    setMessages([greetingMsg, firstChallengeMsg]);
    setIsAnswered(false);
    setUserInput('');
    setSpokenInput('');
    setSpeechFeedback('');

    // Pre-play TTS safely
    setTimeout(() => {
      triggerTextToSpeech(firstPhrase.english);
    }, 1200);
  };

  // Browser speech recognition setup
  const startRecording = () => {
    setSpeechFeedback('');
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRec) {
      setIsMicBlocked(true);
      setSpeechFeedback('Navegador não possui suporte nativo para reconhecimento de fala no iFrame.');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsRecording(true);
        setIsMicBlocked(false);
      };

      rec.onerror = (e: any) => {
        setIsRecording(false);
        if (e.error === 'not-allowed') {
          setIsMicBlocked(true);
          setSpeechFeedback('Acesso ao microfone negado ou bloqueado.');
        } else {
          setSpeechFeedback('Erro ao detectar som: ' + e.error);
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript || '';
        setUserInput(transcript);
        setSpokenInput(transcript);
        setSpeechFeedback(`Transcrito com sucesso: "${transcript}" (Você pode editar, ouvir no alto-falante ou enviar!)`);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err: any) {
      setSpeechFeedback('Erro de inicialização: ' + err.message);
    }
  };

  // Validate the user answers in the Chat layout
  const handleSendAnswer = () => {
    if (!userInput.trim()) {
      alert('Digite sua resposta em inglês no campo do chat!');
      return;
    }

    const currentPhrase = sessionPhrases[currentIndex];

    // Evaluate writing
    const cleanUser = userInput.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    const cleanTarget = currentPhrase.english.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
    
    const isWrittenOk = cleanUser === cleanTarget;
    
    // Levenshtein similarity evaluation
    const maxLen = Math.max(cleanUser.length, cleanTarget.length);
    const distance = getLevenshteinDistance(cleanUser, cleanTarget);
    const writingSimilarityPercentage = maxLen > 0 ? Math.round((1 - distance / maxLen) * 100) : 100;
    
    const isNearlyCorrect = !isWrittenOk && writingSimilarityPercentage >= 70;
    const stepPassed = isWrittenOk || isNearlyCorrect;

    // Evaluate speech similarity comparison
    const speechTextToCheck = spokenInput.trim() || userInput.trim();
    const cleanSpoken = speechTextToCheck.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

    const spokenTokens = cleanSpoken.split(/\s+/).filter(Boolean);
    const targetTokens = cleanTarget.split(/\s+/).filter(Boolean);

    let matches = 0;
    targetTokens.forEach(token => {
      if (spokenTokens.includes(token)) matches++;
    });

    const similarity = targetTokens.length > 0 ? Math.round((matches / targetTokens.length) * 100) : 0;
    const isSpokenOk = similarity >= 70;

    // Play synthesized bell
    playSfx(stepPassed);

    if (stepPassed) {
      setCorrectList(prev => [...prev, currentPhrase.id]);
    } else {
      setIncorrectList(prev => [...prev, currentPhrase.id]);
    }

    // Build the User message bubble response
    const userMsg: ChatMessage = {
      id: `user-reply-${Date.now()}`,
      sender: 'user',
      text: userInput + (spokenInput.trim() ? ` (Pronunciado: "${spokenInput}")` : ''),
      timestamp: getCurrentTimeStr()
    };

    // Build immediate corrective feedback bubble
    let evaluationMsgText = '';
    if (isWrittenOk) {
      evaluationMsgText = `Excelente! Você acertou na mosca. A tradução de "${currentPhrase.translation}" é exatamente "${currentPhrase.english}".`;
    } else if (isNearlyCorrect) {
      evaluationMsgText = `Muito bom! Sua resposta é compreensível e qualquer falante nativo entenderia perfeitamente (${writingSimilarityPercentage}% de similaridade). Marquei como CORRETA! Confira abaixo a grafia sem falhas e a pronúncia e repetição para turbinar sua fluência.`;
    } else {
      evaluationMsgText = `Tentei compreender, mas ficou distante do esperado. Sem problemas, estamos aqui para aprender! A forma recomendada em inglês para "${currentPhrase.translation}" é: "${currentPhrase.english}".`;
    }

    const tutorFeedbackMsg: ChatMessage = {
      id: `tutor-feedback-${Date.now()}`,
      sender: 'tutor',
      text: evaluationMsgText,
      timestamp: getCurrentTimeStr(),
      phraseChallenge: currentPhrase,
      isCorrection: true,
      isCorrect: stepPassed,
      isAlmostCorrect: isNearlyCorrect,
      spokenSimilarity: similarity,
      isFinishAction: true
    };

    setMessages(prev => [...prev, userMsg, tutorFeedbackMsg]);
    setIsAnswered(true);
  };

  // Advance chat sequence to include the next phrase challenge
  const proceedToNextChallenge = () => {
    // Reset peek state
    setIsPeeking(false);
    setPeekRemainingSeconds(0);
    if (peekIntervalRef.current) {
      clearInterval(peekIntervalRef.current);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < sessionPhrases.length) {
      setCurrentIndex(nextIndex);
      setIsAnswered(false);
      setUserInput('');
      setSpokenInput('');
      setSpeechFeedback('');

      const nextPhrase = sessionPhrases[nextIndex];
      const nextChallengeMsg: ChatMessage = {
        id: `tutor-challenge-${Date.now()}`,
        sender: 'tutor',
        text: `Excelente progresso! Vamos para a frase ${nextIndex + 1}. Pratique esta expressão em nosso chat:`,
        timestamp: getCurrentTimeStr(),
        phraseChallenge: nextPhrase,
        audioTextToPlay: nextPhrase.english
      };

      setMessages(prev => [...prev, nextChallengeMsg]);

      // Play the audio for the next phrase automatically
      setTimeout(() => {
        triggerTextToSpeech(nextPhrase.english);
      }, 500);

    } else {
      // Completed last expression
      onSessionComplete(correctList, incorrectList);
      setSessionCompletedSummary(true);
    }
  };

  if (!sessionActive) {
    const categories = Array.from(new Set(PHRASES.map(p => p.category)));

    return (
      <div id="chat-setup-panel" className="bg-white rounded-2xl border border-blue-50 p-6 md:p-8 max-w-xl mx-auto space-y-6 shadow-sm animate-fade-in">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-50 to-indigo-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Bot className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Conversação Instantânea (Simulador de Chat)</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Treine de forma prática por meio de um diálogo dinâmico com nosso Assistente de Idiomas. Oiça, escreva a tradução e grave seu inglês!
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-501 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Selecione o Fluxo de Exercícios:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-xs sm:text-sm focus:outline-none text-slate-700 font-medium cursor-pointer"
            >
              <option value="Todos">Intercâmbio Misto (8 Desafios Aleatórios)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex gap-2.5 items-start">
            <Sparkles className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-indigo-800 leading-normal">
              <strong>Como Treinar:</strong> O tutor enviará mensagens de voz e desafio. Use o teclado para digitar sua tradução de forma direta e ative o botão de microfone para calibrar sua dicção americana!
            </div>
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            onClick={onGoBack}
            className="flex-1 py-3 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          
          <button
            onClick={startSession}
            id="start-chat-btn"
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-blue-100 transition-all flex items-center justify-center gap-1"
          >
            Abrir Chat de Treino
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Finished summary
  if (sessionCompletedSummary) {
    return (
      <div id="chat-completed-stats" className="bg-white rounded-2xl border border-blue-50 p-6 md:p-8 max-w-md mx-auto text-center space-y-6 shadow-sm">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            💡
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Treino por Chat Concluído!</h2>
          <p className="text-xs text-slate-500">Você respondeu a todas as mensagens do tutor com sucesso!</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Fluência Global do Diálogo</span>
            <span className="font-mono font-bold text-slate-700">{correctList.length} de {sessionPhrases.length}</span>
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full relative overflow-hidden">
            <div 
              className="bg-green-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(correctList.length / sessionPhrases.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-2 bg-green-50 rounded-lg border border-green-150">
              <span className="text-[10px] text-green-600 uppercase font-bold tracking-wider block">Acertos</span>
              <span className="text-lg font-extrabold text-green-700 font-mono">{correctList.length}</span>
            </div>
            <div className="p-2 bg-red-50 rounded-lg border border-red-150">
              <span className="text-[10px] text-red-500 uppercase font-bold tracking-wider block">Revisar</span>
              <span className="text-lg font-extrabold text-red-700 font-mono">{incorrectList.length}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setSessionActive(false);
              setSessionCompletedSummary(false);
            }}
            id="restart-chat-btn"
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Iniciar Outro Chat
          </button>
          
          <button
            onClick={onGoBack}
            className="py-2 px-4 text-slate-500 hover:text-slate-800 font-semibold text-xs rounded-xl cursor-pointer transition-all hover:bg-slate-50"
          >
            Voltar ao Painel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="practice-chat-workspace" className="max-w-xl mx-auto flex flex-col h-[600px] bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Chat header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (confirm('Deseja sair do chat de diálogo? Seu progresso nesta rodada será reiniciado.')) {
                setSessionActive(false);
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
            title="Voltar ao início"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="relative">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-sm">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800">Tutor Virtual de Inglês</h4>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-green-600 font-semibold uppercase tracking-wider">Ativo Agora</span>
              <span className="text-[10px] text-slate-400 font-medium">• Progresso: {currentIndex + 1}/{sessionPhrases.length}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            if (confirm('Tem certeza que deseja reiniciar todo o circuito do chat?')) {
              startSession();
            }
          }}
          className="text-slate-400 hover:text-blue-600 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
          title="Reiniciar Circuito"
        >
          <RefreshCw className="w-3 h-3" />
          Reiniciar
        </button>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Avatar block */}
            {msg.sender === 'tutor' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className="space-y-1.5 max-w-[85%]">
              <div 
                className={`p-3.5 rounded-2xl text-xs md:text-sm font-medium ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                }`}
              >
                {msg.text}

                {/* Challenge specific controls */}
                {msg.phraseChallenge && !msg.isCorrection && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100/50 space-y-2.5">
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Traduza no Chat:</span>
                      <strong className="text-sm md:text-base text-slate-900 block mt-1 tracking-tight">
                        "{msg.phraseChallenge.translation}"
                      </strong>
                      <span className="text-[10px] text-slate-500 italic block mt-0.5">Dica contextuada: {msg.phraseChallenge.context}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => triggerTextToSpeech(msg.phraseChallenge!.english)}
                        className="py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        Ouvir Pronúncia Original (Audição)
                      </button>

                      {msg.phraseChallenge.id === currentPhrase?.id && !isAnswered && (
                        <button
                          onClick={triggerPeek}
                          disabled={isPeeking}
                          className="py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-[10px] font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-60"
                          title="Clique para espiar a resposta correta por 5 segundos"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-500" />
                          {isPeeking ? `Espiando (${peekRemainingSeconds}s)` : 'Espiar Resposta (5s)'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Correction details view in the bubble */}
                {msg.isCorrection && msg.phraseChallenge && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1 rounded-full ${
                        msg.isAlmostCorrect 
                          ? 'bg-amber-100 text-amber-700' 
                          : msg.isCorrect 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {msg.isAlmostCorrect ? (
                          <Sparkles className="w-3.5 h-3.5 font-bold" />
                        ) : msg.isCorrect ? (
                          <Check className="w-3.5 h-3.5 font-bold" />
                        ) : (
                          <X className="w-3.5 h-3.5 font-bold" />
                        )}
                      </div>
                      <span className={`text-[11px] font-bold ${
                        msg.isAlmostCorrect 
                          ? 'text-amber-700' 
                          : msg.isCorrect 
                            ? 'text-green-700' 
                            : 'text-red-700'
                      }`}>
                        {msg.isAlmostCorrect 
                          ? 'Quase correto! (Marcado como certo ✓)' 
                          : msg.isCorrect 
                            ? 'Parabéns! Escrita 100% correta ✓' 
                            : 'Atenção aos detalhes ortográficos ✗'}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-150 space-y-1.5 text-[11px] text-slate-600">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Resposta Esperada & Pronúncia</span>
                          <button
                            onClick={() => triggerTextToSpeech(msg.phraseChallenge!.english)}
                            className="p-1 bg-amber-50 rounded text-amber-700 hover:bg-amber-100 cursor-pointer"
                            title="Ouvir como se fala perfeitamente"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-extrabold text-slate-900 font-mono">"{msg.phraseChallenge.english}"</p>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Significado Prático</span>
                        <p className="font-semibold text-slate-700">"{msg.phraseChallenge.meaning}"</p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-150">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">No Cotidiano Americano</span>
                          <button
                            onClick={() => triggerTextToSpeech(msg.phraseChallenge!.example)}
                            className="p-1 bg-slate-100 rounded text-slate-650 hover:bg-slate-200 cursor-pointer"
                            title="Ouvir exemplo no cotidiano"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-semibold text-slate-800 italic">"{msg.phraseChallenge.example}"</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">({msg.phraseChallenge.exampleTranslation})</p>
                      </div>
                    </div>

                    {msg.isFinishAction && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={proceedToNextChallenge}
                          className="py-1.5 px-3 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-extrabold rounded-lg cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                        >
                          Próxima Frase
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Timestamp label */}
              <div className={`text-[9px] text-slate-400 font-semibold font-mono ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.sender === 'tutor' ? 'Tutor' : 'Você'} • {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 border border-blue-500">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Recording active animation feedback */}
        {isRecording && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-xs text-xs md:text-sm font-medium text-slate-500 max-w-[85%]">
              <div className="flex items-center gap-1.5 text-red-650 font-bold animate-pulse">
                <Mic className="w-4 h-4 text-red-500 animate-bounce" />
                Gravando sua voz agora... Fale a frase em inglês!
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mic/iFrame constraints notification */}
      {isMicBlocked && (
        <div className="bg-amber-50 border-y border-amber-200 px-4 py-1.5 text-[10px] text-amber-700 leading-normal flex gap-1.5 items-center shrink-0 font-medium">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Microfone restrito. Se falhar, você pode usar a transcrição de voz alternativa ou o campo do chat!</span>
        </div>
      )}

      {/* Peek Reminder Toast Banner */}
      {isPeeking && currentPhrase && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2.5 text-xs font-bold shrink-0 flex items-center justify-between shadow-md border-b border-orange-600 z-10 animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-200 animate-pulse shrink-0" />
            <span className="leading-tight">
              Coloque na sua mente! A resposta é: <strong className="bg-white/20 px-2 py-0.5 rounded font-mono text-xs sm:text-sm tracking-wide ml-1 border border-white/30 select-all font-black text-white">"{currentPhrase.english}"</strong>
            </span>
          </div>
          <span className="bg-white text-orange-600 px-2 rounded-full font-black text-[10px] shrink-0 font-mono animate-bounce">
            {peekRemainingSeconds}s
          </span>
        </div>
      )}

      {/* Input area */}
      <div className="bg-white border-t border-slate-200 p-3 shrink-0 space-y-2">
        {/* Recording status details */}
        {speechFeedback && (
          <div className="px-1 text-[10px] text-slate-500 italic max-w-full truncate">
            {speechFeedback}
          </div>
        )}

        {/* Input bar and voice recording utility */}
        <div className="flex items-center gap-2">
          {/* Recording tool button */}
          <button
            onClick={startRecording}
            disabled={isAnswered || isRecording}
            className={`p-2.5 rounded-xl border transition-all shrink-0 cursor-pointer ${
              isRecording 
                ? 'bg-red-500 border-red-600 text-white animate-pulse'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-800'
            }`}
            title="Pressione para gravar a pronúncia da frase em inglês"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          {/* User speech backup input box */}
          <input
            type="text"
            disabled={isAnswered}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendAnswer()}
            placeholder="Digite a resposta do tutor e pressione Enter..."
            className="flex-1 min-w-0 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2 px-3 text-xs md:text-sm outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800"
          />

          <button
            onClick={handleSendAnswer}
            disabled={isAnswered || !userInput.trim()}
            id="chat-send-btn"
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl cursor-pointer hover:shadow-sm transition-all"
            title="Enviar Resposta"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Voice matching text alignment tip */}
        <div className="flex flex-wrap items-center justify-between text-[9px] text-slate-400 font-medium gap-1 px-1">
          <span>Ouvir & Repetir: Pratique ao falar e digitar.</span>
          
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Ou use transcrição fonética direta:</span>
            <input 
              type="text"
              disabled={isAnswered}
              value={spokenInput}
              onChange={(e) => setSpokenInput(e.target.value)}
              placeholder="Digite aqui para simular sua fala..."
              className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded font-mono text-[9px] w-28 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
