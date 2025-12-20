

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { User } from '../types';
import { api } from '../services/api';

interface ForgotPasswordProps {
    onClose: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [foundUser, setFoundUser] = useState<User | null>(null);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFindAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // Fix: cast to any to resolve property 'user' does not exist error on lines 26 and 27
            const res: any = await api.findUser(email);
            if (res.user) {
                setFoundUser(res.user);
                setStep(2);
            } else {
                setError("No account found with that email.");
            }
        } catch (err: any) {
            setError(err.message || "Failed to search.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (code === '123456') { 
            setStep(3);
            setError('');
        } else {
            setError("Incorrect code. Please try again.");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setIsLoading(true);
        try {
            await api.resetPassword(email, newPassword);
            alert("Password updated successfully.");
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 animate-fade-in text-[#E4E6EB] bg-[#242526]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-white">Find Your Account</h3>
                <button onClick={onClose} className="text-[#B0B3B8] hover:text-white text-2xl">&times;</button>
            </div>
            
            {step === 1 && (
                <form onSubmit={handleFindAccount}>
                    <p className="text-[#B0B3B8] mb-4 text-[15px]">Please enter your email or mobile number to search for your account.</p>
                    <input 
                        type="text" 
                        className="w-full border border-[#3E4042] rounded-lg p-3.5 mb-4 outline-none focus:border-[#1877F2] bg-[#3A3B3C] text-white" 
                        placeholder="Email or mobile number" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        autoFocus
                    />
                    {error && <div className="text-[#F02849] text-sm mb-4">{error}</div>}
                    <div className="flex justify-end gap-2 pt-4 border-t border-[#3E4042]">
                        <button type="button" onClick={onClose} className="bg-[#3A3B3C] hover:bg-[#4E4F50] text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-70">
                            {isLoading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                </form>
            )}

            {step === 2 && foundUser && (
                <form onSubmit={handleVerifyCode}>
                    <div className="flex items-center gap-4 mb-6 border-b border-[#3E4042] pb-4">
                        <img src={foundUser.profileImage} className="w-14 h-14 rounded-full border border-[#3E4042]" alt="" />
                        <div>
                            <h4 className="font-bold text-lg text-white">{foundUser.name}</h4>
                            <p className="text-[#B0B3B8] text-sm">UNERA Account</p>
                        </div>
                    </div>
                    <p className="text-[#B0B3B8] mb-4">Code sent to: <strong>{email}</strong> (Demo: 123456)</p>
                    <input 
                        type="text" 
                        className="w-full border border-[#3E4042] rounded-lg p-3.5 mb-4 text-center text-2xl tracking-[10px] font-bold text-white bg-[#3A3B3C]" 
                        placeholder="000000" 
                        value={code} 
                        onChange={e => setCode(e.target.value)} 
                        maxLength={6}
                    />
                    {error && <div className="text-[#F02849] text-sm mb-4">{error}</div>}
                    <div className="flex justify-end gap-2 pt-4 border-t border-[#3E4042]">
                        <button type="button" onClick={() => setStep(1)} className="bg-[#3A3B3C] hover:bg-[#4E4F50] text-white font-bold py-2 px-4 rounded-lg transition-colors">Not you?</button>
                        <button type="submit" className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-2 px-6 rounded-lg transition-colors">Continue</button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleResetPassword}>
                    <h4 className="font-bold text-white mb-2 text-lg">Choose a New Password</h4>
                    <p className="text-[#B0B3B8] text-sm mb-4">Create a new password that is at least 6 characters long.</p>
                    <input 
                        type="password" 
                        className="w-full border border-[#3E4042] rounded-lg p-3.5 mb-4 outline-none focus:border-[#1877F2] bg-[#3A3B3C] text-white" 
                        placeholder="New password" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        autoFocus
                    />
                    {error && <div className="text-[#F02849] text-sm mb-4">{error}</div>}
                    <div className="flex justify-end gap-2 pt-4 border-t border-[#3E4042]">
                        <button type="submit" disabled={isLoading} className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-2 px-8 rounded-lg transition-colors w-full">
                            {isLoading ? 'Resetting...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

interface LoginProps {
    onLogin: (email: string, pass: string) => void;
    onNavigateToRegister: () => void;
    onClose: () => void;
    error: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, onClose, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const { t } = useLanguage();
    
    useEffect(() => { if (error) setIsLoggingIn(false); }, [error]);

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        if (!email || !password) return;
        setIsLoggingIn(true);
        onLogin(email, password); 
    };

    return (
        <div className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in">
            <div className="bg-[#242526] w-full max-w-[420px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden animate-slide-up border border-[#3E4042]">
                {showForgot ? (
                    <ForgotPassword onClose={() => setShowForgot(false)} />
                ) : (
                    <div className="flex flex-col">
                        <div className="p-6 pb-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <i className="fas fa-globe-americas text-[#1877F2] text-[48px] animate-[spin_20s_linear_infinite]"></i>
                                    <h1 className="text-[42px] font-black text-white tracking-tighter">UNERA</h1>
                                </div>
                                <p className="text-[#B0B3B8] text-center text-[16px] leading-tight font-medium px-4">{t('tagline')}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && <div className="bg-[#F02849]/10 border border-[#F02849]/20 text-[#F02849] px-4 py-3 rounded-xl text-sm text-center font-bold animate-shake">{error}</div>}
                                
                                <input 
                                    type="email" 
                                    placeholder={t('email_placeholder')} 
                                    className="w-full border border-[#3E4042] rounded-xl px-4 py-4 text-[17px] outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] bg-[#3A3B3C] text-white placeholder-[#B0B3B8]" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    disabled={isLoggingIn}
                                />
                                <input 
                                    type="password" 
                                    placeholder={t('password_placeholder')} 
                                    className="w-full border border-[#3E4042] rounded-xl px-4 py-4 text-[17px] outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] bg-[#3A3B3C] text-white placeholder-[#B0B3B8]" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    disabled={isLoggingIn}
                                />
                                <button 
                                    type="submit" 
                                    disabled={isLoggingIn || !email || !password}
                                    className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-black text-[20px] py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3 mt-2"
                                >
                                    {isLoggingIn ? <><i className="fas fa-circle-notch fa-spin"></i> LOGGING IN...</> : t('login_btn').toUpperCase()}
                                </button>
                            </form>
                            
                            <div className="text-center mt-6 mb-2">
                                <span className="text-[#1877F2] text-[15px] hover:underline cursor-pointer font-bold" onClick={() => setShowForgot(true)}>{t('forgot_password')}</span>
                            </div>
                            
                            <div className="border-t border-[#3E4042] my-8"></div>
                            
                            <div className="text-center">
                                <button onClick={onNavigateToRegister} className="bg-[#42b72a] hover:bg-[#36a420] text-white font-black text-[18px] px-10 py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-md">
                                    CREATE NEW ACCOUNT
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#18191A] p-4 text-center border-t border-[#3E4042]">
                             <button onClick={onClose} className="text-[#B0B3B8] hover:text-white text-sm font-bold flex items-center justify-center gap-2 mx-auto transition-colors"><i className="fas fa-times-circle"></i> Continue as Guest</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const Register: React.FC<{ onRegister: (u: any) => void, onBackToLogin: () => void }> = ({ onRegister, onBackToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('Female');
    const [day, setDay] = useState(1);
    const [month, setMonth] = useState(1);
    const [year, setYear] = useState(new Date().getFullYear() - 18);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        if (password.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }
        setIsSubmitting(true);
        onRegister({ firstName, lastName: surname, email, password, gender, birthDate: `${year}-${month}-${day}`, name: `${firstName} ${surname}` }); 
    };

    const days = Array.from({ length: 31 }, (_, i) => i + 1); 
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="fixed inset-0 z-[250] bg-black/70 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fade-in">
            <div className="bg-[#242526] w-full max-w-[432px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] overflow-hidden animate-slide-up border border-[#3E4042] text-[#E4E6EB]">
                <div className="p-4 border-b border-[#3E4042] flex justify-between items-center bg-[#242526]">
                    <div>
                        <h2 className="text-[32px] font-black leading-tight text-white">{t('sign_up_header')}</h2>
                        <p className="text-[#B0B3B8] text-[15px] font-medium">{t('quick_easy')}</p>
                    </div>
                    <button onClick={onBackToLogin} className="text-[#B0B3B8] hover:text-white text-3xl">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="flex gap-3">
                        <input type="text" placeholder={t('first_name')} className="flex-1 border border-[#3E4042] rounded-xl p-3 text-[15px] bg-[#3A3B3C] text-white outline-none focus:border-[#1877F2]" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        <input type="text" placeholder={t('surname_optional')} className="flex-1 border border-[#3E4042] rounded-xl p-3 text-[15px] bg-[#3A3B3C] text-white outline-none focus:border-[#1877F2]" value={surname} onChange={e => setSurname(e.target.value)} />
                    </div>
                    
                    <input type="email" placeholder={t('email_mobile_placeholder')} className="w-full border border-[#3E4042] rounded-xl p-3 text-[15px] bg-[#3A3B3C] text-white outline-none focus:border-[#1877F2]" value={email} onChange={e => setEmail(e.target.value)} required />
                    
                    <input type="password" placeholder="New password" minLength={6} className="w-full border border-[#3E4042] rounded-xl p-3 text-[15px] bg-[#3A3B3C] text-white outline-none focus:border-[#1877F2]" value={password} onChange={e => setPassword(e.target.value)} required />
                    
                    <div>
                        <label className="text-[12px] text-[#B0B3B8] font-bold block mb-1.5 uppercase tracking-wider">{t('dob')}</label>
                        <div className="flex gap-2">
                            <select value={day} onChange={e => setDay(Number(e.target.value))} className="flex-1 border border-[#3E4042] rounded-lg p-2.5 text-[15px] bg-[#3A3B3C] text-white outline-none">{days.map(d => <option key={d} value={d}>{d}</option>)}</select>
                            <select value={month} onChange={e => setMonth(Number(e.target.value))} className="flex-1 border border-[#3E4042] rounded-lg p-2.5 text-[15px] bg-[#3A3B3C] text-white outline-none">{months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}</select>
                            <select value={year} onChange={e => setYear(Number(e.target.value))} className="flex-1 border border-[#3E4042] rounded-lg p-2.5 text-[15px] bg-[#3A3B3C] text-white outline-none">{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-[12px] text-[#B0B3B8] font-bold block mb-1.5 uppercase tracking-wider">{t('gender')}</label>
                        <div className="flex gap-3">
                            <label className={`flex-1 border rounded-xl p-2.5 flex justify-between items-center cursor-pointer transition-colors ${gender === 'Female' ? 'bg-[#1877F2]/10 border-[#1877F2]' : 'bg-[#3A3B3C] border-[#3E4042]'}`}>
                                <span className="text-[15px] font-bold">{t('female')}</span>
                                <input type="radio" name="gender" className="accent-[#1877F2] w-4 h-4" checked={gender === 'Female'} onChange={() => setGender('Female')} />
                            </label>
                            <label className={`flex-1 border rounded-xl p-2.5 flex justify-between items-center cursor-pointer transition-colors ${gender === 'Male' ? 'bg-[#1877F2]/10 border-[#1877F2]' : 'bg-[#3A3B3C] border-[#3E4042]'}`}>
                                <span className="text-[15px] font-bold">{t('male')}</span>
                                <input type="radio" name="gender" className="accent-[#1877F2] w-4 h-4" checked={gender === 'Male'} onChange={() => setGender('Male')} />
                            </label>
                        </div>
                    </div>
                    
                    <p className="text-[11px] text-[#B0B3B8] leading-tight text-center py-2">{t('terms_text')}</p>
                    
                    <div className="text-center pt-2">
                        <button type="submit" disabled={isSubmitting} className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-black text-[20px] py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] w-full">
                            {isSubmitting ? <><i className="fas fa-circle-notch fa-spin"></i> CREATING ACCOUNT...</> : t('sign_up_btn').toUpperCase()}
                        </button>
                    </div>
                    
                    <div className="text-center pt-4 pb-2">
                        <span className="text-[#1877F2] cursor-pointer hover:underline text-[16px] font-bold" onClick={onBackToLogin}>{t('have_account')}</span>
                    </div>
                </form>
            </div>
        </div>
    );
};
