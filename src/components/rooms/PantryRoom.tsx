import React, { useState } from 'react';
import {
  Coffee,
  CheckCircle2,
  Key,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';
import { PANTRY_QUESTIONS, PantryItemData } from '../../types/game';
import { sounds } from '../../utils/audio';
import { pantryRoomImg } from '../../assets/images';

interface PantryRoomProps {
  isCompleted: boolean;
  onCompleteRoom: () => void;
  onBackToOffice: () => void;
}

export const PantryRoom: React.FC<PantryRoomProps> = ({
  isCompleted,
  onCompleteRoom,
  onBackToOffice
}) => {
  // Solved items set
  const [solvedItemIds, setSolvedItemIds] = useState<Set<string>>(new Set());

  // Selected item being answered
  const [activeItem, setActiveItem] = useState<PantryItemData | null>(PANTRY_QUESTIONS[0]);

  // Player input for active item
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ msg: string; isError: boolean } | null>(null);
  const [showSynonymHint, setShowSynonymHint] = useState(false);

  // Door Lock slots 1-10 inserted state
  const [insertedKeys, setInsertedKeys] = useState<Set<number>>(new Set());

  // Check which keys are earned
  const earnedKeys = new Set<number>();
  solvedItemIds.forEach(id => {
    const item = PANTRY_QUESTIONS.find(q => q.id === id);
    if (item) earnedKeys.add(item.keyNumber);
  });

  const handleSelectItem = (item: PantryItemData) => {
    sounds.playClick();
    setActiveItem(item);
    setUserInput('');
    setFeedback(null);
    setShowSynonymHint(false);
  };

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    const cleaned = userInput.trim().toLowerCase().replace(/[^a-z]/g, '');
    const target = activeItem.answer.toLowerCase();

    // Check match (e.g. openess or openness)
    const isCorrect =
      cleaned === target ||
      (activeItem.id === 'cabinet' && (cleaned === 'openness' || cleaned === 'openess'));

    if (isCorrect) {
      sounds.playCorrect();
      const updatedSolved = new Set(solvedItemIds);
      updatedSolved.add(activeItem.id);
      setSolvedItemIds(updatedSolved);

      // Auto-insert the newly earned key into the door lock
      const updatedInserted = new Set(insertedKeys);
      updatedInserted.add(activeItem.keyNumber);
      setInsertedKeys(updatedInserted);

      setFeedback({
        msg: `🎉 Correct! You demonstrated "${activeItem.answer.toUpperCase()}" and unlocked #Key${activeItem.keyNumber}!`,
        isError: false
      });

      // Check if all 10 are solved and all 10 keys are inserted
      if (updatedSolved.size === 10) {
        sounds.playVictory();
        onCompleteRoom();
      }
    } else {
      sounds.playWrong();
      setFeedback({
        msg: `Not quite. Check the number of blanks (${activeItem.answer.length} letters) or check the clue!`,
        isError: true
      });
    }
  };

  // Render letter blanks: _ _ _ _ _
  const renderLetterBlanks = (item: PantryItemData) => {
    const len = item.answer.length;
    const currentLetters = userInput.padEnd(len, ' ').slice(0, len).split('');

    return (
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 my-4">
        {Array.from({ length: len }).map((_, i) => {
          const char = currentLetters[i];
          const hasChar = char && char !== ' ';
          return (
            <div
              key={i}
              className={`w-8 h-10 sm:w-10 sm:h-12 rounded-lg border-2 flex items-center justify-center font-mono text-lg sm:text-xl font-black uppercase transition-all ${
                hasChar
                  ? 'border-[#9AD9EA] bg-[#9AD9EA]/20 text-cyan-950 shadow-xs'
                  : 'border-dashed border-gray-300 bg-gray-50 text-gray-400'
              }`}
            >
              {hasChar ? char : '_'}
            </div>
          );
        })}
      </div>
    );
  };

  const allKeysCollected = earnedKeys.size === 10;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Story Banner */}
      <div className="bg-gradient-to-r from-white via-[#9AD9EA]/20 to-[#E8E0EE]/50 border-2 border-[#9AD9EA] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#9AD9EA] text-cyan-950 uppercase tracking-wider">
              Room 2 Challenge
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Attitude of an Employee
            </h2>
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Pantry Door Unlocked!</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong>The Pantry Room:</strong> 10 fixtures in the break space hold logical workplace dilemmas reflecting employee attitude.
          Inspect each fixture, review the ethical scenario, and input the demonstrated workplace value. Each correct value awards its
          designated key (#Key1 to #Key10). Collect and insert all 10 keys to unlock the pantry door!
        </p>
      </div>

      {/* Realistic Pantry Photo Banner */}
      <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#9AD9EA] shadow-sm">
        <img
          src={pantryRoomImg}
          alt="Carecor Office Pantry"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-600/80 px-2 py-0.5 rounded-md">
              Pantry Observation View
            </span>
            <p className="text-xs sm:text-sm font-semibold mt-0.5 text-cyan-100">
              Microwave • Refrigerator • Kettle • Dish Rack • Sink • Plants • Cabinet • Frame • Table • Chair
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left 10 Items List, Center Scenario Solver, Right 10-Key Master Door Lock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 10 Pantry Fixtures (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
              <Coffee className="w-4 h-4 text-cyan-700" />
              <span>10 Pantry Fixtures</span>
            </h3>
            <span className="text-xs font-bold text-cyan-900 bg-[#9AD9EA]/30 px-2 py-0.5 rounded-full">
              {solvedItemIds.size} / 10 Solved
            </span>
          </div>

          <div className="space-y-1.5">
            {PANTRY_QUESTIONS.map(item => {
              const isSolved = solvedItemIds.has(item.id);
              const isCurrent = activeItem?.id === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isCurrent
                      ? 'border-[#9AD9EA] bg-[#9AD9EA]/25 ring-2 ring-[#9AD9EA]/50 font-bold'
                      : isSolved
                      ? 'border-emerald-200 bg-emerald-50/40 text-gray-700'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isSolved ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">{item.name}</p>
                      <p className="text-[11px] text-gray-500">
                        {isSolved ? `Earned #Key${item.keyNumber}` : `${item.answer.length} letters clue`}
                      </p>
                    </div>
                  </div>

                  {isSolved ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <Key className="w-3 h-3 text-emerald-600" />
                      <span>#Key{item.keyNumber}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Answer</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Column: Scenario Inspection & Value Input (5 cols on lg) */}
        <div className="lg:col-span-5">
          {activeItem ? (
            <div className="bg-white rounded-2xl border-2 border-[#9AD9EA] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                <div>
                  <span className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider">
                    Pantry Fixture #{PANTRY_QUESTIONS.findIndex(q => q.id === activeItem.id) + 1}
                  </span>
                  <h3 className="text-lg font-black text-gray-900">{activeItem.name}</h3>
                </div>

                {solvedItemIds.has(activeItem.id) ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Unlocked #Key{activeItem.keyNumber}</span>
                  </span>
                ) : (
                  <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    Target: {activeItem.answer.length} Letters
                  </span>
                )}
              </div>

              {/* Scenario Narrative Box */}
              <div className="bg-[#FAF8FC] border border-[#C7BFE8]/40 rounded-xl p-4 text-sm text-gray-700 space-y-2">
                <p className="font-semibold text-purple-950 text-xs uppercase tracking-wide">Workplace Scenario:</p>
                <p className="italic leading-relaxed">"{activeItem.scenario}"</p>
                <p className="font-bold text-gray-900 pt-1 border-t border-purple-100">
                  {activeItem.question}
                </p>
              </div>

              {/* Letter Slots */}
              <div>
                <p className="text-xs text-center text-gray-500">
                  Letter Count Indicator ({activeItem.answer.length} letters):
                </p>
                {renderLetterBlanks(activeItem)}
              </div>

              {/* Synonym Clue Toggle */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowSynonymHint(!showSynonymHint)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 underline inline-flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showSynonymHint ? 'Hide Clue' : 'Need a Clue for other terms?'}</span>
                </button>
                {showSynonymHint && (
                  <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg text-left">
                    <strong>Clue:</strong> {activeItem.synonymClue}
                  </div>
                )}
              </div>

              {/* Answer Input Form */}
              <form onSubmit={handleSubmitAnswer} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Enter Workplace Value:
                  </label>
                  <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    placeholder={`e.g. Type ${activeItem.answer.length} letters...`}
                    maxLength={activeItem.answer.length + 3}
                    disabled={solvedItemIds.has(activeItem.id)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-[#9AD9EA] focus:ring-2 focus:ring-[#9AD9EA]/30 outline-hidden text-sm font-semibold text-gray-800 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>

                {!solvedItemIds.has(activeItem.id) ? (
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9AD9EA] via-[#C7BFE8] to-[#FEAEC9] text-purple-950 font-bold text-sm shadow-xs hover:brightness-105 active:scale-98 transition-all cursor-pointer"
                  >
                    Submit Value & Claim Key
                  </button>
                ) : (
                  <div className="text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                    ✓ Already solved! You hold #Key{activeItem.keyNumber}.
                  </div>
                )}
              </form>

              {/* Feedback Alert */}
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
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 text-sm">
              Select any pantry fixture on the left to inspect its workplace dilemma.
            </div>
          )}
        </div>

        {/* Right Column: 10-Key Master Door Lock (3 cols on lg) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gradient-to-b from-white to-[#F8F7FC] rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
              <Key className="w-5 h-5 text-purple-700" />
              <h3 className="font-black text-gray-900 text-sm">
                Door Keyholes (1 - 10)
              </h3>
            </div>
            <p className="text-xs text-gray-600 mb-3 leading-relaxed">
              Each scenario awards a specific numbered key (1 to 10). When all 10 keys are placed in their keyholes, the pantry master lock turns!
            </p>

            {/* 10 Keyhole Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Array.from({ length: 10 }).map((_, i) => {
                const keyNum = i + 1;
                const isEarned = earnedKeys.has(keyNum);
                const isInserted = insertedKeys.has(keyNum);

                return (
                  <div
                    key={keyNum}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      isInserted
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                        : isEarned
                        ? 'bg-amber-50 border-amber-300 text-amber-900 animate-pulse'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Key className={`w-3.5 h-3.5 ${isInserted ? 'text-emerald-600' : 'text-gray-400'}`} />
                      <span className="text-xs font-bold">Key #{keyNum}</span>
                    </div>
                    <span className="text-[10px] block font-semibold">
                      {isInserted ? 'Inserted ✓' : isEarned ? 'Ready to Insert' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Master Door Lock State */}
            <div className="pt-2 border-t border-gray-100 text-center">
              {allKeysCollected ? (
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Unlock className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-xs text-emerald-900">
                    All 10 Keys Fitted! Master Lock Opened!
                  </p>
                  <button
                    onClick={onBackToOffice}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Door Open - Back to Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-1">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="font-semibold text-xs text-gray-500">
                    Pantry Door: {earnedKeys.size} / 10 Keys
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Solve all 10 fixtures to unlock the door
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
