const express = require('express');
const router = express.Router();
const { dbAll, dbGet } = require('../database/db');

// Get top 100 players leaderboard
router.get('/players', async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const players = await dbAll(`
      SELECT 
        p.*,
        c.name as clan_name,
        c.tag as clan_tag,
        CASE 
          WHEN ROW_NUMBER() OVER (ORDER BY p.rating DESC) <= 10 THEN 'gold'
          WHEN ROW_NUMBER() OVER (ORDER BY p.rating DESC) <= 100 THEN 'silver'
          ELSE NULL
        END as season_banner
      FROM players p
      LEFT JOIN clans c ON p.clan_id = c.id
      ORDER BY p.rating DESC
      LIMIT ?
    `, [parseInt(limit)]);

    // Calculate additional stats for each player
    const playersWithStats = players.map((player, index) => ({
      ...player,
      rank: index + 1,
      win_rate: player.total_raids > 0 
        ? ((player.total_victories / player.total_raids) * 100).toFixed(1)
        : 0,
      avg_damage_per_round: player.total_rounds > 0
        ? Math.floor((player.total_damage / player.total_rounds) * 10)
        : 0
    }));

    res.json(playersWithStats);
  } catch (error) {
    console.error('Error fetching players leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top 100 clans leaderboard
router.get('/clans', async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const clans = await dbAll(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM players WHERE clan_id = c.id) as member_count,
        (SELECT SUM(rating) FROM players WHERE clan_id = c.id) as total_rating,
        (SELECT SUM(total_victories) FROM players WHERE clan_id = c.id) as total_victories,
        (SELECT AVG(
          CASE 
            WHEN total_raids > 0 THEN (total_victories * 100.0 / total_raids)
            ELSE 0 
          END
        ) FROM players WHERE clan_id = c.id) as win_rate
      FROM clans c
      ORDER BY total_rating DESC
      LIMIT ?
    `, [parseInt(limit)]);

    const clansWithRank = clans.map((clan, index) => ({
      ...clan,
      rank: index + 1,
      win_rate: parseFloat(clan.win_rate || 0).toFixed(1)
    }));

    res.json(clansWithRank);
  } catch (error) {
    console.error('Error fetching clans leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get player rank
router.get('/players/:username/rank', async (req, res) => {
  try {
    const { username } = req.params;

    const result = await dbGet(`
      SELECT 
        (SELECT COUNT(*) + 1 FROM players WHERE rating > p.rating) as rank,
        p.rating
      FROM players p
      WHERE p.username = ?
    `, [username]);

    if (!result) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching player rank:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get top 20 for rewards display
router.get('/top20', async (req, res) => {
  try {
    const players = await dbAll(`
      SELECT 
        p.username,
        p.rating,
        p.level,
        c.tag as clan_tag,
        CASE 
          WHEN ROW_NUMBER() OVER (ORDER BY p.rating DESC) <= 10 THEN 'gold'
          ELSE 'silver'
        END as season_banner
      FROM players p
      LEFT JOIN clans c ON p.clan_id = c.id
      ORDER BY p.rating DESC
      LIMIT 20
    `);

    res.json(players);
  } catch (error) {
    console.error('Error fetching top 20:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
