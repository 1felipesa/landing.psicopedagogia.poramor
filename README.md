# 🧠 Psicopedagogia por Amor — Plataforma de Gestão Clínica & Landing Page

> **Plataforma completa para gestão de atendimentos em Psicopedagogia Clássica e Clínica da Dra. Raiane E. Ferreira + Landing Page Institucional e Comercial.**

---

## 📌 Visão Geral do Projeto

O **Psicopedagogia por Amor** é uma solução digital híbrida desenvolvida para simplificar a jornada dos clientes (pais/responsáveis) e automatizar toda a rotina clínica e financeira da Dra. Raiane E. Ferreira.

O projeto é dividido em dois grandes ecossistemas:
1. **Landing Page Institucional e Comercial (`src/landing`)**: Apresentação dos serviços psicopedagógicos, e-books informativos, FAQ, política de privacidade e botão direto de contato via WhatsApp.
2. **Plataforma SaaS de Gestão Clínica (`src/platform`)**: Sistema privado com controle de acesso baseado em funções (`Admin` vs. `Paciente/Cliente`).

---

## ✨ Principais Funcionalidades

### 👑 Painel da Psicopedagoga (Admin)
- **Agenda Clínica Inteligente (`AdminSchedule.tsx`)**:
  - Visão dupla: **Grade Semanal** e **Visão Programação** (estilo Google Agenda).
  - Sincronização automática bidirecional com a **Google Calendar API** (criação de eventos no Google Calendar com envio de convite por e-mail para o cliente).
  - Filtro por modalidade (Presencial vs. Online).
  - Novo agendamento, reagendamento e cancelamento com limpeza automática de cobranças pendentes vinculadas.
- **Gestão de Pacientes & Prontuário (`PatientDetail.tsx` & `AdminPatients.tsx`)**:
  - Ficha cadastral completa com cálculo automático de idade e ano escolar da criança.
  - **Diário de Bordo / Evoluções Clínicas (`PatientEvolutions.tsx`)**: Registro de cada sessão com linha do tempo e alternador de visibilidade (**Público** para o paciente ver ou **Privado** exclusivo da psicopedagoga).
  - **Objetivos Terapêuticos**: Definição de metas com barra de progresso em porcentagem.
- **Gestão de Contratos Oficiais**:
  - Envio e substituição do modelo de contrato em PDF/Word.
  - Recebimento de contrato assinado enviado pelo paciente.
  - **Botão de Ação Direta**: `Marcar como Entregue em Mãos (Impresso)` para clientes que trazem o contrato assinado presencialmente na 1ª sessão.
- **Gestão de Pré-Anamnese**:
  - Visualização das respostas fornecidas pelos responsáveis nas 5 etapas da Pré-Anamnese.
  - **Ação de Reset**: Exclusão da pré-anamnese preenchida e solicitação de novo preenchimento pelo cliente com notificação instantânea.
- **Emissão de Quitação Financeira em PDF**:
  - Gerador automático de **Declaração de Quitação Financeira em PDF** via `jspdf` + `html2canvas`, salvo automaticamente na aba de documentos do paciente.
- **Gestão Financeira (`AdminFinancial.tsx`)**:
  - Métricas de faturamento mensal, faturas pendentes, pagas e vencidas.
  - Controle de cobranças por paciente.

### 👤 Portal do Paciente / Cliente (`src/platform/views/patient`)
- **Dashboard Principal (`PatientDashboard.tsx`)**:
  - Alerta dinâmico de ações pendentes (Assinatura de Contrato e Pré-Anamnese).
  - Atalhos rápidos para visualização das sessões agendadas, evoluções públicas e biblioteca.
- **Formulário de Pré-Anamnese (`AnamnesisForm.tsx`)**:
  - Formulário didático em 5 etapas (Dados Pessoais, Queixa Principal, Histórico Escolar, Desenvolvimento/Saúde e Dinâmica Familiar).
  - Indicador visual de progresso e salvamento seguro no Firebase Firestore.
- **Área de Documentos & Contrato (`PatientReports.tsx`)**:
  - Download do modelo de contrato enviado pela Dra. Raiane.
  - Orientação didática em 3 opções para assinatura:
    1. *Opção 1*: Foto / Scan da assinatura a próprio punho.
    2. *Opção 2*: Assinatura Digital gratuita via **Gov.br**.
    3. *Opção 3*: Entrega impressa em mãos na 1ª sessão clínica.
  - Envio de contrato assinado em PDF, JPG ou PNG.
