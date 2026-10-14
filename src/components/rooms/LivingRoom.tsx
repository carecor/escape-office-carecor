import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Tv,
  Droplet,
  Scissors,
  PenTool,
  Glasses,
  FileText,
  Pin,
  Eye,
  Info
} from 'lucide-react';
import { sounds } from '../../utils/audio';
import { livingRoomImg } from '../../assets/images';

interface LivingRoomProps {
  isCompleted: boolean;
  onCompleteRoom: () => void;
  onBackToOffice: () => void;
}

type ToolItem = 'ballpen' | 'water' | 'sciscor' | 'mirror' | 'paper';

interface StickyNoteLetter {
  id: string;
  letter: string;
  source: string;
}

interface HotspotDefinition {
  id: number;
  name: string;
  style: React.CSSProperties;
}

const FURNITURE_HOTSPOTS: HotspotDefinition[] = [
  { id: 1, name: 'Long Sofa', style: { left: '50%', top: '48%', width: '38%', height: '48%' } },
  { id: 2, name: 'Statement Coffee Table', style: { left: '38%', top: '61%', width: '24%', height: '25%' } },
  { id: 3, name: 'Open Shelving Unit', style: { left: '0%', top: '2%', width: '22%', height: '66%' } },
  { id: 4, name: 'Sideboard / Credenza', style: { left: '28%', top: '48%', width: '23%', height: '23%' } },
  { id: 5, name: 'Window', style: { left: '52%', top: '6%', width: '47%', height: '42%' } },
  { id: 6, name: 'Armchair', style: { left: '12%', top: '56%', width: '21%', height: '33%' } },
  { id: 7, name: 'Floor Boards', style: { left: '0%', top: '82%', width: '45%', height: '18%' } },
  { id: 8, name: 'Side Table', style: { left: '13%', top: '70%', width: '13%', height: '28%' } },
  { id: 9, name: 'Paintings', style: { left: '22%', top: '18%', width: '9.5%', height: '23%' } },
  { id: 10, name: 'Wall Clock', style: { left: '29.5%', top: '42.5%', width: '5.5%', height: '10%' } },
  { id: 11, name: 'Cup', style: { left: '18.5%', top: '65%', width: '4.5%', height: '7%' } },
  { id: 12, name: 'Flower Pot', style: { left: '87%', top: '18%', width: '13%', height: '48%' } },
  { id: 13, name: 'Cushion', style: { left: '60%', top: '47%', width: '8%', height: '13%' } },
  { id: 14, name: 'Floor Lamp', style: { left: '67%', top: '20%', width: '17%', height: '32%' } },
  { id: 15, name: 'Wall-Mounted TV', style: { left: '33%', top: '21%', width: '13%', height: '20%' } },
];

