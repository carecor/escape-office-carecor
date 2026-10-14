/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RoomId } from './types/game';
import { Navbar } from './components/Navbar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OfficeHub } from './components/OfficeHub';
import { LivingRoom } from './components/rooms/LivingRoom';
import { PantryRoom } from './components/rooms/PantryRoom';
import { MeetingRoom } from './components/rooms/MeetingRoom';
import { CeoOffice } from './components/rooms/CeoOffice';
import { BreakRoom } from './components/rooms/BreakRoom';
import { SleepingRoom } from './components/rooms/SleepingRoom';
import { SpecialRoom } from './components/rooms/SpecialRoom';
import { VaultRoom } from './components/rooms/VaultRoom';
import { sounds } from './utils/audio';

export default function App() {
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [activeRoomId, setActiveRoomId] = useState<RoomId | null>(null);
  const [completedRooms, setCompletedRooms] = useState<Set<RoomId>>(new Set());
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Overall Game Timer runs once game begins
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isGameStarted) {
      timer = setInterval(() => {
        setTotalSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGameStarted]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setTotalSeconds(0);
    setActiveRoomId(null);
  };

  const handleSelectRoom = (roomId: RoomId) => {
    setActiveRoomId(roomId);
  };

  const handleCompleteActiveRoom = () => {
    if (!activeRoomId) return;
    setCompletedRooms(prev => {
      const updated = new Set(prev);
      updated.add(activeRoomId);
      return updated;
    });
  };

  const handleExitRoom = () => {
    setActiveRoomId(null);
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  const handleResetGame = () => {
    setIsGameStarted(false);
    setTotalSeconds(0);
    setActiveRoomId(null);
    setCompletedRooms(new Set());
  };

  // Rule from user: "They can choose whatever room they will enter but once they enter they need to finish it before they can select for a new door."
  const canLeaveRoom = activeRoomId ? completedRooms.has(activeRoomId) : true;

  if (!isGameStarted) {
    return <WelcomeScreen onEnterOffice={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col selection:bg-[#FEAEC9] selection:text-pink-950">
      {/* Top Navigation */}
      <Navbar
        totalSeconds={totalSeconds}
        completedRooms={completedRooms}
        activeRoomId={activeRoomId}
        onExitRoom={handleExitRoom}
        onExitGame={handleResetGame}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        canLeaveRoom={canLeaveRoom}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {!activeRoomId && (
          <OfficeHub
            completedRooms={completedRooms}
            onSelectRoom={handleSelectRoom}
            onExitGame={handleResetGame}
          />
        )}

        {/* Room 1: Living Area (Great Characteristic) */}
        {activeRoomId === 'living' && (
          <LivingRoom
            isCompleted={completedRooms.has('living')}
            onCompleteRoom={handleCompleteActiveRoom}
            onBackToOffice={handleExitRoom}
          />
        )}

        {/* Room 2: Pantry Room (Attitude) */}
        {activeRoomId === 'pantry' && (
          <PantryRoom
            isCompleted={completedRooms.has('pantry')}
            onCompleteRoom={handleCompleteActiveRoom}
            onBackToOffice={handleExitRoom}
          />
        )}

        {/* Room 3: Meeting Room (Responsibility) */}
        {activeRoomId === 'meeting' && (
          <MeetingRoom
            isCompleted={completedRooms.has('meeting')}
            onCompleteRoom={handleCompleteActiveRoom}
            onBackToOffice={handleExitRoom}
          />
        )}

        {/* Room 4: CEO Office (Excellence) */}
        {activeRoomId === 'ceo' && (
          <CeoOffice
            isCompleted={completedRooms.has('ceo')}
            onCompleteRoom={handleCompleteActiveRoom}
            onBackToOffice={handleExitRoom}
          />
        )}

        {/* Room 5: Break Room (Cooperation) */}
        {activeRoomId === 'break' && (
          <BreakRoom
            isCompleted={completedRooms.has('break')}
            onCompleteRoom={handleCompleteActiveRoom}
            onBackToOffice={handleExitRoom}
          />
        )}

        {/* Room 6: Sleeping Room (Observation) */}
        {activeRoomId === 'sleeping' && (
          <SleepingRoom
            isCompleted={completedRooms.has('sleeping')}
            onCompleteRoom={handleCompleteActiveRoom}
            onBackToOffice={handleExitRoom}
          />
        )}

        {/* Room 7: Special Room (Relationship) */}
        {activeRoomId === 'special' && (
          <SpecialRoom
            isCompleted={completedRooms.has('special')}
            onCompleteRoom={handleCompleteActiveRoom}
            onBackToOffice={handleExitRoom}
          />
        )}

        {/* Room 8: Main Vault Exit */}
        {activeRoomId === 'vault' && (
          <VaultRoom
            completedRooms={completedRooms}
            totalSeconds={totalSeconds}
            onResetGame={handleResetGame}
            onBackToOffice={handleExitRoom}
          />
        )}
      </main>
    </div>
  );
}
