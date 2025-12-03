const fs = require('fs');
const path = require('path');
const { db } = require('../database/db');

// Read schema file
const schemaPath = path.join(__dirname, '../database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split by semicolon and execute each statement
const statements = schema.split(';').filter(stmt => stmt.trim());

console.log('🔧 Initializing database...');

// Execute all schema statements
const executeStatements = async () => {
  for (const statement of statements) {
    if (statement.trim()) {
      try {
        await new Promise((resolve, reject) => {
          db.run(statement, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } catch (error) {
        console.error('Error executing statement:', error.message);
      }
    }
  }
};

executeStatements()
  .then(() => {
    console.log('✅ Database initialized successfully');
    
    // Insert mock data
    return insertMockData();
  })
  .then(() => {
    console.log('✅ Mock data inserted successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  });

async function insertMockData() {
  const { v4: uuidv4 } = require('uuid');
  
  // Create main player
  const mainPlayerId = uuidv4();
  await new Promise((resolve, reject) => {
    db.run(`
      INSERT OR IGNORE INTO players (id, username, rating, best_rating, level)
      VALUES (?, ?, ?, ?, ?)
    `, [mainPlayerId, 'You', 1250, 1250, 1], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Create mock clans
  const clans = [
    { id: uuidv4(), name: 'Shadow Warriors', tag: 'SHA', total_rating: 25000, member_count: 50, total_victories: 1500, win_rate: 78.5 },
    { id: uuidv4(), name: 'Dragon Legion', tag: 'DRG', total_rating: 23500, member_count: 48, total_victories: 1400, win_rate: 75.2 },
    { id: uuidv4(), name: 'Steel Titans', tag: 'STL', total_rating: 22000, member_count: 45, total_victories: 1300, win_rate: 72.8 }
  ];

  for (const clan of clans) {
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO clans (id, name, tag, total_rating, member_count, total_victories, win_rate)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [clan.id, clan.name, clan.tag, clan.total_rating, clan.member_count, clan.total_victories, clan.win_rate], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Create mock players
  const mockPlayerNames = [
    'ShadowMaster99', 'DragonSlayer', 'IronFist_Pro', 'NinjaWarrior', 'DarkKnight88',
    'StormBreaker', 'PhoenixRider', 'SilentBlade', 'ThunderStrike', 'CrimsonFury'
  ];

  for (let i = 0; i < mockPlayerNames.length; i++) {
    const playerId = uuidv4();
    const rating = 3500 - (i * 150);
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO players (id, username, rating, best_rating, level, total_raids, total_victories, clan_id, season_banner)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        playerId, 
        mockPlayerNames[i], 
        rating, 
        rating + 200, 
        Math.floor(rating / 400) + 1,
        Math.floor(Math.random() * 500) + 100,
        Math.floor(Math.random() * 400) + 50,
        clans[i % clans.length].id,
        i < 10 ? 'gold' : 'silver'
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Add starter inventory for main player
  const starterItems = [
    { item_id: 'steel-keys', quantity: 10 },
    { item_id: 'verified-gems', quantity: 500 },
    { item_id: 'unverified-gems', quantity: 1000 },
    { item_id: 'shadow-coins', quantity: 5000 }
  ];

  for (const item of starterItems) {
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT OR IGNORE INTO inventory (player_id, item_id, quantity)
        VALUES (?, ?, ?)
      `, [mainPlayerId, item.item_id, item.quantity], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Add starter equipment
  await new Promise((resolve, reject) => {
    db.run(`
      INSERT OR IGNORE INTO equipment (id, player_id, equipment_id, equipment_type, level, is_equipped)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uuidv4(), mainPlayerId, 'knives', 'weapon', 1, 1], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  console.log('📦 Mock data created');
}
