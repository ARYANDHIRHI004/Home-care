'use client';

import { MoreHorizontal, CheckCircle2, XCircle, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { useGetCategoriesQuery, useDeleteCategoryMutation } from '@/store/api/categoryApi';

const fallbackCategories = [
    { id: 1, name: 'Deep Cleaning', slug: 'deep-cleaning', description: 'Intense and thorough cleaning for entire homes or specific rooms.', services: 12, status: 'Active', active: true, color: 'bg-blue-500' },
    { id: 2, name: 'Plumbing Services', slug: 'plumbing', description: 'Professional plumbing repairs, installations and general maintenance.', services: 8, status: 'Active', active: true, color: 'bg-indigo-500' },
    { id: 3, name: 'Electrical Repair', slug: 'electrical', description: 'Expert electricians for wiring, appliance repair and fixing faults.', services: 15, status: 'Active', active: true, color: 'bg-amber-500' },
    { id: 4, name: 'AC & Appliance Repair', slug: 'ac-appliance', description: 'Servicing and repair for Air Conditioners, Refrigerators and TVs.', services: 9, status: 'Active', active: true, color: 'bg-sky-500' },
    { id: 5, name: 'Pest Control', slug: 'pest-control', description: 'Safe and effective pest control for termites, bed bugs and cockroaches.', services: 4, status: 'Active', active: true, color: 'bg-emerald-500' },
    { id: 6, name: 'Home Painting', slug: 'painting', description: 'Interior and exterior painting services with premium materials.', services: 6, status: 'Inactive', active: false, color: 'bg-rose-500' },
];

const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-amber-500', 'bg-sky-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500'];

export default function CategoryGrid({ searchQuery, onCategoryClick }) {
    const { data: rawCategories = [], isLoading } = useGetCategoriesQuery();
    const [deleteCategory] = useDeleteCategoryMutation();
    const [openMenuId, setOpenMenuId] = useState(null);

    const categories = rawCategories.length > 0
        ? rawCategories.map((c, idx) => ({
            id: c._id,
            _id: c._id,
            name: c.name,
            slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: c.description || 'Professional home care services for your household needs.',
            status: c.active !== false ? 'Active' : 'Inactive',
            active: c.active !== false,
            color: colors[idx % colors.length],
            _raw: c,
        }))
        : fallbackCategories;

    const filtered = categories.filter(c =>
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id, e) => {
        e?.stopPropagation();
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
                setOpenMenuId(null);
            } catch (err) {
                console.error('Failed to delete category', err);
            }
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(category => (
                <div 
                    key={category._id || category.id} 
                    onClick={() => onCategoryClick(category)}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex flex-col overflow-hidden"
                >
                    {/* Banner Image Placeholder */}
                    <div className="h-32 bg-slate-100 relative overflow-hidden flex-shrink-0">
                        <div className={`absolute inset-0 opacity-20 ${category.color} bg-gradient-to-tr from-black/20 to-transparent`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-slate-400 text-xs font-medium">{category.name}</span>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col relative">
                        {/* Icon overlapping banner */}
                        <div className={`absolute -top-6 left-5 w-12 h-12 rounded-xl shadow-sm border-2 border-white flex items-center justify-center text-white font-bold text-lg ${category.color}`}>
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
                                        <button onClick={() => { onCategoryClick(category); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                            <Edit className="w-3.5 h-3.5" /> Edit Category
                                        </button>
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <button onClick={(e) => category._raw ? handleDelete(category._id, e) : null} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
                            {category.description}
                        </p>

                        {/* Card Footer Info */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400">Status</span>
                            {category.status === 'Active' ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 font-semibold text-slate-400">
                                    <XCircle className="w-3.5 h-3.5" /> Inactive
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
