'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile, updateBankDetails } from '../../api';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  bankName: string;
  accountNumber: string;
  accountName: string;
  referralCode: string;
  referredBy: string | null;
  createdAt: string;
}

export default function ProfileClient({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getProfile(userId).then((p) => {
      const data = p as ProfileData;
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone);
      setBankName(data.bankName || '');
      setAccountNumber(data.accountNumber || '');
      setAccountName(data.accountName || '');
      setLoading(false);
    });
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, email, phone });
      setProfile((prev) => prev ? { ...prev, name, email, phone } : prev);
      setMsg('Profile updated successfully!');
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBank = async () => {
    if (!bankName || !accountNumber || !accountName) return;
    if (accountNumber.length !== 10) {
      setMsg('Account number must be 10 digits.');
      return;
    }
    setSaving(true);
    try {
      await updateBankDetails({ bankName, accountNumber, accountName });
      setProfile((prev) => prev ? { ...prev, bankName, accountNumber, accountName } : prev);
      setMsg('Bank details updated!');
      setEditingBank(false);
    } finally {
      setSaving(false);
    }
  };

  const copyReferral = () => {
    navigator.clipboard.writeText(profile?.referralCode || '');
    setMsg('Referral code copied!');
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-800/50 rounded-2xl" />
        <div className="h-32 bg-gray-800/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className="bg-green-900/30 border border-green-600 text-green-300 px-4 py-3 rounded-xl text-sm">
          {msg}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white">
            {profile?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="text-white font-bold text-lg">{profile?.name}</div>
            <div className="text-gray-400 text-sm">{profile?.email}</div>
            <div className="text-gray-500 text-xs mt-1">Member since {new Date(profile?.createdAt || '').toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}</div>
          </div>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(false)} className="flex-1 bg-gray-700 py-2.5 rounded-xl text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-yellow-600 py-2.5 rounded-xl text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-gray-500 text-xs mb-1">Phone</div>
                <div className="text-white text-sm">{profile?.phone}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs mb-1">Email</div>
                <div className="text-white text-sm">{profile?.email}</div>
              </div>
            </div>
            <button onClick={() => setEditing(true)} className="w-full bg-gray-700 hover:bg-gray-600 py-2.5 rounded-xl text-white text-sm transition-all">
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Bank Details */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Bank Details</h3>
          {!editingBank && (
            <button onClick={() => setEditingBank(true)} className="text-yellow-500 text-sm hover:text-yellow-400">Edit</button>
          )}
        </div>

        {editingBank ? (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Bank Name</label>
              <input value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. First Bank of Nigeria" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Account Number</label>
              <input value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="10-digit account number" maxLength={10} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Account Name</label>
              <input value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="As on your bank account" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditingBank(false)} className="flex-1 bg-gray-700 py-2.5 rounded-xl text-white">Cancel</button>
              <button onClick={handleSaveBank} disabled={saving} className="flex-1 bg-yellow-600 py-2.5 rounded-xl text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save Bank Details'}</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500 text-xs mb-1">Bank</div>
              <div className="text-white text-sm">{profile?.bankName || 'Not set'}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Account Number</div>
              <div className="text-white text-sm">{profile?.accountNumber || 'Not set'}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">Account Name</div>
              <div className="text-white text-sm">{profile?.accountName || 'Not set'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Referral Code */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <h3 className="text-white font-semibold mb-2">Referral Code</h3>
        <p className="text-gray-400 text-xs mb-4">Earn ₦2,000 for every friend who signs up and purchases a ticket!</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3">
            <span className="text-yellow-400 font-mono font-bold text-lg">{profile?.referralCode}</span>
          </div>
          <button onClick={copyReferral} className="bg-yellow-600 hover:bg-yellow-500 text-white px-5 py-3 rounded-xl font-semibold transition-all">
            Copy
          </button>
        </div>
        {profile?.referredBy && (
          <div className="mt-3 text-gray-500 text-xs">
            Referred by: <span className="text-gray-400">{profile.referredBy}</span>
          </div>
        )}
      </div>
    </div>
  );
}
