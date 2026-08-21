import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const AuthView: React.FC = () => {
  const {
    currentUser,
    login,
    signup,
    logout,
    setCurrentScreen,
    authInitialMode,
    setAuthInitialMode,
    cart
  } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>(authInitialMode || 'login');
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  
  // Form fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // OTP Step State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMode(authInitialMode);
  }, [authInitialMode]);

  useEffect(() => {
    let interval: any;
    if (isOtpStep && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, resendTimer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setIsOtpStep(true);
    setResendTimer(30);
    setSuccessMessage(`OTP sent to +91 ${phoneNumber}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      val = val[val.length - 1];
    }
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = [...otpValues];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtpValues(newOtp);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    }
  };

  const fillDemoOtp = () => {
    setOtpValues(['1', '2', '3', '4', '5', '6']);
  };

  const handleVerifyOtp = () => {
    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      login(phoneNumber || '9876543210', 'Rahul Deshmukh');
      setIsSubmitting(false);
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        if (cart.length > 0) {
          setCurrentScreen('cart');
        } else {
          setCurrentScreen('home');
        }
      }, 600);
    }, 700);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      login(email);
      setIsSubmitting(false);
      setSuccessMessage('Welcome back to BiteGo!');
      setTimeout(() => {
        if (cart.length > 0) {
          setCurrentScreen('cart');
        } else {
          setCurrentScreen('home');
        }
      }, 600);
    }, 700);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('You must agree to the Terms & Privacy Policy');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      signup(fullName, email, phoneNumber);
      setIsSubmitting(false);
      setSuccessMessage('Account created successfully! Welcome to BiteGo.');
      setTimeout(() => {
        if (cart.length > 0) {
          setCurrentScreen('cart');
        } else {
          setCurrentScreen('home');
        }
      }, 700);
    }, 800);
  };

  const handleDemoLogin = (profile: 'rahul' | 'priya') => {
    if (profile === 'rahul') {
      login('rahul.nashik@bitego.com', 'Rahul Deshmukh');
    } else {
      login('priya.sharma@bitego.com', 'Priya Sharma');
    }
    setSuccessMessage(`Logged in as ${profile === 'rahul' ? 'Rahul' : 'Priya'}!`);
    setTimeout(() => {
      if (cart.length > 0) {
        setCurrentScreen('cart');
      } else {
        setCurrentScreen('home');
      }
    }, 500);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setIsForgotPasswordOpen(false);
      setForgotSuccess(false);
      setForgotEmail('');
    }, 2500);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Weak (min 6 chars)', color: 'text-red-500 bg-red-100' };
    if (password.length < 9) return { label: 'Good', color: 'text-amber-600 bg-amber-100' };
    return { label: 'Strong', color: 'text-emerald-600 bg-emerald-100' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] flex flex-col font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-[#e4e2e1] px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className="p-1.5 rounded-full hover:bg-[#f6f3f2] text-[#5c4037] transition-colors"
            title="Go Back"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </button>
          <div
            onClick={() => setCurrentScreen('home')}
            className="font-headline font-bold text-xl text-[#a83300] cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[#a83300] text-[24px]">lunch_dining</span>
            BiteGo
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:flex items-center gap-1 text-xs text-[#29695b] font-semibold bg-[#acedda]/30 px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[14px]">lock</span> 256-Bit SSL Encrypted
          </span>
          <button
            onClick={() => setCurrentScreen('home')}
            className="text-xs font-semibold text-[#5c4037] hover:text-black transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        {/* Left Side: Brand Marketing & Perks */}
        <div className="w-full md:w-1/2 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#ffdbd0]/60 border border-[#e5beb2] px-3 py-1 rounded-full text-xs font-bold text-[#832600]">
            <span className="w-2 h-2 rounded-full bg-[#a83300] animate-pulse"></span>
            Nashik's Premier Food & Grocery Destination
          </div>

          <h1 className="font-headline font-bold text-3xl md:text-4xl text-[#1b1c1c] leading-tight">
            Order delicious food from top Nashik restaurants in seconds.
          </h1>

          <p className="text-sm text-[#5c4037] leading-relaxed">
            Sign in to unlock exclusive chef specials, saved delivery addresses, live GPS tracking, and BiteGo Gold complimentary delivery perks.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-white rounded-xl border border-[#e4e2e1] shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#acedda]/40 text-[#29695b] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">bolt</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1b1c1c]">Fast Delivery</h4>
                <p className="text-[11px] text-[#5c4037]">20-35 mins lightning-fast rider dispatch</p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#e4e2e1] shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">local_offer</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1b1c1c]">Up to 50% Off</h4>
                <p className="text-[11px] text-[#5c4037]">Use code BITE50 on your first orders</p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#e4e2e1] shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1b1c1c]">Zero Surge Pricing</h4>
                <p className="text-[11px] text-[#5c4037]">Consistent honest rates across Nashik</p>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#e4e2e1] shadow-xs flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1b1c1c]">Live GPS Tracking</h4>
                <p className="text-[11px] text-[#5c4037]">Real-time map and rider updates</p>
              </div>
            </div>
          </div>

          {/* Quick Demo Login Helpers */}
          <div className="p-4 bg-[#f0eded]/70 rounded-2xl border border-[#e4e2e1] space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5c4037] block">
              🚀 Fast Testing • One-Click Demo Personas
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('rahul')}
                className="px-3 py-1.5 bg-white hover:bg-[#ffdbd0] text-[#a83300] border border-[#e4e2e1] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">stars</span>
                Log in as Rahul (Gold Member)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('priya')}
                className="px-3 py-1.5 bg-white hover:bg-purple-50 text-purple-700 border border-[#e4e2e1] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                Log in as Priya (Foodie)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full md:w-1/2 max-w-[460px]">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#e4e2e1] space-y-6 relative overflow-hidden">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ffdbd0]/40 to-transparent rounded-bl-full pointer-events-none" />

            {/* Mode Switcher Tabs */}
            <div className="bg-[#f6f3f2] p-1.5 rounded-2xl flex items-center relative z-10 border border-[#e4e2e1]">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setIsOtpStep(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'login'
                    ? 'bg-white text-[#1b1c1c] shadow-sm'
                    : 'text-[#5c4037] hover:text-[#1b1c1c]'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setIsOtpStep(false);
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-[#1b1c1c] shadow-sm'
                    : 'text-[#5c4037] hover:text-[#1b1c1c]'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error / Success Feedback Banners */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* ================= LOGIN FORM ================= */}
            {mode === 'login' && !isOtpStep && (
              <div className="space-y-4">
                {/* Method selector: Phone vs Email */}
                <div className="flex border-b border-[#f0eded] pb-2 gap-4 text-xs font-semibold text-[#5c4037]">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('phone');
                      setErrorMessage(null);
                    }}
                    className={`pb-1.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                      loginMethod === 'phone'
                        ? 'border-[#a83300] text-[#a83300]'
                        : 'border-transparent hover:text-black'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">smartphone</span>
                    Mobile & OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod('email');
                      setErrorMessage(null);
                    }}
                    className={`pb-1.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                      loginMethod === 'email'
                        ? 'border-[#a83300] text-[#a83300]'
                        : 'border-transparent hover:text-black'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    Email & Password
                  </button>
                </div>

                {/* LOGIN METHOD 1: PHONE */}
                {loginMethod === 'phone' && (
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5c4037] mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex items-center bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl focus-within:border-[#a83300] focus-within:ring-1 focus-within:ring-[#a83300] overflow-hidden transition-all">
                        <div className="px-3 py-2.5 bg-[#eae8e7] border-r border-[#e4e2e1] text-xs font-bold text-[#1b1c1c] flex items-center gap-1 shrink-0">
                          <span>🇮🇳 +91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full px-3 py-2.5 bg-transparent text-xs text-[#1b1c1c] font-medium outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 block">
                        We'll send a 6-digit verification code to this number
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#a83300] hover:bg-[#d24200] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue with OTP</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </form>
                )}

                {/* LOGIN METHOD 2: EMAIL */}
                {loginMethod === 'email' && (
                  <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#5c4037] mb-1.5">
                        Email Address
                      </label>
                      <div className="flex items-center bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl focus-within:border-[#a83300] focus-within:ring-1 focus-within:ring-[#a83300] px-3 py-2.5 transition-all">
                        <span className="material-symbols-outlined text-[#5c4037] text-[18px] mr-2">mail</span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. rahul.nashik@bitego.com"
                          className="w-full bg-transparent text-xs text-[#1b1c1c] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-semibold text-[#5c4037]">
                          Password
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsForgotPasswordOpen(true)}
                          className="text-[11px] font-bold text-[#a83300] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="flex items-center bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl focus-within:border-[#a83300] focus-within:ring-1 focus-within:ring-[#a83300] px-3 py-2.5 transition-all">
                        <span className="material-symbols-outlined text-[#5c4037] text-[18px] mr-2">lock</span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-transparent text-xs text-[#1b1c1c] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#5c4037] hover:text-black ml-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-[#5c4037] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-[#a83300] accent-[#a83300]"
                        />
                        <span>Remember me on this browser</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#a83300] hover:bg-[#d24200] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? 'Logging In...' : 'Log In to BiteGo'}
                    </button>
                  </form>
                )}

                {/* Social Logins Divider */}
                <div className="relative flex items-center justify-center py-2">
                  <div className="border-t border-[#e4e2e1] w-full" />
                  <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                    Or sign in with
                  </span>
                  <div className="border-t border-[#e4e2e1] w-full" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('rahul')}
                    className="py-2.5 px-3 border border-[#e4e2e1] hover:bg-[#f6f3f2] rounded-xl text-xs font-semibold text-[#1b1c1c] flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('priya')}
                    className="py-2.5 px-3 border border-[#e4e2e1] hover:bg-[#f6f3f2] rounded-xl text-xs font-semibold text-[#1b1c1c] flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.67-.82 1.12-1.96.99-3.1-.96.04-2.13.64-2.82 1.45-.61.71-1.15 1.87-.99 2.98 1.07.08 2.16-.54 2.82-1.33z"/>
                    </svg>
                    Apple
                  </button>
                </div>
              </div>
            )}

            {/* ================= OTP VERIFICATION SCREEN ================= */}
            {mode === 'login' && isOtpStep && (
              <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-[#ffdbd0] text-[#a83300] mx-auto flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">sms</span>
                  </div>
                  <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Enter Verification Code</h3>
                  <p className="text-xs text-[#5c4037]">
                    Sent to <strong className="text-[#1b1c1c]">+91 {phoneNumber}</strong>{' '}
                    <button
                      type="button"
                      onClick={() => setIsOtpStep(false)}
                      className="text-[#a83300] font-bold underline ml-1 text-[11px]"
                    >
                      Change
                    </button>
                  </p>
                </div>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl focus:border-[#a83300] focus:ring-2 focus:ring-[#ffdbd0] outline-none transition-all"
                    />
                  ))}
                </div>

                {/* 1-Click Demo Fill OTP helper */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={fillDemoOtp}
                    className="text-xs text-[#29695b] font-bold bg-[#acedda]/30 hover:bg-[#acedda]/50 px-3 py-1 rounded-full transition-colors inline-flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                    Auto-Fill Demo OTP (123456)
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs text-[#5c4037]">
                  <span>Didn't receive code?</span>
                  {resendTimer > 0 ? (
                    <span className="font-semibold text-gray-400">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setResendTimer(30);
                        setSuccessMessage('New OTP sent!');
                        setTimeout(() => setSuccessMessage(null), 2500);
                      }}
                      className="text-[#a83300] font-bold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#a83300] hover:bg-[#d24200] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? 'Verifying...' : 'Verify & Proceed'}
                </button>
              </div>
            )}

            {/* ================= SIGN UP FORM ================= */}
            {mode === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#5c4037] mb-1">
                    Full Name *
                  </label>
                  <div className="flex items-center bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl focus-within:border-[#a83300] focus-within:ring-1 focus-within:ring-[#a83300] px-3 py-2 transition-all">
                    <span className="material-symbols-outlined text-[#5c4037] text-[18px] mr-2">person</span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Deshmukh"
                      className="w-full bg-transparent text-xs text-[#1b1c1c] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5c4037] mb-1">
                    Mobile Number *
                  </label>
                  <div className="flex items-center bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl focus-within:border-[#a83300] focus-within:ring-1 focus-within:ring-[#a83300] overflow-hidden transition-all">
                    <div className="px-2.5 py-2 bg-[#eae8e7] border-r border-[#e4e2e1] text-xs font-bold text-[#1b1c1c] shrink-0">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="w-full px-3 py-2 bg-transparent text-xs text-[#1b1c1c] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5c4037] mb-1">
                    Email Address *
                  </label>
                  <div className="flex items-center bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl focus-within:border-[#a83300] focus-within:ring-1 focus-within:ring-[#a83300] px-3 py-2 transition-all">
                    <span className="material-symbols-outlined text-[#5c4037] text-[18px] mr-2">mail</span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full bg-transparent text-xs text-[#1b1c1c] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-[#5c4037]">
                      Create Password *
                    </label>
                    {strength.label && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${strength.color}`}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl focus-within:border-[#a83300] focus-within:ring-1 focus-within:ring-[#a83300] px-3 py-2 transition-all">
                    <span className="material-symbols-outlined text-[#5c4037] text-[18px] mr-2">lock</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-transparent text-xs text-[#1b1c1c] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#5c4037] hover:text-black ml-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5c4037] mb-1">
                    Referral / Invite Code (Optional)
                  </label>
                  <div className="flex items-center bg-[#f6f3f2] border border-[#e4e2e1] rounded-xl px-3 py-2">
                    <span className="material-symbols-outlined text-[#29695b] text-[18px] mr-2">redeem</span>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="e.g. BITE100"
                      className="w-full bg-transparent text-xs text-[#1b1c1c] outline-none uppercase font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-[#29695b] mt-0.5 block">
                    Use code BITE50 for 50% off your initial feast
                  </span>
                </div>

                <div className="space-y-2 pt-1 text-xs text-[#5c4037]">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-[#a83300] accent-[#a83300] mt-0.5"
                    />
                    <span className="text-[11px] leading-tight">
                      I agree to the <span className="text-[#a83300] font-semibold underline">Terms of Service</span> & <span className="text-[#a83300] font-semibold underline">Privacy Policy</span>
                    </span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsappUpdates}
                      onChange={(e) => setWhatsappUpdates(e.target.checked)}
                      className="w-4 h-4 rounded text-[#29695b] accent-[#29695b] mt-0.5"
                    />
                    <span className="text-[11px] leading-tight">
                      Send order updates & special weekend offers on WhatsApp 💬
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#a83300] hover:bg-[#d24200] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create BiteGo Account'}
                </button>
              </form>
            )}

            {/* Bottom Footer Note */}
            <div className="text-center pt-2 text-xs text-[#5c4037] border-t border-[#f0eded]">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setIsOtpStep(false);
                      setErrorMessage(null);
                    }}
                    className="text-[#a83300] font-bold hover:underline"
                  >
                    Sign Up here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setIsOtpStep(false);
                      setErrorMessage(null);
                    }}
                    className="text-[#a83300] font-bold hover:underline"
                  >
                    Log In instead
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FORGOT PASSWORD MODAL */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Reset Your Password</h3>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-gray-400 hover:text-black"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
                  Password Reset Email Sent!
                </div>
                <p className="text-[11px] text-emerald-700">
                  Please check your inbox at <strong>{forgotEmail}</strong>. We sent a secure link to reset your credentials.
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
                <p className="text-[#5c4037]">
                  Enter the email address associated with your BiteGo account and we'll send you an instant reset link.
                </p>
                <div>
                  <label className="block font-semibold text-[#5c4037] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. rahul.nashik@bitego.com"
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-lg border border-[#e4e2e1] outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-4 py-2 border border-[#e4e2e1] rounded-lg font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#a83300] text-white rounded-lg font-bold hover:bg-[#d24200]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
