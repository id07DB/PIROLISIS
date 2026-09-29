import { useState } from 'react';
import { Sliders, RotateCcw, ChevronDown, Info } from 'lucide-react';
import type { ModelParameters, ValidationErrors } from '@/types';
import { DEFAULT_PARAMS, W_MIN, W_MAX, W_STEP, PARAM_LABELS } from '@/constants';
import { fmt } from '@/utils/format';

interface ParameterPanelProps {
  params: ModelParameters;
  errors: ValidationErrors;
  onParamChange: (key: keyof ModelParameters, value: number) => void;
  onReset: () => void;
}

const EDITABLE_PARAM_KEYS: (keyof ModelParameters)[] = ['rho_m', 'E_m', 'rho_f', 'E_f', 'xi'];

export default function ParameterPanel({ params, errors, onParamChange, onReset }: ParameterPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sliderPercent = ((params.w - W_MIN) / (W_MAX - W_MIN)) * 100;

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-brand-700 dark:text-brand-400" />
          <h2 className="section-title">Panel de parámetros</h2>
        </div>
        <button
          onClick={onReset}
          className="btn-ghost no-print"
          title="Restablecer valores iniciales"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Restablecer</span>
        </button>
      </div>

      {/* Slider de carga másica */}
      <div className="mt-5">
        <div className="flex items-baseline justify-between">
          <label htmlFor="w-slider" className="text-sm font-medium text-ink-700 dark:text-ink-200">
            Carga másica de rCB
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={30}
              step={0.1}
              value={params.w > 0 ? (params.w * 100).toFixed(1) : '0.0'}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) onParamChange('w', val / 100);
              }}
              className="w-20 rounded-lg border border-ink-200 bg-white px-2 py-1 text-right text-sm font-semibold text-ink-800 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100"
              aria-label="Carga másica de rCB en porcentaje"
            />
            <span className="text-sm font-medium text-ink-500 dark:text-ink-400">%</span>
          </div>
        </div>
        <input
          id="w-slider"
          type="range"
          min={W_MIN * 100}
          max={W_MAX * 100}
          step={W_STEP * 100}
          value={params.w * 100}
          onChange={(e) => onParamChange('w', parseFloat(e.target.value) / 100)}
          className="mt-3 w-full"
          style={{ ['--val' as string]: `${sliderPercent}%` }}
          aria-label="Control deslizante de carga másica de rCB"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-400 dark:text-ink-500">
          <span>0 %</span>
          <span>15 %</span>
          <span>30 %</span>
        </div>
        {errors.w && (
          <p className="mt-2 text-sm text-brand-600 dark:text-brand-400">{errors.w}</p>
        )}
      </div>

      {/* Parámetros avanzados */}
      <div className="mt-5 border-t border-ink-100 pt-4 dark:border-ink-800">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between text-sm font-medium text-ink-700 transition-colors hover:text-brand-700 dark:text-ink-200 dark:hover:text-brand-400"
          aria-expanded={showAdvanced}
        >
          <span>Parámetros del modelo (supuestos editables)</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
          />
        </button>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 animate-fade-in">
            {EDITABLE_PARAM_KEYS.map((key) => {
              const meta = PARAM_LABELS[key];
              const error = errors[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`param-${key}`} className="text-sm font-medium text-ink-700 dark:text-ink-200">
                      {meta.label}
                    </label>
                    <span className="label-badge bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                      Supuesto editable
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      id={`param-${key}`}
                      type="number"
                      step={key === 'xi' ? 0.1 : 0.01}
                      value={params[key]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) onParamChange(key, val);
                      }}
                      className={`input-field ${error ? 'border-brand-500 ring-1 ring-brand-500/30' : ''}`}
                      aria-label={`${meta.label} en ${meta.unit}`}
                    />
                    <span className="shrink-0 text-sm text-ink-500 dark:text-ink-400">{meta.unit}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-400 dark:text-ink-500">{meta.description}</p>
                  {error && (
                    <p className="mt-1 text-xs text-brand-600 dark:text-brand-400">{error}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info de referencia */}
      <div className="mt-4 flex items-start gap-2 rounded-lg bg-ink-50 px-3 py-2 dark:bg-ink-800/50">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
        <p className="text-xs text-ink-500 dark:text-ink-400">
          Valores iniciales: ρm = {fmt(DEFAULT_PARAMS.rho_m, 3)} g/cm³, Em = {fmt(DEFAULT_PARAMS.E_m, 2)} GPa,
          ρf = {fmt(DEFAULT_PARAMS.rho_f, 2)} g/cm³, Ef = {fmt(DEFAULT_PARAMS.E_f, 2)} GPa, ξ = {fmt(DEFAULT_PARAMS.xi, 0)}.
        </p>
      </div>
    </div>
  );
}
