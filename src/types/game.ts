/**
 * Game Types & Data Constants for CARECOR OFFICE Escape Challenge
 */

export type RoomId =
  | 'living'
  | 'pantry'
  | 'meeting'
  | 'ceo'
  | 'break'
  | 'sleeping'
  | 'special'
  | 'vault';

export interface RoomMeta {
  id: RoomId;
  number: number;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  description: string;
  story: string;
}

export const ROOMS: RoomMeta[] = [
  {
    id: 'living',
    number: 1,
    title: 'Living Area',
    subtitle: 'Great Characteristic of an Employee',
    color: '#FEAEC9', // Pink
    icon: 'Sofa',
    description: 'Explore the executive lounge. Search 15 curated fixtures to discover hidden tools and sticky notes.',
    story: 'In this executive lounge, true employee strength is subtle yet steadfast. 15 pieces of furniture and fixtures hold clues. Scour the room, combine tools, gather sticky notes, and pin them onto the bulletin board to uncover the core characteristic!'
  },
  {
    id: 'pantry',
    number: 2,
    title: 'Pantry Room',
    subtitle: 'Attitude of an Employee',
    color: '#9AD9EA', // Light Blue
    icon: 'Coffee',
    description: '10 kitchen fixtures with logical workplace dilemmas. Answer all to win 10 keys.',
    story: 'The office pantry is where daily attitudes collide and camaraderie is tested. 10 fixtures hold workplace scenarios. Determine each attitude value to collect Keys 1 through 10 and unlock the pantry master lock!'
  },
  {
    id: 'meeting',
    number: 3,
    title: 'Meeting Room',
    subtitle: 'Responsibility of an Employee',
    color: '#C7BFE8', // Lavender
    icon: 'Presentation',
    description: 'Decipher 10 picture rebuses and reflect on your core responsibility.',
    story: 'High-stakes decisions and accountability happen here. Crack 10 visual picture rebuses representing vital workplace responsibilities, then share your own conviction to claim the meeting room key!'
  },
  {
    id: 'ceo',
    number: 4,
    title: 'CEO Office',
    subtitle: 'Excellence of Employee',
    color: '#E8E0EE', // Very Light Lavender
    icon: 'Award',
    description: 'Celebrate your peers! Award 8 distinct accolades to Carecor coworkers.',
    story: 'The CEO champions a culture of peer recognition. To unlock the executive chamber, celebrate the unique excellence of your teammates by bestowing 8 prestigious awards upon 8 colleagues!'
  },
  {
    id: 'break',
    number: 5,
    title: 'Break Room',
    subtitle: 'Cooperation',
    color: '#FEAEC9', // Pink
    icon: 'Users',
    description: 'Scan the office QR code and execute the Target pose to follow together.',
    story: 'Collaboration is our superpower. The break room door responds only to synchronized energy. Scan the secret team QR code, match the Target pose to follow, and capture the proof!'
  },
  {
    id: 'sleeping',
    number: 6,
    title: 'Sleeping Room',
    subtitle: 'Observation',
    color: '#9AD9EA', // Light Blue
    icon: 'Eye',
    description: 'Spot 10 subtle differences between two workstation scenes to open the lockbox.',
    story: 'In this restorative haven, sharp observation separates the ordinary from the extraordinary. Scrutinize two nearly identical workstation photos to spot all 10 discrepancies and crack the hidden safe!'
  },
  {
    id: 'special',
    number: 7,
    title: 'Special Room',
    subtitle: 'Relationship',
    color: '#C7BFE8', // Lavender
    icon: 'HeartHandshake',
    description: '8 team members share heartfelt appreciation with 20 seconds dedicated to each.',
    story: 'Relationships are the bedrock of Carecor. Step into the circle of trust: 8 members will share authentic gratitude for 20 seconds each. When all 8 have spoken, the golden relationship chest unlocks!'
  },
  {
    id: 'vault',
    number: 8,
    title: 'Main Vault Exit',
    subtitle: 'The Final Breakthrough',
    color: '#FEAEC9',
    icon: 'ShieldCheck',
    description: 'Gathered all keys? Enter the 7-letter office keyword to unlock the exit door!',
    story: 'The ultimate threshold! All 7 keys turn the preliminary tumblers. Now, input the 7-letter word that binds our entire mission and exit triumphantly into the winner circle!'
  }
];

