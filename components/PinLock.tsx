import React, { useState, useEffect } from 'react';

interface PinLockProps {
  mode: 'set' | 'enter';
  onPinSet?: (pin: string) => void;
  onUnlock: (pin: string) => Promise<boolean>;
  onCancel?: () => void;
}

const PinButton: React.FC<{ value: string; onClick: (v: string) => void; }> = ({ value, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className="w-16 h-16 rounded-full text-2xl font-semibold text-gray-700 dark:text-gray-300 bg-black/5 dark:bg-black/20 hover:bg-black/10 dark:hover:bg-black/30 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
  >
    {value}
  </button>
);

export const PinLock: React.FC<PinLockProps> = ({ mode, onPinSet, onUnlock, onCancel }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const title = mode === 'set' 
    ? (isConfirming ? 'Confirm Your PIN' : 'Set a PIN for Your Journal') 
    : 'Enter Your PIN';
  
  const subtitle = mode === 'set' 
    ? 'This will encrypt your journal entries.'
    : 'Your journal is encrypted.';

  const handlePinInput = (value: string) => {
    if (isLoading) return;
    setError('');
    const targetPin = isConfirming ? confirmPin : pin;
    const setTargetPin = isConfirming ? setConfirmPin : setPin;

    if (value === 'del') {
      setTargetPin(targetPin.slice(0, -1));
    } else if (targetPin.length < 6) {
      setTargetPin(targetPin + value);
    }
  };
  
  useEffect(() => {
    const attemptUnlock = async () => {
       if (pin.length === 6 && mode === 'enter') {
          setIsLoading(true);
          const success = await onUnlock(pin);
          if (!success) {
            setError('Incorrect PIN. Please try again.');
            setPin('');
          }
          setIsLoading(false);
       }
    };
    attemptUnlock();
  }, [pin, mode, onUnlock]);
  
  useEffect(() => {
    if (confirmPin.length === 6) {
        if (pin === confirmPin) {
          onPinSet?.(pin);
        } else {
          setError('PINs do not match. Please try again.');
          setPin('');
          setConfirmPin('');
          setIsConfirming(false);
        }
    }
  }, [confirmPin, pin, onPinSet]);
  
  useEffect(() => {
    if (pin.length === 6 && mode === 'set' && !isConfirming) {
        setIsConfirming(true);
    }
  }, [pin, mode, isConfirming]);

  const activePin = isConfirming ? confirmPin : pin;

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md z-40 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xs text-center">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-green-400 rounded-full flex items-center justify-center mb-6">
          <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-lock'} text-white text-2xl`}></i>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-gray-300 mb-6">{subtitle}</p>
        
        <div className="flex justify-center items-center gap-3 h-8 mb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-colors ${i < activePin.length ? 'bg-purple-400' : 'bg-gray-600'}`}
            ></div>
          ))}
        </div>
        {error && <p className="text-red-400 text-sm mb-4 h-5">{error}</p>}
        
        <div className="grid grid-cols-3 gap-4">
          {'123456789'.split('').map(n => <PinButton key={n} value={n} onClick={handlePinInput} />)}
           {onCancel && <button onClick={onCancel} className="font-semibold text-gray-400 hover:text-white">Cancel</button>}
          <PinButton value="0" onClick={handlePinInput} />
          <button onClick={() => handlePinInput('del')} className="font-semibold text-gray-400 hover:text-white">
            <i className="fas fa-backspace"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
