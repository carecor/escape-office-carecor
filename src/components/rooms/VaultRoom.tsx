import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Trophy,
  RotateCw,
  Clock,
  ArrowRight,
  HelpCircle,
  Award
} from 'lucide-react';
import { RoomId } from '../../types/game';
import { sounds } from '../../utils/audio';

interface VaultRoomProps {
  completedRooms: Set<RoomId>;
  totalSeconds: number;
  onResetGame: () => void;
  onBackToOffice: () => void;
}

export const VaultRoom: React.FC<VaultRoomProps> = ({
  completedRooms,
  totalSeconds,
  onResetGame,
  onBackToOffice
}) => {
  // 7-letter dial array. Target: C-A-R-E-C-O-R
  const [letters, setLetters] = useState<string[]>(['A', 'A', 'A', 'A', 'A', 'A', 'A']);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleRotateLetter = (index: number, direction: 'up' | 'down') => {
    sounds.playClick();
    const currChar = letters[index];
    const currIdx = ALPHABET.indexOf(currChar);
    let nextIdx = direction === 'up' ? currIdx + 1 : currIdx - 1;

    if (nextIdx >= ALPHABET.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = ALPHABET.length - 1;

    const updated = [...letters];
    updated[index] = ALPHABET[nextIdx];
    setLetters(updated);
    setErrorMessage(null);
  };

  const handleDirectKeyChange = (index: number, val: string) => {
    if (!val) return;
    sounds.playClick();
    const upper = val.slice(-1).toUpperCase();
    if (ALPHABET.includes(upper)) {
      const updated = [...letters];
      updated[index] = upper;
      setLetters(updated);
      setErrorMessage(null);

      // Auto-focus next input
      const nextInput = document.getElementById(`dial-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleAttemptUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const assembledWord = letters.join('');

    if (assembledWord === 'CARECOR') {
      sounds.playVictory();
      setIsUnlocked(true);

      // Fire confetti bursts!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 300);
      } catch {
        // Confetti fallback
      }
    } else {
      sounds.playWrong();
      setErrorMessage(`"${assembledWord}" is not the vault code. Remember: The clue is 7 letters!`);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s.toString().padStart(2, '0')}s`;
  };

  const allPreliminaryDone = completedRooms.size >= 7;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Story Banner */}
      <div className="bg-gradient-to-r from-white via-[#FEAEC9]/30 to-[#9AD9EA]/20 border-2 border-[#FEAEC9] rounded-2xl p-4 sm:p-6 shadow-sm text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-[#FEAEC9] text-pink-950 uppercase tracking-wider mb-2">
          <ShieldCheck className="w-4 h-4 text-pink-700" />
          <span>The Grand Exit Vault</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Main Door Exit Vault
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto mt-1">
          You have cleared the challenges of the Carecor workplace! All 7 keys have primed the main exit tumblers.
          To trigger the final release, set the 7-letter keyword into the vault dials!
        </p>
      </div>

      {/* Vault Wheel & Letter Dials Card */}
      <div className="bg-white rounded-3xl border-4 border-[#C7BFE8] p-6 sm:p-10 shadow-xl relative overflow-hidden text-center space-y-6">
        {/* Animated Vault Door Visual */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 mx-auto">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
            {/* Outer Heavy Steel Flange */}
            <circle cx="100" cy="100" r="95" fill="#374151" stroke="#FEAEC9" strokeWidth="4" />
            <circle cx="100" cy="100" r="80" fill="#1F2937" stroke="#9AD9EA" strokeWidth="3" />

            {/* Rotating Spokes */}
            <g className={isUnlocked ? 'animate-spin' : ''} style={{ transformOrigin: 'center', animationDuration: '3s' }}>
              <line x1="100" y1="20" x2="100" y2="180" stroke="#FEAEC9" strokeWidth="6" strokeLinecap="round" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="#FEAEC9" strokeWidth="6" strokeLinecap="round" />
              <line x1="43" y1="43" x2="157" y2="157" stroke="#9AD9EA" strokeWidth="5" strokeLinecap="round" />
              <line x1="157" y1="43" x2="43" y2="157" stroke="#9AD9EA" strokeWidth="5" strokeLinecap="round" />

              {/* Bolt Rivets */}
              <circle cx="100" cy="35" r="5" fill="#FFFFFF" />
              <circle cx="100" cy="165" r="5" fill="#FFFFFF" />
              <circle cx="35" cy="100" r="5" fill="#FFFFFF" />
              <circle cx="165" cy="100" r="5" fill="#FFFFFF" />

              {/* Central Hub */}
              <circle cx="100" cy="100" r="28" fill="#C7BFE8" stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="100" cy="100" r="14" fill="#6B21A8" />
            </g>
          </svg>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {isUnlocked ? (
              <Unlock className="w-10 h-10 text-white drop-shadow-md animate-bounce" />
            ) : (
              <Lock className="w-10 h-10 text-white drop-shadow-md" />
            )}
          </div>
        </div>

        {/* 7-Letter Vault Dials Component */}
        <form onSubmit={handleAttemptUnlock} className="space-y-6 max-w-2xl mx-auto">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-900 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Clue: Only 7 Letters</span>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Use the arrow buttons to spin each tumbler, or type directly into the dial slots:
            </p>

            {/* 7 Interactive Letter Dials */}
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              {letters.map((char, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  {/* Up Button */}
                  <button
                    type="button"
                    onClick={() => handleRotateLetter(idx, 'up')}
                    className="w-9 h-7 rounded-md bg-gray-100 hover:bg-[#C7BFE8]/40 text-gray-700 flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
                  >
                    ▲
                  </button>

                  {/* Letter Input / Box */}
                  <input
                    id={`dial-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={e => handleDirectKeyChange(idx, e.target.value)}
                    className="w-11 h-14 sm:w-14 sm:h-18 rounded-xl border-3 border-[#C7BFE8] bg-gradient-to-b from-[#FAF8FC] to-[#E8E0EE] text-purple-950 font-black text-2xl sm:text-3xl text-center shadow-inner focus:border-pink-500 focus:ring-2 focus:ring-pink-300 outline-hidden uppercase transition-all"
                  />

                  {/* Down Button */}
                  <button
                    type="button"
                    onClick={() => handleRotateLetter(idx, 'down')}
                    className="w-9 h-7 rounded-md bg-gray-100 hover:bg-[#C7BFE8]/40 text-gray-700 flex items-center justify-center font-bold text-xs cursor-pointer transition-colors"
                  >
                    ▼
                  </button>

                  <span className="text-[10px] text-gray-400 font-mono">#{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clue Hint Button */}
          <div>
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline inline-flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Clue Hint' : 'Need a Clue for the 7 letters?'}</span>
            </button>
            {showHint && (
              <div className="mt-2 text-xs bg-purple-50 border border-purple-200 text-purple-950 p-3 rounded-xl max-w-md mx-auto text-center">
                <strong>Clue Hint:</strong> Look back at the organization name on the very first door plaque where your office escape challenge began (7 letters).
              </div>
            )}
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <p className="text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {errorMessage}
            </p>
          )}

          {/* Unlock Action Button */}
          {!isUnlocked ? (
            <button
              type="submit"
              className="w-full sm:w-80 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-purple-950 font-black text-base shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
            >
              TURN VAULT WHEEL & OPEN
            </button>
          ) : (
            <div className="bg-emerald-100 border-2 border-emerald-400 p-4 rounded-2xl">
              <p className="text-emerald-950 font-black text-lg flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <span>"CARECOR" VAULT UNLOCKED!</span>
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Grand Victory Congratulatory Modal */}
      {isUnlocked && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border-4 border-[#FEAEC9] p-6 sm:p-8 shadow-2xl relative text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
              <Trophy className="w-12 h-12 text-yellow-300 drop-shadow-md" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-pink-700 bg-pink-100 px-3 py-1 rounded-full">
                CONGRATULATIONS! YOU ESCAPED!
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
                CARECOR OFFICE MASTER
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                You successfully mastered all 7 workplace values and unlocked the Main Exit!
              </p>
            </div>

            {/* Escape Stats Card */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <div className="bg-[#FAF8FC] border border-[#C7BFE8] p-3 rounded-xl">
                <span className="text-[11px] font-bold text-gray-500 uppercase flex items-center justify-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Total Time</span>
                </span>
                <span className="text-xl sm:text-2xl font-black text-purple-950 font-mono">
                  {formatTime(totalSeconds)}
                </span>
              </div>

              <div className="bg-[#FAF8FC] border border-[#9AD9EA] p-3 rounded-xl">
                <span className="text-[11px] font-bold text-gray-500 uppercase flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Rooms Completed</span>
                </span>
                <span className="text-xl sm:text-2xl font-black text-cyan-950 font-mono">
                  7 / 7 Rooms
                </span>
              </div>
            </div>

            {/* Summary of 7 Workplace Values */}
            <div className="text-left bg-gradient-to-br from-[#FFFDF9] to-[#FAF8FC] border border-[#C7BFE8]/60 p-4 rounded-xl text-xs space-y-1 text-gray-700">
              <p className="font-bold text-gray-900 mb-1">Office Values Certified:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                <p>✓ 1. Credibility (Living Room)</p>
                <p>✓ 2. Positive Attitudes (Pantry Room)</p>
                <p>✓ 3. Responsibility & Rebuses (Meeting)</p>
                <p>✓ 4. Peer Excellence & Awards (CEO)</p>
                <p>✓ 5. Team Cooperation (Break Room)</p>
                <p>✓ 6. Sharp Observation (Sleeping)</p>
                <p className="sm:col-span-2">✓ 7. Genuine Relationships & 20s Gratitude (Special)</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onResetGame}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-purple-950 font-black text-sm shadow-md hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>Play Game Again</span>
              </button>
              <button
                onClick={() => {
                  setIsUnlocked(false);
                  onBackToOffice();
                }}
                className="py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm cursor-pointer"
              >
                Explore Office
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
