import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowLeft, Clock, KeyRound, Sparkles, LogOut, AlertTriangle } from 'lucide-react';
import { RoomId, ROOMS } from '../types/game';
import { sounds } from '../utils/audio';

interface NavbarProps {
  totalSeconds: number;
  completedRooms: Set<RoomId>;
  activeRoomId: RoomId | null;
  onExitRoom: () => void;
  onExitGame: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  canLeaveRoom: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalSeconds,
  completedRooms,
  activeRoomId,
  onExitRoom,
  onExitGame,
  isMuted,
  onToggleMute,
  canLeaveRoom
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentRoomMeta = ROOMS.find(r => r.id === activeRoomId);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#C7BFE8]/40 shadow-xs px-4 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Branding & Back Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeRoomId && (
              <button
                onClick={() => {
                  if (canLeaveRoom) {
                    sounds.playClick();
                    onExitRoom();
                  } else {
                    sounds.playWrong();
                    alert("🔒 Room in progress! You must complete this room's task before choosing a new door.");
                  }
                }}
                title={canLeaveRoom ? "Return to Office Hub" : "Complete this room to unlock the door"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  canLeaveRoom
                    ? 'bg-[#C7BFE8]/30 hover:bg-[#C7BFE8]/60 text-purple-900 cursor-pointer shadow-xs'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Office Map</span>
                {!canLeaveRoom && <span className="text-xs bg-pink-100 text-pink-700 px-1.5 py-0.5 rounded-sm">Locked</span>}
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base md:text-lg text-gray-800 tracking-tight leading-none flex items-center gap-2">
                  <span>CARECOR OFFICE</span>
                  {currentRoomMeta && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8E0EE] text-purple-800 border border-[#C7BFE8]/50">
                      Room {currentRoomMeta.number}: {currentRoomMeta.title}
                    </span>
                  )}
                </h1>
                <p className="text-[11px] text-gray-500 hidden sm:block">Workplace Values & Escape Challenge</p>
              </div>
            </div>
          </div>

          {/* Right: Timer, Progress, Sound & Exit Game Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Timer */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-[#9AD9EA]/20 border border-[#9AD9EA] px-2.5 sm:px-3 py-1.5 rounded-xl shadow-xs text-cyan-900 font-mono font-bold text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-700 animate-pulse" />
              <span>{formatTime(totalSeconds)}</span>
            </div>

            {/* Keys / Rooms Completed Badge */}
            <div className="flex items-center gap-1.5 bg-[#FEAEC9]/25 border border-[#FEAEC9] px-2.5 sm:px-3 py-1.5 rounded-xl text-pink-900 font-semibold text-xs sm:text-sm">
              <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-600" />
              <span>{completedRooms.size} / 7</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleMute();
                sounds.playClick();
              }}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className="p-2 rounded-xl bg-gray-100 hover:bg-[#C7BFE8]/30 text-gray-700 transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-purple-700" />}
            </button>

            {/* Exit Game Button */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowExitConfirm(true);
              }}
              title="Exit Game to Main Entrance"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
              <span className="hidden sm:inline">Exit Game</span>
            </button>
          </div>
        </div>
      </header>

      {/* Exit Game Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border-2 border-red-200 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900">Exit the Escape Game?</h3>
              <p className="text-xs text-gray-600">
                You will return to the Welcome Entrance. Your active timer and progress will be reset.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
              >
                Continue Playing
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowExitConfirm(false);
                  onExitGame();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Yes, Exit Game
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
