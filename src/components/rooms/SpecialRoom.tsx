import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  Play,
  Clock,
  Heart,
  MessageCircle,
  ArrowRight,
  Gift,
  KeyRound,
  UserCheck
} from 'lucide-react';
import { CARECOR_EMPLOYEES } from '../../types/game';
import { sounds } from '../../utils/audio';
import { specialRoomImg } from '../../assets/images';

interface SpecialRoomProps {
  isCompleted: boolean;
  onCompleteRoom: () => void;
  onBackToOffice: () => void;
}

interface CompletedShare {
  id: number;
  recipient: string;
}

export const SpecialRoom: React.FC<SpecialRoomProps> = ({
  isCompleted,
  onCompleteRoom,
  onBackToOffice
}) => {
  const [completedShares, setCompletedShares] = useState<CompletedShare[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<string>(CARECOR_EMPLOYEES[0]);

  // 20-second live timer state
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(20);

  // Pop up gift box
  const [showKeyBox, setShowKeyBox] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval!);
            handleShareFinished();
            return 20;
          }
          sounds.playTick();
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, secondsRemaining]);

  const handleStartShare = () => {
    sounds.playClick();
    setSecondsRemaining(20);
    setIsTimerRunning(true);
  };

  const handleShareFinished = () => {
    sounds.playVictory();
    setIsTimerRunning(false);

    const newShare: CompletedShare = {
      id: Date.now(),
      recipient: selectedRecipient
    };

    const updated = [...completedShares, newShare];
    setCompletedShares(updated);

    // Advance to next member
    const nextIdx = (CARECOR_EMPLOYEES.indexOf(selectedRecipient) + 1) % CARECOR_EMPLOYEES.length;
    setSelectedRecipient(CARECOR_EMPLOYEES[nextIdx]);

    if (updated.length === 8) {
      setShowKeyBox(true);
      onCompleteRoom();
    }
  };

  const currentCount = completedShares.length;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Story Banner */}
      <div className="bg-gradient-to-r from-white via-[#C7BFE8]/30 to-[#FEAEC9]/20 border-2 border-[#C7BFE8] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C7BFE8] text-purple-950 uppercase tracking-wider">
              Room 7 Challenge
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Relationship (Special Room)
            </h2>
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Relationship Key Unlocked!</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong>The Special Room:</strong> Relationships are the soul of Carecor. In this room, <strong>8 members share appreciation</strong> to the team or a specific person.
          Each member must complete a full <strong>20-second timer</strong> dedicated to appreciation. No typing required—simply run the 20-second timer for all 8 members to reveal the hidden key box!
        </p>
      </div>

      {/* Special Room Photo Banner */}
      <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#C7BFE8] shadow-sm">
        <img
          src={specialRoomImg}
          alt="Carecor Special Room Appreciation Sanctuary"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600/80 px-2 py-0.5 rounded-md">
              Team Appreciation Sanctuary
            </span>
            <p className="text-xs sm:text-sm font-semibold mt-0.5 text-purple-100">
              Gathering in harmony to honor each colleague with 20 seconds of focused gratitude.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: 20s Sharing Pod & 8-Member Gratitude Wall */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: 20-Second Live Timer Only (5 cols on md) */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-gray-900 text-base">
                  Appreciation Share #{currentCount + 1}
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                {currentCount} / 8 Completed
              </span>
            </div>

            {currentCount < 8 ? (
              !isTimerRunning ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Select Member / Group to Appreciate:
                    </label>
                    <select
                      value={selectedRecipient}
                      onChange={e => setSelectedRecipient(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-gray-800 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden"
                    >
                      <option value="The Whole Carecor Team">🌟 The Whole Carecor Team</option>
                      {CARECOR_EMPLOYEES.map(emp => (
                        <option key={emp} value={emp}>
                          👤 {emp}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 text-xs text-purple-900">
                    <p className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Timer Mode (No typing required)</span>
                    </p>
                    <p className="mt-1 text-purple-800 leading-relaxed">
                      Click below to initiate the 20-second appreciation share for <strong>{selectedRecipient}</strong>. Take this moment to reflect and express spoken gratitude!
                    </p>
                  </div>

                  <button
                    onClick={handleStartShare}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C7BFE8] via-[#FEAEC9] to-[#9AD9EA] text-purple-950 font-black text-sm shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-purple-950" />
                    <span>Start 20-Second Appreciation Share</span>
                  </button>
                </div>
              ) : (
                /* Active 20-Second Countdown Visual */
                <div className="bg-gradient-to-b from-[#FAF8FC] to-[#F3EFF9] border-2 border-purple-300 rounded-2xl p-6 text-center space-y-4">
                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="#E8E0EE"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="#FEAEC9"
                        strokeWidth="8"
                        strokeDasharray={301.6}
                        strokeDashoffset={301.6 - (301.6 * (20 - secondsRemaining)) / 20}
                        strokeLinecap="round"
                        fill="none"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-purple-950 font-mono">
                        {secondsRemaining}s
                      </span>
                      <span className="text-[10px] font-bold text-pink-600 uppercase">Appreciating</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-black text-gray-900 text-sm">
                      Honoring: {selectedRecipient}
                    </h4>
                    <p className="text-xs text-purple-800 font-medium mt-1">
                      Sharing appreciation live with the team...
                    </p>
                  </div>

                  <p className="text-xs font-semibold text-purple-700 animate-pulse">
                    💖 Speak from the heart... {secondsRemaining} seconds remaining
                  </p>
                </div>
              )
            ) : (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-black text-emerald-900 text-base">All 8 Shares Finished!</h4>
                <p className="text-xs text-emerald-800">
                  Each member completed their 20-second tribute. The relationship lock has unlocked!
                </p>
                <button
                  onClick={() => setShowKeyBox(true)}
                  className="w-full mt-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Inspect Relationship Key Box
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: 8-Member Completed Appreciation Tributes (7 cols on md) */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  <span>The 8 Appreciation Tributes</span>
                </h3>
                <p className="text-xs text-gray-500">Each tribute verified with a 20-second dedication</p>
              </div>

              <div className="w-28 bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${(Math.min(completedShares.length, 8) / 8) * 100}%` }}
                />
              </div>
            </div>

            {completedShares.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 space-y-2">
                <MessageCircle className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-sm font-semibold text-gray-500">No appreciation shares recorded yet.</p>
                <p className="text-xs">Select a coworker on the left and run the 20-second timer to add your first tribute!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {completedShares.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-[#FAF8FC] to-[#F3EFF9] border border-purple-200 rounded-xl p-3.5 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        Member Share #{idx + 1}
                      </span>
                      <h4 className="font-bold text-gray-900 text-sm mt-1">
                        👤 {item.recipient}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        20-Second Appreciation Completed
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pop Up Box for Key when 8 are done */}
      {showKeyBox && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border-4 border-[#C7BFE8] p-6 sm:p-8 shadow-2xl text-center space-y-4 relative">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
              <Gift className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-2xl font-black text-gray-900">
              The Golden Relationship Box!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              By dedicating 20 seconds of appreciation to 8 team members, you have shown that relationships transcend individual tasks.
              The box clicked open to present the <strong>Relationship Master Key</strong>!
            </p>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-center gap-2 text-purple-950 font-bold text-sm">
              <KeyRound className="w-5 h-5 text-purple-600" />
              <span>Relationship Room Key Acquired!</span>
            </div>

            <button
              onClick={() => {
                setShowKeyBox(false);
                onBackToOffice();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-purple-950 font-black text-sm shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
            >
              Collect Key & Return to Office Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
