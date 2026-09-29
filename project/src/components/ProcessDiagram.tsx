import { useState } from 'react';
import { Factory, ChevronRight, ClipboardList } from 'lucide-react';
import { PROCESS_STAGES } from '@/constants';

export default function ProcessDiagram() {
  const [selectedStage, setSelectedStage] = useState(1);
  const stage = PROCESS_STAGES.find((s) => s.id === selectedStage) ?? PROCESS_STAGES[0];

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Factory className="h-5 w-5 text-brand-700 dark:text-brand-400" />
        <h2 className="section-title">Proceso de fabricación</h2>
      </div>

      {/* Diagrama de etapas */}
      <div className="mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
        {PROCESS_STAGES.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedStage(s.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                selectedStage === s.id
                  ? 'border-brand-600 bg-brand-50 text-brand-800 dark:border-brand-500 dark:bg-brand-950/40 dark:text-brand-200'
                  : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700'
              }`}
              aria-pressed={selectedStage === s.id}
            >
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                selectedStage === s.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-ink-100 text-ink-500 dark:bg-ink-700 dark:text-ink-400'
              }`}>
                {s.id}
              </span>
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">Etapa {s.id}</span>
            </button>
            {s.id < PROCESS_STAGES.length && (
              <ChevronRight className="h-4 w-4 text-ink-300 dark:text-ink-600" />
            )}
          </div>
        ))}
      </div>

      {/* Detalle de la etapa seleccionada */}
      <div className="mt-5 rounded-lg border border-ink-100 bg-ink-50/50 p-4 dark:border-ink-800 dark:bg-ink-800/30 animate-fade-in">
        <h3 className="font-semibold text-ink-800 dark:text-ink-100">
          {stage.id}. {stage.title}
        </h3>
        <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
          {stage.description}
        </p>

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-ink-400" />
            <h4 className="text-sm font-medium text-ink-700 dark:text-ink-200">
              Datos necesarios a confirmar
            </h4>
          </div>
          <ul className="mt-2 space-y-1.5">
            {stage.dataToConfirm.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300 dark:bg-ink-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 dark:bg-amber-950/20">
          <span className="text-xs text-amber-700 dark:text-amber-400">
            Pendiente de ficha técnica o validación experimental
          </span>
        </div>
      </div>
    </div>
  );
}