// Employee List for Room 4 & 7
export const CARECOR_EMPLOYEES = [
  'Evan',
  'Jane',
  'Lew',
  'Kay',
  'Jessamin',
  'Ian',
  'Nikko',
  'Jessa',
  'Zay',
  'Krisha',
  'Catherine',
  'Honna',
  'Tem',
  'Brenth',
  'Geanna',
  'Klien',
  'John Andrei'
];

// 20 Awards for Room 4
export const AWARDS_LIST = [
  { id: 1, name: 'Reliable', icon: '🛡️', desc: 'Always dependable in every crunch.' },
  { id: 2, name: 'Helpful', icon: '🤝', desc: 'First to lend a supportive hand.' },
  { id: 3, name: 'Cheerful', icon: '☀️', desc: 'Brightens the room with warmth.' },
  { id: 4, name: 'Responsible', icon: '📌', desc: 'Takes deep ownership of results.' },
  { id: 5, name: 'Punctual', icon: '⏰', desc: 'Always on time and respecting schedules.' },
  { id: 6, name: 'Hardworking', icon: '💪', desc: 'Pours relentless effort into every task.' },
  { id: 7, name: 'Honest', icon: '💎', desc: 'Stands firm for truth and clarity.' },
  { id: 8, name: 'Creative', icon: '🎨', desc: 'Sparks fresh, innovative solutions.' },
  { id: 9, name: 'Patient', icon: '🌱', desc: 'Guides others with calm understanding.' },
  { id: 10, name: 'Respectful', icon: '🙏', desc: 'Treats every voice with dignity.' },
  { id: 11, name: 'Dedicated', icon: '🔥', desc: 'Deeply committed to team goals.' },
  { id: 12, name: 'Friendly', icon: '😊', desc: 'Welcoming and approachable to all.' },
  { id: 13, name: 'Empathetic', icon: '💖', desc: 'Listens and understands feelings deeply.' },
  { id: 14, name: 'Efficient', icon: '⚡', desc: 'Delivers top quality without wasted effort.' },
  { id: 15, name: 'Cooperative', icon: '🧩', desc: 'Excels at bridging team collaboration.' },
  { id: 16, name: 'Organized', icon: '📋', desc: 'Brings order and precision to chaos.' },
  { id: 17, name: 'Motivated', icon: '🚀', desc: 'Driven by passion and continuous growth.' },
  { id: 18, name: 'Trustworthy', icon: '🗝️', desc: 'Confidant and rock-solid partner.' },
  { id: 19, name: 'Optimistic', icon: '🌈', desc: 'Sees the silver lining in every challenge.' },
  { id: 20, name: 'Outstanding', icon: '🌟', desc: 'Consistently exceeds all expectations.' }
];

// Room 2: Pantry Scenarios & Answers
export interface PantryItemData {
  id: string;
  name: string;
  icon: string;
  scenario: string;
  question: string;
  answer: string;
  keyNumber: number;
  synonymClue: string;
}

