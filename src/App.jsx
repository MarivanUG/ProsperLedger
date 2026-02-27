import React, { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp, getDoc, setDoc } from 'firebase/firestore';
import { Wallet, TrendingUp, TrendingDown, PieChart, Smartphone, CreditCard, Banknote, LogOut, Settings as SettingsIcon, Calendar } from 'lucide-react';
import { db } from './firebase';

import Card from './components/Card';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Login from './components/Login';
import Settings from './components/Settings';
import DebtorsCreditors from './components/DebtorsCreditors';
import QuickActions from './components/QuickActions';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auth & Settings State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminConfig, setAdminConfig] = useState({ username: 'admin', password: 'password123' });
  const [showSettings, setShowSettings] = useState(false);

  // Filtering State
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'daily', 'weekly', 'monthly', 'yearly'

  // Quick Action Autofill State
  const [quickFillData, setQuickFillData] = useState(null);

  // Fetch config and transactions
  useEffect(() => {
    // Fetch Admin Config
    const fetchConfig = async () => {
      try {
        const configRef = doc(db, 'config', 'admin');
        const configSnap = await getDoc(configRef);
        if (configSnap.exists()) {
          setAdminConfig(configSnap.data());
        } else {
          // Initialize default in Firestore
          const defaultConfig = { username: 'admin', password: 'password123' };
          await setDoc(configRef, defaultConfig);
          setAdminConfig(defaultConfig);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();

    // Fetch Transactions
    const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (username, password) => {
    if (username === adminConfig.username && password === adminConfig.password) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSaveSettings = async (configData) => {
    try {
      const configRef = doc(db, 'config', 'admin');
      const newConfig = {
        ...adminConfig,
        username: configData.username,
        password: configData.password || adminConfig.password,
        seedCash: configData.seedCash || 0,
        seedBank: configData.seedBank || 0,
        seedMobile: configData.seedMobile || 0
      };
      await setDoc(configRef, newConfig);
      setAdminConfig(newConfig);
    } catch (error) {
      console.error("Error updating config:", error);
      throw error;
    }
  };

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    if (timeFilter === 'all') return transactions;

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

    return transactions.filter(t => {
      if (!t.date) return false;
      const tDate = new Date(t.date).getTime();

      if (timeFilter === 'daily') return tDate >= startOfDay;
      if (timeFilter === 'weekly') return tDate >= startOfWeek;
      if (timeFilter === 'monthly') return tDate >= startOfMonth;
      if (timeFilter === 'yearly') return tDate >= startOfYear;

      return true;
    });
  }, [transactions, timeFilter]);

  // Derived State (Calculations)
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;

    let cashIncome = 0, cashExpense = 0;
    let bankIncome = 0, bankExpense = 0;
    let mobileIncome = 0, mobileExpense = 0;

    filteredTransactions.forEach(t => {
      const amount = Number(t.amount);
      if (t.type === 'income') {
        income += amount;
        if (t.method === 'Cash') cashIncome += amount;
        if (t.method === 'Bank') bankIncome += amount;
        if (t.method === 'Mobile Money') mobileIncome += amount;
      } else {
        expenses += amount;
        if (t.method === 'Cash') cashExpense += amount;
        if (t.method === 'Bank') bankExpense += amount;
        if (t.method === 'Mobile Money') mobileExpense += amount;
      }
    });

    const seedCash = adminConfig.seedCash || 0;
    const seedBank = adminConfig.seedBank || 0;
    const seedMobile = adminConfig.seedMobile || 0;

    const cashBalance = seedCash + cashIncome - cashExpense;
    const bankBalance = seedBank + bankIncome - bankExpense;
    const mobileBalance = seedMobile + mobileIncome - mobileExpense;

    // Only total balance considers the seeds as well.
    const balance = cashBalance + bankBalance + mobileBalance;
    const tithe = Math.max(0, balance) * 0.10;

    return {
      income,
      expenses,
      balance,
      tithe,
      cash: cashBalance,
      bank: bankBalance,
      mobile: mobileBalance
    };
  }, [filteredTransactions, adminConfig]);

  // Handlers
  const handleAddTransaction = async (formData) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...formData,
        createdAt: serverTimestamp() // Better ordering
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save transaction.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteDoc(doc(db, 'transactions', id));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-white p-4 rounded-full shadow-lg border border-teal-50">
            <Wallet size={48} className="text-teal-600 animate-pulse" />
          </div>
        </div>
        <p className="text-teal-900 font-semibold tracking-wide">Loading ProsperLedger...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-gray-800 font-sans selection:bg-teal-100 selection:text-teal-900 pb-12">
      {showSettings && (
        <Settings
          currentUsername={adminConfig.username}
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
        />
      )}

      {/* Navbar */}
      <nav className="bg-white p-4 border-b border-gray-200 sticky top-0 z-30 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-1 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-teal-50 to-emerald-100 rounded-xl shadow-inner group-hover:scale-105 transition-transform">
              <Wallet className="text-teal-700" size={24} />
            </div>
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
              Prosper<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Ledger</span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 sm:px-4 sm:py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm"
            >
              <SettingsIcon size={20} />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 sm:px-4 sm:py-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10">

        {/* Time Filter Banner */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 px-3 shrink-0 text-gray-500 font-medium">
            <Calendar size={20} />
            <span>Overview:</span>
          </div>
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'daily', 'weekly', 'monthly', 'yearly'].map(filter => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${timeFilter === filter
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {filter === 'all' ? 'All Time' : `This ${filter.replace('ly', '')}`}
              </button>
            ))}
          </div>
        </div>

        {/* Main Overview Dashboard */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 px-1 tracking-tight">Financial Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card title="Total Income" amount={stats.income} icon={TrendingUp} type="income" />
            <Card title="Total Expenses" amount={stats.expenses} icon={TrendingDown} type="expense" />
            <Card
              title="Net Balance"
              amount={stats.balance}
              icon={Wallet}
              type="neutral"
              subtext={stats.balance < 0 ? "You are running a deficit" : "Total Cash Available"}
              className="sm:col-span-2 lg:col-span-1"
            />
            <Card
              title="Tithe (10% of Net)"
              amount={stats.tithe}
              icon={PieChart}
              type="tithe"
              subtext="Calculated after expenses"
            />
          </div>
        </section>

        {/* Specific Accounts Dashboard */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-5 px-1 tracking-tight">Account Balances</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Card title="Mobile Money" amount={stats.mobile} icon={Smartphone} type="mobile" />
            <Card title="Bank Account" amount={stats.bank} icon={CreditCard} type="bank" />
            <Card title="Cash at Hand" amount={stats.cash} icon={Banknote} type="cash" />
          </div>
        </section>

        {/* Debtors & Creditors Dashboard */}
        <section className="animate-in fade-in slide-in-from-bottom-7 duration-800">
          <DebtorsCreditors />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Input Form */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px] transition-all">
            <QuickActions onActionClick={(data) => setQuickFillData({ ...data, _t: Date.now() })} />
            <TransactionForm onAddTransaction={handleAddTransaction} initialData={quickFillData} />
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-8">
            <TransactionList transactions={filteredTransactions} onDelete={handleDelete} />
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
