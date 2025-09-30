import { useState, useEffect } from 'react';

// Hook personalizado para gerenciar dados no localStorage
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Erro ao carregar ${key} do localStorage:`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar ${key} no localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}

// Funções utilitárias para gerenciar brainrots no localStorage
export const brainrotStorage = {
  // Gerar ID único
  generateId: () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  },

  // Buscar todos os brainrots
  getAll: () => {
    try {
      const data = localStorage.getItem('brainrots');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar brainrots:', error);
      return [];
    }
  },

  // Buscar brainrot por ID
  getById: (id) => {
    try {
      const brainrots = brainrotStorage.getAll();
      return brainrots.find(item => item.id === id) || null;
    } catch (error) {
      console.error('Erro ao buscar brainrot por ID:', error);
      return null;
    }
  },

  // Salvar todos os brainrots
  saveAll: (brainrots) => {
    try {
      localStorage.setItem('brainrots', JSON.stringify(brainrots));
      return true;
    } catch (error) {
      console.error('Erro ao salvar brainrots:', error);
      return false;
    }
  },

  // Criar novo brainrot
  create: (brainrotData) => {
    try {
      const brainrots = brainrotStorage.getAll();
      const newBrainrot = {
        ...brainrotData,
        id: brainrotStorage.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      brainrots.push(newBrainrot);
      brainrotStorage.saveAll(brainrots);
      return newBrainrot;
    } catch (error) {
      console.error('Erro ao criar brainrot:', error);
      return null;
    }
  },

  // Atualizar brainrot existente
  update: (id, updateData) => {
    try {
      const brainrots = brainrotStorage.getAll();
      const index = brainrots.findIndex(item => item.id === id);
      
      if (index === -1) {
        return null;
      }

      const updatedBrainrot = {
        ...brainrots[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      brainrots[index] = updatedBrainrot;
      brainrotStorage.saveAll(brainrots);
      return updatedBrainrot;
    } catch (error) {
      console.error('Erro ao atualizar brainrot:', error);
      return null;
    }
  },

  // Excluir brainrot
  delete: (id) => {
    try {
      const brainrots = brainrotStorage.getAll();
      const initialLength = brainrots.length;
      const filteredBrainrots = brainrots.filter(item => item.id !== id);
      
      const saveSuccess = brainrotStorage.saveAll(filteredBrainrots);
      return saveSuccess && (initialLength > filteredBrainrots.length);
    } catch (error) {
      console.error('Erro ao excluir brainrot:', error);
      return false;
    }
  },

  // Limpar todos os dados
  clear: () => {
    try {
      localStorage.removeItem('brainrots');
      return true;
    } catch (error) {
      console.error('Erro ao limpar brainrots:', error);
      return false;
    }
  }
};

// Funções para gerenciar favoritos
export const favoritesStorage = {
  // Buscar favoritos
  getAll: () => {
    try {
      const data = localStorage.getItem('favorites');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return [];
    }
  },

  // Salvar favoritos
  saveAll: (favorites) => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
      return true;
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
      return false;
    }
  },

  // Adicionar aos favoritos
  add: (brainrot) => {
    try {
      const favorites = favoritesStorage.getAll();
      const exists = favorites.some(fav => fav.id === brainrot.id);
      
      if (!exists) {
        favorites.push(brainrot);
        favoritesStorage.saveAll(favorites);
      }
      return true;
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      return false;
    }
  },

  // Remover dos favoritos
  remove: (id) => {
    try {
      const favorites = favoritesStorage.getAll();
      const filteredFavorites = favorites.filter(fav => fav.id !== id);
      favoritesStorage.saveAll(filteredFavorites);
      return true;
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      return false;
    }
  },

  // Verificar se está nos favoritos
  isFavorite: (id) => {
    try {
      const favorites = favoritesStorage.getAll();
      return favorites.some(fav => fav.id === id);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  }
};