export const PANTRY_QUESTIONS: PantryItemData[] = [
  {
    id: 'microwave',
    name: 'Microwave',
    icon: 'Radio',
    scenario: 'During a meeting, two employees disagree about how to solve a problem. One employee listens carefully, allows the other to speak, and responds without insulting or belittling them.',
    question: 'What workplace value is demonstrated?',
    answer: 'respect',
    keyNumber: 7,
    synonymClue: 'Treating others with dignity and esteem (7 letters)'
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator',
    icon: 'Refrigerator',
    scenario: 'A new employee repeatedly asks questions while learning a difficult process. Instead of becoming irritated, an experienced coworker calmly explains each step and gives the new employee time to learn.',
    question: 'What workplace value is demonstrated?',
    answer: 'patience',
    keyNumber: 2,
    synonymClue: 'Calm endurance and tolerance under delay (8 letters)'
  },
  {
    id: 'kettle',
    name: 'Kettle',
    icon: 'Coffee',
    scenario: 'Four employees must complete a project. One is good at planning, another at writing, another at analyzing data, and another at presenting. They combine their strengths and help one another to finish the project successfully.',
    question: 'What workplace value is demonstrated?',
    answer: 'teamwork',
    keyNumber: 10,
    synonymClue: 'Collaborative partnership combining unique strengths (8 letters)'
  },
  {
    id: 'dishrack',
    name: 'Dish rack',
    icon: 'Utensils',
    scenario: 'An employee accidentally enters the wrong information into a report. Instead of blaming a coworker, the employee admits the mistake, informs the supervisor, and helps correct it.',
    question: 'What workplace value is demonstrated?',
    answer: 'accountability',
    keyNumber: 1,
    synonymClue: 'Taking personal responsibility for one’s actions (14 letters)'
  },
  {
    id: 'sink',
    name: 'Sink',
    icon: 'Droplet',
    scenario: 'An employee discovers extra money in the office cash box. Nobody notices the mistake, and the employee could keep it without getting caught. Instead, they immediately report it to the supervisor.',
    question: 'What workplace value is demonstrated?',
    answer: 'honesty',
    keyNumber: 6,
    synonymClue: 'Truthfulness and unwavering moral integrity (7 letters)'
  },
  {
    id: 'plants',
    name: 'Plants',
    icon: 'Sprout',
    scenario: 'An employee is assigned an important task with a deadline. Even without constant reminders from the supervisor, the employee organizes their time and makes sure the task is completed.',
    question: 'What workplace value is demonstrated?',
    answer: 'responsibility',
    keyNumber: 5,
    synonymClue: 'Obligation and reliable duty to carry tasks through (14 letters)'
  },
  {
    id: 'cabinet',
    name: 'Cabinet',
    icon: 'Archive',
    scenario: 'During a team discussion, an employee shares their ideas, listens to different suggestions, and is willing to discuss concerns honestly rather than hiding information or rejecting feedback immediately.',
    question: 'What workplace value is demonstrated?',
    answer: 'openess', // accepts openness too
    keyNumber: 8,
    synonymClue: 'Receptiveness to new ideas and transparent dialogue (7 or 8 letters)'
  },
  {
    id: 'frame',
    name: 'Frame',
    icon: 'Image',
    scenario: 'Before submitting a report, an employee checks every number, spelling, date, and calculation. They discover a small error and correct it before sending the document.',
    question: 'What workplace value is demonstrated?',
    answer: 'accuracy',
    keyNumber: 4,
    synonymClue: 'Precision, exactness, and meticulous correctness (8 letters)'
  },
  {
    id: 'table',
    name: 'Table',
    icon: 'LayoutGrid',
    scenario: 'A customer becomes angry and speaks rudely to an employee. The employee remains calm, uses appropriate language, follows company procedures, and handles the complaint politely.',
    question: 'What workplace value is demonstrated?',
    answer: 'professionalism',
    keyNumber: 9,
    synonymClue: 'Courteous conduct, poise, and ethical workplace etiquette (15 letters)'
  },
  {
    id: 'chair',
    name: 'Chair',
    icon: 'Armchair',
    scenario: 'An employee notices that a coworker is struggling to finish a task. Even though the employee has already finished their own work, they offer help without expecting anything in return.',
    question: 'What workplace value is demonstrated?',
    answer: 'kindness',
    keyNumber: 3,
    synonymClue: 'Warmhearted benevolence and considerate helpfulness (8 letters)'
  }
];

