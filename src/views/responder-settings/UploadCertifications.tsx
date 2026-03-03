import { Upload } from 'lucide-react';

export const UploadCertifications = () => (
    <div className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Upload your government-issued medical license or responder certification to verify your account and access live patient SOS requests.</p>
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors gap-3">
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900/40 text-success-DEFAULT flex items-center justify-center rounded-xl shadow-sm">
                <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Tap to upload proof of certification</p>
            <p className="text-xs font-medium text-slate-500">Supports PDF, JPG, PNG up to 10MB</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mt-4">
            <p className="text-sm text-amber-800 dark:text-amber-300 font-medium tracking-wide">Note: Automated AI Vision Verification is rolling out in Phase 3.</p>
        </div>
    </div>
);
