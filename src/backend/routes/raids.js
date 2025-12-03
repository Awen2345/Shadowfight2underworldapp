const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Record a raid result
router.post('/', async (req, res) => {
  try {
    const {
      player_username,
      boss_id,
      boss_tier,
      victory,
      damage_dealt,
      rounds,
      rating_gained,
      placement
    } = req.body;

    // Get player
    const player = await dbGet('SELECT * FROM players WHERE username = ?', [player_username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Insert raid record
    const raidId = uuidv4();
    await dbRun(`
      INSERT INTO raids (id, player_id, boss_id, boss_tier, victory, damage_dealt, rounds, rating_gained, placement)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [raidId, player.id, boss_id, boss_tier, victory ? 1 : 0, damage_dealt, rounds, rating_gained, placement]);

    // Update player stats
    const newTotalRaids = player.total_raids + 1;
    const newTotalVictories = player.total_victories + (victory ? 1 : 0);
    const newTotalDefeats = player.total_defeats + (victory ? 0 : 1);
    const newTotalDamage = player.total_damage + damage_dealt;
    const newTotalRounds = player.total_rounds + rounds;
    const newFirstPlaces = player.first_place_finishes + (placement === 1 ? 1 : 0);

    let newRating = player.rating;
    if (victory) {
      newRating = player.rating + rating_gained;
    } else {
      const ratingLoss = Math.floor(rating_gained * 0.3);
      newRating = Math.max(0, player.rating - ratingLoss);
    }

    const newBestRating = Math.max(player.best_rating, newRating);
    const newLevel = Math.min(10, Math.floor(newRating / 310) + 1);

    await dbRun(`
      UPDATE players 
      SET rating = ?,
          best_rating = ?,
          level = ?,
          total_raids = ?,
          total_victories = ?,
          total_defeats = ?,
          total_damage = ?,
          total_rounds = ?,
          first_place_finishes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      newRating, newBestRating, newLevel, newTotalRaids, newTotalVictories,
      newTotalDefeats, newTotalDamage, newTotalRounds, newFirstPlaces, player.id
    ]);

    // Update or insert daily raids count
    const today = new Date().toISOString().split('T')[0];
    const dailyRaid = await dbGet(
      'SELECT * FROM daily_raids WHERE player_id = ? AND raid_date = ?',
      [player.id, today]
    );

    if (dailyRaid) {
      await dbRun(
        'UPDATE daily_raids SET raid_count = raid_count + 1 WHERE id = ?',
        [dailyRaid.id]
      );
    } else {
      await dbRun(
        'INSERT INTO daily_raids (player_id, raid_date, raid_count) VALUES (?, ?, 1)',
        [player.id, today]
      );
    }

    // Get updated player data
    const updatedPlayer = await dbGet('SELECT * FROM players WHERE id = ?', [player.id]);

    res.status(201).json({
      raid_id: raidId,
      player: updatedPlayer,
      message: 'Raid recorded successfully'
    });
  } catch (error) {
    console.error('Error recording raid:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player raid history
router.get('/player/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { limit = 50 } = req.query;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const raids = await dbAll(`
      SELECT * FROM raids 
      WHERE player_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `, [player.id, parseInt(limit)]);

    res.json(raids);
  } catch (error) {
    console.error('Error fetching raid history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get raids today for player
router.get('/player/:username/today', async (req, res) => {
  try {
    const { username } = req.params;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const dailyRaid = await dbGet(
      'SELECT raid_count FROM daily_raids WHERE player_id = ? AND raid_date = ?',
      [player.id, today]
    );

    res.json({ 
      raids_today: dailyRaid ? dailyRaid.raid_count : 0,
      date: today
    });
  } catch (error) {
    console.error('Error fetching daily raids:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get raid statistics
router.get('/stats/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Get tier statistics
    const tierStats = await dbAll(`
      SELECT 
        boss_tier,
        COUNT(*) as total_raids,
        SUM(CASE WHEN victory = 1 THEN 1 ELSE 0 END) as victories,
        AVG(damage_dealt) as avg_damage,
        SUM(damage_dealt) as total_damage
      FROM raids
      WHERE player_id = ?
      GROUP BY boss_tier
      ORDER BY boss_tier
    `, [player.id]);

    // Get recent performance (last 10 raids)
    const recentRaids = await dbAll(`
      SELECT victory, damage_dealt, rating_gained, created_at
      FROM raids
      WHERE player_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `, [player.id]);

    res.json({
      tier_stats: tierStats,
      recent_raids: recentRaids
    });
  } catch (error) {
    console.error('Error fetching raid stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
