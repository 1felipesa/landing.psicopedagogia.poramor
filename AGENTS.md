# 🤖 AGENTS.md — Guia de Instruções para Modelos de IA e Assistentes Coding Agents

> **Este arquivo contém convenções, regras de código, mapeamento de rotas e protocolos operacionais para agentes de IA (como Antigravity, Claude, ChatGPT e Copilot) atuarem com máxima eficiência neste repositório.**

---

## 🎯 Regras Globais de Comportamento

1. **Idioma**: Responda sempre no idioma do usuário (Português do Brasil), mantendo comentários de código, nomes de variáveis e commits em Inglês ou Português padrão do projeto.
2. **Nenhuma Alteração de Comportamento Não Solicitada**: Preserve a lógica de negócios existente e os contratos das APIs/interfaces.
3. **Verificação Empírica Obrigatória**: NUNCA declare uma tarefa como concluída sem antes rodar o comando de compilação:
   ```bash
   npm run build
   ```
4. **Respeito ao Design System (M3)**: Não utilize cores pretas ou cinzas hardcoded (como `bg-slate-800` ou `bg-slate-900` sem fallback claro). Use sempre os tokens semânticos:
   - `bg-surface`, `bg-surface-variant`, `text-on-surface`, `text-on-surface-variant`, `bg-primary`, `text-primary`.

---

## 📂 Mapeamento de Rotas e Módulos Principais

| Rota / Arquivo | Papel do Módulo | Descrição do Componente |
|---|---|---|
| `src/landing/LandingPage.tsx` | Público | Página inicial comercial e institucional da Dra. Raiane |
| `src/landing/EbooksPage.tsx` | Público | Vitrine e venda de e-books educativos |
| `src/landing/PrivacyPage.tsx` | Público | Política de Privacidade e conformidade LGPD |
| `src/platform/views/Login.tsx` | Autenticação | Tela unificada de login com suporte a redirecionamento pós-login por role |
| `src/platform/views/Register.tsx` | Autenticação | Cadastro de novos clientes/responsáveis |
| `src/platform/views/admin/AdminDashboard.tsx` | Admin | Visão geral da clínica (métricas, próximos atendimentos, pendências) |
| `src/platform/views/admin/AdminSchedule.tsx` | Admin | Agenda clínica com suporte a visão Semanal e Programação + Google Calendar API |
| `src/platform/views/admin/AdminPatients.tsx` | Admin | Lista de pacientes com filtros, busca e atalhos de prontuário |
| `src/platform/views/admin/PatientDetail.tsx` | Admin | Ficha do paciente: Cadastro, Evoluções Clínicas, Objetivos Terapêuticos e Contratos |
| `src/platform/views/patient/PatientDashboard.tsx` | Paciente | Painel do cliente com banners de ações pendentes |
| `src/platform/views/patient/AnamnesisForm.tsx` | Paciente | Formulário interativo de Pré-Anamnese em 5 etapas |
| `src/platform/views/patient/PatientReports.tsx` | Paciente | Área de contratos e documentos (download e envio do assinado) |

---

## 🗄️ Regras do Firebase & Consultas Firestore

1. **Ordenação em Memória**: Para evitar erros de índice composto não criado no Firestore (`FirebaseError: The query requires an index`), ordene coleções com múltiplos filtros diretamente no código TypeScript:
   ```typescript
   // Exemplo de ordenação segura em memória pós-fetch:
   docsData.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
   ```
2. **Atualização de Regras de Segurança**:
   Ao criar ou alterar coleções no Firestore ou subpastas no Storage, atualize sempre `firestore.rules` e `storage.rules` e execute o deploy via Firebase CLI:
   ```bash
   npx firebase-tools deploy --only firestore:rules,storage:rules --project psico-landing-nova
   ```

---

## 💻 Protocolo de Testes e Validação do Agente

Antes de concluir qualquer turno de desenvolvimento, o agente DEVE:
1. Rodar `npm run build` na raiz do projeto.
2. Garantir que a compilação do Vite retornou `built in X.XXs` com **0 erros**.
3. Se houver alterações em regras de segurança ou backend, testar a publicação das regras.
