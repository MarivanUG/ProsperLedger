import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, UserPlus, ArrowRight, ArrowLeft, CheckCircle, Trash2 } from 'lucide-react';

const DebtorsCreditors = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'debtor', // 'debtor' (Owes me) or 'creditor' (I owe)
        name: '',
        amount: '',
        note: '',
        dueDate: ''
    });

    useEffect(() => {
        const q = query(collection(db, 'debts'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecords(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.amount) return;

        try {
            await addDoc(collection(db, 'debts'), {
                ...formData,
                amount: Number(formData.amount),
                isPaid: false,
                createdAt: serverTimestamp()
            });
            setShowForm(false);
            setFormData({ type: 'debtor', name: '', amount: '', note: '', dueDate: '' });
        } catch (error) {
            console.error("Error adding debt record:", error);
        }
    };

    const togglePaidStatus = async (id, currentStatus) => {
        try {
            await updateDoc(doc(db, 'debts', id), {
                isPaid: !currentStatus,
                paidAt: !currentStatus ? serverTimestamp() : null
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this record?')) {
            try {
                await deleteDoc(doc(db, 'debts', id));
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const debtors = records.filter(r => r.type === 'debtor');
    const creditors = records.filter(r => r.type === 'creditor');

    const totalOwedToMe = debtors.filter(r => !r.isPaid).reduce((acc, curr) => acc + curr.amount, 0);
    const totalIOwe = creditors.filter(r => !r.isPaid).reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Users size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Debt Tracking</h2>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-200"
                >
                    <UserPlus size={16} />
                    <span className="hidden sm:inline">{showForm ? 'Cancel' : 'New Record'}</span>
                </button>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
                <div className="p-4 bg-emerald-50/30">
                    <p className="text-sm font-semibold text-emerald-700 flex items-center gap-1"><ArrowRight size={14} /> Total Owed To Me</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{totalOwedToMe.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</p>
                </div>
                <div className="p-4 bg-rose-50/30">
                    <p className="text-sm font-semibold text-rose-700 flex items-center gap-1"><ArrowLeft size={14} /> Total I Owe</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{totalIOwe.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}</p>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div className="p-5 bg-gray-50 border-b border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                        <div className="flex gap-2 p-1 bg-white rounded-xl border border-gray-200 w-fit">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'debtor' })}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'debtor' ? 'bg-emerald-100 text-emerald-800' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                They owe me (Debtor)
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'creditor' })}
                                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${formData.type === 'creditor' ? 'bg-rose-100 text-rose-800' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                I owe them (Creditor)
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Amount (UGX)</label>
                                <input
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="0"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Due Date</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Note (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    placeholder="Reason for debt"
                                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                        <button type="submit" className="px-6 py-2 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors text-sm">
                            Save Record
                        </button>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
                {records.length === 0 && !loading ? (
                    <div className="p-8 text-center text-gray-400 text-sm font-medium">No debt records found.</div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {records.map(record => (
                            <div key={record.id} className={`p-4 flex items-center justify-between group transition-colors ${record.isPaid ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50/50'}`}>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => togglePaidStatus(record.id, record.isPaid)}
                                        className={`p-1 rounded-full border-2 transition-colors ${record.isPaid ? 'border-emerald-500 bg-emerald-50 text-emerald-500' : 'border-gray-300 text-transparent hover:border-gray-400'}`}
                                        title={record.isPaid ? "Mark as unpaid" : "Mark as paid"}
                                    >
                                        <CheckCircle size={20} />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${record.type === 'debtor' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                                {record.type === 'debtor' ? 'Owes Me' : 'I Owe'}
                                            </span>
                                            <span className={`font-bold text-gray-800 ${record.isPaid ? 'line-through text-gray-500' : ''}`}>{record.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                            {record.dueDate && <span className="text-amber-600 font-medium">Due: {record.dueDate}</span>}
                                            {record.dueDate && record.note && <span>•</span>}
                                            {record.note && <span>{record.note}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`font-mono font-bold ${record.type === 'debtor' ? 'text-emerald-600' : 'text-rose-600'} ${record.isPaid ? 'text-gray-400' : ''}`}>
                                        {record.amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
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

export default DebtorsCreditors;
