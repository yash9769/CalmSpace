import React, { useState, useEffect } from 'react';

interface BoxBreathingProps {
  onClose: () => void;
  onComplete: () => void;
}

type Phase = 'idle' | 'inhale' | 'hold1' | 'exhale' | 'hold2';

const phaseConfig: { [key in Phase]: { instruction: string; next: Phase; duration: number } } = {
  idle: { instruction: 'Get Ready...', next: 'inhale', duration: 3 },
  inhale: { instruction: 'Breathe In', next: 'hold1', duration: 4 },
  hold1: { instruction: 'Hold', next: 'exhale', duration: 4 },
  exhale: { instruction: 'Breathe Out', next: 'hold2', duration: 4 },
  hold2: { instruction: 'Hold', next: 'inhale', duration: 4 },
};

const voiceTips = {
    inhale: [
        "Breathe in slowly through your nose for four seconds.",
        "Gently inhale, filling your lungs completely.",
        "Draw your breath in, feeling your belly expand.",
        "Inhale peace."
    ],
    hold1: [
        "Gently hold your breath.",
        "Hold for four.",
        "Pause and hold.",
        "Absorb the calm."
    ],
    exhale: [
        "Slowly exhale through your mouth for four seconds.",
        "Gently release the breath.",
        "Breathe out, letting the tension go.",
        "Exhale tension."
    ],
    hold2: [
        "Hold at the bottom.",
        "Hold for four.",
        "Pause and hold.",
        "Find stillness in the pause."
    ]
};

export const BoxBreathing: React.FC<BoxBreathingProps> = ({ onClose, onComplete }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(phaseConfig.idle.duration);
  const [isActive, setIsActive] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(false);

  // Timer effect for countdown
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setCount(prevCount => {
        if (prevCount > 1) {
          return prevCount - 1;
        } else {
          setPhase(currentPhase => {
            const nextPhase = phaseConfig[currentPhase].next;
            setCount(phaseConfig[nextPhase].duration);
            return nextPhase;
          });
          return 0; // Will be set to correct duration in the next render
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  // Effect for voice guidance
  useEffect(() => {
    if (isActive && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        let utteranceText = '';
        const currentPhase = phase;
        if (currentPhase in voiceTips) {
            const tips = voiceTips[currentPhase as keyof typeof voiceTips];
            utteranceText = tips[Math.floor(Math.random() * tips.length)];
        } else {
            utteranceText = phaseConfig[currentPhase].instruction;
        }

        const utterance = new SpeechSynthesisUtterance(utteranceText);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
  }, [phase, isActive]);

  const handleStart = () => {
    setCount(phaseConfig.idle.duration);
    setPhase('idle');
    setIsActive(true);
    setWasCompleted(true); // Mark as completed once started
  };
  
  const handleStop = () => {
      setIsActive(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (wasCompleted) {
        onComplete();
      }
      onClose();
  }

  const getAnimationClass = () => {
    if (!isActive) return 'scale-50';
    switch (phase) {
      case 'inhale': return 'scale-100';
      case 'exhale': return 'scale-50';
      case 'hold1':
      case 'hold2':
      default:
        return ''; // Will maintain previous state
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 text-white animate-fade-in">
      <button onClick={handleStop} className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-white transition">
        <i className="fas fa-times"></i>
      </button>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className={`absolute w-full h-full bg-purple-500 rounded-lg transition-transform duration-[4000ms] ease-in-out ${getAnimationClass()}`} />
        <div className="relative text-center">
          <p className="text-3xl font-bold mb-2">{phaseConfig[phase].instruction}</p>
          {isActive && <p className="text-6xl font-light">{count}</p>}
        </div>
      </div>

      <div className="mt-16">
        {!isActive ? (
          <button onClick={handleStart} className="px-8 py-3 bg-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-700 transition">
            Start
          </button>
        ) : (
          <p className="text-gray-300">Follow the guide and breathe.</p>
        )}
      </div>
    </div>
  );
};