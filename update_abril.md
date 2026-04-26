# Percurso Guiado - Foco em Conversão

## Product Overview

**The Pitch:** Um site de psicopedagogia clínica desenhado para guiar pais e responsáveis diretamente para o agendamento via WhatsApp, eliminando a ansiedade e a sobrecarga de informações. Transforma blocos de texto densos em soluções visuais acolhedoras e interativas.

**For:** Pais e responsáveis de crianças/adolescentes com dificuldades de aprendizagem que buscam ajuda profissional clara, acolhedora e imediata.

**Device:** desktop

**Design Direction:** Acolhedor, respirável e clínico sem ser frio. Uso estratégico de espaços em branco, tipografia sans-serif limpa e moderna para transmitir clareza e uma paleta de roxo profundo e verde sálvia para inspirar confiança e crescimento.

**Inspired by:** Headspace (para redução de carga cognitiva), BetterHelp (para fluxos de conversão diretos).

---

## Screens

- **Home (Dores & Soluções):** Apresentação imediata de valor, cards interativos de identificação de problemas e seção de destaque de recursos.
- **Sobre a Profissional:** Construção de autoridade e empatia com credenciais claras.
- **Biblioteca de Recursos:** Exibição de materiais de alto valor com redirecionamento direto para a página de e-books.
- **Contato Direto:** Modal rápido e CTA flutuante para conexão instantânea via WhatsApp.

---

## Key Flows

**Agendamento via WhatsApp:** Pais buscando iniciar o tratamento.

1. User is on Home -> sees **Floating WhatsApp Button** (bottom right, always visible).
2. User clicks **Floating WhatsApp Button** -> opens native WhatsApp Web/App with pre-filled message.
3. User connects directly with the clinic, reducing friction to zero.

**Acesso a Recursos Grátis:** Pais e profissionais buscando materiais informativos.

1. User is on Home -> sees **Resource Highlight** section.
2. User clicks **Acessar Materiais** -> redirects directly to `psychopedagogiapoamor.com/ebooks`.
3. User explores the dedicated e-books page.

---

<details>
<summary>Design System</summary>

## Color Palette

- **Primary:** `#4A2B6B` - Deep Amethyst (Headings, primary buttons, footer)
- **Background:** `#F9F8F6` - Warm Oatmeal (Main page background, reduces eye strain)
- **Surface:** `#FFFFFF` - White (Cards, modals, clean content areas)
- **Text:** `#2D2A32` - Charcoal (High contrast body text, softer than pure black)
- **Muted:** `#9CA3AF` - Gray (Secondary text, borders)
- **Accent:** `#739E82` - Sage Green (Success states, secondary buttons, highlights)

## Typography

- **Headings:** `Montserrat`, 700, 24-48px (Transmite modernidade, clareza e autoridade limpa)
- **Body:** `Outfit`, 400, 18px (Alta legibilidade geométrica, limpa)
- **Small text:** `Outfit`, 400, 14px
- **Buttons:** `Outfit`, 500, 16px, uppercase tracking wide (0.05em)

**Style notes:** Bordas arredondadas generosas (`16px` para cards, `999px` para botões pílula), sombras suaves e difusas (`0 10px 40px -10px rgba(74,43,107,0.1)`) criando uma sensação de flutuação e leveza.

## Design Tokens

```css
:root {
  --color-primary: #4A2B6B;
  --color-background: #F9F8F6;
  --color-surface: #FFFFFF;
  --color-text: #2D2A32;
  --color-muted: #9CA3AF;
  --color-accent: #739E82;
  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Outfit', sans-serif;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-pill: 9999px;
  --spacing-4: 16px;
  --spacing-8: 32px;
  --spacing-16: 64px;
}
```

</details>

---

<details>
<summary>Screen Specifications</summary>

### Home (Dores & Soluções)

**Purpose:** Reter a atenção imediata e converter visitantes ansiosos mostrando que suas dores são compreendidas, mantendo o WhatsApp como CTA primário.

**Layout:** Hero section de tela cheia com proposição de valor, seguido por grid 3x2 de cards de "Dores", e uma nova seção "Resource Highlight".

**Key Elements:**
- **Hero Title:** Montserrat 700, 48px, cor `#4A2B6B`. Texto: "Transformando dificuldades em potenciais de aprendizagem."
- **Primary CTA:** Botão pílula, background `#739E82`, texto branco. Texto: "Falar com a Especialista".
- **Dores Cards:** Grid de cards interativos. Ao passar o mouse, a "Dor" (ex: "Falta de foco na escola") flipa ou transiciona suavemente para a "Solução" (ex: "Avaliação atencional e treinos cognitivos").
- **Resource Highlight:** Seção de alta visibilidade promovendo a qualidade dos materiais gratuitos (para famílias e profissionais). Inclui texto engajador e um botão secundário que linka diretamente para `psychopedagogiapoamor.com/ebooks`.

