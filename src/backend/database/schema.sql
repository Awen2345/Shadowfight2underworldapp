-- Players Table
CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    rating INTEGER DEFAULT 1250,
    best_rating INTEGER DEFAULT 1250,
    level INTEGER DEFAULT 1,
    total_raids INTEGER DEFAULT 0,
    total_victories INTEGER DEFAULT 0,
    total_defeats INTEGER DEFAULT 0,
    total_damage INTEGER DEFAULT 0,
    total_rounds INTEGER DEFAULT 0,
    first_place_finishes INTEGER DEFAULT 0,
    clan_id TEXT,
    season_banner TEXT,
    last_presence TEXT DEFAULT 'Online',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clan_id) REFERENCES clans(id) ON DELETE SET NULL
);

-- Clans Table
CREATE TABLE IF NOT EXISTS clans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    tag TEXT NOT NULL UNIQUE,
    total_rating INTEGER DEFAULT 0,
    member_count INTEGER DEFAULT 0,
    total_victories INTEGER DEFAULT 0,
    win_rate REAL DEFAULT 0,
    leader_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_id) REFERENCES players(id) ON DELETE SET NULL
);

-- Raids History Table
CREATE TABLE IF NOT EXISTS raids (
    id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL,
    boss_id TEXT NOT NULL,
    boss_tier INTEGER NOT NULL,
    victory INTEGER DEFAULT 0,
    damage_dealt INTEGER DEFAULT 0,
    rounds INTEGER DEFAULT 0,
    rating_gained INTEGER DEFAULT 0,
    placement INTEGER DEFAULT 1,
    raid_date DATE DEFAULT CURRENT_DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
    id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL,
    equipment_id TEXT NOT NULL,
    equipment_type TEXT NOT NULL,
    level INTEGER DEFAULT 1,
    is_upgrading INTEGER DEFAULT 0,
    upgrade_end_time INTEGER,
    is_equipped INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE(player_id, equipment_id)
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    item_id TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE(player_id, item_id)
);

-- Player Medals Table
CREATE TABLE IF NOT EXISTS medals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    season INTEGER NOT NULL,
    rank INTEGER NOT NULL,
    medal_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE(player_id, season)
);

-- Enchantments Table
CREATE TABLE IF NOT EXISTS enchantments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    equipment_id TEXT NOT NULL,
    enchantment_id TEXT NOT NULL,
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

-- Daily Raids Tracker
CREATE TABLE IF NOT EXISTS daily_raids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id TEXT NOT NULL,
    raid_date DATE NOT NULL,
    raid_count INTEGER DEFAULT 0,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    UNIQUE(player_id, raid_date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_rating ON players(rating DESC);
CREATE INDEX IF NOT EXISTS idx_players_clan ON players(clan_id);
CREATE INDEX IF NOT EXISTS idx_clans_rating ON clans(total_rating DESC);
CREATE INDEX IF NOT EXISTS idx_raids_player ON raids(player_id);
CREATE INDEX IF NOT EXISTS idx_raids_date ON raids(raid_date);
CREATE INDEX IF NOT EXISTS idx_equipment_player ON equipment(player_id);
CREATE INDEX IF NOT EXISTS idx_inventory_player ON inventory(player_id);
CREATE INDEX IF NOT EXISTS idx_daily_raids ON daily_raids(player_id, raid_date);
