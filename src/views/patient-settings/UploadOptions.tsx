import { Upload } from 'lucide-react';

export const UploadOptions = () => (
    <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Upload your current medical reports or list of ongoing medications for emergency responders to see instantly when you ping for help.</p>
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors gap-3">
            <div className="w-12 h-12 bg-med-100 dark:bg-med-900/40 text-med-DEFAULT flex items-center justify-center rounded-xl shadow-sm">
                <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tap to browse files</p>
            <p className="text-xs font-medium text-slate-500">Supports PDF, JPG, PNG up to 10MB</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium tracking-wide">Note: Full document hosting and verification is a Phase 3 feature.</p>
        </div>
    </div>
);
