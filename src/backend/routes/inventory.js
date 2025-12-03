const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../database/db');

// Get player inventory
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const inventory = await dbAll(
      'SELECT * FROM inventory WHERE player_id = ?',
      [player.id]
    );

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific item quantity
router.get('/:username/item/:itemId', async (req, res) => {
  try {
    const { username, itemId } = req.params;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const item = await dbGet(
      'SELECT * FROM inventory WHERE player_id = ? AND item_id = ?',
      [player.id, itemId]
    );

    res.json({
      item_id: itemId,
      quantity: item ? item.quantity : 0
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add or update item in inventory
router.post('/:username/item', async (req, res) => {
  try {
    const { username } = req.params;
    const { item_id, quantity } = req.body;

    if (!item_id || quantity === undefined) {
      return res.status(400).json({ error: 'item_id and quantity are required' });
    }

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Check if item exists
    const existingItem = await dbGet(
      'SELECT * FROM inventory WHERE player_id = ? AND item_id = ?',
      [player.id, item_id]
    );

    if (existingItem) {
      // Update quantity
      const newQuantity = Math.max(0, existingItem.quantity + quantity);
      await dbRun(
        'UPDATE inventory SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE player_id = ? AND item_id = ?',
        [newQuantity, player.id, item_id]
      );
    } else {
      // Insert new item
      await dbRun(
        'INSERT INTO inventory (player_id, item_id, quantity) VALUES (?, ?, ?)',
        [player.id, item_id, Math.max(0, quantity)]
      );
    }

    const updatedItem = await dbGet(
      'SELECT * FROM inventory WHERE player_id = ? AND item_id = ?',
      [player.id, item_id]
    );

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove items from inventory
router.delete('/:username/item/:itemId', async (req, res) => {
  try {
    const { username, itemId } = req.params;
    const { quantity } = req.body;

    const player = await dbGet('SELECT id FROM players WHERE username = ?', [username]);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    const item = await dbGet(
      'SELECT * FROM inventory WHERE player_id = ? AND item_id = ?',
      [player.id, itemId]
    );

    if (!item) {
      return res.status(404).json({ error: 'Item not found in inventory' });
    }

    const newQuantity = Math.max(0, item.quantity - quantity);
    
    if (newQuantity === 0) {
      await dbRun(
        'DELETE FROM inventory WHERE player_id = ? AND item_id = ?',
        [player.id, itemId]
      );
    } else {
      await dbRun(
        'UPDATE inventory SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE player_id = ? AND item_id = ?',
        [newQuantity, player.id, itemId]
      );
    }

    res.json({
      item_id: itemId,
      quantity: newQuantity,
      removed: quantity
    });
  } catch (error) {
    console.error('Error removing from inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
