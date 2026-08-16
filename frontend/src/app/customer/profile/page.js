'use client';

import { useState } from 'react';
import { CheckCircle2, Plus, Pencil, Home, Briefcase, LogOut, MapPin, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth';
import { useUpdateProfileMutation } from '@/store/api/customerAuthApi';
import { useGetMyAddressesQuery, useAddMyAddressMutation, useDeleteMyAddressMutation } from '@/store/api/customerApi';

// Better Auth's phone-number plugin needs a placeholder email under the hood
// (see syntheticEmailForPhone in lib/auth.js) — never show that to the
// customer as if it were a real address on file.
const SYNTHETIC_EMAIL_SUFFIX = '@phone.homecare247.internal';

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState({ label: 'Home', addressText: '' });

  const [updateProfile, { isLoading: isSavingName, error: nameError }] = useUpdateProfileMutation();
  const { data: addresses = [], isLoading: addressesLoading } = useGetMyAddressesQuery();
  const [addMyAddress, { isLoading: isAddingAddress, error: addAddressError }] = useAddMyAddressMutation();
  const [deleteMyAddress] = useDeleteMyAddressMutation();

  const user = session?.user;
  const realEmail = user?.email && !user.email.endsWith(SYNTHETIC_EMAIL_SUFFIX) ? user.email : null;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  if (isPending) {
    return <div className="py-12 text-center text-sm text-[#0F172A]/50">Loading profile...</div>;
  }
  if (!user) {
    return <div className="py-12 text-center text-sm text-rose-600">Unable to load your profile. Please log in again.</div>;
  }

  const profile = {
    name: user.name,
    email: realEmail,
    phone: user.phoneNumber || '-',
    phoneVerified: !!user.phoneNumberVerified,
  };

  function startEditName() {
    setNameDraft(profile.name || '');
    setEditingName(true);
  }

  async function saveName() {
    if (!nameDraft.trim()) return;
    try {
      await updateProfile({ name: nameDraft.trim() }).unwrap();
      setEditingName(false);
    } catch {
      // nameError below the form already surfaces this
    }
  }

  async function handleAddAddress(e) {
    e.preventDefault();
    if (!addressDraft.addressText.trim()) return;
    try {
      await addMyAddress(addressDraft).unwrap();
      setAddressDraft({ label: 'Home', addressText: '' });
      setAddModalOpen(false);
    } catch {
      // addAddressError below the form already surfaces this
    }
  }

  async function handleRemoveAddress(addressId) {
    try {
      await deleteMyAddress(addressId).unwrap();
    } catch {
      // silently fails to remove — RTK Query cache stays consistent with
      // the server either way, no local optimistic state to roll back
    }
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Profile
      </h1>

      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {user.image && !imageFailed ? (
              <img
                src={user.image}
                alt={profile.name || 'Profile photo'}
                className="w-12 h-12 rounded-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#F0F4FF] text-[#2554F0] flex items-center justify-center font-bold text-lg">
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            {editingName ? (
              <div className="space-y-1">
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  className="px-2 py-1 text-sm font-bold text-[#0F172A] border border-[#0F172A]/15 rounded-lg outline-none focus:ring-2 focus:ring-[#2554F0]/20"
                />
                {nameError && <p className="text-[10px] text-rose-600">{nameError.data?.message || 'Could not save name'}</p>}
              </div>
            ) : (
              <div>
                <p className={`text-sm font-bold ${profile.name ? 'text-[#0F172A]' : 'text-[#2554F0]'}`}>
                  {profile.name || 'Add your name'}
                </p>
                <p className="text-xs text-[#0F172A]/50">{profile.email || 'Add your email'}</p>
              </div>
            )}
          </div>
          {editingName ? (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={saveName}
                disabled={isSavingName || !nameDraft.trim()}
                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-40"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button onClick={() => setEditingName(false)} className="p-2 text-[#0F172A]/40 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={startEditName} className="p-2 text-[#0F172A]/40 hover:text-[#2554F0] hover:bg-[#F0F4FF] rounded-lg transition-colors">
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#0F172A]/70 pt-3 border-t border-[#0F172A]/5">
          <span className="font-medium text-[#0F172A]">{profile.phone}</span>
          {profile.phoneVerified && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#0F172A]/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[#0F172A]/40 uppercase tracking-wider">Saved Addresses</span>
          <button onClick={() => setAddModalOpen(true)} className="flex items-center gap-1.5 text-xs font-bold text-[#2554F0]">
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>

        {addressesLoading ? (
          <p className="text-sm text-[#0F172A]/40 text-center py-6">Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <div className="text-center py-6">
            <MapPin className="w-8 h-8 text-[#0F172A]/20 mx-auto mb-2" />
            <p className="text-sm font-medium text-[#0F172A] mb-1">No saved addresses</p>
            <p className="text-xs text-[#0F172A]/50">Add one to speed up your next booking.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {addresses.map((a, i) => {
              const Icon = a.label === 'Home' ? Home : Briefcase;
              return (
                <div key={a._id || i} className="flex items-center justify-between p-3 border border-[#0F172A]/10 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#F0F4FF] text-[#2554F0] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A]">{a.label || 'Address'}</p>
                      <p className="text-xs text-[#0F172A]/50 truncate">{a.addressText}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAddress(a._id)}
                    className="p-1.5 text-[#0F172A]/40 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    aria-label="Remove address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-rose-600 border border-rose-200 rounded-xl text-sm font-medium hover:bg-rose-50 transition-colors">
        <LogOut className="w-4 h-4" /> Logout
      </button>

      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddAddress} className="w-full max-w-sm bg-white rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-[#0F172A]">Add a new address</h3>
              <button type="button" onClick={() => setAddModalOpen(false)} className="p-1 text-[#0F172A]/40 hover:bg-slate-100 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#0F172A]/70 mb-1">Label</label>
              <select
                value={addressDraft.label}
                onChange={(e) => setAddressDraft((d) => ({ ...d, label: e.target.value }))}
                className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#0F172A]/70 mb-1">Full address</label>
              <textarea
                autoFocus
                rows={3}
                value={addressDraft.addressText}
                onChange={(e) => setAddressDraft((d) => ({ ...d, addressText: e.target.value }))}
                placeholder="B-204, Shanti Apartments, Nehru Nagar, Bhilai"
                className="w-full px-3 py-2 border border-[#0F172A]/15 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2554F0]/20 resize-none"
              />
            </div>
            {addAddressError && (
              <p className="text-xs text-rose-600">{addAddressError.data?.message || 'Could not save address.'}</p>
            )}
            <button
              type="submit"
              disabled={isAddingAddress || !addressDraft.addressText.trim()}
              className="w-full py-2.5 bg-[#2554F0] text-white rounded-xl text-sm font-medium hover:bg-[#1D45D1] transition-colors disabled:opacity-40"
            >
              {isAddingAddress ? 'Saving…' : 'Save Address'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
