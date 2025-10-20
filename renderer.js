const { ipcRenderer } = require('electron');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

// Estado da aplicação
let state = {
  selectedFolder: null,
  xmlFiles: [],
  results: [],
  currentFilter: 'all',
  apiUrl: localStorage.getItem('apiUrl') || 'http://localhost:3000/api/validar'
};

// Elementos do DOM
const elements = {
  selectFolderBtn: document.getElementById('selectFolderBtn'),
  processBtn: document.getElementById('processBtn'),
  folderPath: document.getElementById('folderPath'),
  
  selectionCard: document.getElementById('selectionCard'),
  loadingCard: document.getElementById('loadingCard'),
  resultsCard: document.getElementById('resultsCard'),
  
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  
  totalCount: document.getElementById('totalCount'),
  successCount: document.getElementById('successCount'),
  errorCount: document.getElementById('errorCount'),
  
  nfeList: document.getElementById('nfeList'),
  
  filterAll: document.getElementById('filterAll'),
  filterSuccess: document.getElementById('filterSuccess'),
  filterError: document.getElementById('filterError'),
  
  newValidationBtn: document.getElementById('newValidationBtn'),
  configBtn: document.getElementById('configBtn'),
  
  configModal: document.getElementById('configModal'),
  apiUrlInput: document.getElementById('apiUrlInput'),
  saveConfigBtn: document.getElementById('saveConfigBtn'),
  cancelConfigBtn: document.getElementById('cancelConfigBtn'),
  closeConfigBtn: document.getElementById('closeConfigBtn')
};

// Event Listeners
elements.selectFolderBtn.addEventListener('click', selectFolder);
elements.processBtn.addEventListener('click', processXMLs);
elements.newValidationBtn.addEventListener('click', resetApp);

elements.filterAll.addEventListener('click', () => filterResults('all'));
elements.filterSuccess.addEventListener('click', () => filterResults('success'));
elements.filterError.addEventListener('click', () => filterResults('error'));

// Modal de configurações
elements.configBtn.addEventListener('click', openConfigModal);
elements.closeConfigBtn.addEventListener('click', closeConfigModal);
elements.cancelConfigBtn.addEventListener('click', closeConfigModal);
elements.saveConfigBtn.addEventListener('click', saveConfig);

// Fechar modal ao clicar fora
elements.configModal.addEventListener('click', (e) => {
  if (e.target === elements.configModal) {
    closeConfigModal();
  }
});

// Funções de Configuração
function openConfigModal() {
  elements.apiUrlInput.value = state.apiUrl;
  elements.configModal.classList.remove('hidden');
}

function closeConfigModal() {
  elements.configModal.classList.add('hidden');
}

function saveConfig() {
  const newApiUrl = elements.apiUrlInput.value.trim();
  
  if (!newApiUrl) {
    alert('Por favor, informe a URL da API.');
    return;
  }
  
  state.apiUrl = newApiUrl;
  localStorage.setItem('apiUrl', newApiUrl);
  
  closeConfigModal();
  
  // Feedback visual
  const originalText = elements.configBtn.innerHTML;
  elements.configBtn.innerHTML = '<span>✓</span> Salvo!';
  elements.configBtn.classList.remove('btn-ghost');
  elements.configBtn.classList.add('btn-success');
  
  setTimeout(() => {
    elements.configBtn.innerHTML = originalText;
    elements.configBtn.classList.remove('btn-success');
    elements.configBtn.classList.add('btn-ghost');
  }, 2000);
}

// Funções principais
async function selectFolder() {
  const folderPath = await ipcRenderer.invoke('select-folder');
  
  if (folderPath) {
    state.selectedFolder = folderPath;
    elements.folderPath.textContent = folderPath;
    elements.folderPath.classList.add('selected');
    elements.processBtn.disabled = false;
  }
}

