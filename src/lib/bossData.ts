export interface Boss {
  id: string;
  name: string;
  weapon: string;
  rangedWeapon: string;
  magic: string;
  minDan: number;
  shield: number;
  timeLimit: string; // Time limit per round (e.g., "05:20")
  raidDuration: number; // Total raid duration in seconds
  maxPlayers: number;
  tier: number;
  keyRequired: string; // Key item ID required to enter
  keysPerEntry: number; // Number of keys needed per entry
}

export const bosses: Boss[] = [
  // Tier 1
  {
    id: 'volcano',
    name: 'Volcano',
    weapon: 'Ornamental Sabers',
    rangedWeapon: 'Harvester of Souls',
    magic: 'Fire Pillar',
    minDan: 1,
    shield: 1757,
    timeLimit: '05:20',
    raidDuration: 320,
    maxPlayers: 4,
    tier: 1,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'megalith',
    name: 'Megalith',
    weapon: 'Coral Prickles',
    rangedWeapon: 'Throwing Spikes',
    magic: 'Ice Pillar',
    minDan: 1,
    shield: 5121,
    timeLimit: '10:50',
    raidDuration: 650,
    maxPlayers: 5,
    tier: 1,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'fungus',
    name: 'Fungus',
    weapon: 'Two-handed Cudgel',
    rangedWeapon: 'Throwing Sickles',
    magic: "Monk's Amulet",
    minDan: 1,
    shield: 10095,
    timeLimit: '12:40',
    raidDuration: 760,
    maxPlayers: 6,
    tier: 1,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'vortex',
    name: 'Vortex',
    weapon: 'Silver Glaive',
    rangedWeapon: 'Fishes',
    magic: 'Water Ball',
    minDan: 3,
    shield: 11533,
    timeLimit: '12:40',
    raidDuration: 760,
    maxPlayers: 7,
    tier: 1,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  // Tier 2
  {
    id: 'fatum',
    name: 'Fatum',
    weapon: 'Grim Scythe',
    rangedWeapon: 'Needles',
    magic: 'Dark Wave',
    minDan: 4,
    shield: 8473,
    timeLimit: '08:40',
    raidDuration: 520,
    maxPlayers: 5,
    tier: 2,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'arkhos',
    name: 'Arkhos',
    weapon: 'The Sting',
    rangedWeapon: '',
    magic: 'Toxic Cloud',
    minDan: 5,
    shield: 8893,
    timeLimit: '08:10',
    raidDuration: 490,
    maxPlayers: 6,
    tier: 2,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'hoaxen',
    name: 'Hoaxen',
    weapon: 'Harrier Hooks',
    rangedWeapon: 'Kunai',
    magic: 'Asteroid',
    minDan: 6,
    shield: 12639,
    timeLimit: '08:10',
    raidDuration: 490,
    maxPlayers: 6,
    tier: 2,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  // Tier 3
  {
    id: 'karcer',
    name: 'Karcer',
    weapon: 'Hunger Sickles',
    rangedWeapon: 'Harvester of Souls',
    magic: 'Dark Wave',
    minDan: 8,
    shield: 10473,
    timeLimit: '05:00',
    raidDuration: 300,
    maxPlayers: 6,
    tier: 3,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'drakaina',
    name: 'Drakaina',
    weapon: 'War Shuang Gou',
    rangedWeapon: 'War Axes',
    magic: "Torturer's Rage",
    minDan: 9,
    shield: 12513,
    timeLimit: '07:00',
    raidDuration: 420,
    maxPlayers: 6,
    tier: 3,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'tenebris',
    name: 'Tenebris',
    weapon: "Lynx's Claws",
    rangedWeapon: 'None',
    magic: 'Medium Charge of Darkness',
    minDan: 10,
    shield: 14377,
    timeLimit: '07:30',
    raidDuration: 450,
    maxPlayers: 5,
    tier: 3,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  // Tier 4
  {
    id: 'gatekeeper',
    name: 'Gatekeeper',
    weapon: 'Pneumo Fists',
    rangedWeapon: 'Circular Saw',
    magic: 'Force Ray',
    minDan: 10,
    shield: 11001,
    timeLimit: '05:00',
    raidDuration: 300,
    maxPlayers: 4,
    tier: 4,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'saturn',
    name: 'Saturn',
    weapon: 'Electro Batons',
    rangedWeapon: 'Dissecting Blade',
    magic: "Torturer's Rage",
    minDan: 10,
    shield: 12501,
    timeLimit: '05:00',
    raidDuration: 300,
    maxPlayers: 4,
    tier: 4,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'blackness',
    name: 'The Blackness',
    weapon: 'Sharp Claws',
    rangedWeapon: 'None',
    magic: 'Dark Wave',
    minDan: 10,
    shield: 13477,
    timeLimit: '07:30',
    raidDuration: 450,
    maxPlayers: 4,
    tier: 4,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  },
  {
    id: 'stalker',
    name: 'Stalker',
    weapon: 'Insectile Claws',
    rangedWeapon: 'None',
    magic: 'Energy Ball',
    minDan: 10,
    shield: 16911,
    timeLimit: '09:20',
    raidDuration: 560,
    maxPlayers: 4,
    tier: 4,
    keyRequired: 'steel-keys',
    keysPerEntry: 1
  }
];

export const getTierBosses = (tier: number) => {
  return bosses.filter(boss => boss.tier === tier);
};