# 🚀 Guia Rápido - Validador NFe

## Para Desenvolvedores

### 1️⃣ Primeira Execução

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm start
```

Ou no Windows, simplesmente execute: `start.bat`

### 2️⃣ Gerar Executável para Windows

```bash
npm run build
```

Ou no Windows: `build.bat`

O instalador será gerado em `dist/Validador NFe Setup X.X.X.exe`

---

## Para Usuários Finais

### 📥 Instalação

1. Execute o instalador `Validador NFe Setup.exe`
2. Siga as instruções na tela
3. O aplicativo será instalado e um atalho será criado na área de trabalho

### 📝 Como Usar

#### Passo 1: Preparar os XMLs
- Coloque todos os arquivos XML das notas fiscais em uma pasta
- Certifique-se de que são arquivos `.xml` válidos

#### Passo 2: Iniciar a API
- A API de validação deve estar rodando em seu servidor
- Por padrão, o sistema espera a API em `http://localhost:3000/api/validar`
- Você pode alterar essa URL na interface do aplicativo

#### Passo 3: Validar as Notas

1. **Abra o aplicativo** "Validador NFe"

2. **Selecione a pasta** com os XMLs
   - Clique no botão "📁 Selecionar Pasta"
   - Navegue até a pasta com os arquivos XML
   - Clique em "Selecionar"

3. **Verifique a URL da API**
   - Confirme se a URL está correta
   - Exemplo: `http://localhost:3000/api/validar`

4. **Processe os XMLs**
   - Clique no botão "⚡ Processar XMLs"
   - Aguarde o processamento (uma barra de progresso será exibida)

5. **Visualize os Resultados**
   - **Notas Válidas**: Aparecem em verde ✓
   - **Notas com Erros**: Aparecem em vermelho ✗
   - Clique em uma nota para ver os detalhes dos erros

#### Passo 4: Filtrar Resultados

Use os botões de filtro para visualizar:
- **Todas**: Todas as notas processadas
- **Apenas Válidas**: Somente notas sem erros
- **Apenas com Erros**: Somente notas com inconsistências

#### Passo 5: Nova Validação

Clique no botão "🔄 Nova Validação" para processar outra pasta de XMLs

---

## 🎨 Interface

### Cores dos Status

- 🟢 **Verde**: Nota fiscal válida, sem inconsistências
- 🔴 **Vermelho**: Nota fiscal com erros/divergências

### Informações Exibidas

Para cada nota fiscal, você verá:
- **Número da NFe**
- **Nome do Fornecedor**
- **Valor Total**
- **Data de Emissão**
- **Status** (Válida ou Com Erros)
- **Lista de Erros** (se houver)

### Resumo

No topo dos resultados, você verá:
- **Total de Notas**: Quantidade total processada
- **Válidas**: Quantidade de notas sem erros
- **Com Erros**: Quantidade de notas com inconsistências

---

## ❓ Perguntas Frequentes

### A pasta não tem nenhum XML, o que fazer?
Certifique-se de que os arquivos têm a extensão `.xml` (não `.XML` ou outro formato).

### A API não está respondendo
- Verifique se a API está rodando
- Verifique se a URL está correta
- Verifique o firewall/antivírus

### Os XMLs não estão sendo processados
- Verifique se são XMLs válidos de NFe
- Verifique os logs da API para mais detalhes
- Tente processar um XML por vez para identificar o problema

### Como exportar os resultados?
Atualmente, os resultados são exibidos apenas na tela. Para exportar, você pode:
- Fazer capturas de tela
- Implementar funcionalidade de exportação (futuro)

### Posso processar quantos XMLs ao mesmo tempo?
Sim, o sistema processa todos os XMLs da pasta selecionada. Não há limite definido, mas o desempenho dependerá da capacidade da sua API.

---

## 🔧 Configurações Avançadas

### Alterar URL Padrão da API

Edite o arquivo `index.html`, linha com `id="apiUrl"`:

```html
<input 
  type="text" 
  id="apiUrl" 
  value="http://SEU-SERVIDOR:PORTA/api/validar"
>
```

### Alterar Timeout das Requisições

Edite o arquivo `renderer.js`, procure por `timeout`:

```javascript
const response = await axios.post(apiUrl, {
  // ...
}, {
  timeout: 60000, // 60 segundos
  // ...
});
```

---

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Consulte o `README.md` completo
- Consulte o `INTEGRACAO_API.md` para detalhes da API
- Entre em contato com o administrador do sistema

---

**Smartsheet Inc.** - Validador NFe v1.0.0