export const LivingRoom: React.FC<LivingRoomProps> = ({
  isCompleted,
  onCompleteRoom,
  onBackToOffice
}) => {
  // Inventory of discovered tools
  const [inventory, setInventory] = useState<ToolItem[]>([]);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  // Sticky notes collected (L, E, E, C, R, D, I, B)
  const [collectedLetters, setCollectedLetters] = useState<StickyNoteLetter[]>([]);

  // Bulletin board 8 slots: Target: C-R-E-D-I-B-L-E
  const [boardSlots, setBoardSlots] = useState<(StickyNoteLetter | null)[]>([
    null, null, null, null, null, null, null, null
  ]);

  // States of furniture
  const [hasSofaLetter, setHasSofaLetter] = useState(false);
  const [hasArmchairLetter, setHasArmchairLetter] = useState(false);
  const [hasCupLetter, setHasCupLetter] = useState(false);
  const [hasSideTableLetter, setHasSideTableLetter] = useState(false);
  const [hasPaintingLetter, setHasPaintingLetter] = useState(false);
  const [hasFlowerLetter, setHasFlowerLetter] = useState(false);
  const [hasCushionLetter, setHasCushionLetter] = useState(false);
  const [isLampOn, setIsLampOn] = useState(false);
  const [hasLampLetter, setHasLampLetter] = useState(false);
  const [isTvOn, setIsTvOn] = useState(false);

  // Inspected objects
  const [shelvingFound, setShelvingFound] = useState(false);
  const [sideboardFound, setSideboardFound] = useState(false);
  const [windowFound, setWindowFound] = useState(false);
  const [floorboardsFound, setFloorboardsFound] = useState(false);
  const [clockFound, setClockFound] = useState(false);

  // Toggle visual hotspot guide
  const [showHotspots, setShowHotspots] = useState(false);

  // Inspector dialog message
  const [inspectorLog, setInspectorLog] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'hint' | 'warn';
  }>({
    title: 'Executive Living Area',
    message: 'Explore the 15 furniture items and fixtures in the room photograph. Search carefully for hidden tools and sticky notes!',
    type: 'info'
  });

  const addLetter = (id: string, letter: string, source: string) => {
    if (!collectedLetters.some(l => l.id === id)) {
      const newLetter = { id, letter, source };
      setCollectedLetters(prev => [...prev, newLetter]);
      sounds.playFindItem();
    }
  };

  const addTool = (item: ToolItem) => {
    if (!inventory.includes(item)) {
      setInventory(prev => [...prev, item]);
      sounds.playFindItem();
    }
  };

  // Interactions for the 15 furniture items
  const handleFurnitureClick = (furnitureId: number) => {
    sounds.playClick();

    switch (furnitureId) {
      // 1. Long Sofa
      case 1:
        if (!hasSofaLetter) {
          setHasSofaLetter(true);
          addLetter('sofa-L', 'L', 'Long Sofa');
          setInspectorLog({
            title: 'Long Sofa',
            message: 'You reached between the sofa sections and retrieved sticky note: Letter "L"!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Long Sofa',
            message: 'A plush sectional sofa. You already retrieved the sticky note from here.',
            type: 'info'
          });
        }
        break;

      // 2. Statement Coffee Table
      case 2:
        setInspectorLog({
          title: 'Statement Coffee Table',
          message: 'A dual-tier coffee table with books and coasters. Smooth and neat. You find no secret items here.',
          type: 'info'
        });
        break;

      // 3. Open Shelving Unit
      case 3:
        if (!shelvingFound) {
          setShelvingFound(true);
          addTool('ballpen');
          setInspectorLog({
            title: 'Open Shelving Unit',
            message: 'Tucked behind the ceramics on the shelf, you found an item: Ballpen!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Open Shelving Unit',
            message: 'Architectural shelving unit. You have already searched this area.',
            type: 'info'
          });
        }
        break;

      // 4. Sideboard or Credenza
      case 4:
        if (!sideboardFound) {
          setSideboardFound(true);
          addTool('water');
          setInspectorLog({
            title: 'Sideboard Credenza',
            message: 'Inside the credenza cabinet, you found an item: Bottle of Water!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Sideboard Credenza',
            message: 'A walnut credenza. You already collected the water bottle from inside.',
            type: 'info'
          });
        }
        break;

      // 5. Window
      case 5:
        if (!windowFound) {
          setWindowFound(true);
          addTool('sciscor');
          setInspectorLog({
            title: 'Wide Window',
            message: 'On the window frame ledge, you found an item: Pair of Scissors!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Wide Window',
            message: 'Sunlight streams through the glass. Nothing more hidden along the frame.',
            type: 'info'
          });
        }
        break;

      // 6. Armchair
      case 6:
        if (!hasArmchairLetter) {
          setHasArmchairLetter(true);
          addLetter('armchair-E', 'E', 'Armchair');
          setInspectorLog({
            title: 'Armchair',
            message: 'Underneath the armchair base, you found a sticky note: Letter "E"!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Armchair',
            message: 'A cozy swivel armchair. Nothing else is concealed under the seat.',
            type: 'info'
          });
        }
        break;

      // 7. Floor Boards
      case 7:
        if (!floorboardsFound) {
          setFloorboardsFound(true);
          addTool('mirror');
          setInspectorLog({
            title: 'Floor Boards',
            message: 'Beneath a loose floorboard plank, you found an item: Handheld Mirror!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Floor Boards',
            message: 'Warm hardwood floorboards. Nothing else remains beneath.',
            type: 'info'
          });
        }
        break;

      // 8. Side Table
      case 8:
        if (hasSideTableLetter) {
          setInspectorLog({
            title: 'Side Table',
            message: 'The shaded paper impressions have already yielded the sticky note.',
            type: 'info'
          });
        } else if (selectedTool === 'ballpen') {
          setHasSideTableLetter(true);
          addLetter('sidetable-E', 'E', 'Side Table');
          setSelectedTool(null);
          setInspectorLog({
            title: 'Side Table',
            message: 'You shaded over the side table note indentations using the Ballpen! Out came sticky note: Letter "E"!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Side Table',
            message: 'A round side table with faint pen impressions pressed into the surface. You need an item like a ballpen to shade over them.',
            type: 'hint'
          });
        }
        break;

      // 9. Paintings
      case 9:
        if (hasPaintingLetter) {
          setInspectorLog({
            title: 'Modern Paintings',
            message: 'The canvas backing tape was cleanly sliced open already.',
            type: 'info'
          });
        } else if (selectedTool === 'sciscor') {
          setHasPaintingLetter(true);
          addLetter('painting-C', 'C', 'Paintings');
          setSelectedTool(null);
          setInspectorLog({
            title: 'Modern Paintings',
            message: 'You used the Scissors to cut the tape behind the painting frame! Out popped sticky note: Letter "C"!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Modern Paintings',
            message: 'Modern geometric art canvases. The frame backing is firmly sealed with tape. You need scissors to cut it.',
            type: 'hint'
          });
        }
        break;

      // 10. Wall Clock
      case 10:
        if (!clockFound) {
          setClockFound(true);
          addTool('paper');
          setInspectorLog({
            title: 'Wall Clock',
            message: 'Behind the round clock case, you found a folded item: Clean Paper!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Wall Clock',
            message: 'The clock ticks steadily on the wall. No other items hidden here.',
            type: 'info'
          });
        }
        break;

      // 11. Cup
      case 11:
        if (!hasCupLetter) {
          setHasCupLetter(true);
          addLetter('cup-R', 'R', 'Cup');
          setInspectorLog({
            title: 'Coffee Cup',
            message: 'You lifted the ceramic cup on the side table. Attached underneath is sticky note: Letter "R"!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Coffee Cup',
            message: 'A ceramic coffee cup. Empty now.',
            type: 'info'
          });
        }
        break;

      // 12. Flower Pot
      case 12:
        if (hasFlowerLetter) {
          setInspectorLog({
            title: 'Flower Pot',
            message: 'The potted plant is thriving. Secret compartment is empty.',
            type: 'info'
          });
        } else if (selectedTool === 'water') {
          setHasFlowerLetter(true);
          addLetter('flower-D', 'D', 'Flower Pot');
          setSelectedTool(null);
          setInspectorLog({
            title: 'Flower Pot',
            message: 'You poured the Water into the dry flower pot! The soil hydrated, floating up a capsule with sticky note: Letter "D"!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Flower Pot',
            message: 'The large potted plant is very thirsty. The soil is hard as rock. It needs water.',
            type: 'hint'
          });
        }
        break;

      // 13. Cushion
      case 13:
        if (hasCushionLetter) {
          setInspectorLog({
            title: 'Sofa Cushion',
            message: 'The hydro-reactive fabric watermark is already visible.',
            type: 'info'
          });
        } else if (selectedTool === 'water') {
          setHasCushionLetter(true);
          addLetter('cushion-I', 'I', 'Cushion');
          setSelectedTool(null);
          setInspectorLog({
            title: 'Sofa Cushion',
            message: 'You soaked the special cushion with Water! The moisture reacted with the fabric, revealing sticky note: Letter "I"!',
            type: 'success'
          });
        } else {
          setInspectorLog({
            title: 'Sofa Cushion',
            message: 'A colorful designer cushion with moisture-reactive fabric. If only you could soak it with water...',
            type: 'hint'
          });
        }
        break;

      // 14. Lamp
      case 14:
        if (!isLampOn) {
          setIsLampOn(true);
          if (!hasLampLetter) {
            setHasLampLetter(true);
            addLetter('lamp-B', 'B', 'Lamp');
            setInspectorLog({
              title: 'Floor Lamp',
              message: 'Click! You turned the lamp ON. The warm glow projects a stencil on the shade: Letter "B"!',
              type: 'success'
            });
          } else {
            setInspectorLog({
              title: 'Floor Lamp',
              message: 'The floor lamp is shining brightly.',
              type: 'info'
            });
          }
        } else {
          setIsLampOn(false);
          setInspectorLog({
            title: 'Floor Lamp',
            message: 'You turned the lamp off.',
            type: 'info'
          });
        }
        break;

      // 15. TV
      case 15:
        if (!isTvOn) {
          setIsTvOn(true);
          setInspectorLog({
            title: 'Wall-Mounted TV',
            message: 'You switched on the TV! A slide appears on screen showing the clue: "Able"!',
            type: 'success'
          });
        } else {
          setIsTvOn(false);
          setInspectorLog({
            title: 'Wall-Mounted TV',
            message: 'You turned off the television.',
            type: 'info'
          });
        }
        break;
    }
  };

  // Bulletin Board interactions
  const handlePlaceLetterInSlot = (slotIndex: number, note: StickyNoteLetter) => {
    sounds.playClick();
    const newSlots = [...boardSlots];

    // Remove note from any other slot it currently occupies
    const existingIndex = newSlots.findIndex(s => s?.id === note.id);
    if (existingIndex !== -1) {
      newSlots[existingIndex] = null;
    }

    newSlots[slotIndex] = note;
    setBoardSlots(newSlots);

    // Check if word is complete: C-R-E-D-I-B-L-E
    const currentWord = newSlots.map(s => s?.letter || '').join('');
    if (currentWord === 'CREDIBLE') {
      sounds.playVictory();
      onCompleteRoom();
    }
  };

  const handleRemoveFromSlot = (slotIndex: number) => {
    sounds.playClick();
    const newSlots = [...boardSlots];
    newSlots[slotIndex] = null;
    setBoardSlots(newSlots);
  };

  const currentBoardWord = boardSlots.map(s => s?.letter || '_').join('');

  // Unplaced letters
  const placedIds = new Set(boardSlots.filter(Boolean).map(s => s!.id));
  const availableNotes = collectedLetters.filter(l => !placedIds.has(l.id));

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Story & Context Banner */}
      <div className="bg-gradient-to-r from-white via-[#E8E0EE]/50 to-[#9AD9EA]/20 border-2 border-[#C7BFE8] rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FEAEC9] text-pink-950 uppercase tracking-wider">
              Room 1 Challenge
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Great Characteristic of an Employee
            </h2>
          </div>
          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Room Key Acquired: "Credibility Key"</span>
            </div>
          )}
        </div>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
          <strong>Executive Living Area:</strong> Search the 15 furniture items in the room picture.
          Collect hidden tools and sticky notes, use items where needed, and arrange the sticky notes onto the bulletin board to spell the core characteristic!
        </p>
      </div>

      {/* Main Room View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Living Room Picture */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <span>Living Room Inspection Photo</span>
                <span className="text-[11px] font-normal text-gray-400">(Click items in the photo to inspect)</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHotspots(!showHotspots)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    showHotspots
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHotspots ? 'Hide Targets' : 'Show 15 Targets'}</span>
                </button>

                {selectedTool && (
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded-full animate-pulse">
                    <span>Using: {selectedTool}</span>
                    <button
                      onClick={() => setSelectedTool(null)}
                      className="text-purple-600 hover:text-purple-900 ml-1 text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Actual Living Room Image with Accurate Clickable Hotspots */}
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 shadow-inner select-none bg-gray-900">
              <img
                src={livingRoomImg}
                alt="Living room interior"
                className="w-full h-full object-cover"
              />

              {/* TV Screen Overlay when turned on */}
              {isTvOn && (
                <div
                  style={{ left: '33%', top: '21%', width: '13%', height: '20%' }}
                  className="absolute bg-blue-950/90 rounded border border-cyan-400 flex flex-col items-center justify-center text-white pointer-events-none p-1 shadow-lg"
                >
                  <Tv className="w-4 h-4 text-cyan-300 mb-0.5 animate-pulse" />
                  <span className="text-[9px] font-black text-cyan-200">CLUE:</span>
                  <span className="text-xs font-black text-yellow-300 tracking-wider">"Able"</span>
                </div>
              )}

              {/* Lamp Glow Overlay when turned on */}
              {isLampOn && (
                <div
                  style={{ left: '67%', top: '20%', width: '17%', height: '32%' }}
                  className="absolute bg-yellow-300/20 rounded-full blur-md pointer-events-none"
                />
              )}

              {/* 15 Clickable Hotspot Rectangles */}
              {FURNITURE_HOTSPOTS.map(spot => (
                <div
                  key={spot.id}
                  onClick={() => handleFurnitureClick(spot.id)}
                  style={spot.style}
                  title={`${spot.name} (Click to interact)`}
                  className={`absolute rounded-xl cursor-pointer transition-all duration-200 group ${
                    showHotspots
                      ? 'bg-pink-500/20 border-2 border-pink-400'
                      : 'hover:bg-purple-500/25 hover:border-2 hover:border-purple-300'
                  }`}
                >
                  {/* Subtle Target Icon when hovered or toggled */}
                  <div className={`absolute top-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
                    showHotspots ? 'opacity-100' : ''
                  }`}>
                    {spot.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Inspector Log Banner */}
            <div className={`mt-3 p-3.5 rounded-xl border text-sm flex items-start gap-3 transition-colors ${
              inspectorLog.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : inspectorLog.type === 'hint'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-purple-50/70 border-[#C7BFE8] text-purple-950'
            }`}>
              <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-purple-700" />
              <div>
                <p className="font-bold text-xs uppercase tracking-wide opacity-80">{inspectorLog.title}</p>
                <p className="mt-0.5">{inspectorLog.message}</p>
              </div>
            </div>
          </div>

          {/* Discovered Tools & Inventory Bar */}
          <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <span>Inventory of Discovered Items</span>
                <span className="text-xs bg-[#E8E0EE] text-purple-900 px-2 py-0.5 rounded-full font-semibold">
                  {inventory.length} items found
                </span>
              </h4>
              <p className="text-xs text-gray-400">Click item to select, then click target furniture</p>
            </div>

            {inventory.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center italic bg-gray-50 rounded-xl">
                Your inventory is empty. Search the furniture in the photo to discover items!
              </p>
            ) : (
              <div className="flex flex-wrap gap-2.5">
                {inventory.map(item => {
                  const isSelected = selectedTool === item;
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedTool(isSelected ? null : item);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-700 ring-2 ring-purple-300 shadow-md scale-105'
                          : 'bg-white text-gray-800 border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                      }`}
                    >
                      {item === 'ballpen' && <PenTool className="w-4 h-4 text-pink-600" />}
                      {item === 'water' && <Droplet className="w-4 h-4 text-cyan-600" />}
                      {item === 'sciscor' && <Scissors className="w-4 h-4 text-amber-600" />}
                      {item === 'mirror' && <Glasses className="w-4 h-4 text-purple-600" />}
                      {item === 'paper' && <FileText className="w-4 h-4 text-emerald-600" />}
                      <span className="capitalize">{item === 'sciscor' ? 'Scissors' : item}</span>
                      {isSelected && <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Active</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Sticky Notes Found & Manual Bulletin Board */}
        <div className="space-y-4">
          {/* Bulletin Board Component */}
          <div className="bg-gradient-to-b from-[#FFFDF9] to-[#FBF8F2] rounded-2xl border-4 border-[#D4A373] p-4 sm:p-5 shadow-md relative">
            <div className="flex items-center justify-between mb-3 border-b pb-2 border-[#EAD7C5]">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-red-500 fill-red-500" />
                <h3 className="font-black text-gray-900 text-sm tracking-wide">
                  Office Bulletin Board
                </h3>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                8 Letters Required
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Place the sticky notes you found into the slots below to assemble the great employee characteristic.
              {isTvOn && (
                <span className="block mt-1 font-semibold text-purple-900 bg-purple-100 p-1.5 rounded-md">
                  📺 TV Clue: Word ends with <strong>"ABLE"</strong>
                </span>
              )}
            </p>

            {/* 8 Board Slots */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
              {boardSlots.map((slot, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    onClick={() => {
                      if (slot) handleRemoveFromSlot(idx);
                    }}
                    className={`w-11 h-14 rounded-lg flex flex-col items-center justify-center font-black text-lg shadow-sm border-2 transition-all cursor-pointer relative ${
                      slot
                        ? 'bg-[#FEAEC9] border-pink-400 text-pink-950 hover:scale-105 group'
                        : 'bg-white/80 border-dashed border-gray-300 text-gray-400 hover:border-purple-300'
                    }`}
                  >
                    {slot ? (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mb-0.5 shadow-xs" />
                        <span>{slot.letter}</span>
                        <span className="absolute -top-1 -right-1 hidden group-hover:flex w-4 h-4 rounded-full bg-red-500 text-white text-[9px] items-center justify-center">
                          ×
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-mono">{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">Slot {idx + 1}</span>
                </div>
              ))}
            </div>

            {/* Current Assembled Word Display */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center mb-3">
              <span className="text-xs text-amber-900 font-semibold block mb-0.5">Current Assembled Word:</span>
              <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-purple-950">
                {currentBoardWord}
              </span>
            </div>

            {/* Room Completion Banner if CREDIBLE is formed */}
            {currentBoardWord === 'CREDIBLE' ? (
              <div className="bg-emerald-100 border-2 border-emerald-400 p-3 rounded-xl text-center">
                <p className="font-black text-emerald-900 text-sm flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>"CREDIBLE" Solved!</span>
                </p>
                <p className="text-xs text-emerald-800 mt-1">
                  A credible employee is dependable, authentic, and inspiring. You earned the Credibility Key!
                </p>
                <button
                  onClick={onBackToOffice}
                  className="mt-3 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Return to Office Hub
                </button>
              </div>
            ) : (
              <p className="text-[11px] text-gray-500 text-center">
                Tip: Click an available sticky note below to assign it to the next empty slot!
              </p>
            )}
          </div>

          {/* Sticky Notes Discovered Tray */}
          <div className="bg-white rounded-2xl border-2 border-[#C7BFE8] p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pink-500" />
                <span>Found Sticky Notes</span>
              </h4>
              <span className="text-xs font-bold text-purple-900 bg-[#E8E0EE] px-2 py-0.5 rounded-full">
                {collectedLetters.length} / 8 Found
              </span>
            </div>

            {collectedLetters.length === 0 ? (
              <p className="text-xs text-gray-400 py-3 text-center italic bg-gray-50 rounded-xl">
                No sticky notes found yet. Click sofa, armchair, cups, paintings, lamps, and cushions!
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Unplaced Notes (click to place onto board):</p>
                <div className="flex flex-wrap gap-2">
                  {availableNotes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => {
                        const firstEmptyIdx = boardSlots.findIndex(s => s === null);
                        if (firstEmptyIdx !== -1) {
                          handlePlaceLetterInSlot(firstEmptyIdx, note);
                        } else {
                          alert('All board slots are filled! Click a slot on the board to remove a letter first.');
                        }
                      }}
                      className="w-10 h-12 rounded-lg bg-[#FEAEC9] hover:bg-pink-300 text-pink-950 font-black text-base shadow-sm border border-pink-400 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                      title={`From: ${note.source}`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mb-0.5" />
                      <span>{note.letter}</span>
                    </button>
                  ))}
                  {availableNotes.length === 0 && (
                    <span className="text-xs text-gray-400 italic">All found sticky notes placed on the board!</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
