/**
 * EXEMPLO DE API PARA VALIDAÇÃO DE NFe
 * 
 * Este é um exemplo de como a API localhost deve funcionar.
 * O cliente deve implementar sua própria lógica de validação
 * conectando ao banco de dados e verificando as inconsistências.
 */

const express = require('express');
const cors = require('cors');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Parser XML
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

/**
 * Endpoint de validação
 * 
 * Recebe:
 * {
 *   fileName: string,
 *   xmlContent: string
 * }
 * 
 * Retorna:
 * {
 *   status: 'success' | 'error',
 *   nfeNumber: string,
 *   supplier: string,
 *   value: string,
 *   date: string,
 *   errors: [
 *     {
 *       item: string,
 *       message: string
 *     }
 *   ]
 * }
 */
app.post('/api/validar', async (req, res) => {
  try {
    const { fileName, xmlContent } = req.body;
    
    if (!xmlContent) {
      return res.status(400).json({
        status: 'error',
        message: 'XML content is required'
      });
    }
    
    // Parse do XML
    const xmlData = parser.parse(xmlContent);
    
    // Extrair informações da NFe
    const nfe = xmlData.nfeProc?.NFe?.infNFe || xmlData.NFe?.infNFe || {};
    const ide = nfe.ide || {};
    const emit = nfe.emit || {};
    const total = nfe.total?.ICMSTot || {};
    const det = nfe.det || [];
    
    const nfeNumber = ide.nNF || 'N/A';
    const supplier = emit.xNome || emit.xFant || 'N/A';
    const value = total.vNF ? `R$ ${parseFloat(total.vNF).toFixed(2)}` : 'N/A';
    const date = ide.dhEmi || ide.dEmi || 'N/A';
    
    // AQUI VOCÊ DEVE IMPLEMENTAR SUA LÓGICA DE VALIDAÇÃO
    // Conectar ao banco de dados e verificar inconsistências
    
    // Exemplo de validação simulada
    const errors = await validateNfe(nfe, det);
    
    const response = {
      status: errors.length > 0 ? 'error' : 'success',
      nfeNumber,
      supplier,
      value,
      date,
      errors
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Error processing XML:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      errors: [{
        item: 'Sistema',
        message: 'Erro ao processar XML'
      }]
    });
  }
});

/**
 * Função de validação (EXEMPLO)
 * 
 * Aqui você deve implementar sua lógica de validação real:
 * - Conectar ao banco de dados
 * - Buscar os itens da nota
 * - Comparar valores, quantidades, preços, etc.
 * - Retornar lista de inconsistências
 */
async function validateNfe(nfe, det) {
  const errors = [];
  
  // Exemplo de validação simulada
  // Substitua isso pela sua lógica real
  
  // Simular validação de itens
  const items = Array.isArray(det) ? det : [det];
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const prod = item.prod || {};
    
    // Exemplo: validar se o produto existe no banco
    // const produtoDB = await buscarProdutoNoBanco(prod.cProd);
    
    // Simulação de erro aleatório (20% de chance)
    if (Math.random() < 0.2) {
      errors.push({
        item: `Item ${i + 1} - ${prod.xProd || 'N/A'}`,
        message: `Divergência de valor: Esperado R$ 100,00, encontrado R$ ${prod.vUnCom || '0,00'}`
      });
    }
    
    // Exemplo de outras validações
    if (Math.random() < 0.15) {
      errors.push({
        item: `Item ${i + 1} - ${prod.xProd || 'N/A'}`,
        message: `Quantidade divergente: Esperado 10, encontrado ${prod.qCom || '0'}`
      });
    }
  }
  
  return errors;
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API de validação NFe funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 API de validação NFe rodando em http://localhost:${PORT}`);
  console.log(`📋 Endpoint de validação: POST http://localhost:${PORT}/api/validar`);
  console.log(`💚 Health check: GET http://localhost:${PORT}/health`);
});