**States:**
- **Empty:** N/A (conteúdo estático).
- **Loading:** Skeleton loaders suaves com reflexo `#F9F8F6` para `#FFFFFF`.

**Components:**
- **Interactive Card:** 320x240px, bg `#FFFFFF`, borda radius `16px`, shadow suave. Texto centralizado.
- **Floating FAB:** 64x64px, bg `#25D366` (cor oficial do WhatsApp para familiaridade), ícone branco, fixo `bottom-8 right-8`, z-index 50.
- **Highlight Button:** Altura 48px, bg `#4A2B6B`, texto branco, radius `8px`.

**Interactions:**
- **Hover Card:** Transição opacidade/deslocamento Y (-8px), revelando texto de solução.
- **Click Primary CTA:** Scroll suave para rodapé de contato ou aciona link do WhatsApp.
- **Click Highlight Button:** Redirecionamento para a página externa de e-books.

**Responsive:**
- **Desktop:** Hero com imagem à direita, texto à esquerda. Grid 3 colunas.
- **Tablet:** Grid 2 colunas.
- **Mobile:** Hero empilhado, grid 1 coluna, FAB levemente menor (56x56px).

### Sobre a Profissional

**Purpose:** Construir confiança, exibir qualificações sem sobrecarregar com currículo acadêmico denso.

**Layout:** Split screen (1/3 foto acolhedora, 2/3 mini-bio e credenciais em bullet points).

**Key Elements:**
- **Portrait:** Foto profissional mas sorridente, recorte em arco (arch frame) para suavidade.
- **Bio Text:** Outfit 400, 18px, cor `#2D2A32`. Texto dividido em parágrafos curtos (max 3 linhas).
- **Credentials List:** Ícones `#739E82` ao lado de texto curto em Montserrat (ex: "Especialista em Neuropsicopedagogia").

**States:**
- **Empty:** N/A.

**Components:**
- **Credential Badge:** bg `#F9F8F6`, borda esquerda `4px solid #739E82`, padding `16px`.

**Interactions:**
- **Hover Badge:** Bg transiciona para branco, shadow aparece.

**Responsive:**
- **Desktop:** Layout lado a lado (Foto Esq / Texto Dir).
- **Tablet:** Empilhado. Foto centralizada, largura max 400px.
- **Mobile:** Mesmo do tablet, fontes reduzidas em 10%.

### Biblioteca de Recursos

**Purpose:** Organizar e apresentar materiais de alto valor para pais e profissionais, direcionando o tráfego para a página dedicada de downloads.

**Layout:** Header explicativo + Grid de E-books (2 colunas em desktop).

**Key Elements:**
- **Library Header:** Montserrat 40px, centrado. "Materiais Gratuitos para Pais e Profissionais".
- **E-book Card:** Imagem 3D do e-book, título, descrição curta e botão de redirecionamento.
- **External Link Button:** Botão `Acessar Material` que redireciona diretamente para `psychopedagogiapoamor.com/ebooks`.

**States:**
- **Empty:** "Novos materiais em breve."
- **Loading:** Skeleton loading dos cards de e-book.

**Components:**
- **Access Button:** Altura 48px, bg `#4A2B6B`, texto branco, radius `8px`.

**Interactions:**
- **Click Access:** Redireciona imediatamente para a URL externa de e-books.

**Responsive:**
- **Desktop:** Grid de 2 colunas para cards largos (imagem na esq, texto e botão na dir do card).
- **Tablet/Mobile:** Cards verticais (imagem topo, botão na base).

</details>

---

<details>
<summary>Build Guide</summary>

**Stack:** HTML + Tailwind CSS v3 + Alpine.js (para interações de UI leves e modals)

**Build Order:**
1. **Design System Setup:** Configurar tailwind.config.js com cores (`primary: #4A2B6B`, etc) e fontes (Montserrat, Outfit).
2. **Global Components:** Construir o Floating WhatsApp FAB e Navbar, garantindo navegação rápida para a conversão primária.
3. **Home:** Implementar a estrutura Base. Focar na animação dos cards Dores/Soluções e estruturar a nova seção 'Resource Highlight' com link externo.
4. **Sobre & Biblioteca:** Reutilizar tipografia e tokens de spacing. Implementar os cards na biblioteca como redirecionadores diretos para a página externa.

</details>