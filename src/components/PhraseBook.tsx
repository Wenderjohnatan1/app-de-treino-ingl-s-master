import { useState } from 'react';
import { Phrase, UserProgressData } from '../types';
import { PHRASES, CATEGORIES } from '../data/phrases';
import { Search, Volume2, BookOpen, ChevronRight, CheckCircle, HelpCircle, GraduationCap, Sparkles, Play } from 'lucide-react';
import { getPronunciationGuide, playTextToSpeech, parsePhonetic } from '../utils/pronunciation';

interface PhraseBookProps {
  progress: UserProgressData;
  onInstantPractice: (phrase: Phrase) => void;
  onAutoAddToSrs?: (phraseId: number) => void;
}

export default function PhraseBook({ progress, onInstantPractice, onAutoAddToSrs }: PhraseBookProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Filter phrases based on search and selected category
  const filteredPhrases = PHRASES.filter(phrase => {
    const matchesCategory = selectedCategory === 'Todos' || phrase.category === selectedCategory;
    const matchesSearch = 
      phrase.english.toLowerCase().includes(searchTerm.toLowerCase()) || 
      phrase.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phrase.example.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pronounce phrase using SpeechSynthesis
  const speakText = (text: string, e?: any, slow: boolean = false, phraseId?: number) => {
    if (e) e.stopPropagation();
    playTextToSpeech(text, slow);
    if (phraseId && onAutoAddToSrs) {
      onAutoAddToSrs(phraseId);
    }
  };

  const getStatusBadge = (id: number) => {
    const stat = progress.phraseStats[id];
    if (!stat) return null;
    if (stat.status === 'learned') {
      return (
        <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 border border-green-100 rounded-full px-2 py-0.5 font-semibold">
          <CheckCircle className="w-3 h-3 text-green-500 fill-current" />
          Masterizado
        </span>
      );
    }
    if (stat.status === 'reviewing') {
      return (
        <span className="flex items-center gap-1 text-[10px] text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5 font-semibold">
          <GraduationCap className="w-3 h-3 text-blue-500" />
          Em Treino
        </span>
      );
    }
    return null;
  };

  return (
    <div id="phrasebook-tab" className="space-y-5">
      {/* Search and Introduction banner */}
      <div className="bg-white rounded-2xl border border-blue-50 p-5 md:p-6 shadow-xs space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Guia de Consulta Geral
          </h3>
          <p className="text-xs text-slate-500">
            Navegue e estude cada uma das frases mais frequentes do inglês americano com exemplos e tradução de apoio.
          </p>
        </div>

        {/* Inputs row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar input container */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Pesquise por termo em inglês ou tradução (Ex: 'help', 'bom dia')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-sm transition-all focus:outline-none placeholder-slate-400 text-slate-800"
            />
          </div>
        </div>

        {/* Category Filters row - Horizontal Scroll on Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none snap-x">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-all snap-start ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100/75 border border-slate-200/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases collection view */}
      <div className="space-y-3">
        {filteredPhrases.length === 0 ? (
          <div className="bg-white rounded-2xl py-12 text-center border-2 border-dashed border-slate-100 space-y-2">
            <p className="text-sm font-semibold text-slate-600">Nenhuma frase encontrada.</p>
            <p className="text-xs text-slate-400">Tente modificar sua pesquisa ou redefinir a categoria.</p>
          </div>
        ) : (
          filteredPhrases.map(phrase => {
            const isExpanded = expandedId === phrase.id;
            return (
              <div
                key={phrase.id}
                onClick={() => {
                  if (!isExpanded && onAutoAddToSrs) {
                    onAutoAddToSrs(phrase.id);
                  }
                  setExpandedId(isExpanded ? null : phrase.id);
                }}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isExpanded ? 'border-blue-200 shadow-xs' : 'border-blue-50/60 hover:border-slate-200'
                }`}
              >
                {/* Header card view */}
                <div className="p-4 flex justify-between items-center gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded leading-none shrink-0">
                      #{phrase.id}
                    </span>
                    <div className="space-y-0.5 text-left">
                      <h4 className="font-bold text-slate-800 tracking-tight text-sm md:text-base">{phrase.english}</h4>
                      <p className="text-xs text-slate-500 font-medium">{phrase.translation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(phrase.id)}
                    <button
                      onClick={(e) => speakText(phrase.english, e, false, phrase.id)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:scale-105 transition-all shrink-0 border border-transparent hover:border-blue-100"
                      title="Ouvir Pronúncia"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub contents expanded pane */}
                {isExpanded && (() => {
                  const guide = getPronunciationGuide(phrase.english);
                  return (
                    <div className="border-t border-blue-50 bg-slate-50/50 p-4 md:p-5 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Explanations section */}
                        <div className="space-y-3">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Significado / Uso</span>
                            <p className="text-slate-700 font-medium leading-relaxed mt-0.5">{phrase.meaning}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Contexto Recomendado</span>
                            <p className="text-slate-500 mt-0.5">{phrase.context}</p>
                          </div>

                          {/* Speech Speed controls inside expanded box */}
                          <div className="pt-2 flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mr-1">Ouvir Expressão:</span>
                            <button
                              onClick={(e) => speakText(phrase.english, e, false, phrase.id)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer text-[10px]"
                            >
                              <Volume2 className="w-3.5 h-3.5" /> Ouvir Normal
                            </button>
                            <button
                              onClick={(e) => speakText(phrase.english, e, true, phrase.id)}
                              className="px-2.5 py-1.5 bg-pink-50 hover:bg-pink-100 border border-pink-100 text-pink-600 font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer text-[10px]"
                            >
                              <Play className="w-3 h-3 fill-current" /> Ouvir Devagar
                            </button>
                          </div>
                        </div>

                        {/* Code Examples section */}
                        <div className="p-3 bg-white rounded-xl border border-slate-100 flex flex-col justify-between space-y-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                              Exemplo no Cotidiano
                            </span>
                            <div className="space-y-1 mt-1">
                              <p className="font-bold text-slate-800 italic flex items-center gap-1.5 leading-relaxed">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                                {phrase.example}
                              </p>
                              <p className="text-slate-500 pl-3 italic">{phrase.exampleTranslation}</p>
                            </div>
                          </div>
                          {/* Audio speaker micro buttons for example */}
                          <div className="pt-2 flex justify-end gap-1.5">
                            <button
                              onClick={(e) => speakText(phrase.example, e, false, phrase.id)}
                              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Volume2 className="w-3 h-3" /> Exemplo
                            </button>
                            <button
                              onClick={(e) => speakText(phrase.example, e, true, phrase.id)}
                              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                            >
                              <Play className="w-2.5 h-2.5 fill-current" /> Devagar
                            </button>
                          </div>
                        </div>

                        {/* TUTORIAL DE PRONÚNCIA EM PORTUGUÊS */}
                        <div className="md:col-span-2 bg-amber-50/40 border border-amber-200/50 rounded-xl p-3.5 space-y-2.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-2">
                            <span className="font-extrabold text-amber-800 flex items-center gap-1.5 text-xs">
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                              Guia Definitivo de Pronúncia (Como Falar)
                            </span>
                            <div className="font-mono text-[10.5px] font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-100 shrink-0 flex flex-wrap items-center gap-0.5 leading-none">
                              <span>Sons aproximados:</span>
                              <div className="inline-flex items-center gap-0.5 ml-1 bg-white px-1.5 py-0.5 rounded border border-amber-200/50 shadow-2xs">
                                {parsePhonetic(guide.phoneticSpelling).map((part, pIdx) => {
                                  if (part.isSpace) return <span key={pIdx}> </span>;
                                  if (part.isHyphen) return <span key={pIdx} className="text-amber-400 px-0.5">-</span>;
                                  return (
                                    <span 
                                      key={pIdx} 
                                      className={part.isStressed 
                                        ? "text-pink-600 font-extrabold bg-pink-100/80 px-1 rounded border border-pink-200/60" 
                                        : "text-slate-700 font-semibold"
                                      }
                                    >
                                      {part.text}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            {guide.tips.map((tip, index) => (
                              <p key={index} className="text-[11px] text-slate-600 leading-relaxed pl-2 border-l-2 border-amber-350">
                                {tip}
                              </p>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Instant practice CTA */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInstantPractice(phrase);
                          }}
                          className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
                        >
                          Praticar esta Frase
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
