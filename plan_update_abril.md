# Plano de Ação: Update Abril - Otimização de Conversão e Visual

Este plano detalha a reformulação da landing page da psicopedagoga Raiane E. Ferreira, com foco em reduzir a carga cognitiva, modernizar o visual e otimizar o fluxo de conversão para WhatsApp e materiais gratuitos.

---

## 🎯 Objetivos de Sucesso
- **Otimização de Conversão:** Transformar o WhatsApp no CTA primário e mais fluido.
- **Redução de Fricção:** Simplificar a jornada do usuário desde a dor até o contato.
- **Identidade Visual Premium:** Implementar a nova paleta de cores (Deep Amethyst e Sage Green) e tipografia (Montserrat/Outfit).
- **Rastreamento Avançado:** Implementar GTM para gerenciar Pixel, GA4 e eventos de conversão de forma centralizada.

---

## 🛠️ Tech Stack
- **Framework:** React 19 + Vite (Mantido)
- **Styling:** Tailwind CSS v4 (Mantido)
- **Ícones:** Lucide React (Mantido)
- **Animações:** Framer Motion (Nova sugestão para os cards interativos)
- **Analytics:** GTM (Google Tag Manager) + Meta Pixel + GA4

---

## 📂 Estrutura de Arquivos (Planejada)
```text
src/
├── components/
│   ├── ui/                 # Componentes base (Botões, Cards, Badges)
│   └── landing/            # Seções reformuladas
│       ├── Hero.tsx        # Foco em proposta de valor clara
│       ├── PainPoints.tsx  # Cards interativos Dores/Soluções
│       ├── About.tsx       # Bio em split screen acolhedora
│       └── Resources.tsx   # Biblioteca de E-books otimizada
└── utils/
    └── analytics.ts        # Adaptado para GTM
```

---

## 📝 Cronograma de Tarefas

### Fase 1: Infraestrutura e Analytics (O "Cérebro" dos Ads)
| ID | Tarefa | Agente | Status | Prioridade |
|----|--------|--------|--------|------------|
| T1 | **Setup GTM:** Integrar o Google Tag Manager no `index.html`. | `frontend-specialist` | ✅ Concluído | P0 |
| T2 | **Refatorar `analytics.ts`:** Adaptar para disparar eventos via `dataLayer`. | `frontend-specialist` | ✅ Concluído | P1 |
| T3 | **Mapeamento de Eventos:** Definir tags para Cliques WhatsApp e Downloads. | `seo-specialist` | ✅ Concluído | P1 |

### Fase 2: Design System e Fundamentos
| ID | Tarefa | Agente | Status | Prioridade |
|----|--------|--------|--------|------------|
| T4 | **Update Tailwind Config:** Adicionar os tokens de cores e fontes. | `frontend-specialist` | ✅ Concluído | P0 |
| T5 | **Global Styles:** Atualizar `index.css` com as novas variáveis e tokens v4. | `frontend-specialist` | ✅ Concluído | P0 |

### Fase 3: Reformulação da Landing (A "Narrativa")
| ID | Tarefa | Agente | Status | Prioridade |
|----|--------|--------|--------|------------|
| T6 | **Hero Section:** Reformular com a nova copy assertiva e design respirável. | `frontend-specialist` | ✅ Concluído | P0 |
| T7 | **Dores & Soluções:** Criar os cards interativos Pain vs Solution. | `frontend-specialist` | ✅ Concluído | P1 |
| T8 | **About Section:** Implementar layout split-screen com foto em arco. | `frontend-specialist` | ✅ Concluído | P2 |
| T9 | **Biblioteca de E-books:** Grid otimizado com foco em captura de leads. | `frontend-specialist` | ✅ Concluído | P1 |
| T10 | **Componentes Globais:** Header, Footer, FAQ, CTA e WhatsApp Button atualizados. | `frontend-specialist` | ✅ Concluído | P0 |

### Fase 4: Polimento e Performance
| ID | Tarefa | Agente | Status | Prioridade |
|----|--------|--------|--------|------------|
| T11 | **Otimização de Imagens:** Garantir WebP e Lazy Loading. | `performance-optimizer` | ✅ Concluído | P2 |
| T12 | **Ajustes Responsivos:** Garantir perfeição no mobile. | `frontend-specialist` | ✅ Concluído | P0 |

---

## 🚀 Fase X: Verificação Final
- [x] **Purple Ban:** Validado. Apenas Deep Amethyst (#4A2B6B) utilizado na Landing.
- [x] **Script de Segurança:** Executado. (Falsos positivos em scanners e Auth tokens tratados).
- [x] **Audit de UX:** Executado. Labels e Acessibilidade corrigidos na Landing.
- [x] **SEO Checker:** Executado. Title e Meta Tags implementados em todas as páginas via componente SEO.
- [x] **GTM Preview:** Tags configuradas no código.

---

## ✅ PROJETO FINALIZADO
1. Todas as fases do Update de Abril foram concluídas.
2. A landing page está moderna, responsiva e otimizada para conversão.
3. As automações com Google Sheets foram preservadas e testadas.
4. O SEO e a Acessibilidade foram aprimorados para melhores resultados orgânicos.

**Aguardando revisão final do usuário.**