async function processXMLs() {
  if (!state.selectedFolder) {
    alert('Por favor, selecione uma pasta primeiro.');
    return;
  }

  if (!state.apiUrl) {
    alert('Por favor, configure a URL da API nas configurações.');
    return;
  }

  // Mostrar loading
  showCard('loading');
  
  try {
    // Ler arquivos XML da pasta
    const result = await ipcRenderer.invoke('read-xml-files', state.selectedFolder);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    state.xmlFiles = result.files;
    
    if (state.xmlFiles.length === 0) {
      alert('Nenhum arquivo XML encontrado na pasta selecionada.');
      showCard('selection');
      return;
    }
    
    // Processar cada XML
    state.results = [];
    let processed = 0;
    
    for (const xmlFile of state.xmlFiles) {
      try {
        // Enviar para API
        const response = await axios.post(state.apiUrl, {
          fileName: xmlFile.fileName,
          xmlContent: xmlFile.content
        }, {
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        state.results.push({
          fileName: xmlFile.fileName,
          status: response.data.status || 'success',
          data: response.data,
          errors: response.data.errors || [],
          itemCount: response.data.itemCount || null,
          dbItemCount: response.data.dbItemCount || null
        });
        
      } catch (error) {
        // Em caso de erro na API, marcar como erro
        state.results.push({
          fileName: xmlFile.fileName,
          status: 'error',
          data: null,
          errors: [{
            item: 'Sistema',
            message: error.response?.data?.message || error.message || 'Erro ao processar XML'
          }],
          itemCount: null,
          dbItemCount: null
        });
      }
      
      processed++;
      updateProgress(processed, state.xmlFiles.length);
    }
    
    // Mostrar resultados
    displayResults();
    
  } catch (error) {
    alert(`Erro ao processar XMLs: ${error.message}`);
    showCard('selection');
  }
}

function updateProgress(current, total) {
  const percentage = (current / total) * 100;
  elements.progressBar.style.width = `${percentage}%`;
  elements.progressText.textContent = `${current} de ${total} arquivos processados`;
}

function displayResults() {
  // Calcular estatísticas
  const total = state.results.length;
  const success = state.results.filter(r => r.status === 'success').length;
  const errors = state.results.filter(r => r.status === 'error').length;
  
  elements.totalCount.textContent = total;
  elements.successCount.textContent = success;
  elements.errorCount.textContent = errors;
  
  // Renderizar lista
  renderNfeList();
  
  // Mostrar botão "Nova Consulta" no header
  elements.newValidationBtn.classList.remove('hidden');
  
  // Mostrar card de resultados
  showCard('results');
}

function renderNfeList() {
  const filteredResults = filterResultsByStatus(state.results, state.currentFilter);
  
  elements.nfeList.innerHTML = '';
  
  if (filteredResults.length === 0) {
    elements.nfeList.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--neutral-medium);">
        <p style="font-size: 16px; font-weight: 600;">Nenhum resultado encontrado</p>
        <p style="font-size: 13px; margin-top: 8px;">Tente alterar os filtros</p>
      </div>
    `;
    return;
  }
  
  filteredResults.forEach(result => {
    const nfeItem = createNfeItem(result);
    elements.nfeList.appendChild(nfeItem);
  });
}

function createNfeItem(result) {
  const div = document.createElement('div');
  div.className = `nfe-item ${result.status}`;
  
  const statusIcon = result.status === 'success' ? '✓' : '✗';
  const statusText = result.status === 'success' ? 'Válida' : 'Com Erros';
  const statusClass = result.status === 'success' ? 'success' : 'error';
  
  // Extrair informações do XML ou da resposta da API
  const nfeNumber = result.data?.nfeNumber || extractNfeNumber(result.fileName);
  const supplier = result.data?.supplier || 'N/A';
  const value = result.data?.value || 'N/A';
  const date = result.data?.date || 'N/A';
  
  let html = `
    <div class="nfe-header">
      <div class="nfe-number">NFe: ${nfeNumber}</div>
      <div class="nfe-status ${statusClass}">
        <span class="nfe-status-icon">${statusIcon}</span>
        ${statusText}
      </div>
    </div>
    
    <div class="nfe-info">
      <div class="nfe-info-item">
        <span class="nfe-info-label">Arquivo:</span>
        ${result.fileName}
      </div>
      <div class="nfe-info-item">
        <span class="nfe-info-label">Fornecedor:</span>
        ${supplier}
      </div>
      <div class="nfe-info-item">
        <span class="nfe-info-label">Valor:</span>
        ${value}
      </div>
      <div class="nfe-info-item">
        <span class="nfe-info-label">Data:</span>
        ${date}
      </div>
    </div>
  `;
  
  // Se houver erros, adicionar lista de erros
  if (result.status === 'error' && result.errors && result.errors.length > 0) {
    html += `
      <div class="nfe-errors">
        <div class="nfe-errors-title">
          <span>⚠️</span>
          Inconsistências Encontradas
        </div>
        <div class="error-list">
    `;
    
    result.errors.forEach(error => {
      html += `
        <div class="error-item">
          <span class="error-item-label">${error.item || 'Item'}:</span>
          ${error.message || error.description || 'Erro não especificado'}
        </div>
      `;
    });
    
    html += `
        </div>
    `;
    
    // Botão Corrigir - só aparece se itemCount === dbItemCount
    if (result.itemCount !== null && result.dbItemCount !== null && result.itemCount === result.dbItemCount) {
      html += `
        <div style="margin-top: 12px; text-align: right;">
          <button class="btn btn-success btn-corrigir" data-filename="${result.fileName}">
            <span>✓</span>
            Corrigir
          </button>
        </div>
      `;
    }
    
    html += `
      </div>
    `;
  }
  
  div.innerHTML = html;
  
  // Event listener para botão corrigir
  const btnCorrigir = div.querySelector('.btn-corrigir');
  if (btnCorrigir) {
    btnCorrigir.addEventListener('click', () => corrigirNfe(result));
  }
  
  return div;
}

async function corrigirNfe(result) {
  const confirmacao = confirm(`Deseja realmente corrigir a NFe ${result.data?.nfeNumber || result.fileName}?`);
  
  if (!confirmacao) return;
  
  try {
    // Chamar endpoint de correção na API
    const response = await axios.post(state.apiUrl.replace('/validar', '/corrigir'), {
      fileName: result.fileName,
      nfeNumber: result.data?.nfeNumber
    }, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      alert('NFe corrigida com sucesso!');
      // Reprocessar para atualizar status
      await processXMLs();
    } else {
      alert(`Erro ao corrigir: ${response.data.message || 'Erro desconhecido'}`);
    }
    
  } catch (error) {
    alert(`Erro ao corrigir NFe: ${error.response?.data?.message || error.message}`);
  }
}

function extractNfeNumber(fileName) {
  // Tentar extrair número da NFe do nome do arquivo
  const match = fileName.match(/\d{44}/);
  return match ? match[0] : fileName.replace('.xml', '');
}

function filterResultsByStatus(results, filter) {
  if (filter === 'all') return results;
  return results.filter(r => r.status === filter);
}

function filterResults(filter) {
  state.currentFilter = filter;
  
  // Atualizar visual dos botões
  elements.filterAll.classList.remove('btn-primary');
  elements.filterSuccess.classList.remove('btn-primary');
  elements.filterError.classList.remove('btn-primary');
  
  elements.filterAll.classList.add('btn-ghost');
  elements.filterSuccess.classList.add('btn-ghost');
  elements.filterError.classList.add('btn-ghost');
  
  if (filter === 'all') {
    elements.filterAll.classList.remove('btn-ghost');
    elements.filterAll.classList.add('btn-primary');
  } else if (filter === 'success') {
    elements.filterSuccess.classList.remove('btn-ghost');
    elements.filterSuccess.classList.add('btn-primary');
  } else if (filter === 'error') {
    elements.filterError.classList.remove('btn-ghost');
    elements.filterError.classList.add('btn-primary');
  }
  
  renderNfeList();
}

function showCard(cardName) {
  elements.selectionCard.classList.add('hidden');
  elements.loadingCard.classList.add('hidden');
  elements.resultsCard.classList.add('hidden');
  
  if (cardName === 'selection') {
    elements.selectionCard.classList.remove('hidden');
    elements.newValidationBtn.classList.add('hidden');
  } else if (cardName === 'loading') {
    elements.loadingCard.classList.remove('hidden');
  } else if (cardName === 'results') {
    elements.resultsCard.classList.remove('hidden');
  }
}

function resetApp() {
  state.selectedFolder = null;
  state.xmlFiles = [];
  state.results = [];
  state.currentFilter = 'all';
  
  elements.folderPath.textContent = 'Nenhuma pasta selecionada';
  elements.folderPath.classList.remove('selected');
  elements.processBtn.disabled = true;
  elements.progressBar.style.width = '0%';
  elements.progressText.textContent = '0 de 0 arquivos processados';
  
  // Resetar filtros
  elements.filterAll.classList.add('btn-primary');
  elements.filterAll.classList.remove('btn-ghost');
  elements.filterSuccess.classList.add('btn-ghost');
  elements.filterSuccess.classList.remove('btn-primary');
  elements.filterError.classList.add('btn-ghost');
  elements.filterError.classList.remove('btn-primary');
  
  showCard('selection');
}

// Inicialização
showCard('selection');

