const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Get player by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const player = await dbGet('SELECT * FROM players WHERE username = ?', [username]);
    
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Get player's clan info
    if (player.clan_id) {
      const clan = await dbGet('SELECT * FROM clans WHERE id = ?', [player.clan_id]);
      player.clan = clan;
    }

    // Get player's medals
    const medals = await dbAll('SELECT * FROM medals WHERE player_id = ? ORDER BY season DESC', [player.id]);
    player.medals = medals;

    // Calculate win rate
    if (player.total_raids > 0) {
      player.win_rate = (player.total_victories / player.total_raids) * 100;
    } else {
      player.win_rate = 0;
    }

    // Calculate average damage
    if (player.total_rounds > 0) {
      player.avg_damage_per_round = (player.total_damage / player.total_rounds) * 10;
    } else {
      player.avg_damage_per_round = 0;
    }

    res.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update player
router.post('/', async (req, res) => {
  try {
    const { username, rating, level, clan_id } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if player exists
    const existingPlayer = await dbGet('SELECT id FROM players WHERE username = ?', [username]);

    if (existingPlayer) {
      // Update existing player
      await dbRun(`
        UPDATE players 
        SET rating = COALESCE(?, rating),
            level = COALESCE(?, level),
            clan_id = COALESCE(?, clan_id),
            updated_at = CURRENT_TIMESTAMP
        WHERE username = ?
      `, [rating, level, clan_id, username]);

      const updatedPlayer = await dbGet('SELECT * FROM players WHERE username = ?', [username]);
      return res.json(updatedPlayer);
    } else {
      // Create new player
      const playerId = uuidv4();
      await dbRun(`
        INSERT INTO players (id, username, rating, level, clan_id)
        VALUES (?, ?, ?, ?, ?)
      `, [playerId, username, rating || 1250, level || 1, clan_id]);

      const newPlayer = await dbGet('SELECT * FROM players WHERE id = ?', [playerId]);
      return res.status(201).json(newPlayer);
    }
  } catch (error) {
    console.error('Error creating/updating player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update player stats
router.patch('/:username/stats', async (req, res) => {
  try {
    const { username } = req.params;
    const { 
      rating, 
      best_rating,
      level,
      total_raids,
      total_victories,
      total_defeats,
      total_damage,
      total_rounds,
      first_place_finishes
    } = req.body;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    await dbRun(`
      UPDATE players 
      SET rating = COALESCE(?, rating),
          best_rating = COALESCE(?, best_rating),
          level = COALESCE(?, level),
          total_raids = COALESCE(?, total_raids),
          total_victories = COALESCE(?, total_victories),
          total_defeats = COALESCE(?, total_defeats),
          total_damage = COALESCE(?, total_damage),
          total_rounds = COALESCE(?, total_rounds),
          first_place_finishes = COALESCE(?, first_place_finishes),
          updated_at = CURRENT_TIMESTAMP
      WHERE username = ?
    `, [
      rating, best_rating, level, total_raids, total_victories, 
      total_defeats, total_damage, total_rounds, first_place_finishes, username
    ]);

    const updatedPlayer = await dbGet('SELECT * FROM players WHERE username = ?', [username]);
    res.json(updatedPlayer);
  } catch (error) {
    console.error('Error updating player stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete player
router.delete('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await dbRun('DELETE FROM players WHERE username = ?', [username]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
