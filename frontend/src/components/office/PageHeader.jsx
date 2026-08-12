import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ breadcrumbs, title, description, actions }) {
    return (
        <div className="mb-8">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-1.5">
                            {crumb.href ? (
                                <Link href={crumb.href} className="hover:text-slate-900 transition-colors">
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span className="text-slate-900 font-medium">{crumb.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && (
                                <ChevronRight className="w-3.5 h-3.5" />
                            )}
                        </div>
                    ))}
                </nav>
            )}
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-slate-500 mt-1 text-sm sm:text-base">
                            {description}
                        </p>
                    )}
                </div>
                
                {actions && (
                    <div className="flex items-center gap-2 sm:gap-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
