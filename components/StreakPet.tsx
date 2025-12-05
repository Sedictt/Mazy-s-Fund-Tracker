import React from 'react';
import { getPetStage, PET_STAGES } from '../utils/gamification';

interface StreakPetProps {
    streak: number;
}

const StreakPet: React.FC<StreakPetProps> = ({ streak }) => {
    const stage = getPetStage(streak);

    // Calculate progress to next stage
    const currentStageIndex = PET_STAGES.findIndex(s => s.name === stage.name);
    const nextStage = PET_STAGES[currentStageIndex + 1];

    let progress = 100;
    let daysToNext = 0;
    let currentProgress = streak;
    let totalNeeded = streak;

    if (nextStage) {
        const prevStageMin = PET_STAGES[currentStageIndex].minStreak;
        totalNeeded = nextStage.minStreak;
        currentProgress = streak;
        const progressRange = nextStage.minStreak - prevStageMin;
        const currentInRange = streak - prevStageMin;
        progress = Math.min(100, Math.max(0, (currentInRange / progressRange) * 100));
        daysToNext = nextStage.minStreak - streak;
    }

    return (
        <div className="bg-gradient-to-b from-amber-100 to-orange-100 rounded-xl border-2 border-orange-300 shadow-lg overflow-hidden">
            {/* Custom animations */}
            <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.4)); }
          50% { filter: drop-shadow(0 0 20px rgba(251, 191, 36, 0.8)); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        .pet-animate {
          animation: bounce-subtle 2s ease-in-out infinite, pulse-glow 3s ease-in-out infinite;
        }
        .pet-animate:hover {
          animation: wiggle 0.3s ease-in-out infinite, pulse-glow 1s ease-in-out infinite;
        }
        .sparkle-1 { animation: sparkle 2s ease-in-out infinite; animation-delay: 0s; }
        .sparkle-2 { animation: sparkle 2s ease-in-out infinite; animation-delay: 0.5s; }
        .sparkle-3 { animation: sparkle 2s ease-in-out infinite; animation-delay: 1s; }
        .sparkle-4 { animation: sparkle 2s ease-in-out infinite; animation-delay: 1.5s; }
      `}</style>

            {/* Pet Image Section */}
            <div className="bg-gradient-to-b from-amber-50 to-orange-50 p-6 flex flex-col items-center relative">
                {/* Sparkle effects */}
                <div className="absolute top-4 left-8 text-yellow-400 sparkle-1">✨</div>
                <div className="absolute top-8 right-10 text-yellow-400 sparkle-2">✨</div>
                <div className="absolute bottom-16 left-12 text-yellow-400 sparkle-3">⭐</div>
                <div className="absolute bottom-20 right-8 text-yellow-400 sparkle-4">✨</div>

                <div className="w-40 h-40 flex items-center justify-center mb-4 cursor-pointer pet-animate">
                    <img
                        src={stage.image}
                        alt={stage.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<span class="text-7xl">${stage.icon}</span>`;
                        }}
                    />
                </div>

                {/* Pet Name */}
                <div className="flex items-center gap-2 text-gray-800">
                    <h3 className="text-xl font-bold">{stage.name}</h3>
                    <span className="text-orange-500 animate-pulse">🔥</span>
                </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white p-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                        {currentProgress}/{totalNeeded}
                    </span>
                </div>

                {/* Progress Text */}
                <p className="text-center text-gray-500 text-sm">
                    {nextStage ? (
                        <>{daysToNext} days to unlock the next look</>
                    ) : (
                        <span className="animate-pulse">🌟 Max level reached! You're legendary! 🌟</span>
                    )}
                </p>
            </div>
        </div>
    );
};

export default StreakPet;
