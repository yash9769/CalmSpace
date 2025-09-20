import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { JournalEntry, Mood, User, EncryptedPayload } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { JournalEditor } from './JournalEditor';
import { PinLock } from './PinLock';
import cryptoService from '../services/cryptoService';


const moodOptions: { mood: Mood, emoji: string, color: string }[] = [
    { mood: 'Ecstatic', emoji: '🤩', color: 'text-yellow-400' },
    { mood: 'Happy', emoji: '😊', color: 'text-green-400' },
    { mood: 'Neutral', emoji: '😐', color: 'text-blue-400' },
    { mood: 'Sad', emoji: '😢', color: 'text-gray-400' },
    { mood: 'Anxious', emoji: '😟', color: 'text-purple-400' },
];

const moodMap: { [key in Mood]: { value: number, emoji: string, color: string } } = {
    Ecstatic: { value: 5, emoji: '🤩', color: '#FBBF24' },
    Happy: { value: 4, emoji: '😊', color: '#34D399' },
    Neutral: { value: 3, emoji: '😐', color: '#60A5FA' },
    Sad: { value: 2, emoji: '😢', color: '#9CA3AF' },
    Anxious: { value: 1, emoji: '😟', color: '#A78BFA' },
};

const valueToEmojiMap: { [key: number]: string } = { 1: '😟', 2: '😢', 3: '😐', 4: '😊', 5: '🤩' };


// --- Reusable Components (kept within file) ---

const MoodTrends: React.FC<{ entries: JournalEntry[] }> = ({ entries }) => {
    type TimeFilter = '7d' | '30d' | 'all';
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('7d');

    const trendData = useMemo(() => {
        const now = new Date();
        let startDate = new Date(-8640000000000000); // Earliest possible date
        if (timeFilter === '7d') {
            startDate = new Date(new Date().setDate(now.getDate() - 7));
        } else if (timeFilter === '30d') {
            startDate = new Date(new Date().setDate(now.getDate() - 30));
        }

        const completedEntries = entries.filter(e => e.status === 'complete' && new Date(e.date) >= startDate);

        // FIX: Explicitly typed the accumulator `acc` to ensure proper type inference down the chain.
        // FIX: Cast the initial value of reduce to the correct type to avoid type inference issues.
        const entriesByDay = completedEntries.reduce((acc: Record<string, number[]>, entry) => {
            const day = new Date(entry.date).toISOString().split('T')[0];
            if (!acc[day]) acc[day] = [];
            acc[day].push(moodMap[entry.mood].value);
            return acc;
        }, {} as Record<string, number[]>);

        return Object.entries(entriesByDay)
            // FIX: Explicitly typed map parameters to fix `unknown` type error on `moodValues`.
            .map(([date, moodValues]: [string, number[]]) => {
                const avgValue = moodValues.reduce((sum, v) => sum + v, 0) / moodValues.length;
                return { date, moodValue: avgValue };
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [entries, timeFilter]);

    const summaryText = useMemo(() => {
        if (trendData.length < 1) return null;
        // FIX: Explicitly typed the accumulator `acc` to resolve the type error.
        // FIX: Cast the initial value of reduce to the correct type to avoid type inference issues.
        const moodCounts = trendData.reduce((acc: Record<string, number>, { moodValue }) => {
            const mood = moodOptions.find(opt => moodMap[opt.mood].value === Math.round(moodValue))?.mood;
            if (mood) {
                acc[mood] = (acc[mood] || 0) + 1;
            }
            return acc;
        }, {} as Record<string, number>);

        const mostFrequentMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
        return mostFrequentMood ? `Your most frequent mood in this period was ${mostFrequentMood}.` : '';
    }, [trendData]);
    
    const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const moodValue = Math.round(payload[0].value);
            const moodInfo = Object.values(moodMap).find(m => m.value === moodValue);
            const formattedDate = new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            return (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/20 dark:border-gray-700/50">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{formattedDate}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">{moodInfo ? `${moodInfo.emoji} ${Object.keys(moodMap).find(k => moodMap[k as Mood].value === moodValue)}` : ''}</p>
                </div>
            );
        }
        return null;
    };
    
    return (
        <div className="p-4 rounded-lg bg-black/5 dark:bg-black/20">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Mood Trends</h3>
                <div className="flex gap-1 p-0.5 rounded-lg bg-gray-200/50 dark:bg-gray-700/50">
                    {(['7d', '30d', 'all'] as TimeFilter[]).map(filter => (
                        <button key={filter} onClick={() => setTimeFilter(filter)} className={`px-2 py-0.5 text-xs rounded-md transition ${timeFilter === filter ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-500'}`}>
                            {filter.replace('d', 'D')}
                        </button>
                    ))}
                </div>
            </div>

            {trendData.length >= 2 ? (
                <>
                    <div className="h-40">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6}/>
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                                <XAxis 
                                  dataKey="date" 
                                  tick={{ fontSize: 10, fill: 'currentColor' }} 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis 
                                  domain={[0.5, 5.5]} 
                                  ticks={[1, 2, 3, 4, 5]} 
                                  tick={{ fontSize: 14, fill: 'currentColor' }} 
                                  axisLine={false} 
                                  tickLine={false}
                                  tickFormatter={(value) => valueToEmojiMap[value] || ''}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#A78BFA', strokeWidth: 1, strokeDasharray: '3 3' }} />
                                <Area type="monotone" dataKey="moodValue" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#moodGradient)" dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    {summaryText && <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">{summaryText}</p>}
                </>
            ) : (
                <div className="h-40 flex items-center justify-center text-sm text-center text-gray-500 dark:text-gray-400">Add more entries to see your mood trends over time.</div>
            )}
        </div>
    );
};

