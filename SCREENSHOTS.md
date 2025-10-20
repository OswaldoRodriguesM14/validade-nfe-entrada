# 📸 Screenshots e Interface

Este documento descreve a interface do **Validador NFe** e suas telas principais.

## 🎨 Design System

O projeto utiliza o Design System da **Smartsheet Inc.** com as seguintes características:

### Paleta de Cores

**Cores Primárias:**
- Azul Principal: `#0092DB`
- Azul Claro: `#80C8ED`
- Azul Muito Claro: `#EEDFF2`

**Cores de Contraste:**
- Amarelo: `#FFCE00`
- Amarelo Claro: `#FFE680`
- Amarelo Muito Claro: `#FFF3BF`

**Cores Semânticas:**
- Sucesso (Verde): `#00C48C` - Usado para notas válidas
- Erro (Laranja): `#FFA26B` - Usado para notas com inconsistências
- Aviso (Amarelo): `#FFCF5C`
- Info (Azul): `#0084F4`

**Cores Neutras:**
- Escuro: `#041F2E`
- Médio: `#6B7476`
- Claro: `#CED1D1`
- Muito Claro: `#EBECED`
- Branco: `#FFFFFF`

### Tipografia

- **Fonte:** Outfit (Google Fonts)
- **Heading 1:** Outfit Bold, 34px
- **Heading 2:** Outfit SemiBold, 22px
- **Heading 3:** Outfit SemiBold, 17px
- **Body:** Outfit Regular, 16px
- **Caption:** Outfit Medium, 12px

## 📱 Telas da Aplicação

### 1. Tela Inicial - Seleção de Pasta

**Descrição:**
Tela onde o usuário seleciona a pasta contendo os arquivos XML das notas fiscais.

**Elementos:**
- Header com logo e título "VALIDADOR NFe"
- Subtítulo "Smartsheet Inc." em amarelo
- Card com instruções
- Área de seleção de pasta (cinza claro com borda tracejada)
- Campo de input para URL da API
- Botão "Selecionar Pasta" (azul)
- Botão "Processar XMLs" (amarelo, desabilitado até selecionar pasta)

**Cores Utilizadas:**
- Fundo: Gradiente de `#EEDFF2` para branco
- Header: Branco com borda azul
- Botão Primário: `#0092DB`
- Botão Ação: `#FFCE00`

---

### 2. Tela de Processamento - Loading

**Descrição:**
Tela exibida durante o processamento dos XMLs.

**Elementos:**
- Spinner animado (azul)
- Texto "Processando XMLs..."
- Barra de progresso com gradiente azul
- Contador "X de Y arquivos processados"

**Cores Utilizadas:**
- Spinner: `#0092DB`
- Barra de progresso: Gradiente azul
- Fundo da barra: `#EBECED`

---

### 3. Tela de Resultados

**Descrição:**
Tela principal com os resultados da validação.

**Elementos:**

#### 3.1. Resumo Estatístico (Cards)
Três cards no topo mostrando:
- **Total de Notas** (azul): Quantidade total processada
- **Válidas** (verde): Notas sem erros
- **Com Erros** (vermelho): Notas com inconsistências

**Cores dos Cards:**
- Total: Gradiente de `#D5E9FA` para `#66B5F8`
- Válidas: Gradiente de `#D5F2EA` para `#7DDFC3`
- Com Erros: Gradiente de `#FFE8DA` para `#FFC7A6`

#### 3.2. Filtros
Três botões para filtrar resultados:
- "Todas" (padrão ativo)
- "Apenas Válidas"
- "Apenas com Erros"

**Cores:**
- Ativo: `#0092DB` (azul sólido)
- Inativo: Borda azul, fundo transparente

#### 3.3. Lista de Notas Fiscais

Cada item da lista contém:
- **Borda lateral colorida:**
  - Verde (`#00C48C`) para notas válidas
  - Vermelho (`#FFA26B`) para notas com erros
  
- **Fundo com gradiente sutil:**
  - Verde claro para válidas
  - Vermelho claro para com erros

- **Informações exibidas:**
  - Número da NFe (destaque em negrito)
  - Badge de status (verde ✓ ou vermelho ✗)
  - Nome do arquivo
  - Fornecedor
  - Valor total
  - Data de emissão

- **Seção de Erros (apenas para notas com problemas):**
  - Título "⚠️ Inconsistências Encontradas"
  - Lista de erros com:
    - Nome do item
    - Descrição da inconsistência
  - Fundo: `#FFE8DA` (laranja claro)
  - Borda esquerda: `#FFA26B` (laranja)

#### 3.4. Botão Nova Validação
- Botão azul no final da página
- Ícone de reload (🔄)
- Texto "Nova Validação"

---

## 🎯 Estados Visuais

### Botões

**Estado Normal:**
- Sombra sutil
- Cores sólidas

**Estado Hover:**
- Elevação (translateY -2px)
- Sombra mais pronunciada
- Cor levemente mais escura

**Estado Desabilitado:**
- Opacidade 50%
- Cursor not-allowed
- Sem interação

### Cards de Nota Fiscal

**Estado Normal:**
- Borda cinza clara
- Fundo branco/gradiente sutil

**Estado Hover:**
- Sombra média
- Deslocamento para direita (4px)
- Transição suave

### Inputs

**Estado Normal:**
- Borda cinza clara
- Fundo branco

**Estado Focus:**
- Borda azul
- Sombra azul clara ao redor
- Sem outline padrão do browser

---

## 📐 Layout e Espaçamento

### Container Principal
- Largura máxima: 1400px
- Margens laterais: 40px
- Centralizado

### Cards
- Border radius: 16px
- Padding: 32px
- Sombra: 0 10px 15px rgba(4, 31, 46, 0.1)
- Margin bottom: 24px

### Botões
- Border radius: 8px
- Padding: 14px 32px
- Gap entre ícone e texto: 10px

### Espaçamentos
- Pequeno: 8px
- Médio: 16px
- Grande: 24px
- Extra Grande: 32px

---

## 🔄 Animações

### Spinner de Loading
- Rotação contínua (1s linear infinite)
- Border top azul
- Demais bordas cinza claro

### Barra de Progresso
- Transição suave de largura (0.3s ease)
- Gradiente azul animado

### Transições Gerais
- Duração padrão: 0.3s
- Easing: ease
- Propriedades: all, transform, box-shadow

---

## 📱 Responsividade

O layout é responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop (1400px+):** Layout completo
- **Laptop (1200px+):** Layout ajustado
- **Tablet (768px+):** Grid adaptativo
- **Mobile (< 768px):** Layout em coluna única

---

## ♿ Acessibilidade

- Contraste adequado entre texto e fundo
- Tamanhos de fonte legíveis (mínimo 12px)
- Áreas clicáveis com tamanho adequado (mínimo 44x44px)
- Estados visuais claros (hover, focus, disabled)
- Feedback visual para todas as ações

---

## 🎨 Componentes Reutilizáveis

### Botões
- `.btn` - Base
- `.btn-primary` - Azul
- `.btn-warning` - Amarelo
- `.btn-ghost` - Transparente com borda

### Cards
- `.card` - Container principal
- `.card-header` - Cabeçalho
- `.card-title` - Título
- `.card-description` - Descrição

### Badges
- `.badge` - Base
- `.badge-success` - Verde
- `.badge-error` - Vermelho
- `.badge-warning` - Amarelo
- `.badge-info` - Azul

### Inputs
- `.input` - Campo de texto
- `.input-group` - Grupo com label
- `.input-with-icon` - Input com ícone

---

**Smartsheet Inc.** - Validador NFe - Documentação Visual

