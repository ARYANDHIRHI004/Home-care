'use client';
import { CheckCircle2 } from 'lucide-react';

export default function Timeline({ items }) {
    return (
        <div className="space-y-4">
            {items.map((event, idx, arr) => (
                <div key={idx} className="flex gap-4 relative">
                    {idx !== arr.length - 1 && <div className={`absolute left-4 top-8 bottom-[-16px] w-0.5 ${event.status === 'done' ? 'bg-blue-200 dark:bg-blue-800' : 'bg-slate-100 dark:bg-slate-700'}`}></div>}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 ${event.status === 'done' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-500'}`}>
                        {event.status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>}
                    </div>
                    <div className="pb-4">
                        <div className={`text-sm font-medium ${event.status === 'done' ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>{event.title}</div>
                        {event.status === 'done' && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                                <span>{event.date}</span>
                                {event.actor && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                                        <span>{event.actor}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
