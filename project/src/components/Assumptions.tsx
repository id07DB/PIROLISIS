import { ShieldAlert } from 'lucide-react';

export default function Assumptions() {
  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-brand-700 dark:text-brand-400" />
        <h2 className="section-title">Supuestos y limitaciones</h2>
      </div>

      <div className="mt-4 space-y-3 text-sm text-ink-600 dark:text-ink-300">
        <p>
          Los resultados de este simulador dependen completamente de las propiedades de entrada
          (densidades, módulos elásticos y factor geométrico), del modelo de mezcla y de los
          supuestos del modelo de Halpin–Tsai. Todos los valores predeterminados son supuestos
          editables y no corresponden a una ficha técnica certificada del material ThermoTireBlack®.
        </p>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              El modelo de Halpin–Tsai asume una dispersión uniforme de la carga y una geometría
              de partícula simplificada. En la práctica, la dispersión real puede ser heterogénea.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              No se consideran efectos de interfaz matriz–carga, agentes de acoplamiento ni
              posibles aglomeraciones del negro de humo recuperado.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              Las propiedades del rCB pueden variar significativamente según el origen, el proceso
              de pirólisis y el tratamiento posterior. Los valores supuestos deben sustituirse por
              datos de caracterización del lote específico.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            <span>
              Estas estimaciones deben contrastarse con ensayos mecánicos normalizados antes de
              tomarse decisiones de diseño o ingeniería.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
