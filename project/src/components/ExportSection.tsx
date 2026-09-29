import { Download, FileJson, FileText, Printer } from 'lucide-react';
import type { ModelParameters, ModelResults } from '@/types';
import { downloadCSV, downloadJSON } from '@/utils/export';
import { SCIENTIFIC_WARNING, EXPORT_DISCLAIMER, MODEL_NAMES } from '@/constants';
import { fmt, fmtFractionAsPercent, fmtPercent, fmtDateTime } from '@/utils/format';

interface ExportSectionProps {
  params: ModelParameters;
  results: ModelResults;
}

export default function ExportSection({ params, results }: ExportSectionProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Download className="h-5 w-5 text-brand-700 dark:text-brand-400" />
        <h2 className="section-title">Exportación</h2>
      </div>
      <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
        Descargue los resultados del modelo con los parámetros actuales. Todas las exportaciones incluyen la fecha, los parámetros, los resultados y los avisos científicos.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 no-print">
        <button onClick={() => downloadCSV(params, results)} className="btn-secondary">
          <FileText className="h-4 w-4" />
          Descargar CSV
        </button>
        <button onClick={() => downloadJSON(params, results)} className="btn-secondary">
          <FileJson className="h-4 w-4" />
          Descargar JSON
        </button>
        <button onClick={handlePrint} className="btn-secondary">
          <Printer className="h-4 w-4" />
          Generar informe PDF
        </button>
      </div>

      {/* Informe imprimible */}
      <div className="print-only mt-6 border-t border-ink-200 pt-6">
        <h2 className="text-xl font-bold text-ink-900">PolyComp Studio — Informe preliminar</h2>
        <p className="text-sm text-ink-500">Simulador preliminar de compuestos PP/rCB</p>
        <p className="mt-1 text-xs text-ink-400">Fecha de generación: {fmtDateTime(new Date())}</p>

        <div className="mt-4 rounded border border-amber-300 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-900">{SCIENTIFIC_WARNING}</p>
          <p className="mt-2 text-sm text-amber-800">{EXPORT_DISCLAIMER}</p>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-ink-800">Parámetros utilizados</h3>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200">
              <th className="py-1 text-left">Parámetro</th>
              <th className="py-1 text-right">Valor</th>
              <th className="py-1 text-left">Unidad</th>
              <th className="py-1 text-left">Tipo</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Densidad del PP (ρm)</td><td className="text-right">{fmt(params.rho_m, 3)}</td><td>g/cm³</td><td>Supuesto editable</td></tr>
            <tr><td>Módulo del PP (Em)</td><td className="text-right">{fmt(params.E_m, 2)}</td><td>GPa</td><td>Supuesto editable</td></tr>
            <tr><td>Densidad del rCB (ρf)</td><td className="text-right">{fmt(params.rho_f, 2)}</td><td>g/cm³</td><td>Supuesto editable</td></tr>
            <tr><td>Módulo del rCB (Ef)</td><td className="text-right">{fmt(params.E_f, 2)}</td><td>GPa</td><td>Supuesto editable</td></tr>
            <tr><td>Factor geométrico (ξ)</td><td className="text-right">{fmt(params.xi, 1)}</td><td>—</td><td>Supuesto editable</td></tr>
            <tr><td>Fracción másica (w)</td><td className="text-right">{fmtFractionAsPercent(params.w, 1)}</td><td>%</td><td>Seleccionada</td></tr>
          </tbody>
        </table>

        <h3 className="mt-6 text-lg font-semibold text-ink-800">Resultados estimados</h3>
        <table className="mt-2 w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200">
              <th className="py-1 text-left">Resultado</th>
              <th className="py-1 text-right">Valor</th>
              <th className="py-1 text-left">Unidad</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Fracción volumétrica (Vf)</td><td className="text-right">{fmt(results.Vf, 5)}</td><td>—</td></tr>
            <tr><td>Vf (% volumen)</td><td className="text-right">{fmtFractionAsPercent(results.Vf, 2)}</td><td>%</td></tr>
            <tr><td>Densidad estimada (ρc)</td><td className="text-right">{fmt(results.rho_c, 4)}</td><td>g/cm³</td></tr>
            <tr><td>Módulo estimado (Ec)</td><td className="text-right">{fmt(results.E_c, 4)}</td><td>GPa</td></tr>
            <tr><td>Cambio del módulo (ΔE)</td><td className="text-right">{fmtPercent(results.deltaE, 2)}</td><td>%</td></tr>
            <tr><td>Módulo específico (Ec/ρc)</td><td className="text-right">{fmt(results.specificModulus, 4)}</td><td>GPa·cm³/g</td></tr>
          </tbody>
        </table>

        <h3 className="mt-6 text-lg font-semibold text-ink-800">Modelos utilizados</h3>
        <ul className="mt-2 text-sm text-ink-700">
          {MODEL_NAMES.map((m, i) => <li key={i} className="py-0.5">{m}</li>)}
        </ul>

        <p className="mt-6 text-xs text-ink-500">{EXPORT_DISCLAIMER}</p>
      </div>
    </div>
  );
}
