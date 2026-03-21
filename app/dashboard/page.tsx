'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />
      <main className="flex min-h-[calc(100vh-4.5rem)]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-100">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-deep-blue rounded-xl flex items-center justify-center">
                <span className="text-gold font-bold text-lg">W</span>
              </div>
              <span className="font-bold text-xl text-deep-blue">WINBIG <span className="text-gold">AFRICA</span></span>
            </div>
            
            <nav className="space-y-2">
              <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${user ? 'bg-gold/10 text-gold' : 'text-gray-600 hover:bg-gray-50'} `}>
                <span className="w-5 h-5 bg-gold/20 rounded flex items-center justify-center">
                  <span className="text-xs text-gold">📊</span>
                </span>
                <span>Overview</span>
              </Link>
              
              <Link href="/dashboard/tickets" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${user ? 'bg-gold/10 text-gold' : 'text-gray-600 hover:bg-gray-50'} `}>
                <span className="w-5 h-5 bg-gold/20 rounded flex items-center justify-center">
                  <span className="text-xs text-gold">🎟️</span>
                </span>
                <span>My Tickets</span>
              </Link>
              
              <Link href="/dashboard/campaigns" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${user ? 'bg-gold/10 text-gold' : 'text-gray-600 hover:bg-gray-50'} `}>
                <span className="w-5 h-5 bg-gold/20 rounded flex items-center justify-center">
                  <span className="text-xs text-gold">🏆</span>
                </span>
                <span>Campaigns</span>
              </Link>
            </nav>
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-deep-blue">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-500 mt-2">
              Your dashboard overview
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stats Cards */}
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <h3 className="font-semibold text-deep-blue mb-4">My Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">0</div>
                  <p className="text-gray-500 text-sm">Campaigns Joined</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">0</div>
                  <p className="text-gray-500 text-sm">Tickets Owned</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">0</div>
                  <p className="text-gray-500 text-sm">Wins</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">₦0</div>
                  <p className="text-gray-500 text-sm">Total Won</p>
                </div>
              </div>
            </motion.div>
            
            {/* Recent Activity */}
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-card border border-gray-100"
            >
              <h3 className="font-semibold text-deep-blue mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-4xl">📭</span>
                  </div>
                  <p className="text-gray-500 mt-4">No recent activity</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Start by browsing campaigns and buying tickets
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
