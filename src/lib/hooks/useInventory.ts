import { useState, useEffect, useCallback } from 'react';
import { inventoryApi } from '../api/inventoryApi';
import type { InventoryItem } from '../api/inventoryApi';

const CURRENT_USERNAME = 'You';

interface UseInventoryReturn {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
  getItemQuantity: (itemId: string) => number;
  addItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string, quantity: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useInventory = (): UseInventoryReturn => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await inventoryApi.getInventory(CURRENT_USERNAME);

      if (response.data) {
        setInventory(response.data);
      } else if (response.error) {
        setError(response.error);
      }
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  const getItemQuantity = useCallback((itemId: string): number => {
    const item = inventory.find(i => i.item_id === itemId);
    return item?.quantity || 0;
  }, [inventory]);

  const addItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      const response = await inventoryApi.addItem(CURRENT_USERNAME, itemId, quantity);
      
      if (response.data) {
        // Update local state
        setInventory(prev => {
          const existing = prev.find(i => i.item_id === itemId);
          if (existing) {
            return prev.map(i => 
              i.item_id === itemId 
                ? { ...i, quantity: i.quantity + quantity }
                : i
            );
          } else {
            return [...prev, response.data!];
          }
        });
      }
    } catch (err) {
      console.error('Error adding item:', err);
      throw err;
    }
  }, []);

  const removeItem = useCallback(async (itemId: string, quantity: number) => {
    try {
      const response = await inventoryApi.removeItem(CURRENT_USERNAME, itemId, quantity);
      
      if (response.data) {
        // Update local state
        setInventory(prev => {
          const newQuantity = response.data!.quantity;
          if (newQuantity === 0) {
            return prev.filter(i => i.item_id !== itemId);
          } else {
            return prev.map(i =>
              i.item_id === itemId
                ? { ...i, quantity: newQuantity }
                : i
            );
          }
        });
      }
    } catch (err) {
      console.error('Error removing item:', err);
      throw err;
    }
  }, []);

  return {
    inventory,
    loading,
    error,
    getItemQuantity,
    addItem,
    removeItem,
    refresh: loadInventory,
  };
};

// Helper hook to get specific item
export const useInventoryItem = (itemId: string) => {
  const { inventory, loading, error } = useInventory();
  const item = inventory.find(i => i.item_id === itemId);
  
  return {
    quantity: item?.quantity || 0,
    loading,
    error,
  };
};
