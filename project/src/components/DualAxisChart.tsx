import { useState, useRef, useMemo } from 'react';
import type { ChartPoint } from '@/types';
import { fmt, fmtFractionAsPercent } from '@/utils/format';

interface DualAxisChartProps {
  data: ChartPoint[];
  currentW: number;
  dark: boolean;
}

const WIDTH = 760;
const HEIGHT = 380;
const MARGIN = { top: 30, right: 70, bottom: 50, left: 65 };
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right;
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom;

export default function DualAxisChart({ data, currentW, dark }: DualAxisChartProps) {
  const [hover, setHover] = useState<{ x: number; y: number; point: ChartPoint } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const { rhoMin, rhoMax, eMin, eMax } = useMemo(() => {
    let rMin = Infinity, rMax = -Infinity, eMinVal = Infinity, eMaxVal = -Infinity;
    for (const d of data) {
      if (d.rho_c < rMin) rMin = d.rho_c;
      if (d.rho_c > rMax) rMax = d.rho_c;
      if (d.E_c < eMinVal) eMinVal = d.E_c;
      if (d.E_c > eMaxVal) eMaxVal = d.E_c;
    }
    const rPad = (rMax - rMin) * 0.1 || 0.01;
    const ePad = (eMaxVal - eMinVal) * 0.1 || 0.1;
    return { rhoMin: rMin - rPad, rhoMax: rMax + rPad, eMin: eMinVal - ePad, eMax: eMaxVal + ePad };
  }, [data]);

  const xScale = (w: number) => MARGIN.left + (w / 0.3) * PLOT_W;
  const yLeftScale = (rho: number) => MARGIN.top + PLOT_H - ((rho - rhoMin) / (rhoMax - rhoMin)) * PLOT_H;
  const yRightScale = (e: number) => MARGIN.top + PLOT_H - ((e - eMin) / (eMax - eMin)) * PLOT_H;

  const rhoPath = useMemo(() => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.w).toFixed(1)} ${yLeftScale(d.rho_c).toFixed(1)}`).join(' ');
  }, [data, rhoMin, rhoMax]);

  const ePath = useMemo(() => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(d.w).toFixed(1)} ${yRightScale(d.E_c).toFixed(1)}`).join(' ');
  }, [data, eMin, eMax]);

  const currentX = xScale(currentW);
  const currentPoint = data.reduce((closest, d) =>
    Math.abs(d.w - currentW) < Math.abs(closest.w - currentW) ? d : closest
  , data[0]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = WIDTH / rect.width;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const wVal = ((mouseX - MARGIN.left) / PLOT_W) * 0.3;
    const clampedW = Math.max(0, Math.min(0.3, wVal));
    const point = data.reduce((closest, d) =>
      Math.abs(d.w - clampedW) < Math.abs(closest.w - clampedW) ? d : closest
    , data[0]);
    setHover({ x: xScale(point.w), y: e.clientY - rect.top, point });
  };

  const handleMouseLeave = () => setHover(null);

  const axisColor = dark ? '#475569' : '#94a3b8';
  const textColor = dark ? '#94a3b8' : '#64748b';
  const gridColor = dark ? '#1e293b' : '#f1f5f9';
  const rhoColor = '#ea580c';
  const eColor = '#b91c1c';

  const tickW = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3];
  const rhoTicks = [rhoMin, rhoMin + (rhoMax - rhoMin) / 2, rhoMax];
  const eTicks = [eMin, eMin + (eMax - eMin) / 2, eMax];

  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="section-title">Gráfica interactiva</h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: rhoColor }} />
            <span className="text-ink-600 dark:text-ink-300">Densidad (g/cm³)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full" style={{ background: eColor }} />
            <span className="text-ink-600 dark:text-ink-300">Módulo (GPa)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          style={{ minWidth: 500 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="img"
          aria-label="Gráfica de densidad y módulo estimado frente a la carga másica de rCB"
        >
          {/* Grid horizontal */}
          {rhoTicks.map((t, i) => (
            <line key={`grid-l-${i}`} x1={MARGIN.left} x2={MARGIN.left + PLOT_W} y1={yLeftScale(t)} y2={yLeftScale(t)} stroke={gridColor} strokeWidth={1} />
          ))}

          {/* Eje X */}
          {tickW.map((t) => (
            <g key={`x-${t}`}>
              <line x1={xScale(t)} x2={xScale(t)} y1={MARGIN.top + PLOT_H} y2={MARGIN.top + PLOT_H + 5} stroke={axisColor} strokeWidth={1} />
              <text x={xScale(t)} y={MARGIN.top + PLOT_H + 18} textAnchor="middle" fill={textColor} fontSize={11}>
                {fmtFractionAsPercent(t, 0)}
              </text>
            </g>
          ))}
          <text x={MARGIN.left + PLOT_W / 2} y={HEIGHT - 8} textAnchor="middle" fill={textColor} fontSize={12} fontWeight={500}>
            Carga másica de rCB (%)
          </text>

          {/* Eje Y izquierdo (densidad) */}
          {rhoTicks.map((t, i) => (
            <g key={`yl-${i}`}>
              <line x1={MARGIN.left - 5} x2={MARGIN.left} y1={yLeftScale(t)} y2={yLeftScale(t)} stroke={rhoColor} strokeWidth={1.5} />
              <text x={MARGIN.left - 8} y={yLeftScale(t) + 4} textAnchor="end" fill={rhoColor} fontSize={11}>
                {fmt(t, 3)}
              </text>
            </g>
          ))}
          <text x={-MARGIN.top - PLOT_H / 2} y={18} textAnchor="middle" fill={rhoColor} fontSize={12} fontWeight={500} transform="rotate(-90)">
            Densidad (g/cm³)
          </text>

          {/* Eje Y derecho (módulo) */}
          {eTicks.map((t, i) => (
            <g key={`yr-${i}`}>
              <line x1={MARGIN.left + PLOT_W} x2={MARGIN.left + PLOT_W + 5} y1={yRightScale(t)} y2={yRightScale(t)} stroke={eColor} strokeWidth={1.5} />
              <text x={MARGIN.left + PLOT_W + 8} y={yRightScale(t) + 4} textAnchor="start" fill={eColor} fontSize={11}>
                {fmt(t, 2)}
              </text>
            </g>
          ))}
          <text x={MARGIN.top + PLOT_H / 2} y={WIDTH - 12} textAnchor="middle" fill={eColor} fontSize={12} fontWeight={500} transform="rotate(90)">
            Módulo (GPa)
          </text>

          {/* Líneas de datos */}
          <path d={rhoPath} fill="none" stroke={rhoColor} strokeWidth={2.5} strokeLinecap="round" />
          <path d={ePath} fill="none" stroke={eColor} strokeWidth={2.5} strokeLinecap="round" />

          {/* Línea vertical en la selección actual */}
          <line
            x1={currentX} x2={currentX}
            y1={MARGIN.top} y2={MARGIN.top + PLOT_H}
            stroke={dark ? '#64748b' : '#334155'}
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />

          {/* Puntos en la selección actual */}
          <circle cx={currentX} cy={yLeftScale(currentPoint.rho_c)} r={5} fill={rhoColor} stroke="#fff" strokeWidth={2} />
          <circle cx={currentX} cy={yRightScale(currentPoint.E_c)} r={5} fill={eColor} stroke="#fff" strokeWidth={2} />

          {/* Punto hover */}
          {hover && (
            <>
              <line
                x1={hover.x} x2={hover.x}
                y1={MARGIN.top} y2={MARGIN.top + PLOT_H}
                stroke={dark ? '#94a3b8' : '#cbd5e1'}
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle cx={hover.x} cy={yLeftScale(hover.point.rho_c)} r={4} fill={rhoColor} opacity={0.6} />
              <circle cx={hover.x} cy={yRightScale(hover.point.E_c)} r={4} fill={eColor} opacity={0.6} />
            </>
          )}
        </svg>

        {/* Tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-ink-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-ink-700 dark:bg-ink-800"
            style={{
              left: `${(hover.x / WIDTH) * 100}%`,
              top: 0,
              transform: 'translateX(-50%) translateY(-100%)',
              marginTop: '8px',
            }}
          >
            <div className="font-semibold text-ink-800 dark:text-ink-100">
              w = {fmtFractionAsPercent(hover.point.w, 1)}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: rhoColor }} />
              <span className="text-ink-600 dark:text-ink-300">ρc = {fmt(hover.point.rho_c, 4)} g/cm³</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: eColor }} />
              <span className="text-ink-600 dark:text-ink-300">Ec = {fmt(hover.point.E_c, 4)} GPa</span>
            </div>
            <div className="mt-0.5 text-ink-400 dark:text-ink-500">
              Vf = {fmtFractionAsPercent(hover.point.Vf, 2)}
            </div>
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-ink-400 dark:text-ink-500">
        Cada punto se calcula con las ecuaciones implementadas. La línea discontinua marca la carga seleccionada actualmente.
      </p>
    </div>
  );
}
