# Validador NFe - Electron Desktop App

Sistema desktop para validação de XMLs de Notas Fiscais de Entrada contra banco de dados via API localhost (Golang).

## 📋 Descrição

O **Validador NFe** é uma aplicação desktop desenvolvida em Electron que permite validar arquivos XML de Notas Fiscais de Entrada de forma simples e visual. O sistema se comunica com uma API localhost (Golang) que realiza a validação dos dados contra o banco de dados da empresa.

## 🎨 Design System

O projeto utiliza a paleta de cores da **Smartsheet Inc.**:

- **Cores Primárias**: Azuis (#0092DB, #80C8ED, #EEDFF2)
- **Cores de Contraste**: Amarelos (#FFCE00, #FFE680, #FFF3BF)
- **Cores Semânticas**: 
  - Sucesso (Verde): #00C48C
  - Erro (Vermelho/Rosa): #FF647C, #FDAFBB, #FBE4E8
  - Info (Azul): #0084F4
  - Warning (Laranja): #FFA26B (apenas para botões)
- **Background**: Cinza claro (#EBECED)
- **Tipografia**: Outfit (Google Fonts)

## 🚀 Funcionalidades

- ✅ Seleção de pasta com arquivos XML
- ✅ Processamento em lote de múltiplos XMLs
- ✅ Comunicação com API localhost (Golang)
- ✅ Tela de configurações para URL da API
- ✅ Header fixo com botões principais
- ✅ Visualização de resultados com status colorido
- ✅ Filtros (Todas, Válidas, Com Erros)
- ✅ Detalhamento de inconsistências por item
- ✅ Botão "Corrigir" condicional (aparece quando itemCount === dbItemCount)
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

## 🔌 API Localhost (Golang)

O sistema espera uma API Golang rodando localmente. A URL padrão é `http://localhost:3000/api/validar` mas pode ser configurada na tela de Configurações.

### Formato da Requisição

**POST** `/api/validar`

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
  "itemCount": 10,
  "dbItemCount": 10,
  "errors": [
    {
      "item": "Item 1 - Produto X",
      "message": "Divergência de valor: Esperado R$ 100,00, encontrado R$ 95,00"
    }
  ]
}
```

**Campos importantes:**
- `itemCount`: Quantidade de itens no XML
- `dbItemCount`: Quantidade de itens no banco de dados
- **Botão "Corrigir" só aparece quando `itemCount === dbItemCount`**

### Endpoint de Correção

**POST** `/api/corrigir`

```json
{
  "fileName": "nota-fiscal-123.xml",
  "nfeNumber": "12345678901234567890123456789012345678901234"
}
```

Resposta:
```json
{
  "success": true,
  "message": "NFe corrigida com sucesso"
}
```

## 📁 Estrutura do Projeto

```
validade-nfe-entrada/
├── main.js              # Processo principal do Electron
├── renderer.js          # Lógica do frontend
├── index.html           # Interface HTML
├── styles.css           # Estilos (Design System)
├── package.json         # Configurações e dependências
├── assets/              # Ícones e recursos
│   └── icon.svg
├── build.bat            # Script de build para Windows
├── start.bat            # Script de execução em dev
└── README.md
```

## 🎯 Como Usar

1. **Abra o aplicativo**: Execute o Validador NFe

2. **Configure a API** (primeira vez):
   - Clique no botão "⚙️ Configurações" no header
   - Informe a URL da sua API Golang
   - Clique em "Salvar"

3. **Selecione a pasta**: 
   - Clique em "📁 Selecionar Pasta"
   - Escolha a pasta com os XMLs

4. **Processe**: 
   - Clique em "⚡ Processar XMLs"

5. **Visualize os resultados**: 
   - Notas válidas aparecem em **verde** ✓
   - Notas com erros aparecem em **vermelho** ✗
   - Use os filtros para visualizar apenas válidas ou apenas com erros

6. **Corrigir erros**:
   - O botão "✓ Corrigir" aparece apenas quando a quantidade de itens é igual
   - Clique para enviar correção para a API

7. **Nova validação**: 
   - Clique em "🔄 Nova Consulta" no header

## 🎨 Interface

### Header Fixo
- Logo e título sempre visíveis
- Botão "Nova Consulta" (aparece após processar)
- Botão "Configurações"

### Cores dos Status

- 🟢 **Verde** (#00C48C): Nota fiscal válida
- 🔴 **Vermelho/Rosa** (#FF647C): Nota fiscal com erros
- 🔵 **Azul** (#0092DB): Informações gerais

### Informações Exibidas

Para cada nota fiscal:
- Número da NFe
- Nome do Fornecedor
- Valor Total
- Data de Emissão
- Status (Válida ou Com Erros)
- Lista de Erros (se houver)
- Botão "Corrigir" (se itemCount === dbItemCount)

## 🔧 Personalização

### Alterar cores

Edite as variáveis CSS em `styles.css`:

```css
:root {
  --primary-blue: #0092DB;
  --semantic-success: #00C48C;
  --semantic-error: #FF647C;
  /* ... */
}
```

### Alterar URL padrão da API

A URL é salva no localStorage. Para definir um padrão diferente, edite `renderer.js`:

```javascript
apiUrl: localStorage.getItem('apiUrl') || 'http://SUA-URL-AQUI/api/validar'
```

## 📝 Desenvolvendo a API Golang

A API deve implementar os seguintes endpoints:

1. **POST /api/validar** - Validar XML
2. **POST /api/corrigir** - Corrigir NFe

Exemplo básico em Golang:

```go
package main

import (
    "encoding/json"
    "net/http"
)

type ValidateRequest struct {
    FileName   string `json:"fileName"`
    XMLContent string `json:"xmlContent"`
}

type ValidateResponse struct {
    Status      string  `json:"status"`
    NfeNumber   string  `json:"nfeNumber"`
    Supplier    string  `json:"supplier"`
    Value       string  `json:"value"`
    Date        string  `json:"date"`
    ItemCount   int     `json:"itemCount"`
    DBItemCount int     `json:"dbItemCount"`
    Errors      []Error `json:"errors"`
}

type Error struct {
    Item    string `json:"item"`
    Message string `json:"message"`
}

func validateHandler(w http.ResponseWriter, r *http.Request) {
    var req ValidateRequest
    json.NewDecoder(r.Body).Decode(&req)
    
    // Implementar lógica de validação aqui
    
    response := ValidateResponse{
        Status: "success",
        // ... preencher campos
    }
    
    json.NewEncoder(w).Encode(response)
}

func main() {
    http.HandleFunc("/api/validar", validateHandler)
    http.ListenAndServe(":3000", nil)
}
```

## 🐛 Troubleshooting

### Erro ao conectar com a API
- Verifique se a API Golang está rodando
- Verifique a URL nas Configurações
- Verifique o firewall/antivírus

### Botão "Corrigir" não aparece
- O botão só aparece quando `itemCount === dbItemCount`
- Verifique se a API está retornando esses campos

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

