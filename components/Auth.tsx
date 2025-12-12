import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { User } from '../types';

interface LoginProps {
    onLogin: (email: string, pass: string) => void;
    onNavigateToRegister: () => void;
    onClose: () => void;
    error: string;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister, onClose, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { t, setLanguage, language } = useLanguage();
    
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        onLogin(email, password); 
    };

    return (
        <div className="min-h-screen bg-[#18191A] flex flex-col justify-between p-4 relative animate-fade-in">
            <div className="absolute top-4 right-4 w-10 h-10 bg-[#3A3B3C] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#4E4F50] transition-colors z-50" onClick={onClose} title="Continue as Guest">
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
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded text-sm text-center">{error}</div>}
                        <input 
                            type="email" 
                            placeholder={t('email_placeholder') || "Email address"} 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-4 py-3.5 text-[17px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#1877F2] focus:shadow-[0_0_0_2px_#263951]" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder={t('password_placeholder') || "Password"} 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-4 py-3.5 text-[17px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#1877F2] focus:shadow-[0_0_0_2px_#263951]" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                        <button type="submit" className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-[20px] py-2.5 rounded-md transition-colors">
                            {t('login_btn')}
                        </button>
                    </form>
                    
                    <div className="text-center">
                        <span className="text-[#1877F2] text-[14px] hover:underline cursor-pointer">{t('forgot_password')}</span>
                    </div>
                    
                    <div className="border-b border-[#3E4042] my-1"></div>
                    
                    <div className="flex flex-col gap-3">
                        <button onClick={onNavigateToRegister} className="w-auto mx-auto bg-[#42B72A] hover:bg-[#36A420] text-white font-bold text-[17px] px-8 py-3 rounded-md transition-colors">
                            {t('create_new_account')}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 text-center text-xs text-[#B0B3B8]">
                <p>Login to comment, like, and share posts. <span className="text-[#E4E6EB] font-bold cursor-pointer hover:underline" onClick={onClose}>Continue as Guest</span> to view.</p>
            </div>
            
            <div className="mt-auto pt-8 pb-4 w-full max-w-[1000px] mx-auto border-t border-[#3E4042]">
                <div className="flex flex-wrap justify-center gap-4 text-sm text-[#B0B3B8]">
                    <span className={`cursor-pointer hover:underline ${language === 'en' ? 'font-bold text-[#E4E6EB]' : ''}`} onClick={() => setLanguage('en')}>English (US)</span>
                    <span className={`cursor-pointer hover:underline ${language === 'sw' ? 'font-bold text-[#E4E6EB]' : ''}`} onClick={() => setLanguage('sw')}>Kiswahili</span>
                    <span className={`cursor-pointer hover:underline ${language === 'fr' ? 'font-bold text-[#E4E6EB]' : ''}`} onClick={() => setLanguage('fr')}>Français (France)</span>
                    <span className={`cursor-pointer hover:underline ${language === 'es' ? 'font-bold text-[#E4E6EB]' : ''}`} onClick={() => setLanguage('es')}>Español</span>
                </div>
            </div>
        </div>
    );
};

interface RegisterProps {
    onRegister: (newUser: Partial<User>) => void;
    onBackToLogin: () => void;
}

interface CountryData {
    name: { common: string };
    flag: string; // emoji
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onBackToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState(''); // Optional
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nationality, setNationality] = useState('Tanzania');
    const [region, setRegion] = useState('');
    
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
                // Fallback handled by empty list or default
            });
    }, []);

    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault(); 
        
        // Validation for 6 digits
        if (password.length < 6 || isNaN(Number(password))) {
            alert("Password must be at least 6 numbers.");
            return;
        }

        const fullName = surname.trim() ? `${firstName} ${surname}` : firstName; 
        
        onRegister({ 
            name: fullName, 
            firstName, 
            lastName: surname, 
            email, 
            password, 
            nationality,
            location: region, // Use region as location
            birthDate: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`, 
            gender, 
            profileImage: `https://ui-avatars.com/api/?name=${firstName}+${surname || ''}&background=random`, 
            coverImage: 'https://images.unsplash.com/photo-1554034483-04fda0d3507b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80', 
            bio: `Hello! I'm ${fullName} from ${region}, ${nationality}.`, 
            followers: [], 
            following: [], 
            isOnline: true 
        }); 
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
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder={t('first_name') || "First name"} 
                            className="w-1/2 bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            required 
                        />
                        <input 
                            type="text" 
                            placeholder={t('surname_optional') || "Surname (optional)"} 
                            className="w-1/2 bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                            value={surname} 
                            onChange={(e) => setSurname(e.target.value)} 
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-[12px] text-[#B0B3B8]">Nationality</label>
                        <select 
                            className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] focus:outline-none focus:border-[#505151]" 
                            value={nationality} 
                            onChange={(e) => setNationality(e.target.value)}
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
                    />
                    
                    <input 
                        type="email" 
                        placeholder={t('email_mobile_placeholder') || "Email address"} 
                        className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    
                    <input 
                        type="password" 
                        placeholder="Password (6 numbers)" 
                        pattern="[0-9]*"
                        inputMode="numeric"
                        minLength={6}
                        className="w-full bg-[#3A3B3C] border border-[#3E4042] rounded-md px-3 py-2 text-[15px] text-[#E4E6EB] placeholder-[#B0B3B8] focus:outline-none focus:border-[#505151]" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        title="Password must be at least 6 numbers"
                    />
                    
                    <div className="mt-1">
                        <label className="text-[12px] text-[#B0B3B8] block mb-1">{t('dob') || "Date of birth"}</label>
                        <div className="flex gap-2">
                            <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="w-1/3 bg-[#3A3B3C] border border-[#3E4042] rounded-md p-1 text-[#E4E6EB]">
                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-1/3 bg-[#3A3B3C] border border-[#3E4042] rounded-md p-1 text-[#E4E6EB]">
                                {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                            </select>
                            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-1/3 bg-[#3A3B3C] border border-[#3E4042] rounded-md p-1 text-[#E4E6EB]">
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-1">
                        <label className="text-[12px] text-[#B0B3B8] block mb-1">{t('gender') || "Gender"}</label>
                        <div className="flex gap-2 justify-between">
                            <label className="border border-[#3E4042] rounded-md p-2 flex items-center justify-between flex-1 cursor-pointer bg-[#3A3B3C]">
                                <span className="text-[#E4E6EB]">{t('female')}</span>
                                <input type="radio" name="gender" checked={gender === 'Female'} onChange={() => setGender('Female')} />
                            </label>
                            <label className="border border-[#3E4042] rounded-md p-2 flex items-center justify-between flex-1 cursor-pointer bg-[#3A3B3C]">
                                <span className="text-[#E4E6EB]">{t('male')}</span>
                                <input type="radio" name="gender" checked={gender === 'Male'} onChange={() => setGender('Male')} />
                            </label>
                            <label className="border border-[#3E4042] rounded-md p-2 flex items-center justify-between flex-1 cursor-pointer bg-[#3A3B3C]">
                                <span className="text-[#E4E6EB]">{t('custom')}</span>
                                <input type="radio" name="gender" checked={gender === 'Custom'} onChange={() => setGender('Custom')} />
                            </label>
                        </div>
                    </div>
                    
                    <p className="text-[11px] text-[#B0B3B8] my-2">{t('terms_text')}</p>
                    
                    <div className="text-center mt-2">
                        <button type="submit" className="w-[200px] bg-[#00A400] hover:bg-[#008f00] text-white font-bold text-[18px] px-8 py-1.5 rounded-md transition-colors shadow-sm">
                            {t('sign_up_btn')}
                        </button>
                    </div>
                    
                    <div className="text-center mt-4">
                        <span className="text-[#1877F2] cursor-pointer hover:underline text-sm" onClick={onBackToLogin}>
                            {t('have_account')}
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};