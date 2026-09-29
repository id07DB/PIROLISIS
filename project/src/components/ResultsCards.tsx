import { TrendingUp, Ruler, Weight, Gauge, Zap } from 'lucide-react';
import type { ModelResults } from '@/types';
import { fmt, fmtFractionAsPercent, fmtPercent } from '@/utils/format';

interface ResultsCardsProps {
  results: ModelResults;
  emPure: number;
}

interface CardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  accent: 'brand' | 'accent' | 'ink';
}

const accentMap = {
  brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300',
  accent: 'bg-accent-50 text-accent-700 dark:bg-accent-950/40 dark:text-accent-300',
  ink: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
};

function ResultCard({ icon, label, value, subValue, accent }: CardProps) {
  return (
    <div className="card card-hover p-4 sm:p-5 animate-slide-up">
      <div className="flex items-center gap-2">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${accentMap[accent]}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-ink-600 dark:text-ink-300">{label}</span>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-ink-900 dark:text-white">{value}</p>
        {subValue && (
          <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{subValue}</p>
        )}
      </div>
    </div>
  );
}

export default function ResultsCards({ results, emPure }: ResultsCardsProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="section-title">Resultados estimados</h2>
        <span className="label-badge bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
          Estimación teórica
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ResultCard
          icon={<Gauge className="h-5 w-5" />}
          label="Fracción volumétrica (Vf)"
          value={fmt(results.Vf, 5)}
          subValue={`${fmtFractionAsPercent(results.Vf, 2)} de volumen`}
          accent="brand"
        />
        <ResultCard
          icon={<Weight className="h-5 w-5" />}
          label="Densidad estimada (ρc)"
          value={`${fmt(results.rho_c, 4)} g/cm³`}
          subValue="Densidad del compuesto PP/rCB"
          accent="accent"
        />
        <ResultCard
          icon={<Ruler className="h-5 w-5" />}
          label="Módulo elástico (Ec)"
          value={`${fmt(results.E_c, 4)} GPa`}
          subValue="Modelo de Halpin–Tsai"
          accent="brand"
        />
        <ResultCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Cambio del módulo (ΔE)"
          value={fmtPercent(results.deltaE, 2)}
          subValue={`Frente al PP puro (${fmt(emPure, 2)} GPa)`}
          accent={results.deltaE >= 0 ? 'accent' : 'ink'}
        />
        <ResultCard
          icon={<Zap className="h-5 w-5" />}
          label="Módulo específico (Ec/ρc)"
          value={`${fmt(results.specificModulus, 4)} GPa·cm³/g`}
          subValue="Relación módulo–densidad"
          accent="ink"
        />
      </div>
    </div>
  );
}
