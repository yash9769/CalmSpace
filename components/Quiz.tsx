import React, { useState } from 'react';
import { Quiz as QuizType, QuizQuestion } from '../types';
import quizService from '../services/quizService';

interface QuizProps {
    onComplete: (score: number) => void;
    onClose: () => void;
}

const quizData: QuizType = quizService.getQuiz();

export const Quiz: React.FC<QuizProps> = ({ onComplete, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const question: QuizQuestion = quizData.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / quizData.questions.length) * 100;

    const handleNext = () => {
        if (selectedOption === null) return;

        const newAnswers = [...answers, selectedOption];
        setAnswers(newAnswers);
        setSelectedOption(null);

        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
            onComplete(totalScore);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50">
                <div className="relative mb-6">
                    <button onClick={onClose} className="absolute -top-2 -right-2 text-xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition">
                        <i className="fas fa-times-circle"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{quizData.title}</h2>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                        <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">{currentQuestionIndex + 1}. {question.question}</p>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedOption(option.score)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-colors duration-200 ${
                                    selectedOption === option.score 
                                    ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-500' 
                                    : 'bg-gray-50/50 dark:bg-gray-700/50 border-transparent hover:border-purple-300'
                                }`}
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex justify-end mt-6">
                    <button 
                        onClick={handleNext} 
                        disabled={selectedOption === null}
                        className="px-6 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed"
                    >
                        {currentQuestionIndex < quizData.questions.length - 1 ? 'Next' : 'Finish'}
                    </button>
                </div>
            </div>
        </div>
    );
};