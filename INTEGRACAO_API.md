# Guia de Integração - API de Validação NFe

Este documento explica como integrar sua própria API de validação com o sistema Validador NFe.

## 📡 Endpoint Esperado

O aplicativo Electron fará requisições POST para o endpoint configurado (padrão: `http://localhost:3000/api/validar`).

## 📥 Formato da Requisição

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "fileName": "35240112345678000199550010000123451234567890.xml",
  "xmlContent": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><nfeProc>...</nfeProc>"
}
```

**Campos:**
- `fileName` (string): Nome do arquivo XML
- `xmlContent` (string): Conteúdo completo do XML da NFe

## 📤 Formato da Resposta

### Resposta de Sucesso (NFe Válida)

```json
{
  "status": "success",
  "nfeNumber": "000012345",
  "supplier": "FORNECEDOR EXEMPLO LTDA",
  "value": "R$ 1.500,00",
  "date": "2024-01-15T10:30:00-03:00",
  "errors": []
}
```

### Resposta de Erro (NFe com Inconsistências)

```json
{
  "status": "error",
  "nfeNumber": "000012345",
  "supplier": "FORNECEDOR EXEMPLO LTDA",
  "value": "R$ 1.500,00",
  "date": "2024-01-15T10:30:00-03:00",
  "errors": [
    {
      "item": "Item 1 - PRODUTO EXEMPLO 500G",
      "message": "Divergência de valor unitário: Esperado R$ 10,00, encontrado R$ 9,50"
    },
    {
      "item": "Item 2 - PRODUTO TESTE 1KG",
      "message": "Quantidade divergente: Esperado 100, encontrado 95"
    },
    {
      "item": "Item 3 - PRODUTO DEMO",
      "message": "Produto não cadastrado no sistema"
    }
  ]
}
```

**Campos da Resposta:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `status` | string | ✅ Sim | `"success"` ou `"error"` |
| `nfeNumber` | string | ❌ Não | Número da NFe |
| `supplier` | string | ❌ Não | Nome do fornecedor |
| `value` | string | ❌ Não | Valor total da nota (formatado) |
| `date` | string | ❌ Não | Data de emissão |
| `errors` | array | ✅ Sim | Array de erros (vazio se status = success) |

**Campos do objeto Error:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `item` | string | ✅ Sim | Identificação do item com erro |
| `message` | string | ✅ Sim | Descrição da inconsistência |

## 🔍 Estrutura do XML NFe

Para extrair as informações do XML, você pode usar a seguinte estrutura:

```javascript
const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_'
});

const xmlData = parser.parse(xmlContent);

// Acessar dados da NFe
const nfe = xmlData.nfeProc?.NFe?.infNFe || xmlData.NFe?.infNFe;

// Identificação
const ide = nfe.ide;
const nfeNumber = ide.nNF;
const serie = ide.serie;
const date = ide.dhEmi || ide.dEmi;

// Emitente (Fornecedor)
const emit = nfe.emit;
const supplierName = emit.xNome;
const supplierCNPJ = emit.CNPJ;

// Totais
const total = nfe.total.ICMSTot;
const totalValue = total.vNF;

// Itens
const det = Array.isArray(nfe.det) ? nfe.det : [nfe.det];
for (const item of det) {
  const prod = item.prod;
  const itemCode = prod.cProd;
  const itemDesc = prod.xProd;
  const itemQty = prod.qCom;
  const itemValue = prod.vUnCom;
  const itemTotal = prod.vProd;
}
```

## 💾 Exemplo de Validação com Banco de Dados

### Exemplo em Node.js com MySQL

```javascript
const mysql = require('mysql2/promise');

async function validateNfe(xmlData) {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',
    database: 'sistema_nfe'
  });

  const errors = [];
  const nfe = xmlData.nfeProc?.NFe?.infNFe;
  const items = Array.isArray(nfe.det) ? nfe.det : [nfe.det];

  try {
    // Validar cada item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const prod = item.prod;

      // Buscar produto no banco
      const [rows] = await connection.execute(
        'SELECT * FROM produtos WHERE codigo = ?',
        [prod.cProd]
      );

      if (rows.length === 0) {
        errors.push({
          item: `Item ${i + 1} - ${prod.xProd}`,
          message: 'Produto não cadastrado no sistema'
        });
        continue;
      }

      const produtoDB = rows[0];

      // Validar valor unitário
      const valorXML = parseFloat(prod.vUnCom);
      const valorDB = parseFloat(produtoDB.valor_unitario);

      if (Math.abs(valorXML - valorDB) > 0.01) {
        errors.push({
          item: `Item ${i + 1} - ${prod.xProd}`,
          message: `Divergência de valor: Esperado R$ ${valorDB.toFixed(2)}, encontrado R$ ${valorXML.toFixed(2)}`
        });
      }

      // Validar quantidade
      const qtyXML = parseFloat(prod.qCom);
      const qtyDB = parseFloat(produtoDB.quantidade_esperada);

      if (qtyXML !== qtyDB) {
        errors.push({
          item: `Item ${i + 1} - ${prod.xProd}`,
          message: `Quantidade divergente: Esperado ${qtyDB}, encontrado ${qtyXML}`
        });
      }
    }
  } finally {
    await connection.end();
  }

  return errors;
}
```

### Exemplo em Python com PostgreSQL

```python
import psycopg2
from xml.etree import ElementTree as ET

