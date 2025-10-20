# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [2.0.0] - 2024-10-20

### ✨ Adicionado
- Tela de configurações modal para URL da API
- Header fixo com botões principais
- Botão "Nova Consulta" no header
- Botão "Configurações" no header
- Botão "Corrigir" condicional (aparece quando itemCount === dbItemCount)
- Endpoint de correção `/api/corrigir`
- Salvamento de configurações no localStorage
- Feedback visual ao salvar configurações

### 🎨 Design
- Background cinza (#EBECED) ao invés de rosa/gradiente
- Cores de erro alteradas para vermelho/rosa (#FF647C, #FDAFBB, #FBE4E8)
- Laranja (#FFA26B) usado apenas para botões de ação
- Itens da lista mais finos e compactos
- Header reduzido e fixo no topo
- Sombras mais suaves
- Espaçamentos reduzidos

### 🔧 Melhorias
- Removida API de exemplo (foco no frontend)
- URL da API agora configurável via modal
- Interface preparada para abas futuras
- Layout mais limpo e profissional
- Melhor organização dos botões

### 🗑️ Removido
- Campo de URL da API na tela principal
- Pasta `api-example/`
- Documentação antiga desnecessária

---

## [1.0.0] - 2024-10-20

### ✨ Adicionado
- Interface gráfica completa em Electron
- Seleção de pasta com arquivos XML
- Processamento em lote de múltiplos XMLs
- Integração com API localhost via HTTP
- Visualização de resultados com cores semânticas
- Filtros de visualização (Todas, Válidas, Com Erros)
- Barra de progresso durante processamento
- Resumo estatístico (Total, Válidas, Com Erros)
- Detalhamento de inconsistências por item
- Design System Smartsheet Inc.
- Build para Windows (.exe)

### 📦 Dependências
- Electron 28.0.0
- Axios 1.6.2
- fast-xml-parser 4.3.2
- electron-builder 24.9.1

---

**Smartsheet Inc.** - Validador NFe

