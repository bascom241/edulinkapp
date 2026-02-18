import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useWalletStore } from '../store/useWalletStore';
import dayjs from "dayjs";
import {
  User, Edit3, Save, X, Camera, BookOpen, Link as LinkIcon,
  CreditCard, Mail, Phone, UserCheck, DollarSign, Download,
  Calendar, Shield, Globe, Bell, Zap, ChevronRight, CheckCircle,
  FileText, Settings, Wallet, Clock
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart, Line
} from 'recharts';


type Bank = {
  dbId: number;
  providerBankId: string | null;
  name: string;
  code: string;
  slug: string;
  country: string;
  currency: string;
  active: boolean;
};


const Profile = () => {
  const { fetchUserWallet, userWallet } = useWalletStore();
  const { user, editProfile, editBankDetails} = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    teachingSubjects: user?.teachingSubjects || [],
    teachingLevel: user?.teachingLevel || '',
    shortBio: user?.shortBio || '',
    yearsOfExperience: user?.yearsOfExperience || 0,
    socialLink: user?.socialLink || '',
    bankAccount: user?.bankAccount || '',
    bankName: user?.bankName || ''
  });
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBankSlug, setSelectedBankSlug] = useState<string>('');



  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserWallet(user.userId);
    }
  }, [user, fetchUserWallet]);

  useEffect(() => {
    fetch('http://localhost:8080/api/banks')
      .then(res => res.json())
      .then(data => setBanks(data))
      .catch(err => console.error(err));
  }, []);

  const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'bankSlug') {
      const bank = banks.find(b => b.slug === value);

      setFormData(prev => ({
        ...prev,
        bankName: bank?.name || '',
      }));

      setSelectedBankSlug(value);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Process monthly earnings data
  const monthlyEarningsData = React.useMemo(() => {
    const transactions = userWallet?.transactions ?? [];
    if (!transactions.length) return [];

    return transactions.reduce((acc: any[], order: any) => {
      const createdAt = order.createdAt || order.date || order.created_at;
      const month = dayjs(createdAt).format("MMM");
      const amount = Number(order.amount ?? 0);
      const existing = acc.find(item => item.month === month);

      if (existing) {
        existing.earnings += amount;
        existing.classrooms += 1;
      } else {
        acc.push({
          month,
          earnings: amount,
          classrooms: 1,
        });
      }
      return acc;
    }, []);
  }, [userWallet?.transactions]);

  const subjectDistributionData = React.useMemo(() => {
    const transactions = userWallet?.transactions ?? [];
    if (!transactions.length) return [];

    const map: Record<string, number> = {};
    transactions.forEach((order: any) => {
      const name = order.classroomName ?? order.classroom ?? "Unknown";
      const amount = Number(order.amount ?? 0);
      map[name] = (map[name] || 0) + amount;
    });

    return Object.keys(map).map(name => ({ name, value: map[name] }));
  }, [userWallet?.transactions]);

  const recentTransactions = React.useMemo(() => {
    const txs = userWallet?.transactions ?? [];
    return txs
      .slice()
      .sort((a: any, b: any) =>
        new Date(b.createdAt || b.date || b.created_at).getTime() -
        new Date(a.createdAt || a.date || a.created_at).getTime()
      )
      .slice(0, 5)
      .map((t: any) => ({
        id: t.id,
        studentName: t.studentName ?? 'Student',
        date: dayjs(t.createdAt || t.date || t.created_at).format("DD MMM"),
        amount: Number(t.amount ?? 0),
        status: t.status ?? 'completed',
      }));
  }, [userWallet?.transactions]);

  const earningsData = {
    totalEarnings: userWallet?.totalEarnings ?? 0,
    amountWithdrawn: userWallet?.withdrawn ?? 0,
    availableBalance: userWallet?.balance ?? 0,
    totalSessions: userWallet?.transactions?.length ?? 0,
  };

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.teachingSubjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        teachingSubjects: [...prev.teachingSubjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      teachingSubjects: prev.teachingSubjects.filter(s => s !== subject)
    }));
  };

  const handleSave = () => {
    if (editProfile) {
      editProfile(formData);
    }

    setIsEditing(false);
  };

  const handleBankChanges = () => {
    const payload = {
      bankName: formData.bankName,
      bankAccount: formData.bankAccount,
      slug: selectedBankSlug,
    };

    if (editBankDetails) {
      editBankDetails(payload)
    }
    setIsEditing(false);
  }


  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-green-600 text-sm">₦{payload[0]?.value?.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
              <p className="text-gray-500 text-sm">Manage your account and earnings</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isEditing
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {isEditing ? (
                <>
                  <X size={16} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 size={16} />
                  Edit
                </>
              )}
            </button>
          </div>

          {/* Tab Navigation - Modern Style */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 w-fit">
            {['overview', 'earnings', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab === 'overview' && <User size={16} className="inline mr-2" />}
                {tab === 'earnings' && <Wallet size={16} className="inline mr-2" />}
                {tab === 'settings' && <Settings size={16} className="inline mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                      <User size={32} className="text-green-600" />
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm">
                        <Camera size={14} className="text-gray-600" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name"
                            className="flex-1 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name"
                            className="flex-1 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                        </div>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 text-gray-500"
                        />
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </h2>
                        <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                          <Mail size={14} />
                          {user?.email}
                        </p>
                        {user?.teacher && (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full mt-2">
                            <UserCheck size={12} />
                            Teacher
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FileText size={16} />
                    Bio
                  </h3>
                  {isEditing ? (
                    <textarea
                      name="shortBio"
                      value={formData.shortBio}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-600 text-sm">
                      {user?.shortBio || 'No biography added yet.'}
                    </p>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contact Info */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <Phone size={16} />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Phone</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        />
                      ) : (
                        <p className="text-gray-900 text-sm">{user?.phoneNumber || 'Not provided'}</p>
                      )}
                    </div>
                    {user?.teacher && (
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Experience</label>
                        {isEditing ? (
                          <input
                            type="number"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                        ) : (
                          <p className="text-gray-900 text-sm">{user?.yearsOfExperience || 0} years</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Teaching Info */}
                {user?.teacher && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <BookOpen size={16} />
                      Teaching Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Level</label>
                        {isEditing ? (
                          <select
                            name="teachingLevel"
                            value={formData.teachingLevel}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          >
                            <option value="HIGHSCHOOL">High School</option>
                            <option value="MIDDLESCHOOL">Middle School</option>
                            <option value="ELEMENTARY">Elementary</option>
                            <option value="COLLEGE">College</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 text-sm">{user?.teachingLevel}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Subjects */}
                {user?.teacher && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5 md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <BookOpen size={16} />
                      Teaching Subjects
                    </h3>
                    {isEditing ? (
                      <div>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="Add a subject"
                            className="flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          />
                          <button
                            onClick={handleAddSubject}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.teachingSubjects.map((subject, index) => (
                            <div
                              key={index}
                              className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2"
                            >
                              {subject}
                              <button
                                onClick={() => handleRemoveSubject(subject)}
                                className="text-green-700 hover:text-green-900"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {user.teachingSubjects.length > 0 ? (
                          user.teachingSubjects.map((subject, index) => (
                            <span
                              key={index}
                              className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm"
                            >
                              {subject}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No subjects added yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Social & Bank */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Social Links */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                        <Globe size={16} />
                        Social Links
                      </h3>
                      {isEditing ? (
                        <input
                          type="text"
                          name="socialLink"
                          value={formData.socialLink}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                          placeholder="https://..."
                        />
                      ) : (
                        <div>
                          {user?.socialLink ? (
                            <a
                              href={user.socialLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 text-sm flex items-center gap-2"
                            >
                              <LinkIcon size={14} />
                              Visit profile
                            </a>
                          ) : (
                            <p className="text-gray-500 text-sm">No social links added.</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bank Details */}

                    {user?.teacher && (
                      <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4">
                          <CreditCard size={16} />
                          Bank Details
                        </h3>

                        {isEditing? (
                          <div className="space-y-3">
                            <select
                              name="bankSlug"
                              value={selectedBankSlug}
                              onChange={handleInputChange2}
                              className="w-full bg-gray-50 rounded-lg px-3 py-2 border"
                            >
                              <option value="">Select Bank</option>
                              {banks.map(bank => (
                                <option key={bank.slug} value={bank.slug}>
                                  {bank.name}
                                </option>
                              ))}
                            </select>

                            <input
                              type="text"
                              name="bankAccount"
                              value={formData.bankAccount}
                              onChange={handleInputChange}
                              placeholder="Account number"
                              className="w-full bg-gray-50 rounded-lg px-3 py-2 border"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1 text-sm">
                            <p>{user?.bankName || 'Not provided'}</p>
                            <p>{user?.bankAccount || 'Not provided'}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {isEditing&& (
                      <div className="mt-6">
                        <button
                          onClick={handleBankChanges}
                          className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Save size={16} />
                          Save Bank Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Recent Activity */}
            <div className="space-y-6">
              {/* Stats Card */}
              {user?.teacher && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Earnings Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500">Available Balance</p>
                      <p className="text-xl font-semibold text-gray-900">
                        ₦{earningsData.availableBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Total Earnings</p>
                        <p className="text-sm font-medium text-gray-900">
                          ₦{earningsData.totalEarnings.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Sessions</p>
                        <p className="text-sm font-medium text-gray-900">
                          {earningsData.totalSessions}
                        </p>
                      </div>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                      Withdraw Funds
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Recent Activity</h3>
                  <button className="text-green-600 text-xs font-medium">View all</button>
                </div>
                <div className="space-y-3">
                  {recentTransactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded ${transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          <CheckCircle size={14} className={transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.studentName}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₦{transaction.amount.toLocaleString()}</p>
                        <p className={`text-xs ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && user?.teacher && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Earnings', value: earningsData.totalEarnings, icon: Wallet, color: 'green' },
                { label: 'Available Balance', value: earningsData.availableBalance, icon: DollarSign, color: 'blue' },
                { label: 'Withdrawn', value: earningsData.amountWithdrawn, icon: Download, color: 'yellow' },
                { label: 'Total Sessions', value: earningsData.totalSessions, icon: Calendar, color: 'purple' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {stat.label.includes('Earnings') || stat.label.includes('Balance') || stat.label.includes('Withdrawn')
                          ? `₦${stat.value.toLocaleString()}`
                          : stat.value}
                      </p>
                    </div>
                    <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                      <stat.icon size={20} className={`text-${stat.color}-600`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Earnings Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyEarningsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="earnings"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-4">Earnings Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={subjectDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {subjectDistributionData.map((_, index) => (
                         
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₦${Number(value).toLocaleString()}`, 'Amount']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                          {transaction.status === 'completed' ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <Clock size={16} className="text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{transaction.studentName}</p>
                          <p className="text-xs text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₦{transaction.amount.toLocaleString()}</p>
                        <p className={`text-xs ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-6">Account Settings</h3>
            <div className="space-y-3">
              {[
                { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
                { icon: Shield, label: 'Privacy & Security', description: 'Control your privacy settings' },
                { icon: Zap, label: 'Appearance', description: 'Customize the interface' },
                { icon: Globe, label: 'Language', description: 'Change app language' },
              ].map((setting, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <setting.icon size={18} className="text-gray-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{setting.label}</p>
                      <p className="text-xs text-gray-500">{setting.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Save Button (only visible when editing) */}
        {isEditing && (
          <div className="fixed bottom-6 right-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;