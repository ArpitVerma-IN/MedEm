export const PrivacyPolicy = () => (
    <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Data Protection</h4>
            <p>We respect your privacy as a medical professional. Your real-time location is never permanently stored on our servers and is only actively broadcasted and visible over the WebSockets when your system engages an active SOS ping.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Certification Processing</h4>
            <p className="mb-3">Once AI document processing rolls out in upcoming updates, your license files will be scanned purely for verification extraction before being immediately encrypted and securely vaulted.</p>
            <p className="text-success-DEFAULT dark:text-success-light font-bold">The feature is releasing soon, please check the about section to know more.</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Please refer to the complete privacy_policy.txt file in our root repository for all legal disclosures.
        </div>
    </div>
);
