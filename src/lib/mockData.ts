export interface Player {
  id: string;
  username: string;
  rating: number;
  clan?: string;
  clanTag?: string;
  bestRatingPerSeason: number;
  avgDamagePerRound: number;
  totalRaids: number;
  victoriousRaids: number;
  firstPlaces: number;
  lastPresence: string;
  equipment: {
    weapon: string;
    armor: string;
    helm: string;
  };
  medals: Medal[];
  seasonBanner?: 'gold' | 'silver';
}

export interface Clan {
  id: string;
  name: string;
  tag: string;
  rating: number;
  members: number;
  leader: string;
  totalRaids: number;
  winRate: number;
}

export interface Medal {
  season: number;
  rank: number;
  type: 'gold' | 'silver' | 'bronze';
}

const weapons = ['Dragon Sword', 'Katana', 'Kusarigama', 'Nunchaku', 'Staff', 'Blood Reaper', 'Flame Sabers'];
const armors = ['Ninja Armor', 'Samurai Armor', 'Dragon Armor', 'Shadow Armor', 'Demon Armor'];
const helms = ['Ninja Mask', 'Samurai Helmet', 'Dragon Helm', 'Shadow Hood', 'Demon Mask'];

const clanNames = [
  'Shadow Warriors', 'Dragon Clan', 'Silent Assassins', 'Blood Legion', 'Dark Knights',
  'Eternal Fighters', 'Storm Breakers', 'Mystic Monks', 'Iron Fist', 'Deadly Serpents',
  'Ghost Riders', 'Phoenix Rising', 'Thunder Strikes', 'Venom Squad', 'Crimson Blades',
  'Steel Warriors', 'Night Watchers', 'Savage Beasts', 'Ancient Order', 'Chaos Legion'
];

function generateRandomMedals(): Medal[] {
  const medals: Medal[] = [];
  const numMedals = Math.floor(Math.random() * 5);
  for (let i = 0; i < numMedals; i++) {
    const rank = Math.floor(Math.random() * 100) + 1;
    medals.push({
      season: Math.floor(Math.random() * 10) + 1,
      rank: rank,
      type: rank <= 10 ? 'gold' : rank <= 50 ? 'silver' : 'bronze'
    });
  }
  return medals;
}

export const mockPlayers: Player[] = Array.from({ length: 100 }, (_, i) => {
  const rank = i + 1;
  const baseRating = 5000 - (i * 30) - Math.floor(Math.random() * 25);
  const totalRaids = Math.floor(Math.random() * 500) + 100;
  const victoriousRaids = Math.floor(totalRaids * (0.4 + Math.random() * 0.5));
  const hasClan = Math.random() > 0.3;
  const clanIndex = Math.floor(Math.random() * clanNames.length);
  
  return {
    id: `player-${i + 1}`,
    username: `Shadow_Fighter_${1000 + i}`,
    rating: baseRating,
    clan: hasClan ? clanNames[clanIndex] : undefined,
    clanTag: hasClan ? `[${clanNames[clanIndex].substring(0, 3).toUpperCase()}]` : undefined,
    bestRatingPerSeason: baseRating + Math.floor(Math.random() * 500),
    avgDamagePerRound: Math.floor(Math.random() * 3000) + 1000,
    totalRaids: totalRaids,
    victoriousRaids: victoriousRaids,
    firstPlaces: Math.floor(Math.random() * 50) + 10,
    lastPresence: getRandomPresence(),
    equipment: {
      weapon: weapons[Math.floor(Math.random() * weapons.length)],
      armor: armors[Math.floor(Math.random() * armors.length)],
      helm: helms[Math.floor(Math.random() * helms.length)]
    },
    medals: rank <= 100 ? generateRandomMedals() : [],
    seasonBanner: rank <= 10 ? 'gold' : rank <= 100 ? 'silver' : undefined
  };
});

export const mockClans: Clan[] = Array.from({ length: 100 }, (_, i) => {
  const totalRaids = Math.floor(Math.random() * 1000) + 200;
  const victoriousRaids = Math.floor(totalRaids * (0.4 + Math.random() * 0.4));
  
  return {
    id: `clan-${i + 1}`,
    name: clanNames[i % clanNames.length] + (i >= clanNames.length ? ` ${Math.floor(i / clanNames.length) + 1}` : ''),
    tag: clanNames[i % clanNames.length].substring(0, 3).toUpperCase(),
    rating: 50000 - (i * 300) - Math.floor(Math.random() * 250),
    members: Math.floor(Math.random() * 30) + 20,
    leader: `Leader_${1000 + i}`,
    totalRaids: totalRaids,
    winRate: Math.floor((victoriousRaids / totalRaids) * 100)
  };
});

function getRandomPresence(): string {
  const options = [
    'Online',
    '5 minutes ago',
    '1 hour ago',
    '3 hours ago',
    'Yesterday',
    '2 days ago',
    '1 week ago'
  ];
  return options[Math.floor(Math.random() * options.length)];
}
