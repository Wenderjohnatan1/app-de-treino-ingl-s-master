import { UserProgressData } from '../types';
import { PHRASES } from '../data/phrases';
import { CheckCircle, Award, BarChart2, Calendar, Target, CalendarDays } from 'lucide-react';

interface ProgressStatsProps {
  progress: UserProgressData;
}

export default function ProgressStats({ progress }: ProgressStatsProps) {
  const totalPhrases = PHRASES.length;
  const learnedCount = Object.values(progress.phraseStats).filter(s => s.status === 'learned').length;
  const reviewingCount = Object.values(progress.phraseStats).filter(s => s.status === 'reviewing').length;
  const unreachedCount = totalPhrases - learnedCount - reviewingCount;

  const totalAttempts = progress.correctCount + progress.incorrectCount;
  const accuracy = totalAttempts > 0 ? Math.round((progress.correctCount / totalAttempts) * 100) : 0;

  // Simulate 12 dates heatmap progression
  const getSimulatedCalendarHeatmap = () => {
    const days = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      // Match with history
      const historyDay = progress.history.find(h => h.date === dateStr);
      const totalActivities = (historyDay?.correct || 0) + (historyDay?.incorrect || 0);

      let colorClass = 'bg-slate-100 border border-slate-200/40';
      if (totalActivities > 0) {
        if (totalActivities < 5) colorClass = 'bg-blue-100 border border-blue-200';
        else if (totalActivities < 10) colorClass = 'bg-blue-300 border border-blue-400';
        else colorClass = 'bg-blue-600 border border-blue-700 text-white';
      }

      // Readable format: 06 de Jun
      const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

      days.push({
        label,
        count: totalActivities,
        colorClass
      });
    }
    return days;
  };

  const heatmap = getSimulatedCalendarHeatmap();

  return (
    <div id="stats-tab" className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-white rounded-2xl border border-blue-50 p-5 md:p-6 shadow-xs">
        <h3 className="font-bold text-slate-800 text-base mb-1 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-blue-600" />
          Painel de Estatísticas Personalizado
        </h3>
        <p className="text-xs text-slate-400">Monitore sua evolução gramatical, frequência de estudos e controle de precisão no falar e no ouvir.</p>
      </div>

      {/* Accuracy dial & Performance bento row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box: General Distribution */}
        <div className="bg-white rounded-2xl border border-blue-50 p-5 md:p-6 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5 uppercase font-mono tracking-wider text-slate-400">
            <Target className="w-4 h-4 text-blue-500" />
            Estado de Fluência das 500 Frases
          </h4>

          {/* Sliced distribution bar */}
          <div className="bg-slate-100 h-6.5 rounded-full overflow-hidden flex relative">
            <div 
              style={{ width: `${(learnedCount / totalPhrases) * 100}%` }} 
              className="bg-green-500 h-full transition-all duration-500 hover:opacity-90"
              title={`Masterizadas: ${learnedCount}`}
            />
            <div 
              style={{ width: `${(reviewingCount / totalPhrases) * 100}%` }} 
              className="bg-blue-500 h-full transition-all duration-500 hover:opacity-90"
              title={`Em Treino: ${reviewingCount}`}
            />
            <div 
              style={{ width: `${(unreachedCount / totalPhrases) * 100}%` }} 
              className="bg-slate-200 h-full transition-all duration-500 hover:opacity-90"
              title={`Não Praticadas: ${unreachedCount}`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 border border-slate-100 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block mr-1.5 align-middle" />
              <span className="text-slate-500 font-medium">Masterizadas</span>
              <p className="font-extrabold text-slate-800 text-sm mt-1">{learnedCount}</p>
            </div>
            <div className="p-2 border border-slate-100 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block mr-1.5 align-middle" />
              <span className="text-slate-500 font-medium font-mono leading-none">Em Treino</span>
              <p className="font-extrabold text-slate-800 text-sm mt-1">{reviewingCount}</p>
            </div>
            <div className="p-2 border border-slate-100 rounded-lg">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block mr-1.5 align-middle" />
              <span className="text-slate-400 font-medium leading-none">Novas</span>
              <p className="font-extrabold text-slate-800 text-sm mt-1">{unreachedCount}</p>
            </div>
          </div>
        </div>

        {/* Box: Heatmap Grid simulator */}
        <div className="bg-white rounded-2xl border border-blue-50 p-5 md:p-6 space-y-4">
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5 uppercase font-mono tracking-wider text-slate-400">
            <Calendar className="w-4 h-4 text-blue-500" />
            Atividade Diária Recente
          </h4>

          {/* Grid display layout */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center text-xs">
            {heatmap.map((day, idx) => (
              <div 
                key={idx} 
                className={`p-2.5 rounded-xl flex flex-col justify-between items-center h-16 ${day.colorClass}`}
              >
                <span className="text-[10px] font-semibold text-slate-400 leading-none">{day.label}</span>
                <span className="font-bold text-sm leading-none font-mono mt-1">
                  {day.count}
                </span>
                <span className="text-[8px] opacity-60 leading-none uppercase tracking-wider mt-1">treinos</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-mono">
            <span>Menos treinado</span>
            <span>Mais ativo</span>
          </div>
        </div>
      </div>

      {/* Complete Historical Activity Metrics */}
      <div className="bg-white rounded-2xl border border-blue-50 p-5 md:p-6 shadow-xs">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          Histórico Completo de Ciclos de Sucesso
        </h4>

        {progress.history.length === 0 ? (
          <div className="py-10 text-center borderBorder border-slate-100 rounded-xl space-y-2">
            <p className="text-xs text-slate-400">Complete sua primeira sessão de treino para começar a registrar dados históricos detalhados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="py-2 font-semibold">Data do Treino</th>
                  <th className="py-2 text-center font-semibold">Tentativas Bem Sucedidas</th>
                  <th className="py-2 text-center font-semibold">Corrigidos / Erros</th>
                  <th className="py-2 text-right font-semibold">Taxa de Fluência no Dia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                {progress.history.map((h, i) => {
                  const total = h.correct + h.incorrect;
                  const percent = total > 0 ? Math.round((h.correct / total) * 100) : 0;
                  return (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="py-3 font-mono">{h.date}</td>
                      <td className="py-3 text-center text-green-600 font-extrabold font-mono">{h.correct} acertos</td>
                      <td className="py-3 text-center text-red-500 font-extrabold font-mono">{h.incorrect} erros</td>
                      <td className="py-3 text-right font-bold text-slate-800 font-mono">{percent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
