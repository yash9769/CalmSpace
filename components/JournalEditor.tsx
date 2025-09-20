import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { JournalEntry, Mood } from '../types';

const moodOptions: { mood: Mood, emoji: string }[] = [
    { mood: 'Ecstatic', emoji: '🤩' },
    { mood: 'Happy', emoji: '😊' },
    { mood: 'Neutral', emoji: '😐' },
    { mood: 'Sad', emoji: '😢' },
    { mood: 'Anxious', emoji: '😟' },
];

const prompts = [
    "What was the highlight of your day?",
    "Describe a specific event from today and how it made you feel.",
    "What challenged you today, and how did you respond?",
    "What is one thing you're grateful for that happened today?",
    "Write about a conversation that stood out to you.",
    "What's something that made you smile or laugh today?",
    "How did you take care of your well-being today?",
    "What was on your mind the most throughout the day?",
    "Describe a simple pleasure you enjoyed today.",
    "What is one thing you learned today, about yourself or the world?"
];

// A custom hook to encapsulate Web Speech API logic
const useSpeechRecognition = (onTranscript: (transcript: string) => void) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = React.useRef<any>(null); // Using `any` for SpeechRecognition

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
               onTranscript(finalTranscript + ' ');
            }
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };
        
        recognitionRef.current = recognition;

    }, [onTranscript]);

    const toggleListening = useCallback(() => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
        setIsListening(prev => !prev);
    }, [isListening]);

    return { isListening, toggleListening, isSupported: !!recognitionRef.current };
};


// Mood Selector Component
const MoodSelector: React.FC<{ selectedMood: Mood | null; onSelectMood: (mood: Mood) => void; }> = ({ selectedMood, onSelectMood }) => (
    <div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">How are you feeling today?</h3>
        <div className="flex justify-center items-center gap-4">
            {moodOptions.map(({ mood, emoji }) => (
                <button
                    key={mood}
                    onClick={() => onSelectMood(mood)}
                    className={`p-2 rounded-full transition-all duration-200 text-4xl ${selectedMood === mood ? 'transform scale-125 ring-2 ring-purple-500 bg-purple-500/10' : 'hover:scale-110'}`}
                    aria-label={mood}
                >
                    {emoji}
                </button>
            ))}
        </div>
    </div>
);


// Main Journal Editor Modal
export const JournalEditor: React.FC<{ onSave: (entry: Omit<JournalEntry, 'id' | 'date' | 'status'>, status: 'complete' | 'draft') => void; onCancel: () => void; }> = ({ onSave, onCancel }) => {
    const [mood, setMood] = useState<Mood | null>(null);
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    
    const dailyPrompt = useMemo(() => {
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        return prompts[dayOfYear % prompts.length];
    }, []);
    
    const handleTranscript = useCallback((transcript: string) => {
        setContent(prev => prev + transcript);
    }, []);

    const { isListening, toggleListening, isSupported } = useSpeechRecognition(handleTranscript);

    const handleSave = (status: 'complete' | 'draft') => {
        onSave({
            mood: mood || 'Neutral',
            content: content.trim(),
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        }, status);
    };
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">New Journal Entry</h2>
                <div className="space-y-6">
                    <MoodSelector selectedMood={mood} onSelectMood={setMood} />
                    
                    <div className="p-3 rounded-lg bg-black/5 dark:bg-black/20 text-center italic text-gray-600 dark:text-gray-400 text-sm">
                       <p>"{dailyPrompt}"</p>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="journal-content" className="font-semibold text-gray-700 dark:text-gray-300">Your Thoughts</label>
                            <button
                                onClick={isSupported ? toggleListening : undefined}
                                disabled={!isSupported}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-purple-200/50 dark:bg-purple-800/50 text-purple-700 dark:text-purple-200 hover:bg-purple-300/50'} disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:text-gray-400 dark:disabled:text-gray-500 disabled:cursor-not-allowed`}
                                aria-label="Toggle voice dictation"
                                title={isSupported ? "Start voice input" : "Voice input is not supported in your browser"}
                            >
                                <i className="fas fa-microphone-alt"></i>
                            </button>
                        </div>
                       <textarea
                            id="journal-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's on your mind?"
                            rows={8}
                            className="w-full p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-200"
                        />
                    </div>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Tags (e.g., gratitude, work, stress)"
                        className="w-full p-3 bg-gray-50/50 dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-gray-200"
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={onCancel} className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-600/50 hover:bg-gray-300/50 dark:hover:bg-gray-500/50 transition">Cancel</button>
                    <button onClick={() => handleSave('draft')} disabled={!content.trim()} className="px-6 py-2 rounded-lg text-purple-700 dark:text-purple-300 font-medium bg-purple-500/10 hover:bg-purple-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed">Save Draft</button>
                    <button onClick={() => handleSave('complete')} disabled={!mood || !content.trim()} className="px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed">Save Entry</button>
                </div>
            </div>
        </div>
    );
};