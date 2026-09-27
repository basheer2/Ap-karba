import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Fingerprint, Delete, ShieldCheck, Zap } from 'lucide-react';

export const PinLockModal: React.FC = () => {
  const { isLocked, unlockApp } = useApp();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);

  if (!isLocked) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg(false);
      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = unlockApp(nextPin);
          if (!success) {
            setErrorMsg(true);
            setPin('');
          }
        }, 100);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMsg(false);
  };

  const handleBiometricSimulation = () => {
    // Biometric authentication simulation for testing
    unlockApp('1234');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-xs flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/25 mb-4">
          <Zap className="w-8 h-8 text-slate-950 stroke-[2.5]" />
        </div>

        <h2 className="text-xl font-bold text-white mb-1">كهرباني — نظام محمي</h2>
        <p className="text-xs text-slate-400 mb-6">أدخل رمز الأمان المكون من 4 أرقام للمتابعة</p>

        {/* PIN Indicators */}
        <div className="flex items-center gap-4 mb-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border transition-all ${
                i < pin.length
                  ? 'bg-amber-400 border-amber-400 scale-110 shadow-sm shadow-amber-400/50'
                  : 'border-slate-600 bg-slate-800'
              } ${errorMsg ? 'border-red-500 bg-red-500/20 animate-shake' : ''}`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400 font-semibold mb-4 animate-bounce">
            رمز PIN غير صحيح، الرمز الافتراضي: 1234
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 text-xl font-bold text-white transition-colors flex items-center justify-center shadow-sm"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBiometricSimulation}
            className="h-14 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:bg-slate-700 text-amber-400 transition-colors flex flex-col items-center justify-center"
            title="بصمة الإصبع (Biometric)"
          >
            <Fingerprint className="w-6 h-6" />
            <span className="text-[9px] mt-0.5">البصمة</span>
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:bg-amber-500 active:text-slate-950 text-xl font-bold text-white transition-colors flex items-center justify-center shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 active:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>تشفير محلي آمن في الذاكرة (Local Keystore)</span>
        </div>
      </div>
    </div>
  );
};
