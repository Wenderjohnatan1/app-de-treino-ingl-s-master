import { useState } from 'react';
import { Phrase, UserProgressData } from '../types';
import { PHRASES, CATEGORIES } from '../data/phrases';
import { Search, Volume2, BookOpen, ChevronRight, CheckCircle, HelpCircle, GraduationCap } from 'lucide-react';

interface PhraseBookProps {
  progress: UserProgressData;
  onInstantPractice: (phrase: Phrase) => void;
}

export default function PhraseBook({ progress, onInstantPractice }: PhraseBookProps) {
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
  const speakText = (text: string, e?: any) => {
    if (e) e.stopPropagation();
    if (!('speechSynthesis' in window)) {
      alert('Sua máquina atual ou navegador não suporta Síntese de Voz Web.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Slightly slower rate to facilitate clear hearing
    window.speechSynthesis.speak(utterance);
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
                onClick={() => setExpandedId(isExpanded ? null : phrase.id)}
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
                      onClick={(e) => speakText(phrase.english, e)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:scale-105 transition-all shrink-0 border border-transparent hover:border-blue-100"
                      title="Ouvir Pronúncia"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub contents expanded pane */}
                {isExpanded && (
                  <div className="border-t border-blue-50 bg-slate-50/50 p-4 md:p-5 space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Explanations section */}
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Significado / Uso</span>
                          <p className="text-slate-700 font-medium leading-relaxed mt-0.5">{phrase.meaning}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Contexto Recomendo</span>
                          <p className="text-slate-500 mt-0.5">{phrase.context}</p>
                        </div>
                      </div>

                      {/* Code Examples section */}
                      <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                          Exemplo no Cotidiano
                        </span>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800 italic flex items-center gap-1.5 leading-relaxed">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                            {phrase.example}
                          </p>
                          <p className="text-slate-500 pl-3 italic">{phrase.exampleTranslation}</p>
                        </div>
                        {/* Audio speaker micro button */}
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={(e) => speakText(phrase.example, e)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded text-[10px] flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3" /> Ouvir Exemplo
                          </button>
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
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
