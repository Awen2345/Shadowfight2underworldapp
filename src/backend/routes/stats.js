const express = require('express');
const router = express.Router();
const { dbGet, dbAll } = require('../database/db');

// Get player statistics
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const player = await dbGet('SELECT * FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Calculate derived stats
    const winRate = player.total_raids > 0 
      ? ((player.total_victories / player.total_raids) * 100).toFixed(1)
      : 0;

    const avgDamagePerRound = player.total_rounds > 0
      ? Math.floor((player.total_damage / player.total_rounds) * 10)
      : 0;

    // Get raids today
    const today = new Date().toISOString().split('T')[0];
    const dailyRaid = await dbGet(
      'SELECT raid_count FROM daily_raids WHERE player_id = ? AND raid_date = ?',
      [player.id, today]
    );

    res.json({
      rating: player.rating,
      best_rating: player.best_rating,
      level: player.level,
      total_raids: player.total_raids,
      total_victories: player.total_victories,
      total_defeats: player.total_defeats,
      total_damage: player.total_damage,
      total_rounds: player.total_rounds,
      first_place_finishes: player.first_place_finishes,
      win_rate: parseFloat(winRate),
      avg_damage_per_round: avgDamagePerRound,
      raids_today: dailyRaid ? dailyRaid.raid_count : 0
    });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get global statistics
router.get('/global/summary', async (req, res) => {
  try {
    const totalPlayers = await dbGet('SELECT COUNT(*) as count FROM players');
    const totalClans = await dbGet('SELECT COUNT(*) as count FROM clans');
    const totalRaids = await dbGet('SELECT COUNT(*) as count FROM raids');
    
    const topPlayer = await dbGet(`
      SELECT username, rating 
      FROM players 
      ORDER BY rating DESC 
      LIMIT 1
    `);

    const topClan = await dbGet(`
      SELECT c.name, c.tag, SUM(p.rating) as total_rating
      FROM clans c
      LEFT JOIN players p ON p.clan_id = c.id
      GROUP BY c.id
      ORDER BY total_rating DESC
      LIMIT 1
    `);

    // Today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayRaids = await dbGet(
      'SELECT COUNT(*) as count FROM raids WHERE DATE(raid_date) = ?',
      [today]
    );

    res.json({
      total_players: totalPlayers.count,
      total_clans: totalClans.count,
      total_raids: totalRaids.count,
      top_player: topPlayer,
      top_clan: topClan,
      raids_today: todayRaids.count
    });
  } catch (error) {
    console.error('Error fetching global stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
