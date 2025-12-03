const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Get all clans
router.get('/', async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const clans = await dbAll(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM players WHERE clan_id = c.id) as member_count,
        (SELECT SUM(rating) FROM players WHERE clan_id = c.id) as total_rating
      FROM clans c
      ORDER BY total_rating DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json(clans);
  } catch (error) {
    console.error('Error fetching clans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get clan by ID or tag
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by tag
    let clan = await dbGet('SELECT * FROM clans WHERE id = ?', [identifier]);
    
    if (!clan) {
      clan = await dbGet('SELECT * FROM clans WHERE tag = ?', [identifier]);
    }

    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    // Get clan members
    const members = await dbAll(
      'SELECT id, username, rating, level, total_raids, total_victories FROM players WHERE clan_id = ? ORDER BY rating DESC',
      [clan.id]
    );

    clan.members = members;
    clan.member_count = members.length;

    res.json(clan);
  } catch (error) {
    console.error('Error fetching clan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create clan
router.post('/', async (req, res) => {
  try {
    const { name, tag, leader_username } = req.body;

    if (!name || !tag) {
      return res.status(400).json({ error: 'name and tag are required' });
    }

    // Check if clan name or tag already exists
    const existingName = await dbGet('SELECT id FROM clans WHERE name = ?', [name]);
    if (existingName) {
      return res.status(400).json({ error: 'Clan name already exists' });
    }

    const existingTag = await dbGet('SELECT id FROM clans WHERE tag = ?', [tag]);
    if (existingTag) {
      return res.status(400).json({ error: 'Clan tag already exists' });
    }

    let leaderId = null;
    if (leader_username) {
      const leader = await dbGet('SELECT id FROM players WHERE username = ?', [leader_username]);
      if (leader) {
        leaderId = leader.id;
      }
    }

    const clanId = uuidv4();
    await dbRun(`
      INSERT INTO clans (id, name, tag, leader_id)
      VALUES (?, ?, ?, ?)
    `, [clanId, name, tag, leaderId]);

    const newClan = await dbGet('SELECT * FROM clans WHERE id = ?', [clanId]);
    res.status(201).json(newClan);
  } catch (error) {
    console.error('Error creating clan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Join clan
router.post('/:clanId/join', async (req, res) => {
  try {
    const { clanId } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'username is required' });
    }

    const clan = await dbGet('SELECT id FROM clans WHERE id = ? OR tag = ?', [clanId, clanId]);
    if (!clan) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    const player = await dbGet('SELECT id, clan_id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    if (player.clan_id) {
      return res.status(400).json({ error: 'Player is already in a clan' });
    }

    await dbRun(
      'UPDATE players SET clan_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [clan.id, player.id]
    );

    const updatedPlayer = await dbGet('SELECT * FROM players WHERE id = ?', [player.id]);
    res.json(updatedPlayer);
  } catch (error) {
    console.error('Error joining clan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Leave clan
router.post('/:clanId/leave', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'username is required' });
    }

    const player = await dbGet('SELECT id, clan_id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    if (!player.clan_id) {
      return res.status(400).json({ error: 'Player is not in a clan' });
    }

    await dbRun(
      'UPDATE players SET clan_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [player.id]
    );

    const updatedPlayer = await dbGet('SELECT * FROM players WHERE id = ?', [player.id]);
    res.json(updatedPlayer);
  } catch (error) {
    console.error('Error leaving clan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
