import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Plus,
  Trash2,
  ArrowRight,
  Medal,
  ShieldAlert
} from 'lucide-react';
import { CARECOR_EMPLOYEES, AWARDS_LIST } from '../../types/game';
import { sounds } from '../../utils/audio';
import { ceoOfficeImg } from '../../assets/images';

interface CeoOfficeProps {
  isCompleted: boolean;
  onCompleteRoom: () => void;
  onBackToOffice: () => void;
}

interface ConferredAward {
  id: string;
  employeeName: string;
  awardName: string;
  awardIcon: string;
  awardDesc: string;
  reason?: string;
}

export const CeoOffice: React.FC<CeoOfficeProps> = ({
  isCompleted,
  onCompleteRoom,
  onBackToOffice
}) => {
  const [conferredList, setConferredList] = useState<ConferredAward[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>(CARECOR_EMPLOYEES[0]);
  const [selectedAwardId, setSelectedAwardId] = useState<number>(AWARDS_LIST[0].id);
  const [personalReason, setPersonalReason] = useState<string>('');

  const handleAddAward = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if employee already received an award
    if (conferredList.some(item => item.employeeName === selectedEmployee)) {
      sounds.playWrong();
      alert(`${selectedEmployee} has already received an award! Please choose another coworker.`);
      return;
    }

    const awardObj = AWARDS_LIST.find(a => a.id === selectedAwardId);
    if (!awardObj) return;

    sounds.playCorrect();
    const newAward: ConferredAward = {
      id: `${selectedEmployee}-${awardObj.id}-${Date.now()}`,
      employeeName: selectedEmployee,
      awardName: awardObj.name,
      awardIcon: awardObj.icon,
      awardDesc: awardObj.desc,
      reason: personalReason.trim() || undefined
    };

    const updated = [...conferredList, newAward];
    setConferredList(updated);
    setPersonalReason('');

    // Advance to next unselected employee
    const assignedNames = new Set(updated.map(a => a.employeeName));
    const nextAvail = CARECOR_EMPLOYEES.find(name => !assignedNames.has(name));
    if (nextAvail) {
      setSelectedEmployee(nextAvail);
    }

    // Check if 8 awards are completed
    if (updated.length === 8) {
      sounds.playVictory();
      onCompleteRoom();
    }
  };

  const handleRemoveAward = (id: string) => {
    sounds.playClick();
    setConferredList(conferredList.filter(item => item.id !== id));
  };

  const assignedEmployees = new Set(conferredList.map(a => a.employeeName));
  const availableEmployees = CARECOR_EMPLOYEES.filter(name => !assignedEmployees.has(name));
  const targetCompleted = conferredList.length >= 8;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Story Banner */}
      <div className="bg-gradient-to-r from-white via-[#FFF8E1] to-[#E8E0EE] border-2 border-[#C7BFE8] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#E8E0EE] text-purple-950 uppercase tracking-wider border border-purple-200">
              Room 4 Challenge
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Excellence of Employee (CEO Office)
            </h2>
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Excellence Key Conferred!</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong>CEO Executive Chamber:</strong> Excellence is not an isolated title; it is mirrored in how we honor our peers.
          To unlock the CEO door, confer 1 distinct award onto each coworker across <strong>8 different team members</strong>.
          Celebrate the strengths of your colleagues from the roster of 17 Carecor teammates!
        </p>
      </div>

      {/* Realistic CEO Office Photo Banner */}
      <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#C7BFE8] shadow-sm">
        <img
          src={ceoOfficeImg}
          alt="Carecor CEO Office"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <div className="text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-600/80 px-2 py-0.5 rounded-md">
              Executive Suite
            </span>
            <p className="text-xs sm:text-sm font-semibold mt-0.5 text-amber-100">
              Where leadership honors peer excellence and dedication.
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout: Award Nomination Studio + Conferred Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Nomination Form (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <div className="flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-gray-900 text-base">Confer Peer Award</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {conferredList.length} / 8 Nominated
              </span>
            </div>

            {conferredList.length < 8 ? (
              <form onSubmit={handleAddAward} className="space-y-4">
                {/* Coworker Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    1. Select Coworker (from 17 Carecor Employees):
                  </label>
                  <select
                    value={selectedEmployee}
                    onChange={e => setSelectedEmployee(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-gray-800 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden"
                  >
                    {availableEmployees.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Award Select (20 Awards) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    2. Select Prestigious Award (from 20 Values):
                  </label>
                  <select
                    value={selectedAwardId}
                    onChange={e => setSelectedAwardId(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-semibold text-gray-800 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden"
                  >
                    {AWARDS_LIST.map(award => (
                      <option key={award.id} value={award.id}>
                        {award.id}. {award.icon} {award.name} - {award.desc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reason / Commendation Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    3. Personalized Commendation Note (Optional):
                  </label>
                  <input
                    type="text"
                    value={personalReason}
                    onChange={e => setPersonalReason(e.target.value)}
                    placeholder="e.g. Always shows up with radiant positivity and great ideas..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={availableEmployees.length === 0}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 text-purple-950 font-black text-sm shadow-md hover:brightness-105 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Confer Award #{conferredList.length + 1}</span>
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-black text-emerald-900 text-base">All 8 Awards Conferred!</h4>
                <p className="text-xs text-emerald-800">
                  The CEO has reviewed your peer accolades and stamped the Office Registry with highest honors.
                </p>
                <button
                  onClick={onBackToOffice}
                  className="w-full mt-2 py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>Return to Office Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Roster Status */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-xs">
            <span className="font-bold text-gray-700 block mb-2">Carecor 17 Roster Members:</span>
            <div className="flex flex-wrap gap-1.5">
              {CARECOR_EMPLOYEES.map(name => {
                const isAwarded = assignedEmployees.has(name);
                return (
                  <span
                    key={name}
                    className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${
                      isAwarded
                        ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {name} {isAwarded && '★'}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Conferred Awards Wall (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>The CEO Honors Gallery</span>
                </h3>
                <p className="text-xs text-gray-500">8 Coworker Commendation Certificates</p>
              </div>
              <div className="w-32 bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200">
                <div
                  className="bg-gradient-to-r from-amber-400 to-pink-500 h-full transition-all duration-500"
                  style={{ width: `${(Math.min(conferredList.length, 8) / 8) * 100}%` }}
                />
              </div>
            </div>

            {conferredList.length === 0 ? (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 space-y-2">
                <Award className="w-12 h-12 mx-auto text-gray-300" />
                <p className="text-sm font-semibold text-gray-500">No awards bestowed yet.</p>
                <p className="text-xs">Use the panel on the left to nominate your first peer!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {conferredList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="relative bg-gradient-to-br from-[#FFFDF7] to-[#FBF8EF] border-2 border-amber-300/80 rounded-xl p-3.5 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.awardIcon}</span>
                        <div>
                          <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                            Award #{idx + 1}
                          </p>
                          <h4 className="font-black text-gray-900 text-sm leading-tight">
                            {item.awardName}
                          </h4>
                        </div>
                      </div>

                      {!targetCompleted && (
                        <button
                          onClick={() => handleRemoveAward(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove award"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-amber-100 flex items-center justify-between">
                      <span className="text-xs font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-md">
                        👤 {item.employeeName}
                      </span>
                      <span className="text-[10px] text-gray-500 italic truncate max-w-[140px]">
                        {item.reason || item.awardDesc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
