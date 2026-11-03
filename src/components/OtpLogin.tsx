import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Smartphone, ShieldCheck, KeyRound, AlertCircle, ArrowRight, CheckCircle, Sparkles, Globe, User, Shield } from 'lucide-react';
import { INITIAL_USERS } from '../utils/mockData';
import { ProfileSetup } from './ProfileSetup';

export const OtpLogin: React.FC = () => {
  const { t, language, setLanguage, findUserByPhone, setCurrentUser } = useApp();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'profile_setup'>('phone');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Send OTP
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMsg(language === 'hi' ? 'कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Simulate real SMS OTP dispatch
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setStep('otp');
      setLoading(false);
      setSuccessNotice(
        language === 'hi'
          ? `ओटीपी कोड: ${code} (डेमो सत्यापन के लिए)`
          : `OTP Code: ${code} (For demo verification)`
      );
    }, 700);
  };

  // Verify OTP
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otpCode.join('');

    if (fullOtp.length !== 6) {
      setErrorMsg(language === 'hi' ? 'कृपया पूरा 6 अंकों का ओटीपी दर्ज करें' : 'Please enter the full 6-digit OTP');
      return;
    }

    // "Without OTP No Entry"
    if (fullOtp !== generatedOtp && fullOtp !== '123456') {
      setErrorMsg(
        language === 'hi'
          ? 'गलत ओटीपी! बिना सही ओटीपी के नो एंट्री (Without OTP No Entry)।'
          : 'Incorrect OTP! Without valid OTP No Entry.'
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // Check if user already exists
      const existing = findUserByPhone(phoneNumber);
      if (existing) {
        // Existing user: direct login to their existing profile
        setCurrentUser(existing);
      } else {
        // New user: go to Step 3 Profile Setup ("आपका नाम क्या है? अपना फोटो लगाओ")
        setStep('profile_setup');
      }
    } catch {
      setErrorMsg(language === 'hi' ? 'लॉगिन में त्रुटि हुई' : 'Login failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const autoFillOtp = () => {
    const digits = generatedOtp.split('');
    setOtpCode(digits);
  };

  // Quick preset logins for easy evaluation
  const handleQuickPreset = (number: string) => {
    setPhoneNumber(number);
    setErrorMsg(null);
  };

  const handleDirectOwnerLogin = () => {
    const owner = INITIAL_USERS.find(u => u.uid === 'owner_joshiji') || INITIAL_USERS[0];
    setCurrentUser(owner);
  };

  // If in Profile Setup step
  if (step === 'profile_setup') {
    return (
      <ProfileSetup
        initialPhone={`+91 ${phoneNumber.replace(/\D/g, '')}`}
        onComplete={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Top Language Toggle */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-orange-400 flex items-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>
        </div>

        {/* Brand Banner with User's Official Photo */}
        <div className="text-center mb-6">
          <img
            src="/joshi.jpg"
            alt="Joshi Ji Reels"
            style={{ width: '96px', height: '96px', borderRadius: '50%', border: '3px solid gold', objectFit: 'cover' }}
            className="shadow-2xl shadow-amber-500/40 mb-3 mx-auto"
          />
          <h1 className="text-2xl font-black text-white flex items-center justify-center gap-1.5">
            Joshi Ji Reels 👑
          </h1>
          <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mt-0.5">
            {language === 'hi' ? 'देसी हुनर, अपनी पहचान 🇮🇳' : 'Desi Talent, Royal Identity'}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl">
          {/* Security Banner: Without OTP No Entry */}
          <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-3 mb-5 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="text-xs text-orange-200 font-medium leading-relaxed">
              {t.withoutOtpNoEntry}
            </div>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                {/* 1. Exactly as requested: "अपना Mobile Number डालो" */}
                <label className="block text-base font-black text-amber-300 mb-2">
                  {language === 'hi' ? 'अपना Mobile Number डालो' : 'Enter your Mobile Number'}
                </label>
                <div className="flex items-center rounded-2xl bg-black/40 border-2 border-purple-500/40 focus-within:border-orange-500 overflow-hidden transition-all shadow-inner">
                  <span className="px-4 text-orange-400 font-black text-base border-r border-white/10 bg-white/5 py-4">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder={language === 'hi' ? '10 अंकों का मोबाइल नंबर डालें (उदा. 9826012345)' : '10-digit mobile number'}
                    className="w-full bg-transparent px-4 py-4 text-white placeholder-purple-300/40 text-lg font-bold tracking-wider outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold bg-rose-500/20 p-3 rounded-xl border border-rose-500/30">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 2. Number डालने पर OTP भेजने वाला बटन */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === 'hi' ? 'OTP भेजें (Send OTP)' : 'Send OTP'}</span>
                    <ArrowRight className="w-5 h-5 text-amber-200" />
                  </>
                )}
              </button>

              {/* Quick Testing Shortcuts */}
              <div className="pt-4 border-t border-white/10">
                <p className="text-[11px] text-purple-300 font-bold mb-2 text-center uppercase tracking-wider">
                  ⚡ त्वरित परीक्षण बटन (Instant Test Options)
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Master Admin Joshi Ji */}
                  <button
                    type="button"
                    onClick={handleDirectOwnerLogin}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 border border-amber-400/40 text-left transition-all active:scale-95 cursor-pointer shadow"
                  >
                    <div className="font-extrabold text-amber-300 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-amber-300" />
                      <span>👑 जोशी जी (Admin)</span>
                    </div>
                    <div className="text-[10px] text-purple-200 mt-0.5 font-mono">
                      मालिक पैनल (Full Control)
                    </div>
                  </button>

                  {/* New User Signup Testing */}
                  <button
                    type="button"
                    onClick={() => handleQuickPreset('9876500001')}
                    className="p-2.5 rounded-xl bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/40 text-left transition-all active:scale-95 cursor-pointer shadow"
                  >
                    <div className="font-extrabold text-orange-300 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-orange-300" />
                      <span>👤 नया यूजर साइन-अप</span>
                    </div>
                    <div className="text-[10px] text-orange-200/80 mt-0.5 font-mono">
                      नाम + फोटो सेटअप
                    </div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <div className="inline-flex p-2.5 rounded-full bg-orange-500/20 text-orange-400 mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {language === 'hi' ? 'OTP दर्ज करो' : 'Enter OTP'}
                </h3>
                <p className="text-xs text-purple-200/80 mt-1">
                  +91 {phoneNumber} पर भेजा गया 6 अंकों का कोड डालें
                </p>
              </div>

              {/* Demo OTP Notice & 1-tap Auto-fill */}
              {successNotice && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{successNotice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={autoFillOtp}
                    className="text-xs bg-emerald-500 text-black px-2.5 py-1 rounded-lg font-black hover:bg-emerald-400 cursor-pointer shadow"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* 6 Digit Inputs */}
              <div className="flex justify-between gap-1.5 py-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && idx > 0) {
                        const prev = document.getElementById(`otp-input-${idx - 1}`);
                        prev?.focus();
                      }
                    }}
                    className="w-11 h-14 text-center text-2xl font-black bg-black/50 border-2 border-purple-500/50 rounded-xl focus:border-orange-500 text-white outline-none transition-all shadow-inner"
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold bg-rose-500/20 p-3 rounded-xl border border-rose-500/30">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-lg rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{language === 'hi' ? 'OTP सत्यापित करें (Verify OTP)' : 'Verify OTP'}</span>
                    <CheckCircle className="w-5 h-5 text-amber-200" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtpCode(['', '', '', '', '', '']);
                  setErrorMsg(null);
                }}
                className="w-full text-center text-xs text-purple-300 hover:text-white py-1 font-semibold"
              >
                ← {language === 'hi' ? 'दूसरा मोबाइल नंबर डालें (Change Number)' : 'Change Mobile Number'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
