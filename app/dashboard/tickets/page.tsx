'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyTickets } from '../api';

export default function MyTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getMyTickets(user.id); // In real app, would use token
      setTickets(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar />
      <main className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-deep-blue">
            My Tickets
          </h1>
          <p className="text-gray-500 mt-2">
            All your purchased tickets
          </p>
        </motion.div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-200 p-4 mb-6 rounded-r-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse h-8 w-40 bg-gray-300 rounded mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎟️</span>
            </div>
            <h3 className="text-xl font-semibold text-deep-blue mb-2">No Tickets Yet</h3>
            <p className="text-gray-500">
              You haven't purchased any tickets yet. Start by browsing our campaigns!
            </p>
            <div className="mt-6">
              <a href="/#campaigns" className="btn-outline inline-block py-3 px-6">
                Browse Campaigns
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-5 shadow-card border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                        <span className="text-deep-blue font-medium text-xs">#</span>
                      </div>
                      <div>
                        <p className="font-medium text-deep-blue">Ticket Number</p>
                        <p className="text-2xl font-bold text-gold">{ticket.ticket_number}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-center py-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Good luck! This ticket is entered into the draw.
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
