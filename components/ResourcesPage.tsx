import React, { useState, useEffect, useMemo } from 'react';
import { ResourceCategory, Resource, User, ResourceCompletion, ToastNotification } from '../types';
import resourceService from '../services/resourceService';
import { BoxBreathing } from './BoxBreathing';
import { Quiz } from './Quiz';
import quizService from '../services/quizService';

// --- Reusable Helper Components ---

const Toast: React.FC<{ message: string; icon: string; onDismiss: () => void; }> = ({ message, icon, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3500);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <div className="fixed bottom-5 right-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-2xl p-4 flex items-center gap-3 animate-fade-in-up border border-white/20 dark:border-gray-700/50 z-50">
            <i className={`fas ${icon} text-orange-500 text-xl`}></i>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{message}</span>
        </div>
    );
};


const ResourceCard: React.FC<{
    resource: Resource;
    onClick: () => void;
    isFavorite: boolean;
    onToggleFavorite: (e: React.MouseEvent) => void;
    showFavoriteButton: boolean;
    isCompleted: boolean;
}> = ({ resource, onClick, isFavorite, onToggleFavorite, showFavoriteButton, isCompleted }) => {
    const getIcon = (type: Resource['type']) => {
        switch (type) {
            case 'Article': return 'fa-newspaper';
            case 'Video': return 'fa-video';
            case 'Hotline': return 'fa-phone-alt';
            case 'Website': return 'fa-globe';
            case 'Audio': return 'fa-headphones-alt';
            case 'Infographic': return 'fa-image';
            case 'PDF': return 'fa-file-pdf';
            default: return 'fa-link';
        }
    };

    return (
        <button
            onClick={onClick}
            className="relative block text-left w-full p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-lg shadow-sm border border-white/20 dark:border-gray-700/50 hover:shadow-md hover:border-purple-400/50 dark:hover:border-purple-500/50 transition-all duration-300 group"
        >
            {isCompleted && (
                 <div className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center bg-green-500/20 text-green-600 dark:text-green-300" title="Completed">
                    <i className="fas fa-check"></i>
                </div>
            )}
            {showFavoriteButton && (
                <button
                    onClick={onToggleFavorite}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/10 dark:bg-black/20 hover:bg-black/20 dark:hover:bg-black/30 text-yellow-500 transition-colors z-10"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <i className={`${isFavorite ? 'fas' : 'far'} fa-bookmark`}></i>
                </button>
            )}
            <div className="flex items-start gap-4">
                {resource.imageUrl ? (
                    <div className="flex-shrink-0 w-24 h-16 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <img src={resource.imageUrl} alt={resource.title} className="w-full h-full object-cover"/>
                    </div>
                ) : (
                    <div className="flex-shrink-0 w-10 h-10 mt-1 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-300">
                       <i className={`fas ${getIcon(resource.type)}`}></i>
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors pr-2 mr-8">{resource.title}</h4>
                        {resource.duration && (
                            <span className="flex-shrink-0 text-xs font-medium text-purple-800 dark:text-purple-200 bg-purple-500/10 dark:bg-purple-500/20 px-2 py-0.5 rounded-full">{resource.duration}</span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{resource.description}</p>
                </div>
            </div>
        </button>
    );
};

const QuizResultModal: React.FC<{ result: { level: string, description: string, recommendations: Resource[] }, onClose: () => void, onResourceClick: (resource: Resource) => void }> = ({ result, onClose, onResourceClick }) => {
    const levelColor = { Low: 'bg-green-500', Moderate: 'bg-yellow-500', High: 'bg-red-500' }[result.level] || 'bg-gray-500';
    const levelWidth = { Low: '33%', Moderate: '66%', High: '100%' }[result.level] || '0%';

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50">
                <p className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-2">Assessment Complete</p>
                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                    <div className={`${levelColor} h-2.5 rounded-full`} style={{ width: levelWidth, transition: 'width 0.5s ease-in-out' }}></div>
                </div>
                <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-4">
                    Your current stress level appears to be: <span className="font-bold">{result.level}</span>
                </p>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">{result.description}</p>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Recommended Resources:</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {result.recommendations.map(res => (
                        <div key={res.id} onClick={() => onResourceClick(res)} className="block w-full p-3 bg-black/5 dark:bg-black/20 rounded-lg hover:bg-black/10 dark:hover:bg-black/30 cursor-pointer transition">
                           <h5 className="font-semibold text-gray-800 dark:text-gray-200">{res.title}</h5>
                           <p className="text-xs text-gray-600 dark:text-gray-400">{res.description}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-6">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-600/50 hover:bg-gray-300/50 dark:hover:bg-gray-500/50 transition">Close</button>
                </div>
            </div>
        </div>
    );
};

// --- Helper Functions ---
const calculateStreak = (completions: ResourceCompletion[]): number => {
    const dates = [...new Set(completions.map(c => c.completedAt.split('T')[0]))].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
    if (dates.length === 0) return 0;
    
    let currentStreak = 0;
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Streak can be today or end yesterday
    if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
        return 0;
    }

    let expectedDate = new Date(dates[0]);
    for (const dateStr of dates) {
        if (dateStr === expectedDate.toISOString().split('T')[0]) {
            currentStreak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
            break;
        }
    }
    return currentStreak;
};


// --- Main Page Component ---
const ResourcesPage: React.FC<{ user: User | null }> = ({ user }) => {
    const [categories, setCategories] = useState<ResourceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isBreathingExerciseOpen, setIsBreathingExerciseOpen] = useState(false);
    
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const favoritesKey = useMemo(() => user ? `favorite_resources_${user.id}` : null, [user]);

    const [completions, setCompletions] = useState<ResourceCompletion[]>([]);
    const completionsKey = useMemo(() => user ? `resource_completions_${user.id}` : null, [user]);
    
    const [isQuizOpen, setIsQuizOpen] = useState(false);
    const [quizResult, setQuizResult] = useState<{level: string; description: string; recommendations: Resource[]}|null>(null);
    
    const [toasts, setToasts] = useState<ToastNotification[]>([]);

    useEffect(() => {
        if (favoritesKey) {
            const stored = localStorage.getItem(favoritesKey);
            if (stored) setFavoriteIds(new Set(JSON.parse(stored)));
        } else {
            setFavoriteIds(new Set());
        }
        if (completionsKey) {
            const stored = localStorage.getItem(completionsKey);
            if (stored) setCompletions(JSON.parse(stored));
        } else {
            setCompletions([]);
        }
    }, [favoritesKey, completionsKey]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const data = await resourceService.getResources();
                setCategories(data);
            } catch (err) {
                setError('Failed to load resources.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchResources();
    }, []);

    const streak = useMemo(() => calculateStreak(completions), [completions]);
    const completedIds = useMemo(() => new Set(completions.map(c => c.resourceId)), [completions]);

    const addToast = (message: string, icon: string) => {
        setToasts(prev => [...prev, { id: Date.now(), message, icon }]);
    };
    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const handleResourceComplete = (resourceId: string) => {
        if (!completionsKey) return;
        const oldStreak = streak;
        const newCompletion: ResourceCompletion = { resourceId, completedAt: new Date().toISOString() };
        
        // Prevent duplicate completions on the same day for streak calculation
        const todayStr = new Date().toISOString().split('T')[0];
        const hasCompletedToday = completions.some(c => c.completedAt.startsWith(todayStr));

        const updatedCompletions = [...completions, newCompletion];
        setCompletions(updatedCompletions);
        localStorage.setItem(completionsKey, JSON.stringify(updatedCompletions));

        if (!hasCompletedToday) {
            const newStreak = calculateStreak(updatedCompletions);
            if (newStreak > oldStreak) {
                addToast(`Resource streak: ${newStreak} days!`, 'fa-fire');
            }
        }
    };

    const toggleFavorite = (resourceId: string) => {
        if (!favoritesKey) return;
        const newFavorites = new Set(favoriteIds);
        newFavorites.has(resourceId) ? newFavorites.delete(resourceId) : newFavorites.add(resourceId);
        setFavoriteIds(newFavorites);
        localStorage.setItem(favoritesKey, JSON.stringify(Array.from(newFavorites)));
    };

    const favoriteResources = useMemo(() => {
        return categories.flatMap(cat => cat.resources).filter(res => favoriteIds.has(res.id));
    }, [categories, favoriteIds]);

    const handleResourceClick = (resource: Resource) => {
        handleResourceComplete(resource.id);
        if (resource.id === 'box-breathing') {
            setIsBreathingExerciseOpen(true);
        } else if (resource.link) {
            window.open(resource.link, '_blank', 'noopener,noreferrer');
        }
    };
    
    const handleQuizComplete = (score: number) => {
        const result = quizService.getResults(score);
        const allResources = categories.flatMap(c => c.resources);
        const recommendations = allResources.filter(r => result.recommendedResourceIds.includes(r.id));
        setQuizResult({ level: result.level, description: result.description, recommendations });
        setIsQuizOpen(false);
    };

    if (isLoading) return <div className="flex items-center justify-center h-full"><div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div></div>;
    if (error) return <div className="flex items-center justify-center h-full text-center text-red-500"><p>{error}</p></div>;

    return (
        <div className="flex flex-col h-full max-w-6xl mx-auto bg-white/40 dark:bg-gray-800/40 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
            {isBreathingExerciseOpen && <BoxBreathing onClose={() => setIsBreathingExerciseOpen(false)} onComplete={() => handleResourceComplete('box-breathing')} />}
            {isQuizOpen && <Quiz onComplete={handleQuizComplete} onClose={() => setIsQuizOpen(false)} />}
            {quizResult && <QuizResultModal result={quizResult} onClose={() => setQuizResult(null)} onResourceClick={handleResourceClick} />}
             {toasts.map(toast => (
                <Toast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
            ))}

            <header className="p-4 flex justify-between items-center border-b border-white/20 dark:border-gray-700/50">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Helpful Resources</h1>
                {user && streak > 0 && (
                    <div className="flex items-center gap-1.5 text-orange-500 font-semibold" title={`${streak} day resource streak`}>
                        <i className="fas fa-fire"></i>
                        <span>{streak}</span>
                    </div>
                )}
            </header>
            <main className="flex-1 p-4 md:p-6 overflow-y-auto space-y-8">
                {user && (
                    <div className="p-4 rounded-lg bg-purple-500/10 text-center">
                        <h3 className="font-semibold text-purple-800 dark:text-purple-200">Feeling Unsure?</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">Take a quick assessment to get personalized resource suggestions.</p>
                        <button onClick={() => setIsQuizOpen(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300 text-sm">
                            Assess Your Stress
                        </button>
                    </div>
                )}
                {favoriteResources.length > 0 && (
                     <section>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Favorites</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {favoriteResources.map(resource => (
                                <ResourceCard key={resource.id} resource={resource} onClick={() => handleResourceClick(resource)} isFavorite={true} onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(resource.id); }} showFavoriteButton={!!user} isCompleted={completedIds.has(resource.id)} />
                            ))}
                        </div>
                    </section>
                )}
                {categories.map((category) => (
                    <section key={category.category}>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{category.category}</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {category.resources.map(resource => (
                                <ResourceCard key={resource.id} resource={resource} onClick={() => handleResourceClick(resource)} isFavorite={favoriteIds.has(resource.id)} onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(resource.id); }} showFavoriteButton={!!user} isCompleted={completedIds.has(resource.id)} />
                            ))}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
};

export default ResourcesPage;