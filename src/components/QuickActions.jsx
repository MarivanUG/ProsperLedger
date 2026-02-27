import React from 'react';
import { Zap, Coffee, Bus, ShoppingCart, PlusCircle, CreditCard } from 'lucide-react';

const QuickActions = ({ onActionClick }) => {

    // Pre-defined template transactions
    const actions = [
        {
            label: "Morning Coffee",
            icon: Coffee,
            color: "text-amber-600",
            bg: "bg-amber-100",
            hover: "hover:bg-amber-50 group-hover:border-amber-200",
            template: {
                type: 'expense',
                amount: '5000',
                category: 'Food & Dining',
                method: 'Mobile Money',
                note: 'Morning Coffee'
            }
        },
        {
            label: "Transport (Taxi)",
            icon: Bus,
            color: "text-blue-600",
            bg: "bg-blue-100",
            hover: "hover:bg-blue-50 group-hover:border-blue-200",
            template: {
                type: 'expense',
                amount: '10000',
                category: 'Transportation',
                method: 'Cash',
                note: 'Taxi to Town'
            }
        },
        {
            label: "Groceries",
            icon: ShoppingCart,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
            hover: "hover:bg-emerald-50 group-hover:border-emerald-200",
            template: {
                type: 'expense',
                amount: '30000',
                category: 'Groceries',
                method: 'Mobile Money',
                note: 'Quick Grocery Run'
            }
        },
        {
            label: "Client Payment",
            icon: PlusCircle,
            color: "text-indigo-600",
            bg: "bg-indigo-100",
            hover: "hover:bg-indigo-50 group-hover:border-indigo-200",
            template: {
                type: 'income',
                amount: '100000',
                category: 'Salary / Wages',
                method: 'Bank',
                note: 'Client Payment'
            }
        },
        {
            label: "Withdraw Cash",
            icon: CreditCard,
            color: "text-purple-600",
            bg: "bg-purple-100",
            hover: "hover:bg-purple-50 group-hover:border-purple-200",
            template: {
                type: 'expense', // In a full double-entry system this is a transfer. Here we'll treat it contextually or leave as a template to modify.
                amount: '50000',
                category: 'Other',
                method: 'Bank',
                note: 'ATM Withdrawal (Update Cash manually)'
            }
        }
    ];

    const handleClick = (template) => {
        // We pass the template up to the parent to auto-fill the form, 
        // or execute it immediately if we wanted to (auto-fill is safer so the user can edit amount)
        onActionClick(template);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-5 duration-600">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                <Zap size={18} className="text-amber-500 fill-amber-500" />
                <h3 className="font-bold text-gray-800 text-sm tracking-tight">Quick Actions (Auto-fill Form)</h3>
            </div>
            <div className="p-4 overflow-x-auto">
                <div className="flex gap-3 min-w-max">
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => handleClick(action.template)}
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 bg-white shadow-sm transition-all active:scale-95 ${action.hover}`}
                            >
                                <div className={`p-2 rounded-lg ${action.bg} ${action.color}`}>
                                    <Icon size={18} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-gray-800">{action.label}</p>
                                    <p className="text-xs font-semibold text-gray-500">
                                        {Number(action.template.amount).toLocaleString('en-US')} UGX • {action.template.method}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuickActions;
