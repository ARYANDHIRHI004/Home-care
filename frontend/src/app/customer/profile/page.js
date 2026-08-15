'use client';

import { useState } from 'react';
import { CheckCircle2, Plus, Pencil, Home, Briefcase, LogOut, MapPin } from 'lucide-react';
import { MOCK_PROFILE, MOCK_ADDRESSES } from '@/lib/customerData';

export default function ProfilePage() {
  const [addresses] = useState(MOCK_ADDRESSES);

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Profile
      </h1>

      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#F0F4FF] text-[#2554F0] flex items-center justify-center font-bold text-lg">
              {MOCK_PROFILE.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-[#0F172A]">{MOCK_PROFILE.name}</p>
              <p className="text-xs text-[#0F172A]/50">{MOCK_PROFILE.email}</p>
            </div>
          </div>
          <button className="p-2 text-[#0F172A]/40 hover:text-[#2554F0] hover:bg-[#F0F4FF] rounded-lg transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#0F172A]/70 pt-3 border-t border-[#0F172A]/5">
          <span className="font-medium text-[#0F172A]">{MOCK_PROFILE.phone}</span>
          {MOCK_PROFILE.phoneVerified && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider">Saved Addresses</span>
          <button className="flex items-center gap-1.5 text-xs font-bold text-[#2554F0]">
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-6">
            <MapPin className="w-8 h-8 text-[#0F172A]/20 mx-auto mb-2" />
            <p className="text-sm font-medium text-[#0F172A] mb-1">No saved addresses</p>
            <p className="text-xs text-[#0F172A]/50">Add one to speed up your next booking.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {addresses.map((a) => {
              const Icon = a.label === 'Home' ? Home : Briefcase;
              return (
                <div key={a.id} className="flex items-center justify-between p-3 border border-[#0F172A]/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F0F4FF] text-[#2554F0] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{a.label}</p>
                      <p className="text-xs text-[#0F172A]/50">{a.line}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.isDefault && (
                      <span className="text-[10px] font-bold text-[#2554F0] bg-[#F0F4FF] px-2 py-0.5 rounded-full">Default</span>
                    )}
                    <button className="text-xs font-medium text-[#0F172A]/50 hover:text-[#0F172A]">Edit</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button className="flex items-center gap-2 px-4 py-2.5 text-rose-600 border border-rose-200 rounded-xl text-sm font-medium hover:bg-rose-50 transition-colors">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
}
