import React from 'react';
import {
  Sofa,
  Coffee,
  Presentation,
  Award,
  Users,
  Eye,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  BookOpen,
  LogOut
} from 'lucide-react';
import { RoomId, ROOMS } from '../types/game';
import { sounds } from '../utils/audio';
import {
  livingRoomImg,
  pantryRoomImg,
  meetingRoomImg,
  ceoOfficeImg,
  breakroomImg,
  workstationImg,
  specialRoomImg
} from '../assets/images';

interface OfficeHubProps {
  completedRooms: Set<RoomId>;
  onSelectRoom: (roomId: RoomId) => void;
  onExitGame?: () => void;
}

export const OfficeHub: React.FC<OfficeHubProps> = ({
  completedRooms,
  onSelectRoom,
  onExitGame
}) => {
  const getRoomIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sofa':
        return <Sofa className="w-5 h-5" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5" />;
      case 'Presentation':
        return <Presentation className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Eye':
        return <Eye className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getRoomImage = (id: RoomId) => {
    switch (id) {
      case 'living':
        return livingRoomImg;
      case 'pantry':
        return pantryRoomImg;
      case 'meeting':
        return meetingRoomImg;
      case 'ceo':
        return ceoOfficeImg;
      case 'break':
        return breakroomImg;
      case 'sleeping':
        return workstationImg;
      case 'special':
        return specialRoomImg;
      default:
        return null;
    }
  };

  const allPreliminaryCleared = completedRooms.size >= 7;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Office Hub Header */}
      <div className="text-center mb-8 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C7BFE8]/30 border border-[#C7BFE8] text-purple-900 font-bold text-xs uppercase tracking-wider mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive Office Floor Plan</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Select Your Next Challenge
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto mt-1">
          Pick any office room below. Remember: once you step inside, you must conquer its challenge before selecting another door!
        </p>

        {onExitGame && (
          <div className="mt-3">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to exit the game and return to the main entrance?')) {
                  sounds.playClick();
                  onExitGame();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Exit to Main Entrance</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of 8 Room Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ROOMS.map(room => {
          const isVault = room.id === 'vault';
          const isCleared = completedRooms.has(room.id);
          const isLocked = isVault && !allPreliminaryCleared;
          const roomImg = getRoomImage(room.id);

          return (
            <div
              key={room.id}
              className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-lg ${
                isCleared
                  ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/10'
                  : isLocked
                  ? 'border-gray-200 opacity-80 cursor-not-allowed bg-gray-50/50'
                  : 'border-[#C7BFE8]/60 hover:border-[#FEAEC9] hover:-translate-y-1'
              }`}
            >
              {/* Room Image Container */}
              <div className="p-2.5 pb-0">
                <div className="w-full h-40 rounded-xl relative overflow-hidden border border-gray-200 shadow-inner group-hover:scale-[1.01] transition-transform">
                  {roomImg ? (
                    <img
                      src={roomImg}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:brightness-105 transition-all duration-300"
                    />
                  ) : (
                    /* Vault Room High-Tech Design */
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-950 to-pink-950 flex items-center justify-center relative p-3">
                      <div className="w-20 h-20 rounded-full border-4 border-pink-400 border-dashed animate-spin flex items-center justify-center text-white" style={{ animationDuration: '20s' }}>
                        <div className="w-12 h-12 rounded-full bg-purple-700/60 border-2 border-cyan-300 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-yellow-300" />
                        </div>
                      </div>
                      <span className="absolute bottom-2 text-[10px] font-mono font-bold text-pink-300 tracking-wider">
                        SECURE VAULT
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                  {/* Corner Room Tag */}
                  <span className="absolute top-2 right-2 text-[10px] font-black bg-white/90 backdrop-blur-xs text-purple-950 px-2.5 py-0.5 rounded-full shadow-xs border border-white/50">
                    {isVault ? '7-Letter Code' : `Room ${room.number}`}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-[#E8E0EE] text-purple-900">
                      {isVault ? 'FINAL STAGE' : `ROOM ${room.number}`}
                    </span>

                    {/* Status Badge */}
                    {isCleared ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : isLocked ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Needs 7 Keys</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                        <span>Available</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-900 transition-colors flex items-center gap-2">
                    <span>{room.title}</span>
                  </h3>
                  <p className="text-xs font-semibold text-purple-700 mt-0.5">
                    {room.subtitle}
                  </p>

                  <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {room.description}
                  </p>
                </div>

                {/* Enter Button */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (isLocked) {
                        sounds.playWrong();
                        alert(`🔒 The Vault requires all 7 preliminary room keys! You currently have ${completedRooms.size}/7 keys.`);
                        return;
                      }
                      sounds.playClick();
                      onSelectRoom(room.id);
                    }}
                    disabled={isLocked}
                    className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCleared
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                        : isLocked
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#FEAEC9] via-[#C7BFE8] to-[#9AD9EA] text-purple-950 hover:brightness-105 active:scale-98 shadow-xs'
                    }`}
                  >
                    {getRoomIcon(room.icon)}
                    <span>{isCleared ? 'Revisit Room' : isLocked ? 'Locked (7 Keys Required)' : 'Enter Room'}</span>
                    {!isLocked && <ArrowRight className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
