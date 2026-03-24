'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile, updateBankDetails } from '../../../app/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  total_deposits: number;
  total_wins: number;
  joined_at: string;
}

export default function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [bankMode, setBankMode] = useState(false);

  const [form, setForm] = useState({ name: '', phone: '' });
  const [bankForm, setBankForm] = useState({ bankName: '', accountNumber: '', accountName: '' });

  useEffect(() => {
    getCurrentUser().then((data: any) => {
      if (data?.user) {
        const u = data.user;
        setProfile(u);
        setForm({ name: u.name || '', phone: u.phone || '' });
        setBankForm({
          bankName: u.bank_name || '',
          accountNumber: u.account_number || '',
          accountName: u.account_name || ''
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updateProfile(form);
      setProfile((prev: any) => ({ ...prev, ...form }));
      setEditMode(false);
      setMsg('✅ Profile updated!');
    } catch {
      setMsg('❌ Failed to update profile');
    }
    setSaving(false);
  };

  const handleBankSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updateBankDetails(bankForm);
      setProfile((prev: any) => ({ ...prev, ...bankForm }));
      setBankMode(false);
      setMsg('✅ Bank details saved!');
    } catch {
      setMsg('❌ Failed to save bank details');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gradient-to-r from-[#0B1F3A]/30 to-[#0B1F3A]/10 rounded-xl" />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-center py-12 text-gray-400">Failed to load profile.</div>;
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`text-sm px-4 py-2 rounded-lg ${msg.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {msg}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-[#0B1F3A]/60 border border-[#D4AF37]/20 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center text-2xl font-bold text-[#0B1F3A]">
              {profile.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile.name}</h2>
              <p className="text-gray-400 text-sm">{profile.email}</p>
              {profile.phone && <p className="text-gray-500 text-sm">{profile.phone}</p>}
            </div>
          </div>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="text-sm text-[#D4AF37] hover:underline">
              Edit
            </button>
          )}
        </div>

        {editMode ? (
          <div className="space-y-3 mt-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Phone</label>
              <input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-[#D4AF37] text-[#0B1F3A] rounded-lg text-sm font-bold hover:bg-[#F4D03F] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => { setEditMode(false); setForm({ name: profile.name || '', phone: profile.phone || '' }); }} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-[#0A0A0A]/50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Total Deposits</p>
              <p className="text-[#D4AF37] font-bold">₦{(profile.total_deposits || 0).toLocaleString()}</p>
            </div>
            <div className="bg-[#0A0A0A]/50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Total Wins</p>
              <p className="text-green-400 font-bold">{profile.total_wins || 0}</p>
            </div>
            <div className="bg-[#0A0A0A]/50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-white text-sm">{profile.joined_at ? new Date(profile.joined_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bank Details Card */}
      <div className="bg-[#0B1F3A]/60 border border-[#D4AF37]/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Bank Details</h3>
          {!bankMode && (
            <button onClick={() => setBankMode(true)} className="text-sm text-[#D4AF37] hover:underline">
              {profile.bank_name ? 'Edit' : 'Add'}
            </button>
          )}
        </div>

        {profile.bank_name ? (
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Bank</span>
              <span className="text-white text-sm">{profile.bank_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Account Number</span>
              <span className="text-white text-sm">{profile.account_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Account Name</span>
              <span className="text-white text-sm">{profile.account_name}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No bank details added yet.</p>
        )}

        {bankMode && (
          <div className="space-y-3 mt-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Bank Name</label>
              <input
                value={bankForm.bankName}
                onChange={e => setBankForm({ ...bankForm, bankName: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Account Number</label>
              <input
                value={bankForm.accountNumber}
                onChange={e => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Account Name</label>
              <input
                value={bankForm.accountName}
                onChange={e => setBankForm({ ...bankForm, accountName: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleBankSave} disabled={saving} className="px-4 py-2 bg-[#D4AF37] text-[#0B1F3A] rounded-lg text-sm font-bold hover:bg-[#F4D03F] disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => { setBankMode(false); setBankForm({ bankName: profile.bank_name || '', accountNumber: profile.account_number || '', accountName: profile.account_name || '' }); }} className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
