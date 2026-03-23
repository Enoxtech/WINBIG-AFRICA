import { getServerUser } from '@/app/lib/auth';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getServerUser();
  const userId = user?.id || 'guest';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1F3A] via-[#0A1628] to-[#0D1F3C] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">My Profile</h1>
          <p className="text-gray-400 text-sm">Manage your account, bank details, and referral code</p>
        </div>
        <ProfileClient userId={userId} />
      </div>
    </div>
  );
}
