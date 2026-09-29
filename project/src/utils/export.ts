import type { ModelParameters, ModelResults } from '@/types';
import { SCIENTIFIC_WARNING, EXPORT_DISCLAIMER, MODEL_NAMES } from '@/constants';
import { fmt, fmtFractionAsPercent, fmtPercent, fmtDateTime, fmtFileDate } from './format';

function buildMeta(params: ModelParameters, results: ModelResults) {
  return {
    fechaGeneracion: fmtDateTime(new Date()),
    parametros: {
      rho_m: { valor: params.rho_m, unidad: 'g/cm³', descripcion: 'Densidad del PP (supuesto editable)' },
      E_m: { valor: params.E_m, unidad: 'GPa', descripcion: 'Módulo elástico del PP (supuesto editable)' },
      rho_f: { valor: params.rho_f, unidad: 'g/cm³', descripcion: 'Densidad del rCB (supuesto editable)' },
      E_f: { valor: params.E_f, unidad: 'GPa', descripcion: 'Módulo elástico del rCB (supuesto editable)' },
      xi: { valor: params.xi, unidad: '—', descripcion: 'Factor geométrico (supuesto editable)' },
      w: { valor: params.w, unidad: '—', descripcion: 'Fracción másica de rCB' },
    },
    resultados: {
      Vf: { valor: results.Vf, unidad: '—', descripcion: 'Fracción volumétrica de la carga' },
      densidad: { valor: results.rho_c, unidad: 'g/cm³', descripcion: 'Densidad estimada del compuesto' },
      modulo: { valor: results.E_c, unidad: 'GPa', descripcion: 'Módulo elástico estimado (Halpin–Tsai)' },
      cambioModulo: { valor: results.deltaE, unidad: '%', descripcion: 'Cambio porcentual del módulo frente al PP puro' },
      moduloEspecifico: { valor: results.specificModulus, unidad: 'GPa·cm³/g', descripcion: 'Módulo específico Ec/ρc' },
    },
    modelos: MODEL_NAMES,
    avisos: {
      cientifico: SCIENTIFIC_WARNING,
      exportacion: EXPORT_DISCLAIMER,
    },
  };
}

export function downloadCSV(params: ModelParameters, results: ModelResults): void {
  const meta = buildMeta(params, results);
  const lines: string[] = [];

  lines.push('# PolyComp Studio — Exportación de resultados');
  lines.push(`# Fecha de generación: ${meta.fechaGeneracion}`);
  lines.push(`# Aviso: ${SCIENTIFIC_WARNING}`);
  lines.push(`# ${EXPORT_DISCLAIMER}`);
  lines.push('');
  lines.push('Parámetro,Valor,Unidad,Descripción');
  lines.push(`Densidad PP (ρm),${fmt(params.rho_m, 3)},g/cm³,Supuesto editable`);
  lines.push(`Módulo PP (Em),${fmt(params.E_m, 2)},GPa,Supuesto editable`);
  lines.push(`Densidad rCB (ρf),${fmt(params.rho_f, 2)},g/cm³,Supuesto editable`);
  lines.push(`Módulo rCB (Ef),${fmt(params.E_f, 2)},GPa,Supuesto editable`);
  lines.push(`Factor geométrico (ξ),${fmt(params.xi, 1)},—,Supuesto editable`);
  lines.push(`Fracción másica (w),${fmtFractionAsPercent(params.w, 1)},—,Carga de rCB`);
  lines.push('');
  lines.push('Resultado,Valor,Unidad');
  lines.push(`Fracción volumétrica (Vf),${fmt(results.Vf, 5)},—`);
  lines.push(`Fracción volumétrica (Vf),${fmtFractionAsPercent(results.Vf, 2)},%`);
  lines.push(`Densidad estimada (ρc),${fmt(results.rho_c, 4)},g/cm³`);
  lines.push(`Módulo estimado (Ec),${fmt(results.E_c, 4)},GPa`);
  lines.push(`Cambio del módulo (ΔE),${fmtPercent(results.deltaE, 2)},%`);
  lines.push(`Módulo específico (Ec/ρc),${fmt(results.specificModulus, 4)},GPa·cm³/g`);
  lines.push('');
  lines.push('Modelos utilizados:');
  MODEL_NAMES.forEach((m) => lines.push(`# ${m}`));

  const csv = lines.join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `polycomp_resultados_${fmtFileDate(new Date())}.csv`);
}

export function downloadJSON(params: ModelParameters, results: ModelResults): void {
  const meta = buildMeta(params, results);
  const json = JSON.stringify(meta, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  triggerDownload(blob, `polycomp_resultados_${fmtFileDate(new Date())}.json`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
