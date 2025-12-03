const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Get player equipment
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const equipment = await dbAll(
      'SELECT * FROM equipment WHERE player_id = ?',
      [player.id]
    );

    res.json(equipment);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get equipped items
router.get('/:username/equipped', async (req, res) => {
  try {
    const { username } = req.params;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const equipped = await dbAll(
      'SELECT * FROM equipment WHERE player_id = ? AND is_equipped = 1',
      [player.id]
    );

    res.json(equipped);
  } catch (error) {
    console.error('Error fetching equipped items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add equipment to player
router.post('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { equipment_id, equipment_type, level = 1 } = req.body;

    if (!equipment_id || !equipment_type) {
      return res.status(400).json({ error: 'equipment_id and equipment_type are required' });
    }

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check if equipment already exists
    const existing = await dbGet(
      'SELECT * FROM equipment WHERE player_id = ? AND equipment_id = ?',
      [player.id, equipment_id]
    );

    if (existing) {
      return res.status(400).json({ error: 'Equipment already owned' });
    }

    const id = uuidv4();
    await dbRun(`
      INSERT INTO equipment (id, player_id, equipment_id, equipment_type, level)
      VALUES (?, ?, ?, ?, ?)
    `, [id, player.id, equipment_id, equipment_type, level]);

    const newEquipment = await dbGet('SELECT * FROM equipment WHERE id = ?', [id]);
    res.status(201).json(newEquipment);
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Equip/Unequip item
router.patch('/:username/:equipmentId/equip', async (req, res) => {
  try {
    const { username, equipmentId } = req.params;
    const { is_equipped } = req.body;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const equipment = await dbGet(
      'SELECT * FROM equipment WHERE player_id = ? AND equipment_id = ?',
      [player.id, equipmentId]
    );

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    // If equipping, unequip other items of same type
    if (is_equipped) {
      await dbRun(
        'UPDATE equipment SET is_equipped = 0 WHERE player_id = ? AND equipment_type = ? AND equipment_id != ?',
        [player.id, equipment.equipment_type, equipmentId]
      );
    }

    // Update this equipment
    await dbRun(
      'UPDATE equipment SET is_equipped = ?, updated_at = CURRENT_TIMESTAMP WHERE player_id = ? AND equipment_id = ?',
      [is_equipped ? 1 : 0, player.id, equipmentId]
    );

    const updated = await dbGet(
      'SELECT * FROM equipment WHERE player_id = ? AND equipment_id = ?',
      [player.id, equipmentId]
    );

    res.json(updated);
  } catch (error) {
    console.error('Error equipping item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upgrade equipment
router.patch('/:username/:equipmentId/upgrade', async (req, res) => {
  try {
    const { username, equipmentId } = req.params;
    const { duration_seconds } = req.body;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const equipment = await dbGet(
      'SELECT * FROM equipment WHERE player_id = ? AND equipment_id = ?',
      [player.id, equipmentId]
    );

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    if (equipment.is_upgrading) {
      return res.status(400).json({ error: 'Equipment is already upgrading' });
    }

    const upgradeEndTime = Date.now() + (duration_seconds * 1000);

    await dbRun(`
      UPDATE equipment 
      SET is_upgrading = 1,
          upgrade_end_time = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE player_id = ? AND equipment_id = ?
    `, [upgradeEndTime, player.id, equipmentId]);

    const updated = await dbGet(
      'SELECT * FROM equipment WHERE player_id = ? AND equipment_id = ?',
      [player.id, equipmentId]
    );

    res.json(updated);
  } catch (error) {
    console.error('Error upgrading equipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Complete upgrade
router.patch('/:username/:equipmentId/complete-upgrade', async (req, res) => {
  try {
    const { username, equipmentId } = req.params;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const equipment = await dbGet(
      'SELECT * FROM equipment WHERE player_id = ? AND equipment_id = ?',
      [player.id, equipmentId]
    );

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    await dbRun(`
      UPDATE equipment 
      SET level = level + 1,
          is_upgrading = 0,
          upgrade_end_time = NULL,
          updated_at = CURRENT_TIMESTAMP
      WHERE player_id = ? AND equipment_id = ?
    `, [player.id, equipmentId]);

    const updated = await dbGet(
      'SELECT * FROM equipment WHERE player_id = ? AND equipment_id = ?',
      [player.id, equipmentId]
    );

    res.json(updated);
  } catch (error) {
    console.error('Error completing upgrade:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
