import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  TrendingUp,
  Award,
  Wallet,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Gift,
  Eye,
  HandCoins
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EarningsModalProps {
  onClose: () => void;
}

export const EarningsModal: React.FC<EarningsModalProps> = ({ onClose }) => {
  const { t, language, currentUser, setCurrentUser } = useApp();

  const [upiId, setUpiId] = useState(currentUser?.upiId || '');
  const [withdrawAmount, setWithdrawAmount] = useState(
    currentUser?.pendingBalance ? Math.min(currentUser.pendingBalance, 1000) : 500
  );
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!currentUser) return null;

  // Eligibility requirements calculation
  const reqFollowers = 1000;
  const reqViews = 10000;
  const reqReels = 10;

  const currentFollowers = currentUser.followersCount || 0;
  const currentViews = currentUser.viewsCount || 0;
  const currentReels = currentUser.reelsCount || 0;
  const currentViolations = currentUser.violationsCount || 0;

  const passFollowers = currentFollowers >= reqFollowers;
  const passViews = currentViews >= reqViews;
  const passReels = currentReels >= reqReels;
  const passViolations = currentViolations === 0;

  const isEligible = passFollowers && passViews && passReels && passViolations;
  const isMonetized = currentUser.monetizationEnabled || isEligible;

  // Handle Withdraw
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upiId.trim() || !upiId.includes('@')) {
      setErrorMsg(language === 'hi' ? 'मान्य UPI ID दर्ज करें (उदा. name@okhdfcbank)' : 'Please enter a valid UPI ID (e.g. name@okhdfcbank)');
      return;
    }

    if ((currentUser.pendingBalance || 0) < withdrawAmount) {
      setErrorMsg(language === 'hi' ? 'निकासी योग्य राशि अपर्याप्त है' : 'Insufficient pending balance');
      return;
    }

    setWithdrawing(true);
    setErrorMsg(null);

    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawSuccess(true);
      confetti({ particleCount: 70, spread: 60 });

      // Deduct pending balance
      setCurrentUser({
        ...currentUser,
        upiId: upiId.trim(),
        pendingBalance: Math.max(0, (currentUser.pendingBalance || 0) - withdrawAmount)
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-lg bg-gradient-to-b from-purple-950 via-slate-900 to-black border-t sm:border border-purple-500/30 rounded-t-3xl sm:rounded-3xl p-6 text-white shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-purple-950/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-white">{t.myEarningsBtn}</h3>
              <p className="text-xs text-purple-300">@{currentUser.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Monetization Status Badge */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-purple-900/60 to-orange-950/60 border border-orange-500/30 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              {isMonetized ? <Award className="w-7 h-7 text-amber-300" /> : <Clock className="w-7 h-7 text-purple-300" />}
            </div>
            <div>
              <div className="text-xs text-purple-300 uppercase font-bold tracking-wider">
                {t.monetizationStatus}
              </div>
              <div className="text-base font-black text-white flex items-center gap-1.5">
                {isMonetized ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 fill-emerald-400 text-black" />
                    {t.activeMonetized}
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {t.pendingEligibility}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-purple-300 font-medium">दर (Rate)</div>
            <div className="text-xs font-black text-amber-300">10k Views = ₹100</div>
          </div>
        </div>

        {/* Eligibility Progress Tracker */}
        <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4">
          <h4 className="text-xs font-black text-orange-400 uppercase tracking-wider mb-3">
            {t.eligibilityCriteria}
          </h4>

          <div className="space-y-3 text-xs">
            {/* Followers */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-purple-200">👥 {t.critFollowers}</span>
                <span className={passFollowers ? 'text-emerald-400' : 'text-amber-300'}>
                  {currentFollowers.toLocaleString()} / 1,000 {passFollowers ? '✓' : ''}
                </span>
              </div>
              <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{ width: `${Math.min(100, (currentFollowers / reqFollowers) * 100)}%` }}
                />
              </div>
            </div>

            {/* Views */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-purple-200">👁️ {t.critViews}</span>
                <span className={passViews ? 'text-emerald-400' : 'text-amber-300'}>
                  {currentViews.toLocaleString()} / 10,000 {passViews ? '✓' : ''}
                </span>
              </div>
              <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{ width: `${Math.min(100, (currentViews / reqViews) * 100)}%` }}
                />
              </div>
            </div>

            {/* Reels */}
            <div>
              <div className="flex justify-between font-bold mb-1">
                <span className="text-purple-200">🎬 {t.critReels}</span>
                <span className={passReels ? 'text-emerald-400' : 'text-amber-300'}>
                  {currentReels} / 10 {passReels ? '✓' : ''}
                </span>
              </div>
              <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{ width: `${Math.min(100, (currentReels / reqReels) * 100)}%` }}
                />
              </div>
            </div>

            {/* Violations */}
            <div className="flex items-center justify-between font-bold pt-1 border-t border-white/5">
              <span className="text-purple-200">🛡️ {t.critViolations}</span>
              <span className={passViolations ? 'text-emerald-400' : 'text-rose-400'}>
                {passViolations
                  ? (language === 'hi' ? 'साफ रिकॉर्ड (0 स्ट्राइक) ✅' : '0 Strikes - Clean ✅')
                  : `${currentViolations} Violations ⚠️`}
              </span>
            </div>
          </div>
        </div>

        {/* Earning Cards */}
        <div className="grid grid-cols-3 gap-2.5 mt-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-purple-300 font-bold uppercase">{t.todayEarning}</span>
            <div className="text-xl font-black text-amber-300 mt-1">
              ₹{(currentUser.todayEarnings || 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-purple-300 font-bold uppercase">{t.lifetimeEarning}</span>
            <div className="text-xl font-black text-emerald-400 mt-1">
              ₹{(currentUser.totalEarnings || 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-b from-orange-950/50 to-purple-950/50 border border-orange-500/40 rounded-2xl p-3 text-center">
            <span className="text-[10px] text-orange-300 font-bold uppercase">{t.pendingPayout}</span>
            <div className="text-xl font-black text-white mt-1">
              ₹{(currentUser.pendingBalance || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Rates Explanation */}
        <div className="mt-4 p-3 bg-purple-900/30 border border-purple-500/20 rounded-xl space-y-1 text-xs text-purple-200">
          <div className="font-bold text-orange-400">{t.ratesHeading}</div>
          <div>{t.viewsEarningRate}</div>
          <div>{t.giftsEarningRate}</div>
          <div>{t.collabEarningRate}</div>
        </div>

        {/* UPI Withdrawal Form */}
        <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4">
          <h4 className="text-sm font-extrabold text-white mb-2 flex items-center gap-1.5">
            <HandCoins className="w-4 h-4 text-orange-400" />
            <span>{t.withdrawNow}</span>
          </h4>

          {withdrawSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-1" />
              <div className="text-sm font-bold text-white">{t.withdrawSuccess}</div>
              <div className="text-xs text-emerald-300 mt-1">UPI: {upiId}</div>
            </div>
          ) : (
            <form onSubmit={handleWithdraw} className="space-y-3">
              <div>
                <label className="block text-[11px] text-purple-300 font-bold mb-1">
                  UPI ID (Paytm / PhonePe / Google Pay)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder={t.enterUpiPlaceholder}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-purple-300/40 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-purple-300 font-bold mb-1">
                  {language === 'hi' ? 'निकासी राशि (Amount in ₹)' : 'Withdraw Amount (₹)'}
                </label>
                <div className="flex gap-2">
                  {[500, 1000, 2000, 5000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWithdrawAmount(amt)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        withdrawAmount === amt
                          ? 'border-orange-500 bg-orange-500/30 text-white'
                          : 'border-white/10 bg-white/5 text-purple-200'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-400 bg-rose-500/20 p-2 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Big Village-friendly Button */}
              <button
                type="submit"
                disabled={withdrawing || (currentUser.pendingBalance || 0) <= 0}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base rounded-xl shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-40 cursor-pointer"
              >
                {withdrawing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>
                      {language === 'hi' ? `₹${withdrawAmount} बैंक में भेजें` : `Withdraw ₹${withdrawAmount}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