- **Biblioteca Digital (`PatientLibrary.tsx`)**:
  - Acesso a e-books, guias e materiais educativos disponibilizados para a família.
- **Histórico Financeiro (`PatientFinancial.tsx`)**:
  - Visualização de recibos e cobranças das sessões.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia / Biblioteca |
|---|---|
| **Core Front-end** | React 18 + TypeScript + Vite |
| **Estilização** | TailwindCSS v4 + CSS Variables (Design System M3) |
| **Autenticação** | Firebase Auth (Email/Senha com suporte a reset de senha) |
| **Banco de Dados** | Firebase Firestore |
| **Storage de Arquivos** | Firebase Storage (Documentos, fotos e PDFs dos contratos) |
| **Integração Externa** | Google Calendar API (Google Cloud OAuth 2.0 Client ID) |
| **Geração de PDF** | `jspdf` + `html2canvas` |
| **Ícones & UI** | Lucide React |

---

## 🚀 Como Executar o Projeto Localmente

### Requisitos Prévios
- **Node.js**: Versão 18.x ou superior
- **npm**: Versão 9.x ou superior

### Passo a Passo

1. **Clonar o Repositório**:
   ```bash
   git clone https://github.com/1felipesa/landing.psicopedagogia.poramor.git
   cd landing.psicopedagogia.poramor
   ```

2. **Instalar as Dependências**:
   ```bash
   npm install
   ```

3. **Configurar as Variáveis de Ambiente (`.env`)**:
   Crie um arquivo `.env` na raiz do projeto com base no `env.example`:
   ```env
   VITE_FIREBASE_API_KEY=seu_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   VITE_GOOGLE_CLIENT_ID=seu_google_oauth_client_id.apps.googleusercontent.com
   ```

4. **Iniciar o Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse a aplicação em `http://localhost:5173`.

5. **Testar o Build de Produção**:
   ```bash
   npm run build
   ```

---

## 📁 Estrutura de Pastas

```
PSICO LANDING NOVA/
├── .agent/                    # Configurações de agentes, skills e workflows
├── docs/                      # Documentação auxiliar e mapeamentos de eventos (GTM)
├── public/                    # Assets estáticos públicos (favicons, imagens estáticas)
├── src/
│   ├── assets/                # Imagens otimizadas (fotos de perfil, hero banner)
│   ├── landing/               # Módulos e páginas da Landing Page pública
│   │   ├── components/        # Hero, Serviços, Sobre, Depoimentos, E-books, Footer
│   │   ├── EbooksPage.tsx     # Página de E-books comerciais
│   │   ├── LandingPage.tsx    # Página Principal Comercial
│   │   └── PrivacyPage.tsx   # Política de Privacidade (LGPD)
│   └── platform/              # Módulos da Plataforma SaaS Privada
│       ├── components/        # Componentes reutilizáveis (Sidebar, Header, Avatares, Modais)
│       ├── context/           # Contextos Globais (AuthContext, ThemeContext, ToastContext)
│       ├── hooks/             # Custom Hooks (useAuth, useTheme, etc.)
│       ├── lib/               # Clientes e utilitários (firebase.ts, googleCalendar.ts, documents.ts)
│       ├── views/
│       │   ├── admin/         # Painel da Psicopedagoga (Dashboard, Pacientes, Agenda, Financeiro)
│       │   ├── patient/       # Portal do Cliente (Dashboard, Pré-Anamnese, Relatórios, Biblioteca)
│       │   ├── Login.tsx      # Login unificado
│       │   └── Register.tsx   # Cadastro de novos responsáveis
│       └── types.ts           # Definições de Tipos TypeScript
├── firestore.rules            # Regras de segurança do Firestore
├── storage.rules              # Regras de segurança do Firebase Storage
├── firebase.json              # Configuração de deploy do Firebase
├── vite.config.ts             # Configurações do Vite e plugins
└── package.json               # Dependências do projeto
```

---

## ⚖️ Licença e Direitos Reservados

Desenvolvido para **Dra. Raiane E. Ferreira — Psicopedagogia por Amor**. Todos os direitos reservados.
