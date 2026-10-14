import React, { useState } from 'react';
import {
  Eye,
  CheckCircle2,
  Sparkles,
  Lock,
  Unlock,
  KeyRound,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { workstationImg } from '../../assets/images';

interface SleepingRoomProps {
  isCompleted: boolean;
  onCompleteRoom: () => void;
  onBackToOffice: () => void;
}

interface DifferenceItem {
  id: number;
  name: string;
  xPercent: number; // percentage coordinate 0 to 100
  yPercent: number;
  radiusPercent: number;
  descA: string;
  descB: string;
}

const DIFFERENCES: DifferenceItem[] = [
  {
    id: 1,
    name: 'Monitor Sticky Note',
    xPercent: 30,
    yPercent: 61,
    radiusPercent: 5.5,
    descA: 'Yellow sticky note on monitor bezel',
    descB: 'Sticky note is missing'
  },
  {
    id: 2,
    name: 'Wall Clock Hands Time',
    xPercent: 36.5,
    yPercent: 12.5,
    radiusPercent: 6,
    descA: 'Clock hands pointing to 10:10',
    descB: 'Clock hands pointing to 3:45'
  },
  {
    id: 3,
    name: 'Coffee Mug Color & Label',
    xPercent: 74,
    yPercent: 62,
    radiusPercent: 5.5,
    descA: 'Pink "Stay Inspired" mug',
    descB: 'Yellow plain mug'
  },
  {
    id: 4,
    name: 'Desk Succulent Flower',
    xPercent: 66,
    yPercent: 55,
    radiusPercent: 5.5,
    descA: 'Pure green succulent',
    descB: 'Blossoming purple flower'
  },
  {
    id: 5,
    name: 'Pen Holder Stationery',
    xPercent: 82,
    yPercent: 58,
    radiusPercent: 5.5,
    descA: 'Full cup of colorful pens & ruler',
    descB: 'Only one solitary pen'
  },
  {
    id: 6,
    name: 'Desk Lamp Bulb Glow',
    xPercent: 18,
    yPercent: 35,
    radiusPercent: 6,
    descA: 'Lamp illuminated with warm bulb',
    descB: 'Lamp turned off'
  },
  {
    id: 7,
    name: 'Bookshelf Book Spine',
    xPercent: 10.5,
    yPercent: 17,
    radiusPercent: 5,
    descA: 'Red book spine on shelf',
    descB: 'Cyan blue book spine'
  },
  {
    id: 8,
    name: 'Keyboard Accent Bar',
    xPercent: 47,
    yPercent: 71,
    radiusPercent: 5,
    descA: 'Silver top metallic accent bar',
    descB: 'Dark charcoal accent bar'
  },
  {
    id: 9,
    name: 'Desk Mat Logo Badge',
    xPercent: 28,
    yPercent: 78,
    radiusPercent: 5,
    descA: 'Carecor heart badge on mat corner',
    descB: 'Blank felt mat corner'
  },
  {
    id: 10,
    name: 'Ergonomic Chair Cushion',
    xPercent: 66,
    yPercent: 88,
    radiusPercent: 6.5,
    descA: 'Solid navy mesh seat',
    descB: 'Pastel striped cushion'
  }
];

export const SleepingRoom: React.FC<SleepingRoomProps> = ({
  isCompleted,
  onCompleteRoom,
  onBackToOffice
}) => {
  const [foundDiffIds, setFoundDiffIds] = useState<Set<number>>(new Set());
  const [clickNotice, setClickNotice] = useState<string | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>, side: 'A' | 'B') => {
    sounds.playClick();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if click hits any unfound difference
    let matched: DifferenceItem | null = null;
    for (const diff of DIFFERENCES) {
      if (foundDiffIds.has(diff.id)) continue;
      const dx = clickX - diff.xPercent;
      const dy = clickY - diff.yPercent;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= diff.radiusPercent + 2.5) {
        matched = diff;
        break;
      }
    }

    if (matched) {
      sounds.playCorrect();
      const updated = new Set(foundDiffIds);
      updated.add(matched.id);
      setFoundDiffIds(updated);
      setClickNotice(`✨ Difference Found: ${matched.name} (${updated.size}/10)`);

      if (updated.size === 10) {
        sounds.playVictory();
        onCompleteRoom();
      }
    } else {
      setClickNotice('Nothing different clicked here. Scrutinize both photos carefully!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Story Banner */}
      <div className="bg-gradient-to-r from-white via-[#9AD9EA]/20 to-[#E8E0EE]/40 border-2 border-[#9AD9EA] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#9AD9EA] text-cyan-950 uppercase tracking-wider">
              Room 6 Challenge
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Observation (Sleeping Room)
            </h2>
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Observation Key Claimed!</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong>Workstation Observation:</strong> Keen observation is what turns good work into perfection.
          Compare the two actual workstation photographs side-by-side. Spot and click all <strong>10 discrepancies</strong> between Photo A and Photo B.
          Once all 10 are identified, the secret wall safe unlocks!
        </p>
      </div>

      {/* Progress & Feedback Bar */}
      <div className="bg-white rounded-2xl border-2 border-[#9AD9EA] p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 font-black">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              Differences Found: {foundDiffIds.size} / 10
            </h3>
            <p className="text-xs text-gray-500">
              {clickNotice || 'Click any difference on either photo to register it!'}
            </p>
          </div>
        </div>

        {/* Visual Progress Dots */}
        <div className="flex items-center gap-1.5">
          {DIFFERENCES.map(diff => {
            const isFound = foundDiffIds.has(diff.id);
            return (
              <div
                key={diff.id}
                title={isFound ? diff.name : `Difference #${diff.id}`}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isFound
                    ? 'bg-emerald-500 text-white shadow-xs scale-105'
                    : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {isFound ? '✓' : diff.id}
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Spot The Difference Comparison Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Photo A: Original Reference Workstation */}
        <div className="bg-white rounded-2xl border-2 border-gray-300 p-3 shadow-xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Photo A: Reference Workstation
            </span>
            <span className="text-[11px] text-gray-400">Original Photo</span>
          </div>

          <div
            onClick={e => handleImageClick(e, 'A')}
            className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-900 cursor-crosshair shadow-inner select-none"
          >
            <img
              src={workstationImg}
              alt="Reference Workstation"
              className="w-full h-full object-cover"
            />

            {/* Photo A: Extra subtle visual markers for specific differences */}
            {/* Diff 9: Carecor Heart badge on mat corner */}
            <div
              style={{ left: '26%', top: '76%', width: '4%', height: '5%' }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-pink-500/90 text-[8px] text-white flex items-center justify-center font-bold shadow-xs">
                ♥
              </div>
            </div>

            {/* Render Circles for Found Differences on Photo A */}
            {DIFFERENCES.filter(d => foundDiffIds.has(d.id)).map(diff => (
              <div
                key={diff.id}
                style={{
                  left: `${diff.xPercent}%`,
                  top: `${diff.yPercent}%`,
                  width: `${diff.radiusPercent * 2}%`,
                  height: `${diff.radiusPercent * 2}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute rounded-full border-2 border-emerald-400 bg-emerald-500/25 flex items-center justify-center pointer-events-none animate-pulse-subtle shadow-md"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Photo B: Altered Workstation with 10 Precise Discrepancies */}
        <div className="bg-white rounded-2xl border-2 border-[#9AD9EA] p-3 shadow-xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider">
              Photo B: Inspection Scene
            </span>
            <span className="text-[11px] font-semibold text-pink-600">Spot 10 Differences!</span>
          </div>

          <div
            onClick={e => handleImageClick(e, 'B')}
            className="relative aspect-[4/3] rounded-xl overflow-hidden border border-cyan-300 bg-gray-900 cursor-crosshair shadow-inner select-none"
          >
            <img
              src={workstationImg}
              alt="Altered Workstation"
              className="w-full h-full object-cover"
            />

            {/* Visual Overlays Creating the 10 Precise Accurate Differences on Photo B */}

            {/* Diff 1: Sticky note removed (covered with bezel matching black) */}
            <div
              style={{ left: '27%', top: '57%', width: '6.5%', height: '8.5%' }}
              className="absolute bg-[#1B1D20] pointer-events-none shadow-inner"
            />

            {/* Diff 2: Clock hands altered to 3:45 */}
            <div
              style={{ left: '33.5%', top: '9.5%', width: '6%', height: '8%' }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              <div className="w-5 h-5 rounded-full bg-white border border-gray-700 relative">
                <div className="absolute top-2.5 left-2.5 w-2 h-0.5 bg-black transform rotate-45" />
                <div className="absolute top-2.5 left-2.5 w-0.5 h-2 bg-red-600 transform -rotate-90" />
              </div>
            </div>

            {/* Diff 3: Pink Coffee mug turned Yellow */}
            <div
              style={{ left: '72%', top: '58%', width: '7%', height: '9.5%' }}
              className="absolute pointer-events-none bg-yellow-400 rounded-lg opacity-85 mix-blend-color"
            />

            {/* Diff 4: Desk Succulent has a blossoming purple flower */}
            <div
              style={{ left: '64.5%', top: '50.5%', width: '5%', height: '6%' }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              <div className="w-4 h-4 rounded-full bg-purple-600 border border-pink-300 shadow-md animate-pulse" />
            </div>

            {/* Diff 5: Pen holder has only 1 pen (other pens masked out) */}
            <div
              style={{ left: '81%', top: '53%', width: '3.5%', height: '7%' }}
              className="absolute pointer-events-none bg-stone-200/90 rounded opacity-90"
            />

            {/* Diff 6: Desk Lamp head turned OFF (cooler tone) */}
            <div
              style={{ left: '14%', top: '28%', width: '8.5%', height: '11%' }}
              className="absolute pointer-events-none bg-slate-900/60 rounded-full mix-blend-multiply"
            />

            {/* Diff 7: Red book spine turned blue */}
            <div
              style={{ left: '9.5%', top: '13%', width: '3%', height: '10%' }}
              className="absolute pointer-events-none bg-sky-500 rounded-xs mix-blend-hue"
            />

            {/* Diff 8: Keyboard accent bar darkened */}
            <div
              style={{ left: '38%', top: '69%', width: '22%', height: '3.5%' }}
              className="absolute pointer-events-none bg-gray-900/70 rounded-xs"
            />

            {/* Diff 9: Desk Mat logo is missing (empty black felt) */}
            {/* Handled by lack of badge */}

            {/* Diff 10: Chair cushion has striped lavender pattern */}
            <div
              style={{ left: '59%', top: '85%', width: '16%', height: '10%' }}
              className="absolute pointer-events-none bg-purple-300/60 rounded-xl mix-blend-overlay border border-purple-400/50"
            />

            {/* Render Circles for Found Differences on Photo B */}
            {DIFFERENCES.filter(d => foundDiffIds.has(d.id)).map(diff => (
              <div
                key={diff.id}
                style={{
                  left: `${diff.xPercent}%`,
                  top: `${diff.yPercent}%`,
                  width: `${diff.radiusPercent * 2}%`,
                  height: `${diff.radiusPercent * 2}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className="absolute rounded-full border-2 border-pink-400 bg-pink-500/30 flex items-center justify-center pointer-events-none animate-pulse-subtle shadow-md"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 border border-white shadow-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Discovered Differences Log & Secret Safe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Differences List */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 p-4">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Discovered Discrepancies:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {DIFFERENCES.map(d => {
              const isFound = foundDiffIds.has(d.id);
              return (
                <div
                  key={d.id}
                  className={`p-2 rounded-lg border flex items-center gap-2 ${
                    isFound
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                  }`}
                >
                  <span className="font-mono font-bold">#{d.id}</span>
                  <span>{isFound ? d.name : 'Unknown Difference'}</span>
                  {isFound && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Secret Safe Box */}
        <div className="bg-gradient-to-b from-[#FAF8FC] to-[#E8E0EE] rounded-2xl border-2 border-[#C7BFE8] p-5 text-center flex flex-col justify-between">
          <div>
            <h4 className="font-black text-gray-900 text-sm mb-1">
              Secret Wall Safe
            </h4>
            <p className="text-xs text-gray-500 mb-3">
              Opens automatically when all 10 differences are identified
            </p>

            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all ${
              foundDiffIds.size === 10
                ? 'bg-emerald-500 border-white text-white animate-bounce'
                : 'bg-gray-800 border-gray-700 text-gray-400'
            }`}>
              {foundDiffIds.size === 10 ? (
                <Unlock className="w-10 h-10" />
              ) : (
                <Lock className="w-10 h-10" />
              )}
            </div>
          </div>

          <div className="mt-4">
            {foundDiffIds.size === 10 ? (
              <div className="space-y-2">
                <p className="text-xs font-black text-emerald-900">
                  🎉 Safe Unlocked! Key Granted!
                </p>
                <button
                  onClick={onBackToOffice}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Return to Office Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-xs font-semibold text-gray-500">
                {10 - foundDiffIds.size} differences remaining
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
