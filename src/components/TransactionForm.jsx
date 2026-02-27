import React, { useState } from 'react';
import { Smartphone, Banknote, CreditCard, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const incomeCategories = ['Web Design', 'Hosting', 'Product Sales', 'Tips/Gifts', 'Other Income'];
const expenseCategories = ['Transport', 'Home/Family', 'Water Bill', 'Electricity', 'Data/Internet', 'Business Expense', 'Other Expense'];

const TransactionForm = ({ onAddTransaction }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        type: 'income',
        category: 'Web Design',
        amount: '',
        method: 'Mobile Money',
        note: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            type,
            category: type === 'income' ? incomeCategories[0] : expenseCategories[0]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) return;

        onAddTransaction({
            ...formData,
            amount: Number(formData.amount)
        });

        // Reset form but keep date
        setFormData(prev => ({
            ...prev,
            amount: '',
            note: ''
        }));
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 xl:sticky xl:top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
                    <Plus size={20} />
                </div>
                New Entry
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => handleTypeChange('income')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${formData.type === 'income' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shadow-sm' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <ArrowUpCircle size={18} />
                        Income
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeChange('expense')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${formData.type === 'expense' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 shadow-sm' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                        <ArrowDownCircle size={18} />
                        Expense
                    </button>
                </div>

                {/* Amount */}
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Amount (UGX)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Shs</span>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition font-semibold text-lg"
                            required
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none appearance-none font-medium text-gray-700 cursor-pointer"
                    >
                        {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Payment Method */}
                <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Payment Method</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['Mobile Money', 'Cash', 'Bank'].map(method => (
                            <button
                                key={method}
                                type="button"
                                onClick={() => setFormData({ ...formData, method })}
                                className={`px-2 py-3 text-sm font-medium border rounded-xl transition-all flex flex-col items-center gap-2 ${formData.method === method
                                        ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm'
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                            >
                                {method === 'Mobile Money' && <Smartphone size={18} />}
                                {method === 'Cash' && <Banknote size={18} />}
                                {method === 'Bank' && <CreditCard size={18} />}
                                {method}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Date & Note */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
                        <input
                            type="text"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            placeholder="Optional note"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${formData.type === 'income' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                            }`}
                    >
                        <Plus size={20} />
                        Add {formData.type === 'income' ? 'Income' : 'Expense'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransactionForm;
