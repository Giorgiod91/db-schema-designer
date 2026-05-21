import ERDiagram from '@/components/ERDiagram';
import { ExternalLink } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 px-5 py-3 shrink-0 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">DB</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-none">DB Schema Designer</h1>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Visuelles Datenbankmodell-Tool · Export als UMLet (.uxf)
            </p>
          </div>
        </div>

        <a
          href="https://giorgiodettmar.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <span className="hidden sm:inline">von Giorgio Dettmar</span>
          <ExternalLink size={12} />
        </a>
      </header>

      <div className="flex-1 overflow-hidden">
        <ERDiagram />
      </div>
    </main>
  );
}
