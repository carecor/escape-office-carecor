import React, { useState } from 'react';
import {
  Presentation,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { REBUS_LIST, RebusItem } from '../../types/game';
import { sounds } from '../../utils/audio';
import { meetingRoomImg } from '../../assets/images';

interface MeetingRoomProps {
  isCompleted: boolean;
  onCompleteRoom: () => void;
  onBackToOffice: () => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  isCompleted,
  onCompleteRoom,
  onBackToOffice
}) => {
  // Current active rebus index (0 to 9)
  const [currentIdx, setCurrentIdx] = useState(0);

  // Solved rebus IDs
  const [solvedIds, setSolvedIds] = useState<Set<number>>(new Set());

  // Input for current rebus
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Final reflection question modal state
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [isFinalSubmitted, setIsFinalSubmitted] = useState(false);

  const currentRebus: RebusItem = REBUS_LIST[currentIdx];

  const handleSelectRebus = (idx: number) => {
    sounds.playClick();
    setCurrentIdx(idx);
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRebus) return;

    // Normalizing hyphens and spaces
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '');
    const cleanUser = normalize(userInput);
    const cleanTarget = normalize(currentRebus.word);

    if (cleanUser === cleanTarget) {
      sounds.playCorrect();
      const newSolved = new Set(solvedIds);
      newSolved.add(currentRebus.id);
      setSolvedIds(newSolved);
      setFeedback({
        msg: `🎉 Excellent! "${currentRebus.word}" is correct!`,
        isError: false
      });

      // If all 10 are solved, open final question modal
      if (newSolved.size === 10) {
        setTimeout(() => {
          setShowFinalModal(true);
        }, 600);
      } else {
        // Auto-advance to next unsolved rebus after a brief pause
        const nextUnsolved = REBUS_LIST.findIndex(r => !newSolved.has(r.id));
        if (nextUnsolved !== -1) {
          setTimeout(() => {
            setCurrentIdx(nextUnsolved);
            setUserInput('');
            setFeedback(null);
            setShowHint(false);
          }, 800);
        }
      }
    } else {
      sounds.playWrong();
      setFeedback({
        msg: `Incorrect guess. Look at the visual symbols and wordplay breakdown carefully!`,
        isError: true
      });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAnswer.trim()) {
      alert('Please enter your thought on what your responsibility is as an employee.');
      return;
    }

    sounds.playVictory();
    setIsFinalSubmitted(true);
    onCompleteRoom();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Story Banner */}
      <div className="bg-gradient-to-r from-white via-[#C7BFE8]/30 to-[#9AD9EA]/20 border-2 border-[#C7BFE8] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#C7BFE8] text-purple-950 uppercase tracking-wider">
              Room 3 Challenge
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Responsibility of an Employee
            </h2>
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Meeting Room Key Claimed!</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong>The Boardroom:</strong> A workplace flourishes when every employee shoulders their core responsibilities.
          Decipher the 10 visual picture rebuses. Once all 10 are cracked, answer the final reflection question to claim the Meeting Room Key!
        </p>
      </div>

      {/* Realistic Boardroom Photo Banner */}
      <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#C7BFE8] shadow-sm">
        <img
          src={meetingRoomImg}
          alt="Carecor Boardroom"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-600/80 px-2 py-0.5 rounded-md">
              Boardroom Environment
            </span>
            <p className="text-xs sm:text-sm font-semibold mt-0.5 text-purple-100">
              Where strategic thinking, alignment, and core responsibilities take shape.
            </p>
          </div>
        </div>
      </div>

      {/* Progress & Rebus Navigation Tabs */}
      <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <Presentation className="w-4 h-4 text-purple-600" />
            <span>10 Picture Rebuses Progress:</span>
          </span>
          <span className="text-xs font-black text-purple-900 bg-[#E8E0EE] px-2.5 py-0.5 rounded-full">
            {solvedIds.size} / 10 Completed
          </span>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {REBUS_LIST.map((rebus, idx) => {
            const isSolved = solvedIds.has(rebus.id);
            const isSelected = currentIdx === idx;

            return (
              <button
                key={rebus.id}
                onClick={() => handleSelectRebus(idx)}
                className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-purple-600 bg-purple-100 text-purple-950 ring-2 ring-purple-300'
                    : isSolved
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>#{idx + 1}</span>
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5" />
                ) : (
                  <span className="text-[10px] text-gray-400 mt-0.5">•</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rebus Solver Stage */}
      <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-6 shadow-sm max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b pb-3 border-gray-100">
          <div>
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
              Rebus #{currentIdx + 1} of 10
            </span>
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              Guess the Employee Responsibility
            </h3>
          </div>
          {solvedIds.has(currentRebus.id) ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved: {currentRebus.word}</span>
            </span>
          ) : (
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
              {currentRebus.word.length} Letters
            </span>
          )}
        </div>

        {/* Visual Rebus Symbols Box */}
        <div className="bg-gradient-to-br from-[#FAF8FC] via-[#F4F1FA] to-[#E8E0EE]/50 border-2 border-purple-200 rounded-2xl p-6 sm:p-8 text-center shadow-inner">
          <p className="text-xs font-semibold text-purple-800 uppercase tracking-widest mb-4">
            Picture Rebus Clues:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 my-2">
            {currentRebus.visualParts.map((part, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-md border-2 border-[#C7BFE8] flex items-center justify-center text-3xl sm:text-4xl transform group-hover:scale-105 transition-transform">
                    {part.symbol}
                  </div>
                  <span className="mt-2 text-xs font-bold text-gray-700 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                    {part.label}
                  </span>
                </div>
                {i < currentRebus.visualParts.length - 1 && (
                  <span className="text-2xl font-black text-[#C7BFE8] select-none">+</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Letter Count Slots */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Letter Count Indicator ({currentRebus.word.length} letters):
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
            {currentRebus.word.split('').map((char, i) => {
              const isHyphen = char === '-';
              const inputChar = userInput.replace(/[^a-zA-Z-]/g, '')[i];
              return (
                <div
                  key={i}
                  className={`w-7 h-9 sm:w-8 sm:h-10 rounded-md border flex items-center justify-center font-mono text-sm sm:text-base font-black uppercase ${
                    isHyphen
                      ? 'border-transparent text-gray-700'
                      : inputChar
                      ? 'border-purple-400 bg-purple-50 text-purple-950'
                      : 'border-dashed border-gray-300 bg-gray-50 text-gray-400'
                  }`}
                >
                  {isHyphen ? '-' : inputChar || '_'}
                </div>
              );
            })}
          </div>
        </div>

        {/* Clue Toggle */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline inline-flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Need a Clue / Synonym?'}</span>
          </button>
          {showHint && (
            <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg text-left">
              <p><strong>Clue:</strong> {currentRebus.hint}</p>
              <p className="mt-1 text-[11px] text-amber-800"><strong>Concept:</strong> {currentRebus.synonym}</p>
            </div>
          )}
        </div>

        {/* Answer Form */}
        <form onSubmit={handleCheckAnswer} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Enter Responsibility Word:
            </label>
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder={`e.g. Type word for #${currentIdx + 1}...`}
              disabled={solvedIds.has(currentRebus.id)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden text-sm font-semibold text-gray-800 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>

          {!solvedIds.has(currentRebus.id) ? (
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C7BFE8] via-[#FEAEC9] to-[#9AD9EA] text-purple-950 font-bold text-sm shadow-xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
            >
              Verify Rebus Answer
            </button>
          ) : (
            <div className="text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
              ✓ Solved! Select another rebus above or continue to the final question.
            </div>
          )}
        </form>

        {feedback && (
          <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.isError
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
          }`}>
            {feedback.isError ? (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Button to open final question if all 10 are solved */}
        {solvedIds.size === 10 && !isCompleted && (
          <button
            onClick={() => setShowFinalModal(true)}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm shadow-md hover:brightness-110 cursor-pointer flex items-center justify-center gap-2 animate-bounce"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Proceed to Final Reflection Question!</span>
          </button>
        )}
      </div>

      {/* Final Question Popup Modal */}
      {showFinalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-[#C7BFE8] p-6 sm:p-8 shadow-2xl relative space-y-4">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E8E0EE] text-purple-900 flex items-center justify-center shadow-inner">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Final Boardroom Question
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                You have cracked all 10 picture rebuses! To claim the final meeting room key, reflect on your personal commitment:
              </p>
            </div>

            <div className="bg-[#FAF8FC] border-2 border-[#C7BFE8] p-4 rounded-2xl">
              <p className="font-black text-sm sm:text-base text-purple-950 text-center">
                "As an employee, what is your responsibility?"
              </p>
            </div>

            {!isFinalSubmitted ? (
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <textarea
                  rows={4}
                  value={finalAnswer}
                  onChange={e => setFinalAnswer(e.target.value)}
                  placeholder="Share your personal commitment or responsibility as an employee at Carecor (e.g., To lead with integrity, support my peers, and deliver my best every day)..."
                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden text-sm text-gray-800"
                />

                <p className="text-[11px] text-gray-400 text-center">
                  ✨ Any thoughtful answer you share is honored and correct.
                </p>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-purple-950 font-black text-sm shadow-md hover:scale-[1.01] active:scale-98 transition-all cursor-pointer"
                >
                  Confirm Responsibility & Claim Key!
                </button>
              </form>
            ) : (
              <div className="text-center space-y-3 pt-2">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 text-base">Key Awarded!</h4>
                <p className="text-xs text-gray-600">
                  Your pledge: <span className="font-semibold italic">"{finalAnswer}"</span> has been recorded on the executive board.
                </p>
                <button
                  onClick={() => {
                    setShowFinalModal(false);
                    onBackToOffice();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xs cursor-pointer"
                >
                  Return to Office Hub
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
