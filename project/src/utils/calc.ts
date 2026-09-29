import type { ModelParameters, ModelResults, ChartPoint, ValidationErrors } from '@/types';
import { W_MIN, W_MAX } from '@/constants';

/**
 * Calcula la fracción volumétrica de la carga a partir de la fracción másica.
 * Vf = (w / rho_f) / ((w / rho_f) + ((1 - w) / rho_m))
 */
export function calcVf(w: number, rho_f: number, rho_m: number): number {
  if (w === 0) return 0;
  const volF = w / rho_f;
  const volM = (1 - w) / rho_m;
  return volF / (volF + volM);
}

/**
 * Calcula la densidad estimada del compuesto.
 * rho_c = 1 / (((1 - w) / rho_m) + (w / rho_f))
 */
export function calcRhoC(w: number, rho_m: number, rho_f: number): number {
  return 1 / ((1 - w) / rho_m + w / rho_f);
}

/**
 * Calcula el parámetro eta para el modelo de Halpin–Tsai.
 * eta = ((E_f / E_m) - 1) / ((E_f / E_m) + xi)
 */
export function calcEta(E_f: number, E_m: number, xi: number): number {
  const ratio = E_f / E_m;
  return (ratio - 1) / (ratio + xi);
}

/**
 * Calcula el módulo elástico estimado mediante Halpin–Tsai.
 * E_c = E_m * ((1 + xi * eta * Vf) / (1 - eta * Vf))
 */
export function calcEC(E_m: number, xi: number, eta: number, Vf: number): number {
  const numerator = 1 + xi * eta * Vf;
  const denominator = 1 - eta * Vf;
  return E_m * (numerator / denominator);
}

/**
 * Calcula todos los resultados del modelo para un conjunto de parámetros.
 */
export function computeResults(params: ModelParameters): ModelResults {
  const { w, rho_m, rho_f, E_m, E_f, xi } = params;

  const Vf = calcVf(w, rho_f, rho_m);
  const rho_c = calcRhoC(w, rho_m, rho_f);
  const eta = calcEta(E_f, E_m, xi);
  const E_c = calcEC(E_m, xi, eta, Vf);
  const deltaE = E_m > 0 ? ((E_c - E_m) / E_m) * 100 : 0;
  const specificModulus = rho_c > 0 ? E_c / rho_c : 0;

  return {
    Vf,
    rho_c,
    eta,
    E_c,
    deltaE,
    specificModulus,
  };
}

/**
 * Genera una serie de puntos para la gráfica, desde 0% hasta 30% de carga másica.
 */
export function generateChartSeries(params: ModelParameters, steps = 151): ChartPoint[] {
  const { rho_m, rho_f, E_m, E_f, xi } = params;
  const points: ChartPoint[] = [];

  for (let i = 0; i <= steps; i++) {
    const w = W_MIN + (W_MAX - W_MIN) * (i / steps);
    const Vf = calcVf(w, rho_f, rho_m);
    const rho_c = calcRhoC(w, rho_m, rho_f);
    const eta = calcEta(E_f, E_m, xi);
    const E_c = calcEC(E_m, xi, eta, Vf);

    points.push({ w, Vf, rho_c, E_c });
  }

  return points;
}

/**
 * Valida los parámetros del modelo. Devuelve un objeto con los errores encontrados.
 */
export function validateParams(params: ModelParameters): ValidationErrors {
  const errors: ValidationErrors = {};

  if (isNaN(params.rho_m) || params.rho_m <= 0) {
    errors.rho_m = 'La densidad del PP debe ser mayor que cero.';
  }
  if (isNaN(params.E_m) || params.E_m <= 0) {
    errors.E_m = 'El módulo del PP debe ser mayor que cero.';
  }
  if (isNaN(params.rho_f) || params.rho_f <= 0) {
    errors.rho_f = 'La densidad del rCB debe ser mayor que cero.';
  }
  if (isNaN(params.E_f) || params.E_f <= 0) {
    errors.E_f = 'El módulo del rCB debe ser mayor que cero.';
  }
  if (isNaN(params.xi) || params.xi < 0) {
    errors.xi = 'El factor geométrico ξ debe ser mayor o igual que cero.';
  }
  if (isNaN(params.w) || params.w < W_MIN || params.w > W_MAX) {
    errors.w = `La fracción másica debe estar entre ${(W_MIN * 100).toFixed(0)}% y ${(W_MAX * 100).toFixed(0)}%.`;
  }

  return errors;
}

/**
 * Comprobaciones internas de referencia para w = 0 y w = 0,10.
 */
export function verifySanityChecks(params: ModelParameters): { w0: ModelResults; w10: ModelResults } {
  const w0Params = { ...params, w: 0 };
  const w10Params = { ...params, w: 0.1 };

  return {
    w0: computeResults(w0Params),
    w10: computeResults(w10Params),
  };
}
