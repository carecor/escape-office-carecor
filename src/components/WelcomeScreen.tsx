import React from 'react';
import { DoorClosed, Sparkles, Trophy, Clock, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import { sounds } from '../utils/audio';

interface WelcomeScreenProps {
  onEnterOffice: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnterOffice }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8E0EE] via-[#F8F7FC] to-[#9AD9EA]/20 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl bg-white/95 rounded-3xl shadow-2xl border-4 border-[#C7BFE8] overflow-hidden relative backdrop-blur-xl">
        {/* Decorative Top Accent Bar */}
        <div className="h-4 bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA]" />

        <div className="p-6 sm:p-10 md:p-12 text-center relative">
          {/* Subtle Floating Embellishments */}
          <div className="absolute top-8 left-8 text-3xl animate-float opacity-75">✨</div>
          <div className="absolute bottom-10 right-8 text-3xl animate-float opacity-75" style={{ animationDelay: '1.5s' }}>🌟</div>
          <div className="absolute top-12 right-12 text-2xl animate-float opacity-60" style={{ animationDelay: '0.8s' }}>🌸</div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEAEC9]/30 border border-[#FEAEC9] text-pink-900 font-bold text-xs sm:text-sm uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Interactive Escape Room</span>
          </div>

          {/* Big Entrance Door Plaque */}
          <div className="max-w-2xl mx-auto bg-gradient-to-b from-[#FAF8FC] to-[#E8E0EE] border-4 border-[#C7BFE8] rounded-2xl p-6 sm:p-8 shadow-inner mb-8 relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] flex items-center justify-center shadow-lg border-2 border-white mb-4 transform hover:scale-105 transition-transform">
              <DoorClosed className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-md" />
            </div>

            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#7E57C2] uppercase mb-1">
              Main Office Entrance
            </p>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight mb-2 drop-shadow-xs">
              Welcome to <br className="sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D81B60] via-[#673AB7] to-[#0288D1]">
                CARECOR OFFICE
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto font-medium">
              Step through the main door to test your wits, attitudes, and teamwork in 7 dynamic office rooms.
            </p>
          </div>

          {/* Mission Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto mb-8 text-left">
            <div className="bg-[#FEAEC9]/20 border border-[#FEAEC9] p-3.5 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-pink-900 font-bold text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-pink-600" />
                <span>Timed Challenge</span>
              </div>
              <p className="text-xs text-gray-600">The overall game timer begins immediately once you enter the door!</p>
            </div>

            <div className="bg-[#9AD9EA]/25 border border-[#9AD9EA] p-3.5 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-cyan-900 font-bold text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>Finish Before Leaving</span>
              </div>
              <p className="text-xs text-gray-600">Choose any room you like, but you must complete it before opening a new door.</p>
            </div>

            <div className="bg-[#C7BFE8]/30 border border-[#C7BFE8] p-3.5 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-purple-900 font-bold text-xs sm:text-sm">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span>Unlock The Vault</span>
              </div>
              <p className="text-xs text-gray-600">Collect all 7 room keys to unlock the final 7-letter Carecor Vault exit!</p>
            </div>
          </div>

          {/* Big Energetic Enter Button */}
          <button
            onClick={() => {
              sounds.playClick();
              sounds.playVictory();
              onEnterOffice();
            }}
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-purple-950 font-black text-lg sm:text-xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
          >
            <Star className="w-6 h-6 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ENTER THE DOOR & START</span>
            <ArrowRight className="w-6 h-6 text-purple-950 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Press to open the Carecor Main Door • Game timer starts automatically
          </p>
        </div>
      </div>
    </div>
  );
};
