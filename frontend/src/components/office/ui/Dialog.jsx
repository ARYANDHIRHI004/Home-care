'use client';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function Dialog({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
    const dialogRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            <div 
                ref={dialogRef}
                className={`relative w-full ${maxWidth} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800`}
            >
                {title && (
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900 sticky top-0 z-10">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h2>
                        <button 
                            onClick={onClose}
                            className="p-1.5 rounded-full text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="overflow-y-auto max-h-[calc(100vh-120px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
