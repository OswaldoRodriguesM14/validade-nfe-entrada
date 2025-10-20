# Validador NFe - Electron Desktop App

Sistema desktop para validação de XMLs de Notas Fiscais de Entrada contra banco de dados via API localhost.

## 📋 Descrição

O **Validador NFe** é uma aplicação desktop desenvolvida em Electron que permite validar arquivos XML de Notas Fiscais de Entrada de forma simples e visual. O sistema se comunica com uma API localhost que realiza a validação dos dados contra o banco de dados da empresa.

## 🎨 Design System

O projeto utiliza a paleta de cores da **Smartsheet Inc.** com:

- **Cores Primárias**: Azuis (#0092DB, #80C8ED, #EEDFF2)
- **Cores de Contraste**: Amarelos (#FFCE00, #FFE680, #FFF3BF)
- **Cores Semânticas**: 
  - Sucesso (Verde): #00C48C
  - Erro (Laranja): #FFA26B
  - Aviso (Amarelo): #FFCF5C
  - Info (Azul): #0084F4
- **Tipografia**: Outfit (Google Fonts)

## 🚀 Funcionalidades

- ✅ Seleção de pasta com arquivos XML
- ✅ Processamento em lote de múltiplos XMLs
- ✅ Comunicação com API localhost
- ✅ Visualização de resultados com status colorido
- ✅ Filtros (Todas, Válidas, Com Erros)
- ✅ Detalhamento de inconsistências por item
- ✅ Interface moderna e responsiva
- ✅ Build para Windows (.exe)

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passos

1. Clone ou extraia o projeto

2. Instale as dependências:
```bash
npm install
```

3. Execute em modo desenvolvimento:
```bash
npm start
```

## 🏗️ Build para Windows

Para gerar o executável (.exe) para Windows:

```bash
npm run build
```

O instalador será gerado na pasta `dist/`.

### Outras opções de build:

```bash
# Build portátil (sem instalador)
npm run build:portable

# Apenas empacotar (sem criar instalador)
npm run pack
```

## 🔌 API Localhost

O sistema espera uma API rodando em `http://localhost:3000/api/validar` (configurável na interface).

### Formato da Requisição

```json
{
  "fileName": "nota-fiscal-123.xml",
  "xmlContent": "<xml>...</xml>"
}
```

### Formato da Resposta

```json
{
  "status": "success" | "error",
  "nfeNumber": "12345678901234567890123456789012345678901234",
  "supplier": "Fornecedor LTDA",
  "value": "R$ 1.500,00",
  "date": "2024-01-15",
  "errors": [
    {
      "item": "Item 1 - Produto X",
      "message": "Divergência de valor: Esperado R$ 100,00, encontrado R$ 95,00"
    }
  ]
}
```

### API de Exemplo

Uma API de exemplo está incluída na pasta `api-example/`. Para executá-la:

```bash
cd api-example
npm install
npm start
```

**⚠️ IMPORTANTE**: A API de exemplo usa validações simuladas. Você deve implementar sua própria lógica de validação conectando ao seu banco de dados.

## 📁 Estrutura do Projeto

```
validador-nfe-electron/
├── main.js              # Processo principal do Electron
├── renderer.js          # Lógica do frontend
├── index.html           # Interface HTML
├── styles.css           # Estilos (Design System)
├── package.json         # Configurações e dependências
├── assets/              # Ícones e recursos
│   └── icon.png
├── api-example/         # API de exemplo (Node.js + Express)
│   ├── server.js
│   └── package.json
└── README.md
```

## 🎯 Como Usar

1. **Inicie a API**: Certifique-se de que sua API de validação está rodando
2. **Abra o aplicativo**: Execute o Validador NFe
3. **Selecione a pasta**: Clique em "Selecionar Pasta" e escolha a pasta com os XMLs
4. **Configure a API**: Verifique se a URL da API está correta
5. **Processe**: Clique em "Processar XMLs"
6. **Visualize os resultados**: 
   - Notas válidas aparecem em **verde** ✓
   - Notas com erros aparecem em **vermelho** ✗
   - Clique nos filtros para visualizar apenas válidas ou apenas com erros

## 🔧 Personalização

### Alterar cores

Edite as variáveis CSS em `styles.css`:

```css
:root {
  --primary-blue: #0092DB;
  --semantic-success: #00C48C;
  --semantic-error: #FFA26B;
  /* ... */
}
```

### Alterar URL padrão da API

Edite o campo `value` no `index.html`:

```html
<input 
  type="text" 
  id="apiUrl" 
  value="http://localhost:3000/api/validar"
>
```

### Alterar ícone do aplicativo

Substitua os arquivos em `assets/`:
- `icon.png` (256x256 ou maior)
- `icon.ico` (para Windows)

## 📝 Implementando sua API

Para implementar a validação real, você deve:

1. Criar uma API REST (Node.js, Python, C#, etc.)
2. Receber o XML no endpoint `/api/validar`
3. Fazer o parse do XML
4. Conectar ao seu banco de dados
5. Validar os dados (valores, quantidades, produtos, etc.)
6. Retornar o resultado no formato especificado

### Exemplo de validação (pseudocódigo):

```javascript
async function validateNfe(xmlData) {
  const errors = [];
  
  // Buscar nota no banco
  const notaBD = await db.query('SELECT * FROM notas WHERE numero = ?', [xmlData.nfeNumber]);
  
  // Validar itens
  for (const item of xmlData.items) {
    const itemBD = await db.query('SELECT * FROM itens WHERE codigo = ?', [item.codigo]);
    
    if (item.valor !== itemBD.valor) {
      errors.push({
        item: `Item ${item.codigo} - ${item.descricao}`,
        message: `Valor divergente: Esperado R$ ${itemBD.valor}, encontrado R$ ${item.valor}`
      });
    }
  }
  
  return errors;
}
```

## 🐛 Troubleshooting

### Erro ao selecionar pasta
- Verifique se o aplicativo tem permissões de leitura no sistema

### Erro ao conectar com a API
- Verifique se a API está rodando
- Verifique se a URL está correta
- Verifique o firewall/antivírus

### Erro ao processar XMLs
- Verifique se os arquivos são XMLs válidos de NFe
- Verifique os logs da API para mais detalhes

## 📄 Licença

MIT License - Smartsheet Inc.

## 👨‍💻 Desenvolvimento

Desenvolvido com:
- Electron 28
- Node.js
- Axios
- fast-xml-parser
- Design System Smartsheet Inc.

---

**Smartsheet Inc.** - Sistema de Validação de NFe

