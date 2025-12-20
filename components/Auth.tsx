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
            const res = await api.findUser(email);
            if (res.user) {
                setFoundUser(res.user);
                setStep(2);
                // Simulate sending code
                console.log("Code sent: 123456");
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
        if (code === '123456') { // Mock verification
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
            alert("Password updated successfully. Please login.");
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to reset password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in font-sans">
            <div className="bg-white w-full max-w-[500px] rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-gray-800 text-lg">Find Your Account</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">&times;</button>
                </div>
                
                <div className="p-6">
                    {step === 1 && (
                        <form onSubmit={handleFindAccount}>
                            <p className="text-gray-600 mb-4 text-base">Please enter your email address or mobile number to search for your account.</p>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded p-3 mb-4 outline-none focus:border-[#1877F2] focus:shadow-sm" 
                                placeholder="Email address or mobile number" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                autoFocus
                            />
                            {error && <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 border border-red-200 rounded">{error}</div>}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-colors">Cancel</button>
                                <button type="submit" disabled={isLoading} className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-70">
                                    {isLoading ? 'Searching...' : 'Search'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && foundUser && (
                        <form onSubmit={handleVerifyCode}>
                            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                                <img src={foundUser.profileImage} className="w-16 h-16 rounded-full border border-gray-300" alt="Profile" />
                                <div>
                                    <h4 className="font-bold text-lg text-gray-800">{foundUser.name}</h4>
                                    <p className="text-gray-500 text-sm">UNERA User</p>
                                </div>
                            </div>
                            <p className="text-gray-600 mb-4">We sent a code to your email: <strong>{email}</strong></p>
                            <p className="text-xs text-gray-400 mb-2">Use code 123456 for demo</p>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded p-3 mb-4 outline-none focus:border-[#1877F2] text-center text-xl tracking-widest" 
                                placeholder="Enter Code" 
                                value={code} 
                                onChange={e => setCode(e.target.value)} 
                                maxLength={6}
                            />
                            {error && <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 border border-red-200 rounded">{error}</div>}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                                <button type="button" onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-colors">Not you?</button>
                                <button type="submit" className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-2 px-6 rounded transition-colors">Continue</button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <h4 className="font-bold text-gray-800 mb-2">Choose a New Password</h4>
                            <p className="text-gray-600 text-sm mb-4">Create a new password that is at least 6 characters long. A strong password is a combination of letters, numbers, and punctuation marks.</p>
                            
                            <div className="mb-4">
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded p-3 outline-none focus:border-[#1877F2]" 
                                    placeholder="New password" 
                                    value={newPassword} 
                                    onChange={e => setNewPassword(e.target.value)} 
                                />
                            </div>
                            
                            {error && <div className="text-red-600 text-sm mb-4 bg-red-50 p-2 border border-red-200 rounded">{error}</div>}
                            
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                                <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded transition-colors">Skip</button>
                                <button type="submit" disabled={isLoading} className="bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-70">
                                    {isLoading ? 'Processing...' : 'Continue'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

interface LoginProps {
    onLogin: (email: string, pass: string) => void;
    onNavigateToRegister: () => void;
    onClose: () => void;
    error: string;
    message?: string;
    onLoginSuccess?: (userData: any) => void; // UPDATED: Accept user data
    onRedirectToHome?: () => void; // NEW: Redirect callback
}

export const Login: React.FC<LoginProps> = ({ 
    onLogin, 
    onNavigateToRegister, 
    onClose, 
    error, 
    message, 
    onLoginSuccess,
    onRedirectToHome 
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t, setLanguage, language } = useLanguage();
    
    // UPDATED: Proper authentication-based login function
    const handleApiLogin = async (e: React.FormEvent) => { 
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch('https://unera-2.pages.dev/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            
            // 🔐 CORRECT: Check for authentication success flag
            if (data.success === true) {
                // Store user data in localStorage
                localStorage.setItem("unera_user", JSON.stringify(data.user));
                localStorage.setItem("unera_auth_token", data.token || '');
                localStorage.setItem("unera_login_time", new Date().toISOString());
                
                // Call existing onLogin for compatibility
                onLogin(email, password);
                
                // Call success callback with user data
                if (onLoginSuccess) {
                    onLoginSuccess(data.user);
                }
                
                // Show success message
                alert(`Welcome back, ${data.user?.name || email}!`);
                
                // Redirect to home
                if (onRedirectToHome) {
                    onRedirectToHome();
                }
            } else {
                throw new Error('Authentication failed');
            }
        } catch (err: any) {
            // Fallback to original onLogin for compatibility
            onLogin(email, password);
            alert(`Login Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (showForgot) {
        return <ForgotPassword onClose={() => setShowForgot(false)} />;
    }

    return (
        <div className="fixed inset-0 z-[200] bg-[#18191A] flex flex-col justify-between p-4 animate-fade-in overflow-y-auto">
            <div className="absolute top-4 right-4 w-10 h-10 bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4E4F50] transition-colors z-50" onClick={onClose} title="Close">
                <i className="fas fa-times text-[#E4E6EB] text-xl"></i>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 max-w-[1000px] w-full mx-auto">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-[500px]">
                    <div className="flex items-center gap-2 mb-4">
                        <i className="fas fa-globe-americas text-[#1877F2] text-[40px] lg:text-[50px]"></i>
                        <h1 className="text-[40px] lg:text-[50px] font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text tracking-tight">UNERA</h1>
                    </div>
                    <p className="text-[24px] lg:text-[28px] text-[#E4E6EB] font-normal leading-8">{t('tagline')}</p>
                </div>
                
                <div className="bg-[#242526] p-4 rounded-lg shadow-lg w-full max-w-[396px] flex flex-col gap-4 border border-[#3E4042]">
                    <form onSubmit={handleApiLogin} className="flex flex-col gap-4">
                        {message && (
                            <div className="bg-[#263951] border border-[#2D88FF] text-[#E4E6EB] px-4 py-3 rounded text-sm text-center flex items-center justify-center gap-2">
                                <i className="fas fa-info-circle text-[#2D88FF]"></i>
                                {message}
                            </div>
                        )}
                        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded text-sm text-center">{error}</div>}
                        <input 
                            type="email" 
                            placeholder={t('email_placeholder') || "Email address"} 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-4 py-3.5 text-[17px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#1877F2] focus:shadow-[0_0_0_2px_#263951]" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            disabled={isLoading}
                        />
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder={t('password_placeholder') || "Password"} 
                                className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-4 py-3.5 text-[17px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#1877F2] focus:shadow-[0_0_0_2px_#263951]" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                                disabled={isLoading}
                            />
                            <div 
                                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#B0B3B8] hover:text-[#E4E6EB]"
                                onClick={() => !isLoading && setShowPassword(!showPassword)}
                            >
                                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-[20px] py-2.5 rounded-md transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Authenticating...
                                </>
                            ) : (
                                t('login_btn')
                            )}
                        </button>
                    </form>
                    
                    <div className="text-center">
                        <span 
                            className="text-[#1877F2] text-[14px] hover:underline cursor-pointer" 
                            onClick={() => !isLoading && setShowForgot(true)}
                        >
                            {t('forgot_password')}
                        </span>
                    </div>
                    
                    <div className="border-b border-[#3E4042] my-1"></div>
                    
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={onNavigateToRegister} 
                            disabled={isLoading}
                            className="w-auto mx-auto bg-[#42B72A] hover:bg-[#36A420] text-white font-bold text-[17px] px-8 py-3 rounded-md transition-colors disabled:opacity-70"
                        >
                            {t('create_new_account')}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center text-xs text-[#B0B3B8]">
                <p>Login to fully experience UNERA.</p>
            </div>
            
            <div className="mt-auto pt-8 pb-4 w-full max-w-[1000px] mx-auto border-t border-[#3E4042]">
                <div className="flex flex-wrap justify-center gap-4 text-sm text-[#B0B3B8]">
                    <span className={`cursor-pointer hover:underline ${language === 'en' ? 'font-bold text-[#E4E6EB]' : ''}`} onClick={() => !isLoading && setLanguage('en')}>English (US)</span>
                    <span className={`cursor-pointer hover:underline ${language === 'sw' ? 'font-bold text-[#E4E6EB]' : ''}`} onClick={() => !isLoading && setLanguage('sw')}>Kiswahili</span>
                    <span className={`cursor-pointer hover:underline ${language === 'fr' ? 'font-bold text-[#E4E6EB]' : ''}`} onClick={() => !isLoading && setLanguage('fr')}>Français (France)</span>
                    <span className={`cursor-pointer hover:underline ${language === 'es' ? 'font-bold text-[#E4E6EB]' : ''}`} onClick={() => !isLoading && setLanguage('es')}>Español</span>
                </div>
            </div>
        </div>
    );
};

interface RegisterProps {
    onRegister: (newUser: Partial<User>) => void;
    onBackToLogin: () => void;
    onRegistrationSuccess?: (userData: any) => void; // UPDATED: Accept user data
}

interface CountryData {
    name: { common: string };
    flag: string; // emoji
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onBackToLogin, onRegistrationSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nationality, setNationality] = useState('Tanzania');
    const [region, setRegion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Date of birth
    const [day, setDay] = useState(new Date().getDate());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear() - 18);
    
    const [gender, setGender] = useState('Female');
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    
    const { t } = useLanguage();

    useEffect(() => {
        // Fetch countries with flags
        fetch('https://restcountries.com/v3.1/all?fields=name,flag')
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a: CountryData, b: CountryData) => a.name.common.localeCompare(b.name.common));
                setCountries(sorted);
                setIsLoadingCountries(false);
            })
            .catch(err => {
                console.error("Failed to fetch countries", err);
                setIsLoadingCountries(false);
            });
    }, []);

    const handleApiRegister = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        
        // Validation for 6 digits
        if (password.length < 6 || isNaN(Number(password))) {
            alert("Password must be at least 6 numbers.");
            return;
        }

        setIsLoading(true);
        
        try {
            // Prepare username from first name and surname
            const username = surname.trim() 
                ? `${firstName.toLowerCase()}${surname.toLowerCase()}` 
                : `${firstName.toLowerCase()}${Math.floor(1000 + Math.random() * 9000)}`;
            
            // Call registration API
            const response = await fetch('https://unera-2.pages.dev/users/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            
            // Check for registration success
            if (data.success === true) {
                // Prepare user data for local state
                const fullName = surname.trim() ? `${firstName} ${surname}` : firstName; 
                const userData = { 
                    name: fullName, 
                    firstName, 
                    lastName: surname, 
                    email, 
                    password, 
                    nationality,
                    location: region,
                    birthDate: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`, 
                    gender, 
                    profileImage: `https://ui-avatars.com/api/?name=${firstName}+${surname || ''}&background=random`, 
                    coverImage: 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80', 
                    bio: `Hello! I'm ${fullName} from ${region}, ${nationality}.`, 
                    followers: [], 
                    following: [], 
                    isOnline: true 
                };
                
                // Store user data
                localStorage.setItem("unera_user", JSON.stringify(userData));
                
                // Call the existing onRegister for compatibility
                onRegister(userData);
                
                // Call success callback with user data
                if (onRegistrationSuccess) {
                    onRegistrationSuccess(userData);
                }
                
                // Show success message
                alert(`Welcome to UNERA, ${fullName}! Your account has been created successfully.`);
                
                // Navigate back to login
                onBackToLogin();
                
            } else {
                throw new Error('Registration was not successful');
            }
            
        } catch (err: any) {
            alert(`Registration Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const days = Array.from({ length: 31 }, (_, i) => i + 1); 
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="min-h-screen bg-[#18191A] flex flex-col items-center justify-center p-4 py-8 animate-fade-in">
            <div className="flex flex-col items-center mb-6">
                <div className="flex items-center gap-2">
                    <i className="fas fa-globe-americas text-[#1877F2] text-[40px]"></i>
                    <h1 className="text-[40px] font-bold bg-gradient-to-r from-[#1877F2] to-[#1D8AF2] text-transparent bg-clip-text">UNERA</h1>
                </div>
            </div>
            
            <div className="bg-[#242526] p-4 rounded-lg shadow-lg w-full max-w-[432px] border border-[#3E4042]">
                <div className="text-center mb-4 border-b border-[#3E4042] pb-3">
                    <h2 className="text-[25px] font-bold text-[#E4E6EB]">{t('sign_up_header')}</h2>
                    <p className="text-[#B0B3B8] text-[15px]">{t('quick_easy')}</p>
                </div>
                
                <form onSubmit={handleApiRegister} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder={t('first_name') || "First name"} 
                            className="w-1/2 bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            required 
                            disabled={isLoading}
                        />
                        <input 
                            type="text" 
                            placeholder={t('surname_optional') || "Surname (optional)"} 
                            className="w-1/2 bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                            value={surname} 
                            onChange={(e) => setSurname(e.target.value)} 
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[12px] text-[#B0B3B8]">Nationality</label>
                        <select 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] focus:outline-none focus:border-[#505151]" 
                            value={nationality} 
                            onChange={(e) => setNationality(e.target.value)}
                            disabled={isLoading}
                        >
                            {isLoadingCountries ? (
                                <option>Loading countries...</option>
                            ) : (
                                countries.map((c, idx) => (
                                    <option key={idx} value={c.name.common}>
                                        {c.flag} {c.name.common}
                                    </option>
                                ))
                            )}
                            {!isLoadingCountries && countries.length === 0 && <option value="Tanzania">🇹🇿 Tanzania</option>}
                        </select>
                    </div>

                    <input 
                        type="text" 
                        placeholder="Region (e.g. Dar es Salaam)" 
                        className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                        value={region} 
                        onChange={(e) => setRegion(e.target.value)} 
                        required 
                        disabled={isLoading}
                    />
                    
                    <input 
                        type="email" 
                        placeholder={t('email_mobile_placeholder') || "Email address"} 
                        className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        disabled={isLoading}
                    />
                    
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password (6 numbers)" 
                            pattern="[0-9]*"
                            inputMode="numeric"
                            minLength={6}
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            title="Password must be at least 6 numbers"
                            disabled={isLoading}
                        />
                        <div 
                            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-[#B0B3B8] hover:text-[#E4E6EB]"
                            onClick={() => !isLoading && setShowPassword(!showPassword)}
                        >
                            <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </div>
                    </div>
                    
                    <div className="mt-1">
                        <label className="text-[12px] text-[#B0B3B8] block mb-1">{t('dob') || "Date of birth"}</label>
                        <div className="flex gap-2">
                            <select 
                                value={day} 
                                onChange={(e) => setDay(Number(e.target.value))} 
                                className="w-1/3 bg-[#3A3B3C] border border-[#3E4042] rounded-md p-1 text-[#E4E6EB]"
                                disabled={isLoading}
                            >
                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select 
                                value={month} 
                                onChange={(e) => setMonth(Number(e.target.value))} 
                                className="w-1/3 bg-[#3A3B3C] border border-[#3E4042] rounded-md p-1 text-[#E4E6EB]"
                                disabled={isLoading}
                            >
                                {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                            </select>
                            <select 
                                value={year} 
                                onChange={(e) => setYear(Number(e.target.value))} 
                                className="w-1/3 bg-[#3A3B3C] border border-[#3E4042] rounded-md p-1 text-[#E4E6EB]"
                                disabled={isLoading}
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-1">
                        <label className="text-[12px] text-[#B0B3B8] block mb-1">{t('gender') || "Gender"}</label>
                        <div className="flex gap-2 justify-between">
                            <label className={`border border-[#3E4042] rounded-md p-2 flex items-center justify-between flex-1 cursor-pointer ${!isLoading ? 'bg-[#3A3B3C] hover:bg-[#4E4F50]' : 'bg-[#2A2B2C]'} transition-colors`}>
                                <span className="text-[#E4E6EB]">{t('female')}</span>
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    checked={gender === 'Female'} 
                                    onChange={() => !isLoading && setGender('Female')} 
                                    disabled={isLoading}
                                />
                            </label>
                            <label className={`border border-[#3E4042] rounded-md p-2 flex items-center justify-between flex-1 cursor-pointer ${!isLoading ? 'bg-[#3A3B3C] hover:bg-[#4E4F50]' : 'bg-[#2A2B2C]'} transition-colors`}>
                                <span className="text-[#E4E6EB]">{t('male')}</span>
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    checked={gender === 'Male'} 
                                    onChange={() => !isLoading && setGender('Male')} 
                                    disabled={isLoading}
                                />
                            </label>
                            <label className={`border border-[#3E4042] rounded-md p-2 flex items-center justify-between flex-1 cursor-pointer ${!isLoading ? 'bg-[#3A3B3C] hover:bg-[#4E4F50]' : 'bg-[#2A2B2C]'} transition-colors`}>
                                <span className="text-[#E4E6EB]">{t('custom')}</span>
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    checked={gender === 'Custom'} 
                                    onChange={() => !isLoading && setGender('Custom')} 
                                    disabled={isLoading}
                                />
                            </label>
                        </div>
                    </div>
                    
                    <p className="text-[11px] text-[#B0B3B8] my-2">{t('terms_text')}</p>
                    
                    <div className="text-center mt-2">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-[200px] bg-[#00A400] hover:bg-[#008f00] text-white font-bold text-[18px] px-8 py-1.5 rounded-md transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 mx-auto"
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Registering...
                                </>
                            ) : (
                                t('sign_up_btn')
                            )}
                        </button>
                    </div>
                    
                    <div className="text-center mt-4">
                        <span 
                            className="text-[#1877F2] cursor-pointer hover:underline text-sm" 
                            onClick={() => !isLoading && onBackToLogin()}
                        >
                            {t('have_account')}
                        </span>
                    </div>
                </form>
            </div>
            
            {/* API Status Indicator */}
            <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-[#242526] px-3 py-1 rounded-full border border-[#3E4042]">
                    <div className={`w-2 h-2 rounded-full ${!isLoading ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    <span className="text-xs text-[#B0B3B8]">
                        {isLoading ? 'Connecting to UNERA API...' : 'API: Online'}
                    </span>
                </div>
            </div>
        </div>
    );
};

// NEW: Helper function to check if user is authenticated
export const isAuthenticated = (): boolean => {
    try {
        const userStr = localStorage.getItem("unera_user");
        const token = localStorage.getItem("unera_auth_token");
        
        if (!userStr || !token) return false;
        
        // Optional: Check if token is expired (you can implement JWT expiration check)
        const loginTime = localStorage.getItem("unera_login_time");
        if (loginTime) {
            const loginDate = new Date(loginTime);
            const now = new Date();
            const hoursDiff = Math.abs(now.getTime() - loginDate.getTime()) / 36e5;
            
            // Logout after 24 hours (adjust as needed)
            if (hoursDiff > 24) {
                logout();
                return false;
            }
        }
        
        return true;
    } catch {
        return false;
    }
};

// NEW: Get current user data
export const getCurrentUser = (): any | null => {
    try {
        const userStr = localStorage.getItem("unera_user");
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
};

// NEW: Logout function
export const logout = (): void => {
    localStorage.removeItem("unera_user");
    localStorage.removeItem("unera_auth_token");
    localStorage.removeItem("unera_login_time");
    // Redirect to login page if in a browser environment
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

// NEW: Check API status
export const checkApiStatus = async (): Promise<boolean> => {
    try {
        const response = await fetch('https://unera-2.pages.dev/posts');
        return response.ok;
    } catch {
        return false;
    }
};
