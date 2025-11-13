export interface Item {
  id: string;
  name: string;
  type: 'charge' | 'key' | 'pack' | 'elixir' | 'chest' | 'lottery' | 'shard' | 'ticket' | 'gem' | 'coin';
  description: string;
  price: number | null; // null if not purchasable
  priceType?: 'gems' | 'orbs' | 'unverified-gems' | 'coins';
  alternativePrice?: number;
  alternativePriceType?: 'gems' | 'orbs' | 'unverified-gems' | 'coins';
  otherWays: string[];
}

export const items: Item[] = [
  // Currencies
  {
    id: 'verified-gems',
    name: 'Verified Gems',
    type: 'gem',
    description: 'Premium rare gems obtained from defeating raid bosses. Used to purchase chests, equipment, and raid supplies.',
    price: null,
    otherWays: [
      'Defeating Tier 1-4 raid bosses',
      'Special events',
      'Season end rewards'
    ]
  },
  {
    id: 'unverified-gems',
    name: 'Unverified Gems',
    type: 'gem',
    description: 'Common gems used for enchantments, forging, and speeding up weapon upgrades. Earned from various activities.',
    price: null,
    otherWays: [
      'Daily rewards',
      'Quest completions',
      'Chest rewards',
      'Minor boss battles'
    ]
  },
  {
    id: 'coins',
    name: 'Shadow Coins',
    type: 'coin',
    description: 'Standard currency for weapon upgrades. Upgrades take time but can be accelerated with Unverified Gems.',
    price: null,
    otherWays: [
      'Daily login rewards',
      'Completing battles',
      'Selling items',
      'Quest rewards'
    ]
  },
  // Charges
  {
    id: 'minor-charge',
    name: 'Minor Charge of Darkness',
    type: 'charge',
    description: 'This Charge of Darkness causes 72 - 88 damage to the boss.',
    price: 5,
    priceType: 'gems',
    otherWays: [
      'Beating any raid-boss',
      'Daily Quests',
      "Season's rewards"
    ]
  },
  {
    id: 'medium-charge',
    name: 'Medium Charge of Darkness',
    type: 'charge',
    description: 'This Charge of Darkness causes 488 - 551 damage to the boss.',
    price: 25,
    priceType: 'gems',
    otherWays: [
      'Beating any raid-boss (except Volcano and Megalith)',
      'Daily Quests',
      "Season's rewards"
    ]
  },
  {
    id: 'large-charge',
    name: 'Large Charge of Darkness',
    type: 'charge',
    description: 'This Charge of Darkness causes 990 - 1071 damage to the boss.',
    price: 35,
    priceType: 'gems',
    otherWays: [
      'Get first place in Arkhos, Hoaxen, Karcer, Drakaina and Tenebris raids'
    ]
  },
  {
    id: 'medium-charges-bundle',
    name: '10 medium Charges of Darkness',
    type: 'charge',
    description: 'Large pack of Charges of Darkness (488 - 551 damage)',
    price: 199,
    priceType: 'gems',
    otherWays: []
  },
  {
    id: 'large-charges-bundle',
    name: '10 large Charges of Darkness',
    type: 'charge',
    description: 'Large pack of Charges of Darkness (990 - 1071 damage)',
    price: 299,
    priceType: 'gems',
    otherWays: []
  },
  // Keys
  {
    id: 'steel-keys',
    name: 'Bunch of steel keys',
    type: 'key',
    description: '5 keys for entering the battle with Volcano.',
    price: 14,
    priceType: 'gems',
    otherWays: ['Given at the start of season']
  },
  // Packs
  {
    id: 'raid-equipment',
    name: 'Raid Equipment',
    type: 'pack',
    description: 'Limited-time offer pack with various items',
    price: 249,
    priceType: 'gems',
    otherWays: []
  },
  {
    id: 'underworld-conqueror',
    name: "Underworld Conqueror's pack",
    type: 'pack',
    description: 'Special pack with charges and other items',
    price: 99,
    priceType: 'gems',
    otherWays: []
  },
  // Elixirs
  {
    id: 'magic-source',
    name: 'Magic Source',
    type: 'elixir',
    description: 'Increases amount of magic gained when player is hit, strongly boosting its recharge speed - acts 1 round.',
    price: 19,
    priceType: 'gems',
    otherWays: [
      'Win Tier 3 raids',
      'Special Event Chests',
      'Mystery Box'
    ]
  },
  {
    id: 'steel-hedgehog',
    name: 'Steel Hedgehog',
    type: 'elixir',
    description: 'Reflects a percentage of damage received from hits during 1 round. The harder the enemy hits, the more damage he takes.',
    price: 12,
    priceType: 'gems',
    otherWays: [
      'Special Event Chests',
      'Mystery Box'
    ]
  },
  {
    id: 'crag',
    name: 'Crag',
    type: 'elixir',
    description: 'Increases endurance during 1 round, not allowing the enemy to knock you to the ground with strong blows.',
    price: 14,
    priceType: 'gems',
    otherWays: [
      'Special Event Chests',
      'Mystery Box'
    ]
  },
  {
    id: 'healing-vine',
    name: 'Healing Vine',
    type: 'elixir',
    description: 'Regenerates health after you took some damage during several seconds - acts for 1 round.',
    price: 12,
    priceType: 'gems',
    otherWays: ['Mystery Box']
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    type: 'elixir',
    description: "Combines several elixirs effects: hits cannot knock you off, reflects a percentage of received damage, increased magic recharge. Works for 1 round.",
    price: 29,
    priceType: 'gems',
    otherWays: ['Mystery Box']
  },
  {
    id: 'explosive-vigor',
    name: 'The Explosive Vigor',
    type: 'elixir',
    description: "Any hit applies the bomb effect. Explosion knocks enemy off, deals increased damage and steals the enemy's health - acts 1 round.",
    price: 32,
    priceType: 'gems',
    otherWays: [
      'Special Event Chests',
      'Mystery Box'
    ]
  },
  {
    id: 'star-clarity',
    name: 'Star Clarity',
    type: 'elixir',
    description: 'Reduces proc chances of enemy enchantments to trigger and activate.',
    price: 34,
    priceType: 'gems',
    otherWays: ['Special Event Chests']
  },
  // Chests
  {
    id: 'forest-mystery',
    name: 'Chest of the Forest Mystery',
    type: 'chest',
    description: "1 Monk's Set item and/or raid consumables.",
    price: 329,
    priceType: 'gems',
    alternativePrice: 7500,
    alternativePriceType: 'orbs',
    otherWays: []
  },
  {
    id: 'souls-keeper',
    name: 'Chest of Souls Keeper',
    type: 'chest',
    description: "1 Sentinel's Set item and/or raid consumables",
    price: 599,
    priceType: 'gems',
    alternativePrice: 10000,
    alternativePriceType: 'orbs',
    otherWays: []
  },
  {
    id: 'neo-wanderer',
    name: 'Chest of Neo-wanderer',
    type: 'chest',
    description: '1 Neo-Wanderer Set item and/or raid consumables',
    price: 399,
    priceType: 'gems',
    alternativePrice: 8500,
    alternativePriceType: 'orbs',
    otherWays: []
  },
  {
    id: 'eternals-treasures',
    name: "Chest of Eternals' Treasures",
    type: 'chest',
    description: 'Contains various rare items with different drop rates',
    price: 2899,
    priceType: 'gems',
    otherWays: []
  },
  {
    id: 'enchanters-chest',
    name: "Enchanter's Chest",
    type: 'chest',
    description: 'Quantity depends on the player\'s progress in the story. Shadow orbs can be obtained in Eclipse',
    price: 79,
    priceType: 'gems',
    otherWays: []
  },
  // Mystery Box
  {
    id: 'mystery-box',
    name: 'Mystery Box',
    type: 'lottery',
    description: 'Play the lottery, try your luck and you will be lucky! (Get a random item such as Monk Chest, keys, elixir, charges, and Shadow Orbs.)',
    price: 19,
    priceType: 'gems',
    alternativePrice: 1,
    alternativePriceType: 'ticket',
    otherWays: ['Watch ads']
  },
  // Shards
  {
    id: 'monk-shards',
    name: 'Monk set shards',
    type: 'shard',
    description: 'These magic items can be exchanged for an item from the Monk set.',
    price: null,
    otherWays: [
      'Obtained from the first-place reward in any raids and event chest'
    ]
  },
  {
    id: 'sentinel-shards',
    name: 'Sentinel set shards',
    type: 'shard',
    description: 'These magic items can be exchanged for an item from the Sentinel set.',
    price: null,
    otherWays: [
      'Obtained from the first-place reward in any raids (Tier 2 onward) and event chest'
    ]
  },
  {
    id: 'neo-wanderer-shards',
    name: 'Neo-wanderer set shards',
    type: 'shard',
    description: 'These magic items can be exchanged for an item from the Neo-wanderer set.',
    price: null,
    otherWays: [
      'Obtained from the first-place reward in any raids on tier 4 onward'
    ]
  },
  // Tickets
  {
    id: 'mystical-coupons',
    name: 'Mystical Coupons',
    type: 'ticket',
    description: 'These coupons allow you to get your prize from the Mystery Box!',
    price: null,
    otherWays: ['Obtained from event chest']
  }
];

export const getItemsByType = (type: Item['type']) => {
  return items.filter(item => item.type === type);
};

export const getItemById = (id: string) => {
  return items.find(item => item.id === id);
};