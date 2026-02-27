import React from 'react';
import { Filter, Briefcase, CreditCard, Truck, Home, Droplet, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

const TransactionList = ({ transactions, onDelete }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                        <Filter size={20} />
                    </div>
                    Recent History
                </h2>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                        {transactions.length} Records
                    </span>
                </div>
            </div>

            <div className="min-h-[400px]">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-12 text-center text-gray-400 space-y-4 pt-24">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                            <TrendingUp size={32} />
                        </div>
                        <p className="font-medium text-gray-500">No records yet. Add your first income or expense!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {transactions.map((t) => (
                            <div key={t.id} className="p-5 hover:bg-gray-50/80 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${t.type === 'income' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                                        }`}>
                                        {t.category === 'Web Design' && <Briefcase size={22} strokeWidth={2.5} />}
                                        {t.category === 'Hosting' && <CreditCard size={22} strokeWidth={2.5} />}
                                        {t.category === 'Transport' && <Truck size={22} strokeWidth={2.5} />}
                                        {t.category === 'Home/Family' && <Home size={22} strokeWidth={2.5} />}
                                        {t.category === 'Water Bill' && <Droplet size={22} strokeWidth={2.5} />}
                                        {!['Web Design', 'Hosting', 'Transport', 'Home/Family', 'Water Bill'].includes(t.category) && (
                                            t.type === 'income' ? <TrendingUp size={22} strokeWidth={2.5} /> : <TrendingDown size={22} strokeWidth={2.5} />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-base">{t.category}</p>
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-medium">
                                            <span>{t.date}</span>
                                            <span className="text-gray-300">•</span>
                                            <span className="bg-gray-100 px-2 py-0.5 rounded-md text-gray-600 text-xs">{t.method}</span>
                                            {t.note && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <span className="italic text-gray-400 line-clamp-1 max-w-[200px]">{t.note}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`font-mono font-bold text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {t.type === 'income' ? '+' : '-'} {Number(t.amount).toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
                                    </span>
                                    <button
                                        onClick={() => onDelete(t.id)}
                                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        title="Delete transaction"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionList;