const ConfirmationDialog: React.FC<{ message: string; onConfirm: () => void; onCancel: () => void; }> = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{message}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-600/50 hover:bg-gray-300/50 dark:hover:bg-gray-500/50 transition">Cancel</button>
                <button onClick={onConfirm} className="px-6 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition">Delete</button>
            </div>
        </div>
    </div>
);

const JournalEntryCard: React.FC<{ entry: JournalEntry; onDelete: (id: string) => void; }> = ({ entry, onDelete }) => {
    const { emoji } = moodOptions.find(m => m.mood === entry.mood) || { emoji: '🤔' };
    const formattedDate = new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return (
        <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-5 shadow-md border border-white/20 dark:border-gray-700/50">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <span className="text-4xl">{emoji}</span>
                    {entry.status === 'draft' && (<span className="px-2.5 py-1 text-xs font-semibold text-yellow-800 dark:text-yellow-200 bg-yellow-400/50 dark:bg-yellow-500/30 rounded-full">Draft</span>)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{formattedDate}</span>
                    <button onClick={() => onDelete(entry.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors" aria-label="Delete entry"><i className="fas fa-trash-alt"></i></button>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-4">{entry.content}</p>
            <div className="flex flex-wrap gap-2">
                {entry.tags.map(tag => (<span key={tag} className="px-2.5 py-1 text-xs font-medium text-purple-800 dark:text-purple-200 bg-purple-500/10 dark:bg-purple-500/20 rounded-full">#{tag}</span>))}
            </div>
        </div>
    );
};


// --- Main Journal Page Component ---
interface JournalPageProps { user: User; }

const JournalPage: React.FC<JournalPageProps> = ({ user }) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
    const [notificationPermission, setNotificationPermission] = useState('default');

    // --- Security State ---
    const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
    const [isLocked, setIsLocked] = useState(true);
    const [isPinSetupMode, setIsPinSetupMode] = useState(false);
    const [isPinSet, setIsPinSet] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const saltKey = useMemo(() => `journal_pin_salt_${user.id}`, [user.id]);
    const verifierKey = useMemo(() => `journal_pin_verifier_${user.id}`, [user.id]);
    const storageKey = useMemo(() => `journal_entries_encrypted_${user.id}`, [user.id]);
    
    // --- Security Effects & Functions ---
    useEffect(() => {
        // Check for notification permission status on component mount
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
        
        const checkPinStatus = () => {
            const salt = localStorage.getItem(saltKey);
            if (salt) {
                setIsPinSet(true);
                setIsLocked(true);
            } else {
                setIsPinSet(false);
                setIsLocked(false); // No PIN set, so it's unlocked by default
            }
            setIsLoading(false);
        };
        checkPinStatus();
    }, [saltKey]);
    
    const loadAndDecryptEntries = useCallback(async (key: CryptoKey) => {
        try {
            const encryptedData = localStorage.getItem(storageKey);
            if (encryptedData) {
                const payload: EncryptedPayload = JSON.parse(encryptedData);
                const decryptedString = await cryptoService.decrypt(payload, key);
                setEntries(JSON.parse(decryptedString));
            }
        } catch (error) {
            console.error("Failed to load or decrypt journal entries", error);
            // Handle decryption failure (e.g., show error message)
        }
    }, [storageKey]);
    
    const saveAndEncryptEntries = useCallback(async (updatedEntries: JournalEntry[]) => {
        if (!encryptionKey) return;
        try {
            const dataString = JSON.stringify(updatedEntries);
            const payload = await cryptoService.encrypt(dataString, encryptionKey);
            localStorage.setItem(storageKey, JSON.stringify(payload));
        } catch (error) {
            console.error("Failed to save or encrypt journal entries", error);
        }
    }, [encryptionKey, storageKey]);

    const handlePinSet = async (pin: string) => {
      setIsLoading(true);
      const salt = cryptoService.generateSalt();
      const key = await cryptoService.deriveKey(pin, salt);
      const verifierPayload = await cryptoService.encrypt('calmspace-verification', key);
      
      localStorage.setItem(saltKey, cryptoService.bufferToHex(salt));
      localStorage.setItem(verifierKey, JSON.stringify(verifierPayload));

      setEncryptionKey(key);
      setIsPinSet(true);
      setIsPinSetupMode(false);
      setIsLocked(false);
      setIsLoading(false);
    };
    
    const handleUnlockAttempt = async (pin: string): Promise<boolean> => {
        const saltHex = localStorage.getItem(saltKey);
        const verifierJson = localStorage.getItem(verifierKey);
        if (!saltHex || !verifierJson) return false;
        
        try {
            const salt = cryptoService.hexToBuffer(saltHex);
            const key = await cryptoService.deriveKey(pin, salt);
            const verifierPayload: EncryptedPayload = JSON.parse(verifierJson);
            await cryptoService.decrypt(verifierPayload, key);
            
            // Success!
            setEncryptionKey(key);
            setIsLocked(false);
            await loadAndDecryptEntries(key);
            return true;
        } catch (e) {
            console.error("PIN verification failed", e);
            return false;
        }
    };
    
    // --- Regular Journal Logic ---
    useEffect(() => {
        if (entries.length > 0) {
            saveAndEncryptEntries(entries);
        }
    }, [entries, saveAndEncryptEntries]);

    const allTags = useMemo(() => Array.from(new Set(entries.flatMap(entry => entry.tags))), [entries]);

    const displayedEntries = useMemo(() => {
        const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return activeTags.length === 0 ? sorted : sorted.filter(entry => activeTags.every(tag => entry.tags.includes(tag)));
    }, [entries, activeTags]);
    
    // --- Streaks and Reminders ---
    const streak = useMemo(() => {
        const dates = [...new Set(entries.filter(e => e.status === 'complete').map(e => e.date.split('T')[0]))].sort();
        if (dates.length === 0) return 0;
    
        let currentStreak = 0;
        let expectedDate = new Date();
        const todayStr = expectedDate.toISOString().split('T')[0];
    
        // If no entry today, check from yesterday
        if (!dates.includes(todayStr)) {
            expectedDate.setDate(expectedDate.getDate() - 1);
        }
    
        // Iterate backwards through unique dates
        for (let i = dates.length - 1; i >= 0; i--) {
            const entryDate = new Date(dates[i] + 'T00:00:00Z');
            const expectedDateMidnight = new Date(expectedDate.getFullYear(), expectedDate.getMonth(), expectedDate.getDate());
            
            if (entryDate.getTime() === expectedDateMidnight.getTime()) {
                currentStreak++;
                expectedDate.setDate(expectedDate.getDate() - 1);
            } else {
                break;
            }
        }
        return currentStreak;
    }, [entries]);

    const hasJournaledToday = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        return entries.some(e => e.date.startsWith(todayStr) && e.status === 'complete');
    }, [entries]);

    const handleNotificationRequest = async () => {
        if (!('Notification' in window)) {
            alert("This browser does not support desktop notification");
            return;
        }
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission === 'granted') {
            new Notification("CalmSpace Reminders", {
                body: "Great! You'll now receive daily reminders to journal.",
                icon: '/vite.svg'
            });
        }
    };

    const handleToggleTag = (tag: string) => setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    const handleSaveEntry = (newEntryData: Omit<JournalEntry, 'id' | 'date' | 'status'>, status: 'complete' | 'draft') => {
        const newEntry: JournalEntry = { ...newEntryData, id: `${Date.now()}`, date: new Date().toISOString(), status };
        setEntries(prev => [newEntry, ...prev]);
        setIsCreating(false);
    };

    const handleDeleteRequest = (id: string) => setEntryToDelete(id);
    const handleConfirmDelete = () => {
        if (!entryToDelete) return;
        const updatedEntries = entries.filter(entry => entry.id !== entryToDelete);
        setEntries(updatedEntries);
        saveAndEncryptEntries(updatedEntries); // Manually trigger save on delete
        setEntryToDelete(null);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isPinSetupMode) {
      return <PinLock mode="set" onPinSet={handlePinSet} onUnlock={handleUnlockAttempt} onCancel={() => setIsPinSetupMode(false)} />;
    }
    
    if (isLocked) {
        return <PinLock mode="enter" onUnlock={handleUnlockAttempt} />;
    }

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
             {isCreating && <JournalEditor onSave={handleSaveEntry} onCancel={() => setIsCreating(false)} />}
             {entryToDelete && <ConfirmationDialog message="Are you sure?" onConfirm={handleConfirmDelete} onCancel={() => setEntryToDelete(null)} />}
            
            <header className="p-4 flex justify-between items-center border-b border-white/20 dark:border-gray-700/50">
                <div className="flex items-center gap-4">
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Journal</h1>
                   {streak > 0 && (
                        <div className="flex items-center gap-1.5 text-orange-500 font-semibold" title={`${streak} day streak`}>
                            <i className="fas fa-fire"></i>
                            <span>{streak}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => isPinSet ? setIsLocked(true) : setIsPinSetupMode(true)} 
                    className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    aria-label={isPinSet ? "Lock Journal" : "Set PIN Lock"}
                  >
                    <i className={`fas ${isPinSet ? 'fa-lock' : 'fa-lock-open'}`}></i>
                  </button>
                   <button 
                    onClick={handleNotificationRequest}
                    disabled={notificationPermission === 'granted'}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Enable Reminders"
                    title={notificationPermission === 'granted' ? 'Reminders are enabled' : 'Enable daily reminders'}
                  >
                    <i className={`fas ${notificationPermission === 'granted' ? 'fa-bell' : 'fa-bell-slash'}`}></i>
                  </button>
                  <button onClick={() => setIsCreating(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center gap-2">
                      <i className="fas fa-plus"></i>
                      <span className="hidden sm:inline">New Entry</span>
                  </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <aside className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r border-white/20 dark:border-gray-700/50 overflow-y-auto">
                    <MoodTrends entries={entries} />
                     <div className="mt-6">
                        <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Filter by Tags</h3>
                        <div className="flex flex-wrap gap-2">{allTags.map(tag => (<button key={tag} onClick={() => handleToggleTag(tag)} className={`px-3 py-1 text-sm rounded-full transition ${activeTags.includes(tag) ? 'bg-purple-600 text-white' : 'bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/50'}`}>{tag}</button>))}</div>
                    </div>
                </aside>

                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {!hasJournaledToday && (
                       <div className="p-3 mb-4 rounded-lg bg-purple-500/10 text-center animate-fade-in">
                         <p className="text-sm font-medium text-purple-800 dark:text-purple-200">✨ Take 2 mins to reflect today. ✨</p>
                       </div>
                    )}
                    {displayedEntries.length > 0 ? (
                        <div className="space-y-6">{displayedEntries.map(entry => (<JournalEntryCard key={entry.id} entry={entry} onDelete={handleDeleteRequest} />))}</div>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400 mt-10"><p>No journal entries found.</p><p className="text-sm">Click "New Entry" to write down your thoughts.</p></div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default JournalPage;