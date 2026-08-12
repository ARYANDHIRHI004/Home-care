import { MoreHorizontal, GripVertical, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

const mockCategories = [
    { id: 1, name: 'Deep Cleaning', slug: 'deep-cleaning', description: 'Intense and thorough cleaning for entire homes or specific rooms.', services: 12, status: 'Active', order: 1, color: 'bg-blue-500' },
    { id: 2, name: 'Plumbing Services', slug: 'plumbing', description: 'Professional plumbing repairs, installations and general maintenance.', services: 8, status: 'Active', order: 2, color: 'bg-indigo-500' },
    { id: 3, name: 'Electrical Repair', slug: 'electrical', description: 'Expert electricians for wiring, appliance repair and fixing faults.', services: 15, status: 'Active', order: 3, color: 'bg-amber-500' },
    { id: 4, name: 'AC & Appliance Repair', slug: 'ac-appliance', description: 'Servicing and repair for Air Conditioners, Refrigerators and TVs.', services: 9, status: 'Active', order: 4, color: 'bg-sky-500' },
    { id: 5, name: 'Pest Control', slug: 'pest-control', description: 'Safe and effective pest control for termites, bed bugs and cockroaches.', services: 4, status: 'Active', order: 5, color: 'bg-emerald-500' },
    { id: 6, name: 'Home Painting', slug: 'painting', description: 'Interior and exterior painting services with premium materials.', services: 6, status: 'Inactive', order: 6, color: 'bg-rose-500' },
];

export default function CategoryGrid({ searchQuery, onCategoryClick }) {
    const [openMenuId, setOpenMenuId] = useState(null);

    const filtered = mockCategories.filter(c =>
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(category => (
                <div 
                    key={category.id} 
                    onClick={() => onCategoryClick(category)}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex flex-col overflow-hidden"
                >
                    {/* Banner Image Placeholder */}
                    <div className="h-32 bg-slate-100 relative overflow-hidden flex-shrink-0">
                        {/* Fake image gradient for aesthetics */}
                        <div className={`absolute inset-0 opacity-20 ${category.color} bg-gradient-to-tr from-black/20 to-transparent`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-slate-400 text-xs font-medium">Banner Image (16:9)</span>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col relative">
                        {/* Icon overlapping banner */}
                        <div className={`absolute -top-6 left-5 w-12 h-12 rounded-xl shadow-sm border-2 border-white flex items-center justify-center text-white ${category.color}`}>
                            {category.name.charAt(0)}
                        </div>

                        {/* Card Header & Menu */}
                        <div className="flex justify-between items-start mt-4 mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                                <p className="text-xs text-slate-400 font-mono mt-0.5">/{category.slug}</p>
                            </div>
                            <div className="relative" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === category.id ? null : category.id)}
                                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                {openMenuId === category.id && (
                                    <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-xl border border-slate-200 z-20 py-1">
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View Services</button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Edit Category</button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Duplicate</button>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Archive</button>
                                        <button className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50">Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-600 mb-6 line-clamp-2 flex-1">
                            {category.description}
                        </p>

                        {/* Footer Stats */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                                    <span className="font-bold text-slate-900">{category.services}</span> Services
                                </span>
                                {category.status === 'Active' ? (
                                    <span className="flex items-center gap-1 text-emerald-600">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-slate-500">
                                        <XCircle className="w-3.5 h-3.5" /> Inactive
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1 text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600" title="Drag to reorder">
                                <GripVertical className="w-3.5 h-3.5" /> Order: {category.order}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {filtered.length === 0 && (
                <div className="col-span-full py-20 text-center">
                    <p className="text-slate-500 text-sm">No categories found matching your search.</p>
                </div>
            )}
        </div>
    );
}
