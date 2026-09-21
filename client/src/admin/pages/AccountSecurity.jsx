import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, CheckCircle2, AlertCircle, Key } from 'lucide-react';

export default function AccountSecurity() {
  const { user, changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { success: boolean, message: string }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (newPassword.length < 8) {
      setFeedback({ success: false, message: 'New password must be at least 8 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ success: false, message: 'New password and confirmation do not match.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setFeedback({ success: true, message: 'Password updated successfully.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setFeedback({ success: false, message: res.message || 'Failed to update password.' });
      }
    } catch (err) {
      setFeedback({ success: false, message: 'Network error updating password.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Account Security &amp; Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Update the administrator master password used to authenticate into the House of Engineers Admin Console.
        </p>
      </div>

      {feedback && (
        <div className={`p-4 rounded-lg border text-xs flex items-start gap-2.5 ${
          feedback.success
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {feedback.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Account Info Box */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Current Admin Profile
        </span>
        <div className="text-sm font-bold text-slate-800">{user?.name || 'Administrator'}</div>
        <div className="text-xs font-mono text-slate-500">{user?.email}</div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
          <Key className="w-4 h-4 text-brand-orange" />
          <span>Change Master Password</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Password (Min 8 characters)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-blue font-mono"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-accent text-xs py-2 px-6 shadow-sm"
            >
              {isSubmitting ? 'Updating Password...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
