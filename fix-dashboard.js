const fs = require('fs');
const path = 'C:/Users/SkyBond/.openclaw/workspace/WINBIG AFRICA/app/dashboard/DashboardContent.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Fix tab state type to include 'overview'
content = content.replace(
  "useState<'tickets' | 'achievements' | 'referral' | 'wallet'>('tickets')",
  "useState<'overview' | 'tickets' | 'achievements' | 'referral' | 'wallet'>('tickets')"
);

// 2. Add overview tab button (find tickets tab and insert overview before it)
content = content.replace(
  "{ key: 'tickets', label: '🎟️ My Tickets' },",
  "{ key: 'tickets', label: '🎟️ My Tickets' },\n              { key: 'overview', label: '📊 Overview' },"
);

// 3. Add overview tab content before tickets tab
const overviewContent = `{ activeSection === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl p-4 border backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🎟️</span>
                      <span className="text-gray-400 text-xs">Active Tickets</span>
                    </div>
                    <div className="text-white font-bold text-lg">12</div>
                    <div className="text-gray-500 text-xs">+3 this week</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">💰</span>
                      <span className="text-gray-400 text-xs">Total Won</span>
                    </div>
                    <div className="text-white font-bold text-lg">₦157,500</div>
                    <div className="text-gray-500 text-xs">All time</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-xl p-4 border backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">🔥</span>
                      <span className="text-gray-400 text-xs">Win Streak</span>
                    </div>
                    <div className="text-white font-bold text-lg">5</div>
                    <div className="text-gray-500 text-xs">Personal best!</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📈</span>
                      <span className="text-gray-400 text-xs">Payout Rate</span>
                    </div>
                    <div className="text-white font-bold text-lg">28%</div>
                    <div className="text-gray-500 text-xs">This month</div>
                  </div>
                </div>

                {/* Campaigns Quick Access */}
                <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm">🎯 Live Campaigns</h3>
                    <a href="/campaigns" className="text-yellow-500 text-xs hover:text-yellow-400">See All →</a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <a href="/campaigns/weekly-mega" className="bg-gradient-to-r from-blue-900/60 to-purple-900/40 rounded-lg p-3 border border-blue-500/20 hover:border-yellow-500/40 transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full">Weekly</span>
                        <span className="text-xs text-gray-400">5 days left</span>
                      </div>
                      <div className="text-white font-semibold text-sm">Weekly Mega Draw</div>
                      <div className="text-yellow-400 text-xs mt-1">₦5,000,000</div>
                    </a>
                    <a href="/campaigns/jackpot" className="bg-gradient-to-r from-purple-900/60 to-pink-900/40 rounded-lg p-3 border border-purple-500/20 hover:border-yellow-500/40 transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-purple-900/60 text-purple-300 px-2 py-0.5 rounded-full">🔥 JACKPOT</span>
                        <span className="text-xs text-gray-400">3 days left</span>
                      </div>
                      <div className="text-white font-semibold text-sm">₦50,000,000 Jackpot</div>
                      <div className="text-yellow-400 text-xs mt-1">₦50,000,000</div>
                    </a>
                  </div>
                </div>

                {/* Recent Winners */}
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-xl p-4 border border-green-800/30">
                  <h3 className="text-white font-semibold mb-3">🏆 Recent Winners</h3>
                  <div className="space-y-3">
                    {[{name:'Chidi O.',amount:'₦500,000',location:'Lagos'},{name:'Aisha M.',amount:'₦1,200,000',location:'Abuja'},{name:'Emeka N.',amount:'₦75,000',location:'Port Harcourt'}].map((winner,i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white">{winner.name.charAt(0)}</div>
                        <div className="flex-1"><div className="text-white text-sm font-medium">{winner.name}</div><div className="text-gray-400 text-xs">{winner.location}</div></div>
                        <div className="text-green-400 font-bold text-sm">{winner.amount}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            { activeSection === 'tickets' && (`;

content = content.replace(
  '{ activeSection === \'tickets\' && (',
  overviewContent
);

fs.writeFileSync(path, content, 'utf8');
console.log('Done');
