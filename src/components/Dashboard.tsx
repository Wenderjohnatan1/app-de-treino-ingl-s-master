import { UserProgressData, Phrase } from '../types';
import { PHRASES } from '../data/phrases';
import { Award, BookOpen, Flame, CheckCircle, XCircle, ChevronRight, HelpCircle, RotateCcw, AlertTriangle, Play } from 'lucide-react';

interface DashboardProps {
  progress: UserProgressData;
  activeTab: (tab: 'dashboard' | 'treinar' | 'frases' | 'progresso') => void;
  onRetrainError: (phraseId: number) => void;
  onClearErrors: () => void;
}

export default function Dashboard({ progress, activeTab, onRetrainError, onClearErrors }: DashboardProps) {
  const totalPhrases = PHRASES.length;
  // Calculate statistics
  const learnedCount = Object.values(progress.phraseStats).filter(s => s.status === 'learned').length;
  const reviewingCount = Object.values(progress.phraseStats).filter(s => s.status === 'reviewing').length;
  
  const totalAttempts = progress.correctCount + progress.incorrectCount;
  const accuracy = totalAttempts > 0 ? Math.round((progress.correctCount / totalAttempts) * 100) : 0;

  // Group phrases in incorrect list
  const errorPhrases: Phrase[] = PHRASES.filter(p => progress.incorrectPhraseIds.includes(p.id));

  // Category statistics helper
  const getCategoryStats = () => {
    const categories = Array.from(new Set(PHRASES.map(p => p.category)));
    return categories.map(cat => {
      const catPhrases = PHRASES.filter(p => p.category === cat);
      const catIds = catPhrases.map(p => p.id);
      
      const catLearned = catIds.filter(id => progress.phraseStats[id]?.status === 'learned').length;
      const catTotal = catPhrases.length;
      const catPercent = Math.round((catLearned / catTotal) * 100);

      return {
        name: cat,
        learned: catLearned,
        total: catTotal,
        percent: catPercent
      };
    });
  };

  const categoryStats = getCategoryStats();

  return (
    <div id="dashboard-tab" className="space-y-6">
      {/* Primary Stats Header Row - Bento Grid style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Bento */}
        <div className="bg-white rounded-2xl border border-blue-50 p-4 md:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-medium text-xs">Dias Ativos</span>
            <span className="p-2 bg-orange-50 text-orange-500 rounded-xl">
              <Flame className="w-4 h-4 fill-current" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              {progress.streak} <span className="text-xs font-normal text-slate-500">Dias</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">Fogo diário aceso</p>
          </div>
        </div>

        {/* Accuracy Bento */}
        <div className="bg-white rounded-2xl border border-blue-50 p-4 md:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-medium text-xs">Precisão Geral</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              {accuracy}%
            </h4>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 relative overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${accuracy}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">{progress.correctCount} acertos / {totalAttempts} tentativas</p>
          </div>
        </div>

        {/* Learned Phrases Bento */}
        <div className="bg-white rounded-2xl border border-blue-50 p-4 md:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-medium text-xs">Frases Masterizadas</span>
            <span className="p-2 bg-green-50 text-green-600 rounded-xl">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight animate-pulse-once">
              {learnedCount} <span className="text-xs font-normal text-slate-400">/ {totalPhrases}</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">{Math.round((learnedCount / totalPhrases) * 100)}% das 500 do cotidiano</p>
          </div>
        </div>

        {/* Active Errors Bento */}
        <div className="bg-white rounded-2xl border border-blue-50 p-4 md:p-5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-slate-400 font-medium text-xs">Banco de Erros</span>
            <span className={`p-2 rounded-xl ${errorPhrases.length > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
              <XCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h4 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              {errorPhrases.length} <span className="text-xs font-normal text-slate-400">Ativos</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              {errorPhrases.length > 0 ? 'Disponível para revisão' : 'Tudo limpo! Excelente!'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section for Quick Training */}
      <div className="bg-blue-600 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
        {/* Abstract background decorative overlay */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-blue-500 rounded-full opacity-30 select-none pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-700 rounded-full opacity-20 select-none pointer-events-none" />

        <div className="space-y-1 relative z-10 text-center md:text-left">
          <h3 className="font-bold text-lg md:text-xl shrink-0">Pronto para treinar sua pronúncia agora?</h3>
          <p className="text-xs text-blue-100 max-w-lg leading-relaxed">
            Pratique falar, ouvir e escrever as 500 frases mais cruciais recomendadas para o dia a dia americano. Use o microfone para obter feedback instantâneo!
          </p>
        </div>
        <button
          onClick={() => activeTab('treinar')}
          id="btn-cta-train"
          className="relative z-10 py-3 px-6 bg-white hover:bg-blue-50 text-blue-600 font-bold text-xs md:text-sm rounded-xl cursor-pointer shadow-md shadow-blue-800/20 shrink-0 transition-all flex items-center gap-2"
        >
          Iniciar Novo Treino
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Error List View Component -> "onde ela pode ver os seus erros" */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-blue-50 p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Seus Erros para Revisão
                </h3>
                <p className="text-xs text-slate-400">Estude as frases que você errou nos testes anteriores para masterizá-las.</p>
              </div>
              {errorPhrases.length > 0 && (
                <button
                  onClick={onClearErrors}
                  id="btn-clear-errors"
                  className="text-xs text-slate-400 hover:text-red-500 p-2 border border-slate-100 hover:border-red-100 hover:bg-red-50 font-medium rounded-lg cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpar Todos
                </button>
              )}
            </div>

            {errorPhrases.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-xl space-y-2">
                <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h4 className="font-semibold text-slate-700 text-sm">Nenhum erro registrado!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto px-4">
                  Excelente trabalho! Quando errar palavras ou fala nos treinos virtuais, os erros aparecerão aqui para estudo focado.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {errorPhrases.map(phrase => (
                  <div 
                    key={phrase.id} 
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/75 rounded-xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 transition-all text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-600">
                          #{phrase.id}
                        </span>
                        <span className="font-extrabold text-slate-800 tracking-tight">{phrase.english}</span>
                      </div>
                      <p className="text-slate-500 font-medium">{phrase.translation}</p>
                      <p className="text-[10px] text-slate-400 max-w-xs leading-none">Contexto: {phrase.context}</p>
                    </div>
                    
                    <button
                      onClick={() => onRetrainError(phrase.id)}
                      className="py-1.5 px-3 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 font-extrabold text-[11px] rounded-lg cursor-pointer transition-all flex items-center gap-1 shrink-0 self-end sm:self-auto"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Treinar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Categories Progress Bento */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-blue-50 p-5 md:p-6 shadow-xs">
          <h3 className="font-bold text-slate-800 text-base mb-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Progresso por Categoria
          </h3>
          <p className="text-xs text-slate-400 mb-5">Seu avanço em cada seção das 500 frases mais usadas.</p>

          <div className="space-y-4">
            {categoryStats.map(cat => (
              <div key={cat.name} className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-slate-700 font-medium">
                  <span>{cat.name}</span>
                  <span className="font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 leading-none">
                    {cat.learned}/{cat.total}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-2 rounded-full relative overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-300" 
                      style={{ width: `${cat.percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-bold text-slate-800 font-mono text-[11px] shrink-0 leading-none">
                    {cat.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
