import React from 'react';

const Card = ({ title, amount, icon: Icon, type, subtext, className = "" }) => {
    const getColor = () => {
        if (type === 'income') return 'text-emerald-600 bg-emerald-50 border-emerald-200';
        if (type === 'expense') return 'text-rose-600 bg-rose-50 border-rose-200';
        if (type === 'neutral') return 'text-blue-600 bg-blue-50 border-blue-200';
        if (type === 'tithe') return 'text-purple-600 bg-purple-50 border-purple-200';
        if (type === 'cash') return 'text-amber-600 bg-amber-50 border-amber-200';
        if (type === 'bank') return 'text-indigo-600 bg-indigo-50 border-indigo-200';
        if (type === 'mobile') return 'text-cyan-600 bg-cyan-50 border-cyan-200';
        return 'text-gray-600 bg-gray-50 border-gray-200';
    };

    const colorClasses = getColor();
    const borderClass = colorClasses.split(' ').find(c => c.startsWith('border-'));
    const bgClass = colorClasses.split(' ').find(c => c.startsWith('bg-'));
    const textClass = colorClasses.split(' ').find(c => c.startsWith('text-'));

    return (
        <div className={`p-6 rounded-2xl border ${borderClass} shadow-sm bg-white transition-all hover:shadow-md ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
                <div className={`p-2.5 rounded-xl ${bgClass} ${textClass}`}>
                    <Icon size={22} className={textClass} />
                </div>
            </div>
            <div className={`text-2xl font-bold ${type === 'expense' ? 'text-gray-900' : 'text-gray-900'}`}>
                {amount.toLocaleString('en-US', { style: 'currency', currency: 'UGX' })}
            </div>
            {subtext && <p className="text-xs text-gray-500 mt-2 font-medium">{subtext}</p>}
        </div>
    );
};

export default Card;
