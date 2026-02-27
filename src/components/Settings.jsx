import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Save, Shield, Database } from 'lucide-react';

const Settings = ({ onClose, onSave, currentConfig }) => {
    const [username, setUsername] = useState(currentConfig?.username || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Seed Balances State
    const [seedCash, setSeedCash] = useState(currentConfig?.seedCash || 0);
    const [seedBank, setSeedBank] = useState(currentConfig?.seedBank || 0);
    const [seedMobile, setSeedMobile] = useState(currentConfig?.seedMobile || 0);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password && password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            await onSave({
                username,
                password,
                seedCash: Number(seedCash),
                seedBank: Number(seedBank),
                seedMobile: Number(seedMobile)
            });
            onClose();
        } catch (err) {
            setError('Failed to update config');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200 my-8">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                            <SettingsIcon size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-sm rounded-r-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Security Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                                <Shield size={16} className="text-indigo-500" /> Security
                            </h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium text-gray-800"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">New Password <span className="text-gray-400 font-normal">(optional)</span></label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium text-gray-800"
                                />
                            </div>

                            {password && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium text-gray-800"
                                        required={!!password}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Seed Balances Section */}
                        <div className="space-y-4 pt-2">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                                <Database size={16} className="text-emerald-500" /> Starting Balances
                            </h3>
                            <p className="text-xs text-gray-500">Set initial amounts to offset your calculated totals.</p>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Cash (UGX)</label>
                                    <input
                                        type="number"
                                        value={seedCash}
                                        onChange={(e) => setSeedCash(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium text-gray-800 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Bank (UGX)</label>
                                    <input
                                        type="number"
                                        value={seedBank}
                                        onChange={(e) => setSeedBank(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium text-gray-800 text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Mobile Money (UGX)</label>
                                    <input
                                        type="number"
                                        value={seedMobile}
                                        onChange={(e) => setSeedMobile(e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-medium text-gray-800 text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex gap-3 border-t mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 bg-gray-100 font-bold text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? 'Saving...' : (
                                    <>
                                        <Save size={18} />
                                        Save Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;

