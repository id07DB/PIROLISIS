export interface ModelParameters {
  rho_m: number;
  E_m: number;
  rho_f: number;
  E_f: number;
  xi: number;
  w: number;
}

export interface ModelResults {
  Vf: number;
  rho_c: number;
  eta: number;
  E_c: number;
  deltaE: number;
  specificModulus: number;
}

export interface ChartPoint {
  w: number;
  Vf: number;
  rho_c: number;
  E_c: number;
}

export interface ProcessStage {
  id: number;
  title: string;
  description: string;
  dataToConfirm: string[];
}

export interface ValidationErrors {
  rho_m?: string;
  E_m?: string;
  rho_f?: string;
  E_f?: string;
  xi?: string;
  w?: string;
}
