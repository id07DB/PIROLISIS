import type { ModelParameters, ProcessStage } from '@/types';

export const DEFAULT_PARAMS: ModelParameters = {
  rho_m: 0.905,
  E_m: 1.35,
  rho_f: 1.8,
  E_f: 12.0,
  xi: 2,
  w: 0.1,
};

export const W_MIN = 0;
export const W_MAX = 0.3;
export const W_STEP = 0.001;

export const SCIENTIFIC_WARNING =
  'Modelo teórico preliminar basado en parámetros supuestos. No representa una caracterización experimental ni una especificación certificada de ThermoTireBlack®.';

export const EXPORT_DISCLAIMER =
  'Los resultados son estimaciones del modelo con los parámetros indicados. No deben interpretarse como propiedades medidas o garantizadas del material. Sustituya los valores supuestos por datos de ficha técnica y ensayos antes de emplear estos resultados en decisiones de diseño.';

export const MODEL_NAMES = [
  'Fracción volumétrica: Vf = (w/ρf) / ((w/ρf) + ((1-w)/ρm))',
  'Densidad de mezcla: ρc = 1 / (((1-w)/ρm) + (w/ρf))',
  'Parámetro η: η = ((Ef/Em) - 1) / ((Ef/Em) + ξ)',
  'Módulo de Halpin–Tsai: Ec = Em · (1 + ξ·η·Vf) / (1 - η·Vf)',
];

export const PROCESS_STAGES: ProcessStage[] = [
  {
    id: 1,
    title: 'Preparación y caracterización del rCB',
    description:
      'Recepción del negro de humo recuperado (rCB) procedente de pirólisis de neumáticos. Se realiza un control de calidad preliminar para verificar la pureza, el tamaño de partícula y la estructura, antes de su uso como carga en la matriz polimérica.',
    dataToConfirm: [
      'Distribución de tamaño de partícula (D50, D90)',
      'Superficie específica BET (m²/g)',
      'Contenido de cenizas y residuos volátiles',
      'Grado de pureza y presencia de contaminantes',
      'Valores de densidad y módulo del lote específico',
    ],
  },
  {
    id: 2,
    title: 'Mezclado y composición con PP',
    description:
      'El polipropileno (PP) y el rCB se dosifican según la fracción másica objetivo. El mezclado busca una dispersión uniforme de la carga en la matriz polimérica para evitar aglomerados que podrían afectar las propiedades del compuesto.',
    dataToConfirm: [
      'Temperatura de mezclado',
      'Velocidad y tiempo de mezclado',
      'Uso de agentes de acoplamiento o compatibilizantes',
      'Orden de incorporación de los componentes',
      'Condiciones ambientales del proceso',
    ],
  },
  {
    id: 3,
    title: 'Extrusión y peletizado',
    description:
      'El material mezclado se procesa en una extrusora para fundir, homogeneizar y peletizar el compuesto. Los gránulos obtenidos son la forma intermedia antes del moldeo final.',
    dataToConfirm: [
      'Perfil de temperatura de la extrusora',
      'Velocidad de tornillo',
      'Tiempo de residencia',
      'Sistema y condiciones de peletizado',
      'Parámetros de enfriamiento',
    ],
  },
  {
    id: 4,
    title: 'Moldeo o fabricación de probetas',
    description:
      'Los gránulos se transforman en probetas o piezas mediante inyección, compresión u otro método de moldeo adecuado para el polipropileno. La geometría depende del ensayo posterior.',
    dataToConfirm: [
      'Temperatura de moldeo',
      'Presión de inyección o compresión',
      'Tiempo de ciclo y enfriamiento',
      'Geometría y dimensiones de la probeta',
      'Norma de fabricación de probetas',
    ],
  },
  {
    id: 5,
    title: 'Ensayos y control de calidad',
    description:
      'Las probetas se someten a ensayos mecánicos para medir las propiedades reales del compuesto. Los resultados experimentales se comparan con las estimaciones del modelo teórico.',
    dataToConfirm: [
      'Norma de ensayo de tracción (ej. ISO 527)',
      'Velocidad de ensayo',
      'Número de probetas y criterios de repetibilidad',
      'Condiciones de acondicionamiento',
      'Método de medición del módulo elástico',
    ],
  },
];

export const PARAM_LABELS: Record<keyof ModelParameters, { label: string; symbol: string; unit: string; description: string }> = {
  rho_m: {
    label: 'Densidad del PP (matriz)',
    symbol: 'ρm',
    unit: 'g/cm³',
    description: 'Densidad del polipropileno puro utilizado como matriz del compuesto.',
  },
  E_m: {
    label: 'Módulo elástico del PP',
    symbol: 'Em',
    unit: 'GPa',
    description: 'Módulo elástico del polipropileno puro.',
  },
  rho_f: {
    label: 'Densidad del rCB (carga)',
    symbol: 'ρf',
    unit: 'g/cm³',
    description: 'Densidad del negro de humo recuperado utilizado como carga.',
  },
  E_f: {
    label: 'Módulo elástico del rCB',
    symbol: 'Ef',
    unit: 'GPa',
    description: 'Módulo elástico del negro de humo recuperado.',
  },
  xi: {
    label: 'Factor geométrico',
    symbol: 'ξ',
    unit: '—',
    description: 'Factor de forma de la carga en el modelo de Halpin–Tsai. Refleja la geometría de las partículas.',
  },
  w: {
    label: 'Fracción másica de rCB',
    symbol: 'w',
    unit: '—',
    description: 'Proporción en masa de negro de humo recuperado en el compuesto.',
  },
};
