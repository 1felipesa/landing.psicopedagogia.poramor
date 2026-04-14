# Plano de Otimização Mobile (Responsividade)

Este documento detalha o plano de ação sistemático para corrigir todas as inconsistências no layout e usabilidade da Landing Page quando visualizada em dispositivos menores (celulares e tablets).

## 1. Implementação do Menu Mobile (Header.tsx)
**Problema:** Atualmente a barra de navegação esconde os links principais e o botão de WhatsApp no celular (`hidden lg:flex` e `hidden md:flex`), deixando o visitante sem opções de navegação.
**Solução:**
- Adicionar um estado (`useState`) para controlar a abertura/fechamento do Modal/Menu no Mobile.
- Inserir um botão de Ícone Sanduíche (`Menu` e `X` da biblioteca `lucide-react`) visível em telas menores.
- Criar a interface de menu sobreposto (*Glassmorphism overlay*) que é ativado ao clicar, contendo todos os links (Sobre, Metodologia, etc.) e o botão verde principal "Agendar Consulta".

## 2. Ajuste do Respiro Lateral (Paddings)
**Problema:** Componentes com a sensação de "sufocamento" visual, encostando excessivamente nas bordas da tela do celular.
**Solução:**
- Otimizar o espaçamento horizontal base de todas as seções (Hero, About, Methodology, Services, etc.).
- Transição da classe `px-4` para `px-6 sm:px-8 lg:px-12` na envolvente global principal (ou adicionar estas métricas em toda `<div className="max-w-7xl mx-auto">`).
- Afastar do limite a própria barra flutuante do Header, dando uma margem segura das bordas nativas do celular.

## 3. Tipografia e Escala de Títulos
**Problema:** Fontes com corpo gigante (`text-5xl` ou `text-6xl`) podem "quebrar" palavras ou usar muito espaço vertical em celulares.
**Solução:**
- Revisar `font-display` nas âncoras (h1, h2).
- Garantir que todas as quebras utilizem classes base maleáveis (por exemplo, começar por `text-3xl sm:text-5xl md:text-6xl`).

## 4. Otimização de Empilhamento e Gráficos (Mockups)
**Problema:** Gráficos interativos (Cards flutuantes na Metodologia, Portal do Cliente e Materiais) podem transbordar (*overflow-x*) da extensão do celular.
**Solução:**
- Redimensionar *Widths* rígidas como `w-48` no celular para `w-[70vw]` ou larguras condicionais.
- Confirmar *wrap* flexível nas seções em Z-Index para não ocorrer rolagem horizontal na tela (bug do eixo X).

## Ordem de Execução Sugerida:
- [ ] Etapa 1: Atualizar o componente `Header.tsx` implementando toda a arquitetura de Menu Mobile e seus estilos de exibição.
- [ ] Etapa 2: Fazer uma busca pelas seções principais da página (`Hero`, `Methodology`, `Services`, `EbooksSection`) resolvendo as métricas de `px` e `py` em conjunto com ajustes de fonte.
- [ ] Etapa 3: Checar rodapé (`Footer.tsx`) e Área Legal para corrigir grids esmagados.

> **Status:** Aguardando aprovação para iniciarmos o passo-a-passo no código.
