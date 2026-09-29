import { useState, useMemo, useCallback } from 'react';
import Header from '@/components/Header';
import ParameterPanel from '@/components/ParameterPanel';
import ResultsCards from '@/components/ResultsCards';
import DualAxisChart from '@/components/DualAxisChart';
import ProcessDiagram from '@/components/ProcessDiagram';
import ExportSection from '@/components/ExportSection';
import Assumptions from '@/components/Assumptions';
import { useTheme } from '@/hooks/useTheme';
import type { ModelParameters } from '@/types';
import { DEFAULT_PARAMS } from '@/constants';
import { computeResults, generateChartSeries, validateParams, verifySanityChecks } from '@/utils/calc';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [params, setParams] = useState<ModelParameters>(DEFAULT_PARAMS);

  const errors = useMemo(() => validateParams(params), [params]);
  const hasErrors = Object.keys(errors).length > 0;

  const results = useMemo(() => {
    if (hasErrors) return null;
    return computeResults(params);
  }, [params, hasErrors]);

  const chartData = useMemo(() => {
    if (hasErrors) return [];
    return generateChartSeries(params);
  }, [params, hasErrors]);

  const sanityChecks = useMemo(() => verifySanityChecks(params), [params]);

  const handleParamChange = useCallback((key: keyof ModelParameters, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setParams(DEFAULT_PARAMS);
  }, []);

  return (
    <div className="min-h-screen bg-ink-50 text-ink-800 dark:bg-ink-950 dark:text-ink-100">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Verificación interna w=0 y w=0.10 (comentario de cálculo) */}
        {/* w=0: Vf=0, ρc=ρm=0,905, Ec=Em=1,35 — verified by sanityChecks.w0 */}
        {/* w=0.10: Vf≈5,34%, ρc≈0,977, Ec≈1,52 GPa — verified by sanityChecks.w10 */}

        {/* Panel de parámetros + Resultados */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ParameterPanel
              params={params}
              errors={errors}
              onParamChange={handleParamChange}
              onReset={handleReset}
            />
          </div>
          <div className="lg:col-span-3">
            {results ? (
              <ResultsCards results={results} emPure={params.E_m} />
            ) : (
              <div className="card p-6">
                <div className="rounded-lg border border-brand-200 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-950/30">
                  <p className="text-sm font-medium text-brand-800 dark:text-brand-200">
                    Hay parámetros inválidos. Corrija los valores marcados para ver los resultados.
                  </p>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(errors).map(([key, msg]) => (
                      <li key={key} className="text-sm text-brand-600 dark:text-brand-400">
                        {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfica interactiva */}
        {results && chartData.length > 0 && (
          <DualAxisChart data={chartData} currentW={params.w} dark={theme === 'dark'} />
        )}

        {/* Proceso de fabricación */}
        <ProcessDiagram />

        {/* Exportación */}
        {results && <ExportSection params={params} results={results} />}

        {/* Supuestos y limitaciones */}
        <Assumptions />

        {/* Pie de página */}
        <footer className="border-t border-ink-200 py-6 text-center dark:border-ink-800">
          <p className="text-xs text-ink-400 dark:text-ink-500">
            PolyComp Studio — Prototipo teórico. Los resultados son estimaciones del modelo y no
            constituyen una validación experimental del material.
          </p>
        </footer>
      </main>
    </div>
  );
}
