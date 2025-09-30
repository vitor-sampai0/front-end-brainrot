import { brainrotStorage } from '../hooks/useLocalStorage';

// Dados de exemplo
const sampleBrainrots = [
  {
    name: "Alpha Grindset",
    cost: 1000,
    income: 150,
    favorite: false,
    concluida: false,
    img_1: "/api/placeholder/300/200",
    rarity_1: "Comum",
    description: "O início da jornada sigma"
  },
  {
    name: "Beta Mindset",
    cost: 2500,
    income: 300,
    favorite: false,
    concluida: false,
    img_1: "/api/placeholder/300/200",
    rarity_1: "Incomum",
    description: "Evitando a mentalidade beta"
  },
  {
    name: "Sigma Male",
    cost: 5000,
    income: 750,
    favorite: true,
    concluida: false,
    img_1: "/api/placeholder/300/200",
    rarity_1: "Raro",
    description: "O verdadeiro sigma male"
  }
];

// Função para inicializar dados de exemplo
export const initializeSampleData = () => {
  try {
    // Verificar se já existem dados
    const existingData = brainrotStorage.getAll();
    
    if (existingData.length === 0) {
      console.log('Inicializando dados de exemplo...');
      
      // Adicionar cada brainrot de exemplo
      sampleBrainrots.forEach(brainrot => {
        brainrotStorage.create(brainrot);
      });
      
      console.log('Dados de exemplo inicializados com sucesso!');
      return true;
    } else {
      console.log('Dados já existem no localStorage');
      return false;
    }
  } catch (error) {
    console.error('Erro ao inicializar dados de exemplo:', error);
    return false;
  }
};

// Função para limpar todos os dados
export const clearAllData = () => {
  try {
    brainrotStorage.clear();
    localStorage.removeItem('favorites');
    console.log('Todos os dados foram limpos');
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    return false;
  }
};

// Função para exportar dados
export const exportData = () => {
  try {
    const brainrots = brainrotStorage.getAll();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    const exportData = {
      brainrots,
      favorites,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brainrots-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return false;
  }
};

// Função para importar dados
export const importData = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);
          
          if (importedData.brainrots && Array.isArray(importedData.brainrots)) {
            // Limpar dados existentes
            clearAllData();
            
            // Importar brainrots
            importedData.brainrots.forEach(brainrot => {
              brainrotStorage.create(brainrot);
            });
            
            // Importar favoritos
            if (importedData.favorites && Array.isArray(importedData.favorites)) {
              localStorage.setItem('favorites', JSON.stringify(importedData.favorites));
            }
            
            resolve(true);
          } else {
            reject(new Error('Formato de arquivo inválido'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
};