// Room 3: Rebuses
export interface RebusItem {
  id: number;
  word: string;
  visualParts: { symbol: string; label: string }[];
  hint: string;
  synonym: string;
}

export const REBUS_LIST: RebusItem[] = [
  {
    id: 1,
    word: 'Resourcefulness',
    visualParts: [
      { symbol: '🔄', label: 'Cycle' },
      { symbol: '⛲', label: 'Spring' },
      { symbol: '🥛', label: 'Packed' },
      { symbol: '🏞️', label: 'Wild' }
    ],
    hint: 'Ability to find clever ways to overcome workplace hurdles',
    synonym: 'Inventiveness & quick problem solving'
  },
  {
    id: 2,
    word: 'Discipline',
    visualParts: [
      { symbol: '💿', label: 'Laser Disc' },
      { symbol: '🌐', label: 'Protocol' },
      { symbol: '📏', label: 'Straight Rule' }
    ],
    hint: 'Self-control and strict adherence to principles',
    synonym: 'Orderliness & steadfast focus'
  },
  {
    id: 3,
    word: 'Adaptability',
    visualParts: [
      { symbol: '🔌', label: 'Converter' },
      { symbol: '⚡', label: 'Power Skill' }
    ],
    hint: 'Capacity to adjust easily to changing workplace conditions',
    synonym: 'Versatility in evolving environments'
  },
  {
    id: 4,
    word: 'Selfmotivation',
    visualParts: [
      { symbol: '🪞', label: 'Reflection' },
      { symbol: '🏎️', label: 'Drive & Velocity' },
      { symbol: '🏝️', label: 'Destination' }
    ],
    hint: 'Inner spark that drives you to take initiative independently',
    synonym: 'Personal drive and proactive momentum'
  },
  {
    id: 5,
    word: 'Diligence',
    visualParts: [
      { symbol: '🤝', label: 'Accord' },
      { symbol: '🎩', label: 'Men in Suits' }
    ],
    hint: 'Persistent and thorough effort toward excellence',
    synonym: 'Conscientious application to duties'
  },
  {
    id: 6,
    word: 'Attentiveness',
    visualParts: [
      { symbol: '📍', label: 'Location Marker' },
      { symbol: '⛺', label: 'Shelter' },
      { symbol: '👁️', label: 'Vision' },
      { symbol: '🌊', label: 'Loch' }
    ],
    hint: 'Action of observing keenly and listening intently to details',
    synonym: 'Mindful alertness and deep listening'
  },
  {
    id: 7,
    word: 'Vigilance',
    visualParts: [
      { symbol: '✌️', label: 'Two Fingers' },
      { symbol: '🐟', label: 'Aquatic Breathing' },
      { symbol: '🐜', label: 'Colony Insects' }
    ],
    hint: 'Keeping watchful and alert against potential mistakes or risks',
    synonym: 'Watchfulness and proactive care'
  },
  {
    id: 8,
    word: 'Integrity',
    visualParts: [
      { symbol: '🔢', label: 'Whole Number' },
      { symbol: '🍵', label: 'Brewed Cup' }
    ],
    hint: 'Uncompromising adherence to moral and ethical principles',
    synonym: 'Wholeness of character & unwavering honesty'
  },
  {
    id: 9,
    word: 'Dependability',
    visualParts: [
      { symbol: '🌊', label: 'Abyss' },
      { symbol: '✒️', label: 'Quill' },
      { symbol: '🥁', label: 'Beat' },
      { symbol: '💵', label: 'Invoice Note' }
    ],
    hint: 'Quality of being trustworthy and consistently delivering promises',
    synonym: 'Steadfast trustworthiness'
  },
  {
    id: 10,
    word: 'Commitment',
    visualParts: [
      { symbol: '☄️', label: 'Space Rock' },
      { symbol: '🌿', label: 'Herb Leaf' }
    ],
    hint: 'Dedication and unwavering pledge to a shared mission',
    synonym: 'Devotion, allegiance, and loyalty'
  }
];
