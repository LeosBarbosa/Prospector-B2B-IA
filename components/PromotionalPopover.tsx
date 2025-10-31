import React, { useState, useEffect } from 'react';

const PromotionalPopover: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(59);

    useEffect(() => {
        const showTimer = setTimeout(() => setVisible(true), 2000); // Show after 2 seconds
        
        const countdownTimer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 59));
        }, 1000);

        return () => {
            clearTimeout(showTimer);
            clearInterval(countdownTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-5 left-5 bg-white p-4 rounded-lg shadow-2xl max-w-sm w-full border border-gray-200 animate-fade-in">
            <button onClick={() => setVisible(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                &times;
            </button>
            <div className="flex items-center gap-3">
                <div className="text-2xl">🔥</div>
                <div>
                    <p className="font-bold text-sm">SOMENTE HOJE!</p>
                    <p className="text-sm">Ganhe +100 créditos durante sua assinatura! 🔥</p>
                </div>
                 <div className="text-2xl font-bold text-gray-800">
                    54:{timeLeft.toString().padStart(2, '0')}
                 </div>
            </div>
        </div>
    );
};

export default PromotionalPopover;