def validate_nfe(xml_content):
    # Parse XML
    root = ET.fromstring(xml_content)
    
    # Conectar ao banco
    conn = psycopg2.connect(
        host="localhost",
        database="sistema_nfe",
        user="postgres",
        password="senha"
    )
    cursor = conn.cursor()
    
    errors = []
    
    # Extrair itens
    ns = {'nfe': 'http://www.portalfiscal.inf.br/nfe'}
    items = root.findall('.//nfe:det', ns)
    
    for i, item in enumerate(items):
        prod = item.find('nfe:prod', ns)
        codigo = prod.find('nfe:cProd', ns).text
        descricao = prod.find('nfe:xProd', ns).text
        valor_xml = float(prod.find('nfe:vUnCom', ns).text)
        
        # Buscar no banco
        cursor.execute(
            "SELECT valor_unitario FROM produtos WHERE codigo = %s",
            (codigo,)
        )
        result = cursor.fetchone()
        
        if not result:
            errors.append({
                'item': f'Item {i+1} - {descricao}',
                'message': 'Produto não cadastrado no sistema'
            })
            continue
        
        valor_db = float(result[0])
        
        if abs(valor_xml - valor_db) > 0.01:
            errors.append({
                'item': f'Item {i+1} - {descricao}',
                'message': f'Divergência de valor: Esperado R$ {valor_db:.2f}, encontrado R$ {valor_xml:.2f}'
            })
    
    cursor.close()
    conn.close()
    
    return errors
```

### Exemplo em C# com SQL Server

```csharp
using System;
using System.Data.SqlClient;
using System.Xml.Linq;
using System.Collections.Generic;

public class NfeValidator
{
    private string connectionString = "Server=localhost;Database=SistemaNFe;User Id=sa;Password=senha;";
    
    public List<NfeError> ValidateNfe(string xmlContent)
    {
        var errors = new List<NfeError>();
        var xml = XDocument.Parse(xmlContent);
        XNamespace ns = "http://www.portalfiscal.inf.br/nfe";
        
        var items = xml.Descendants(ns + "det");
        
        using (var connection = new SqlConnection(connectionString))
        {
            connection.Open();
            
            int itemIndex = 1;
            foreach (var item in items)
            {
                var prod = item.Element(ns + "prod");
                var codigo = prod.Element(ns + "cProd").Value;
                var descricao = prod.Element(ns + "xProd").Value;
                var valorXml = decimal.Parse(prod.Element(ns + "vUnCom").Value);
                
                // Buscar no banco
                var command = new SqlCommand(
                    "SELECT valor_unitario FROM produtos WHERE codigo = @codigo",
                    connection
                );
                command.Parameters.AddWithValue("@codigo", codigo);
                
                var result = command.ExecuteScalar();
                
                if (result == null)
                {
                    errors.Add(new NfeError
                    {
                        Item = $"Item {itemIndex} - {descricao}",
                        Message = "Produto não cadastrado no sistema"
                    });
                    itemIndex++;
                    continue;
                }
                
                var valorDb = (decimal)result;
                
                if (Math.Abs(valorXml - valorDb) > 0.01m)
                {
                    errors.Add(new NfeError
                    {
                        Item = $"Item {itemIndex} - {descricao}",
                        Message = $"Divergência de valor: Esperado R$ {valorDb:F2}, encontrado R$ {valorXml:F2}"
                    });
                }
                
                itemIndex++;
            }
        }
        
        return errors;
    }
}

public class NfeError
{
    public string Item { get; set; }
    public string Message { get; set; }
}
```

## 🧪 Testando sua API

Use o exemplo de API fornecido para testar:

```bash
cd api-example
npm install
npm start
```

Ou teste manualmente com curl:

```bash
curl -X POST http://localhost:3000/api/validar \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "teste.xml",
    "xmlContent": "<?xml version=\"1.0\"?><nfeProc>...</nfeProc>"
  }'
```

## ⚠️ Considerações Importantes

1. **Timeout**: O aplicativo tem timeout de 30 segundos por requisição
2. **Tamanho**: XMLs podem ser grandes (até 50MB configurado no exemplo)
3. **CORS**: Habilite CORS na sua API para localhost
4. **Erro Handling**: Sempre retorne status HTTP 200 com `status: "error"` no body
5. **Performance**: Otimize queries ao banco para processar lotes grandes
6. **Logs**: Implemente logs detalhados para debug

## 📞 Suporte

Para dúvidas sobre a integração, consulte o README.md principal ou entre em contato com o suporte técnico.

---

**Smartsheet Inc.** - Guia de Integração API

