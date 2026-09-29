import { FlaskConical, Sun, Moon, AlertTriangle } from 'lucide-react';
import { SCIENTIFIC_WARNING } from '@/constants';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-ink-200/60 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-950/20" />
      <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm dark:bg-brand-600">
              <FlaskConical className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink-900 dark:text-white sm:text-3xl">
                PolyComp Studio
              </h1>
              <p className="mt-0.5 text-sm text-ink-600 dark:text-ink-300 sm:text-base">
                Simulador preliminar de compuestos PP/rCB
              </p>
              <div className="mt-2">
                <span className="label-badge bg-accent-100 text-accent-800 dark:bg-accent-900/40 dark:text-accent-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-600 dark:bg-accent-400" />
                  Prototipo teórico
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onToggleTheme}
            className="no-print flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-600 transition-all hover:bg-ink-50 active:scale-95 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-ink-700"
            aria-label={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
            title={theme === 'light' ? 'Tema oscuro' : 'Tema claro'}
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/30">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {SCIENTIFIC_WARNING}
          </p>
        </div>
      </div>
    </header>
  );
}
