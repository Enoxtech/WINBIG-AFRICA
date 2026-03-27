      setStats({
        ...(s || {}),
        totalUsers: s?.total_users ?? 0,
        totalCampaigns: s?.total_campaigns ?? 0,
        activeCampaigns: Array.isArray(c) ? c.filter((x: any) => x.status === 'active').length : 0,
        totalTickets: s?.total_tickets ?? 0,
        totalRevenue: s?.total_revenue ?? 0,
        totalWinners: Array.isArray(c) ? c.filter((x: any) => x.status === 'completed' && x.winner_id).length : 0,
        conversionRate: s?.conversion_rate ?? 0,
      } as DashboardStats);
    }, [u, c, s]);

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar
            tab={tab}
            setTab={setTab}
            isLoading={statsLoading || campaignsLoading || usersLoading}
            unreadNotifications={unreadNotifications}
            setUnreadNotifications={setUnreadNotifications}
            toggleNotifications={toggleNotifications}
          />
          <div className="flex-1 overflow-hidden">
            {/* --------------------------------------- TABS --------------------------------------- */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
              {[
                { key: 'overview', label: '?? Overview' },
                { key: 'campaigns', label: '?? Campaigns' },
                { key: 'winners', label: '?? Winners' },
                { key: 'users', label: '?? Users' },
                { key: 'create', label: '+ New Campaign' },
                { key: 'settings', label: '?? Settings' },
                { key: 'payments', label: '?? Payments' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                    tab === t.key
                      ? 'bg-deep-blue text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* --------------------------------------- OVERVIEW --------------------------------------- */}
            {tab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="px-5 py-4">
                  <div className="grid gap-4">
                    <StatsCard
                      title="Total Users"
                      value={stats.totalUsers}
                      icon={<UserIcon className="h-5 w-5" />}
                      color="text-blue-500"
                      trend={"+12% this week"}
                      trendPositive={true}
                    />
                    <StatsCard
                      title="Active Campaigns"
                      value={stats.activeCampaigns}
                      icon={<TrophyIcon className="h-5 w-5" />}
                      color="text-green-500"
                      trend={"+3 new this week"}
                      trendPositive={true}
                    />
                    <StatsCard
                      title="Total Tickets Sold"
                      value={stats.totalTickets}
                      icon={<TicketIcon className="h-5 w-5" />}
                      color="text-purple-500"
                      trend={"+8% today"}
                      trendPositive={true}
                    />
                    <StatsCard
                      title="Total Revenue"
                      value={formatCurrency(stats.totalRevenue)}
                      icon={<TrendingUpIcon className="h-5 w-5" />}
                      color="text-emerald-500"
                      trend={"+15% this month"}
                      trendPositive={true}
                    />
                    <StatsCard
                      title="Total Winners"
                      value={stats.totalWinners}
                      icon={<StarIcon className="h-5 w-5" />}
                      color="text-amber-500"
                      trend={"+5 this week"}
                      trendPositive={true}
                    />
                    <StatsCard
                      title="Conversion Rate"
                      value={stats.conversionRate.toFixed(1) + '%'}
                      icon={<ChartPieIcon className="h-5 w-5" />}
                      color="text-indigo-500"
                      trend={"+2.3%"}
                      trendPositive={true}
                    />
                  </div>

                  <div className="mt-6">
                    <h2 className="font-bold text-xl text-deep-blue mb-4">
                      Quick Actions
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={loadData}
                        disabled={statsLoading || campaignsLoading || usersLoading}
                        className="btn-primary w-full py-4"
                      >
                        {statsLoading || campaignsLoading || usersLoading ? (
                          <>
                            <Loader className="h-4 w-4 mr-2" />
                            Refreshing...
                          </>
                        ) : (
                          'Refresh All Stats'
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setTab('create');
                          setEditForm(defaultFormState);
                        }}
                        className="btn-secondary w-full py-4"
                      >
                        + Create New Campaign
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --------------------------------------- CAMPAIGNS --------------------------------------- */}
            {tab === 'campaigns' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="px-5 py-4">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-xl text-deep-blue">
                      Active Campaigns
                    </h2>
                    <button
                      onClick={() => {
                        setTab('create');
                        setEditForm(defaultFormState);
                      }}
                      className="btn-secondary px-4 py-2"
                    >
                      + New Campaign
                    </button>
                  </div>

                  <div className="space-y-4">
                    {campaigns.length > 0 ? (
                      campaigns.map((campaign: any) => (
                        <CampaignCard
                          key={campaign.id}
                          campaign={campaign}
                          onEdit={(c: any) => {
                            setSelectedCampaign(c);
                            setEditForm({
                              name: c.name || '',
                              description: c.description || '',
                              ticket_price: c.ticket_price ? Number(c.ticket_price) : 0,
                              total_tickets: c.total_tickets || 0,
                              end_date: c.end_date ? new Date(c.end_date) : null,
                              category: c.category || 'general',
                              is_active: c.status === 'active' ? true : false,
                            });
                            setTab('create');
                          }}
                          onDraw={(c: any) => {
                            setSelectedCampaign(c);
                            setTab('create');
                          }}
                          onDelete={async (id: string) => {
                            setIsDeleting(true);
                            try {
                              await deleteCampaign(id);
                              setMsg('? Campaign deleted successfully!');
                              setTimeout(() => setMsg(''), 3000);
                              await loadData();
                            } catch (error: any) {
                              setMsg('? Failed to delete campaign');
                              setTimeout(() => setMsg(''), 3000);
                            } finally {
                              setIsDeleting(false);
                            }
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          No campaigns found. Create your first campaign!
                        </p>
                        <button
                          onClick={() => {
                            setTab('create');
                            setEditForm(defaultFormState);
                          }}
                          className="btn-primary mt-4"
                        >
                          Create Campaign
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* --------------------------------------- WINNERS --------------------------------------- */}
            {tab === 'winners' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="px-5 py-4">
                  <h2 className="font-bold text-xl text-deep-blue mb-4">
                    Recent Winners
                  </h2>
                  <div className="space-y-4">
                    {winners.length > 0 ? (
                      winners.map((winner: any) => (
                        <WinnerCard
                          key={winner.id}
                          winner={winner}
                          campaignName={winner.campaign?.name || 'Unknown Campaign'}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">
                          No winners yet. Winners will appear here after draws.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* --------------------------------------- USERS --------------------------------------- */}
            {tab === 'users' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="px-5 py-4">
                  <h2 className="font-bold text-xl text-deep-blue mb-4">
                    User Management
                  </h2>
                  <div className="overflow-x-auto">
                    <div className="p-4">
                      {users.length > 0 ? (
                        <div className="space-y-4">
                          {users.map((user: any) => (
                            <UserCard
                              key={user.id}
                              user={user}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500">
                            No users found.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --------------------------------------- CREATE CAMPAIGN --------------------------------------- */}
            {tab === 'create' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="px-5 py-4">
                  <div className="space-y-4">
                    <form onSubmit={handleCreate} className="space-y-4">
                      <div>
                        <h3 className="font-bold text-xl text-deep-blue">
                          Create New Campaign
                        </h3>
                        <p className="text-sm text-gray-400 mt-0.5">
                          Fill in the details below to create a new campaign
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Campaign Name
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="input w-full"
                            placeholder="Enter campaign name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Description
                          </label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({ ...editForm, description: e.target.value })
                            }
                            className="input w-full"
                            rows="3"
                            placeholder="Describe your campaign..."
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Ticket Price (?)
                          </label>
                          <div className="flex items-center">
                            <span className="text-deep-blue">?</span>
                            <input
                              type="number"
                              value={editForm.ticket_price}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  ticket_price: e.target.value
                                    ? Number(e.target.value)
                                    : 0,
                                })
                              }
                              className="input w-full"
                              min="0"
                              step="100"
                              placeholder="Enter ticket price"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Total Tickets
                          </label>
                          <input
                            type="number"
                            value={editForm.total_tickets}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                total_tickets: Number(e.target.value),
                              })
                            }
                            className="input w-full"
                            min="1"
                            placeholder="Enter total tickets"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Category
                          </label>
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
                            className="input w-full"
                          >
                            <option value="general">General</option>
                            <option value="sports">Sports</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="technology">Technology</option>
                            <option value="health">Health</option>
                            <option value="education">Education</option>
                            <option value="charity">Charity</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={editForm.end_date
                              ? editForm.end_date.toISOString().split('T')[0]
                              : ''}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                end_date: e.target.value
                                  ? new Date(e.target.value)
                                  : null,
                              })
                            }
                            className="input w-full"
                          />
                        </div>

                        <div className="flex items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editForm.is_active}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  is_active: e.target.checked,
                                })
                              }
                              className="form-checkbox h-4 w-4 text-deep-blue"
                            />
                            <span className="ml-2 text-sm">
                              Active Campaign
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setTab('campaigns');
                            setEditForm(defaultFormState);
                          }}
                          className="btn-outline px-6 py-3"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isCreating}
                          className="btn-primary px-6 py-3 ml-2"
                        >
                          {isCreating ? (
                            <>
                              <Loader className="h-4 w-4 mr-2" />
                              Creating...
                            </>
                          ) : (
                            'Create Campaign'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --------------------------------------- SETTINGS --------------------------------------- */}
            {tab === 'settings' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="px-5 py-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100">
                      <h3 className="font-bold text-deep-blue">
                        Platform Settings
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5">
                        Configure core platform parameters
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="p-4">
                        <form onSubmit={handleSaveSettings} className="space-y-6">
                          <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Site Name
                              </label>
                              <input
                                type="text"
                                value={settings.siteName}
                                onChange={(e) =>
                                  setSettings({ ...settings, siteName: e.target.value })
                                }
                                className="input w-full"
                                placeholder="e.g., WinBig Africa"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Contact Email
                              </label>
                              <input
                                type="email"
                                value={settings.contactEmail}
                                onChange={(e) =>
                                  setSettings({ ...settings, contactEmail: e.target.value })
                                }
                                className="input w-full"
                                placeholder="e.g., support@winbigafrica.com"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Minimum Withdrawal (?)
                              </label>
                              <div className="flex items-center">
                                <span className="text-deep-blue">?</span>
                                <input
                                  type="number"
                                  value={settings.minWithdrawal}
                                  onChange={(e) =>
                                    setSettings({
                                      ...settings,
                                      minWithdrawal: Number(e.target.value),
                                    })
                                  }
                                  className="input w-full"
                                  min="0"
                                  step="100"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Referral Bonus (?)
                              </label>
                              <div className="flex items-center">
                                <span className="text-deep-blue">?</span>
                                <input
                                  type="number"
                                  value={settings.referralBonus}
                                  onChange={(e) =>
                                    setSettings({
                                      ...settings,
                                      referralBonus: Number(e.target.value),
                                    })
                                  }
                                  className="input w-full"
                                  min="0"
                                  step="100"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Platform Fee (%)
                              </label>
                              <div className="flex items-center">
                                <span className="text-deep-blue">%</span>
                                <input
                                  type="number"
                                  value={settings.platformFee}
                                  onChange={(e) =>
                                    setSettings({
                                      ...settings,
                                      platformFee: Number(e.target.value),
                                    })
                                  }
                                  className="input w-full"
                                  min="0"
                                  max="100"
                                  step="0.1"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Weekly Draw Day
                              </label>
                              <select
                                value={settings.weeklyDrawDay}
                                onChange={(e) =>
                                  setSettings({
                                    ...settings,
                                    weeklyDrawDay: e.target.value,
                                  })
                                }
                                className="input w-full"
                              >
                                <option value="monday">Monday</option>
                                <option value="tuesday">Tuesday</option>
                                <option value="wednesday">Wednesday</option>
                                <option value="thursday">Thursday</option>
                                <option value="friday">Friday</option>
                                <option value="saturday">Saturday</option>
                                <option value="sunday">Sunday</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Weekly Draw Time
                              </label>
                              <input
                                type="time"
                                value={settings.weeklyDrawTime}
                                onChange={(e) =>
                                  setSettings({
                                    ...settings,
                                    weeklyDrawTime: e.target.value,
                                  })
                                }
                                className="input w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Urgency Banner
                              </label>
                              <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.urgencyBannerActive}
                                    onChange={(e) =>
                                      setSettings({
                                        ...settings,
                                        urgencyBannerActive: e.target.checked,
                                      })
                                    }
                                    className="form-checkbox h-4 w-4 text-deep-blue"
                                  />
                                  <span className="ml-2 text-sm">
                                    Enable urgency banner
                                  </span>
                                </label>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Urgency Banner End Date
                              </label>
                              <input
                                type="date"
                                value={settings.urgencyBannerEndDate
                                  ? settings.urgencyBannerEndDate.toISOString().split('T')[0]
                                  : ''}
                                onChange={(e) =>
                                  setSettings({
                                    ...settings,
                                    urgencyBannerEndDate: e.target.value
                                      ? new Date(e.target.value)
                                      : null,
                                  })
                                }
                                className="input w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Registrations Open
                              </label>
                              <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={settings.registrationsOpen}
                                    onChange={(e) =>
                                      setSettings({
                                        ...settings,
                                        registrationsOpen: e.target.checked,
                                      })
                                    }
                                    className="form-checkbox h-4 w-4 text-deep-blue"
                                  />
                                  <span className="ml-2 text-sm">
                                    Allow new user registrations
                                  </span>
                                </label>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Minimum Ticket Price (?)
                              </label>
                              <div className="flex items-center">
                                <span className="text-deep-blue">?</span>
                                <input
                                  type="number"
                                  value={settings.minTicketPrice}
                                  onChange={(e) =>
                                    setSettings({
                                      ...settings,
                                      minTicketPrice: Number(e.target.value),
                                    })
                                  }
                                  className="input w-full"
                                  min="0"
                                  step="100"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Max Tickets Per User
                              </label>
                              <input
                                type="number"
                                value={settings.maxTicketPerUser}
                                onChange={(e) =>
                                  setSettings({
                                    ...settings,
                                    maxTicketPerUser: Number(e.target.value),
                                  })
                                }
                                className="input w-full"
                                min="1"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-4">
                            <button
                              type="button"
                              onClick={() => {
                                setSettings(defaultSettings);
                              }}
                              className="btn-outline px-6 py-3"
                            >
                              Reset to Defaults
                            </button>
                            <button
                              type="submit"
                              disabled={isSaving}
                              className="btn-primary px-6 py-3 ml-2"
                            >
                              {isSaving ? (
                                <>
                                  <Loader className="h-4 w-4 mr-2" />
                                  Saving...
                                </>
                              ) : (
                                'Save Settings'
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* --------------------------------------- PAYMENTS --------------------------------------- */}
            {tab === 'payments' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-deep-blue">Payment Management</h3>
                    <p className="text-sm text-gray-400 mt-0.5">View and manage payment transactions</p>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="p-4">
                      <p className="text-gray-500">Payment management interface coming soon...</p>
                      <div className="mt-6">
                        <button 
                          onClick={() => {
                            // TODO: Implement payment fetch and display
                            setMsg('? Payment data loaded!');
                            setTimeout(() => setMsg(''), 3000);
                          }}
                          className="btn-primary px-6 py-3"
                        >
                          Load Payment Transactions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <NotificationPanel
          notifications={notifications}
          setNotifications={setNotifications}
          toggleNotifications={toggleNotifications}
        />
        <MsgBar msg={msg} setMsg={setMsg} />
      </div>
    );
  };

export default AdminPage;