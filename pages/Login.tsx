
import React, { useState } from 'react';
import { useAuth } from '../App';
import { MOCK_STUDENTS, MOCK_DRIVERS, MOCK_ADMIN } from '../constants';
import { BusIcon, UserCircleIcon, LockClosedIcon, ClipboardIcon, CheckIcon } from '../components/icons';
import ThemeToggle from '../components/ThemeToggle';
import Card from '../components/Card';
import { ShootingStars } from '../components/ui/shooting-stars';


const CredentialItem: React.FC<{ email: string; onSelect: (email: string) => void; isSelected: boolean; }> = ({ email, onSelect, isSelected }) => (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-white/10 dark:hover:bg-black/20 transition-colors group">
        <span className="text-sm truncate pr-2">{email}</span>
        <button 
            onClick={() => onSelect(email)} 
            className="text-gray-500 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors p-1"
            aria-label={`Fill and copy credentials for ${email}`}
        >
            {isSelected 
                ? <CheckIcon className="w-4 h-4 text-green-400" /> 
                : <ClipboardIcon className="w-4 h-4" />
            }
        </button>
    </div>
);


const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCredential, setSelectedCredential] = useState<string | null>(null);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email && password) {
            login(email, password);
        } else {
            alert("Please enter email and password.");
        }
    };

    const handleCredentialClick = (emailToFill: string) => {
        setEmail(emailToFill);
        setPassword('password123');

        navigator.clipboard.writeText(emailToFill).then(() => {
            setSelectedCredential(emailToFill);
            setTimeout(() => setSelectedCredential(null), 2000);
        }).catch(err => {
            console.error("Failed to copy email: ", err);
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-gray-900 flex flex-col items-center justify-center text-gray-900 dark:text-gray-50 p-4">
             <ShootingStars
                starColor="#9E00FF"
                trailColor="#2EB9DF"
                minSpeed={15}
                maxSpeed={35}
                minDelay={1000}
                maxDelay={3000}
            />
            <ShootingStars
                starColor="#FF0099"
                trailColor="#FFB800"
                minSpeed={10}
                maxSpeed={25}
                minDelay={2000}
                maxDelay={4000}
            />
            <ShootingStars
                starColor="#00FF9E"
                trailColor="#00B8FF"
                minSpeed={20}
                maxSpeed={40}
                minDelay={1500}
                maxDelay={3500}
            />
            <div className="absolute top-4 right-4 z-10">
                <ThemeToggle />
            </div>
            <div className="w-full max-w-md mx-auto z-10">
                <div className="text-center mb-8">
                    <BusIcon className="w-16 h-16 mx-auto text-primary-400" />
                    <h1 className="text-3xl font-bold mt-4 text-shadow text-white">College Transport Tracker</h1>
                    <p className="text-gray-300 mt-2">Login to your account.</p>
                </div>

                <Card>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                             <label htmlFor="email" className="block text-sm font-medium text-gray-800 dark:text-gray-200">Email Address</label>
                             <div className="mt-1 relative rounded-md shadow-sm">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                     <UserCircleIcon className="h-5 w-5 text-gray-400" />
                                 </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@example.com"
                                    className="block w-full pl-10 pr-3 py-2 border border-white/20 bg-white/30 dark:bg-black/30 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    required
                                />
                             </div>
                        </div>
                         <div>
                             <label htmlFor="password"  className="block text-sm font-medium text-gray-800 dark:text-gray-200">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                     <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                 </div>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="************"
                                    className="block w-full pl-10 pr-3 py-2 border border-white/20 bg-white/30 dark:bg-black/30 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105"
                        >
                            Login
                        </button>
                    </form>
                </Card>

                <div className="mt-6">
                    <Card>
                        <h3 className="text-lg font-bold text-center mb-3">Account Credentials</h3>
                        <p className="text-center text-sm mb-4">Password for all accounts: <span className="font-semibold bg-white/20 dark:bg-black/20 px-2 py-1 rounded">password123</span></p>
                        <div className="max-h-60 overflow-y-auto pr-2 text-sm">
                             <h4 className="font-bold mt-2 mb-1 text-gray-600 dark:text-gray-300">Admin:</h4>
                             <div className="space-y-1 mb-4">
                               <CredentialItem email={MOCK_ADMIN.email} onSelect={handleCredentialClick} isSelected={selectedCredential === MOCK_ADMIN.email} />
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6">
                                {/* Students Column */}
                                <div>
                                    <h4 className="font-bold mt-2 mb-1 text-primary-600 dark:text-primary-300">Students:</h4>
                                    <div className="space-y-1">
                                        {MOCK_STUDENTS.map(s => <CredentialItem key={s.id} email={s.email} onSelect={handleCredentialClick} isSelected={selectedCredential === s.email} />)}
                                    </div>
                                </div>
                                {/* Staff Column */}
                                <div>
                                    <h4 className="font-bold mt-2 mb-1 text-green-600 dark:text-green-300">Drivers:</h4>
                                    <div className="space-y-1">
                                        {MOCK_DRIVERS.map(d => <CredentialItem key={d.id} email={d.email} onSelect={handleCredentialClick} isSelected={selectedCredential === d.email} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;