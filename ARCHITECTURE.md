# 🏗️ ARCHITECTURE.md — Documentação Arquitetural do Sistema

> **Visão técnica detalhada da arquitetura, modelagem de dados, regras de segurança e integrações externas da plataforma Psicopedagogia por Amor.**

---

## 📌 1. Visão Geral da Arquitetura

O sistema é construído como uma **Single Page Application (SPA)** moderna utilizando React, TypeScript e Vite, integrada ao ecossistema Serverless do **Google Firebase** (Auth, Firestore, Storage) e à API do **Google Calendar**.

### Diagrama de Arquitetura de Alto Nível (Mermaid)

```mermaid
flowchart TD
    subgraph Client ["Navegador do Cliente / Dispositivo Mobile"]
        LP["Landing Page Pública\n(src/landing)"]
        AUTH_UI["Páginas de Autenticação\nLogin / Registro / Reset"]
        ADMIN_PANEL["Painel da Psicopedagoga\n(role: 'admin')"]
        PATIENT_PANEL["Portal do Cliente\n(role: 'patient')"]
    end

    subgraph Firebase ["Serviços Google Firebase (Backend Serverless)"]
        FB_AUTH["Firebase Authentication\n(Email / Senha)"]
        FIRESTORE[("Firebase Firestore\n(NoSQL Database)")]
        STORAGE[("Firebase Storage\n(Documentos & Contratos PDF)")]
    end

    subgraph External ["APIs de Terceiros"]
        GCAL["Google Calendar API v3\n(OAuth 2.0 Client ID)"]
        GOV_BR["Assinador Digital Gov.br"]
    end

    LP --> AUTH_UI
    AUTH_UI --> FB_AUTH
    FB_AUTH -->|Token JWT & UID| ADMIN_PANEL
    FB_AUTH -->|Token JWT & UID| PATIENT_PANEL

    ADMIN_PANEL <-->|Leitura/Escrita com Regras| FIRESTORE
    ADMIN_PANEL <-->|Upload/Download| STORAGE
    ADMIN_PANEL <-->|OAuth Token / Criar Eventos| GCAL

    PATIENT_PANEL <-->|Leitura/Escrita Restrita| FIRESTORE
    PATIENT_PANEL <-->|Upload Contrato Assinado| STORAGE
    PATIENT_PANEL -.->|Redirecionamento Opcional| GOV_BR
```

---

## 🗄️ 2. Modelagem do Banco de Dados (Firestore NoSQL)

As coleções no Firestore foram estruturadas para garantir desempenho rápido, consultas diretas por `patient_id` e controle de permissão por usuário.

### Schema das Coleções

```mermaid
erDiagram
    PROFILES ||--o{ APPOINTMENTS : "possui"
    PROFILES ||--o{ DOCUMENTS : "possui"
    PROFILES ||--o{ ANAMNESIS : "preenche"
    PROFILES ||--o{ PATIENT_EVOLUTIONS : "possui"
    PROFILES ||--o{ INVOICES : "possui"

    PROFILES {
        string uid PK
        string email
        string full_name
        string role "admin | patient"
        string phone
        string created_at
    }

    APPOINTMENTS {
        string id PK
        string patient_id FK
        string patient_name
        string date "ISO String"
        string status "scheduled | completed | cancelled"
        string type "presencial | online"
        number price
        string notes
        string google_event_id
        string created_at
    }

    DOCUMENTS {
        string id PK
        string patient_id FK
        string title
        string url
        string type "contract_template | signed_contract | report | other"
        number size_bytes
        string storage_path
        string uploaded_by "patient | admin"
        string created_at
    }

    ANAMNESIS {
        string patientId PK
        object step_data "Respostas das Etapas 1 a 5"
        boolean is_completed
        string updated_at
    }

    PATIENT_EVOLUTIONS {
        string id PK
        string patient_id FK
        string content
        boolean is_public "true = visível para paciente"
        string appointment_id
        string created_at
    }

    INVOICES {
        string id PK
        string patient_id FK
        string patient_name
        number amount
        string status "paid | pending | overdue"
        string due_date
        string appointment_id
        string created_at
    }
```

---

## 🛡️ 3. Regras de Segurança (Security Rules)

### Firestore Security Rules (`firestore.rules`)
Garantem que apenas o administrador pode acessar todos os dados, enquanto os pacientes só conseguem ler/escrever registros estritamente vinculados ao seu próprio `UID` (`request.auth.uid`).

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null &&
        get(/databases/$(database)/documents/profiles/$(request.auth.uid)).data.role == 'admin';
    }

    match /profiles/{userId} {
      allow read, write: if request.auth != null && (request.auth.uid == userId || isAdmin());
    }

    match /anamnesis/{patientId} {
      allow read, write: if request.auth != null && (request.auth.uid == patientId || isAdmin());
    }

    match /{collectionName}/{docId} {
      allow read, write: if request.auth != null && (
        isAdmin() ||
        (request.resource != null && request.resource.data.patient_id == request.auth.uid) ||
        (resource != null && resource.data.patient_id == request.auth.uid)
      );
    }
  }
}
```

### Storage Security Rules (`storage.rules`)
Controlam o armazenamento de fotos e PDFs em `patient-documents/{patientId}/*`.

```rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /patient-documents/{patientId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🔄 4. Fluxos de Trabalho Críticos do Sistema

### A. Fluxo de Integração com o Google Calendar API (`src/platform/lib/googleCalendar.ts`)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Dra. Raiane (Admin)
    participant UI as AdminSchedule.tsx
    participant OAuth as Google OAuth 2.0
    participant GCal as Google Calendar API v3
    participant FS as Firestore

    Admin->>UI: Clica em "Conectar Google Calendar"
    UI->>OAuth: Solicita token (scopes: calendar.events)
    OAuth-->>Admin: Exibe popup de consentimento Google
    Admin-->>OAuth: Aprova acesso da conta psicopedagogia.poramor.2026@gmail.com
    OAuth-->>UI: Retorna Access Token
    UI->>GCal: Lista agendas disponíveis (`calendarList.list`)
    UI->>FS: Salva evento no banco e cria no Google Calendar
    GCal-->>Admin: Envia convite de e-mail ao cliente automaticamente
```

### B. Fluxo do Ciclo de Vida de Contratos

```mermaid
stateDiagram-v2
    [*] --> SemContrato
    SemContrato --> TemplateEnviado: Admin envia PDF modelo (contract_template)
    TemplateEnviado --> AssinadoOnline: Paciente faz upload do assinado (signed_contract)
    TemplateEnviado --> EntregueEmMaos: Admin clica "Marcar como Entregue em Mãos (Impresso)"
    AssinadoOnline --> [*]: Banner de pendência somem no portal
    EntregueEmMaos --> [*]: Status de contrato concluído no sistema
```

### C. Fluxo de Reset e Solicitação de Nova Pré-Anamnese

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Dra. Raiane (Admin)
    participant FS as Firestore
    actor Patient as Cliente (Paciente)

    Admin->>FS: Clica em "Excluir e Requisitar Nova Pré-Anamnese"
    FS-->>FS: Remove documento `anamnesis/{patientId}`
    Patient->>FS: Carrega Dashboard ou Relatórios
    FS-->>Patient: Identifica que `anamnesis` não existe mais
    Patient-->>Patient: Reativa o banner "Responder Pré-Anamnese Pendente"
```

---

## 🎨 5. Design System & Temas (Light / Dark Mode)

O projeto adota a especificação do **Material Design 3 (M3)** utilizando classes semânticas do TailwindCSS v4 com suporte total a **Modo Claro** e **Modo Escuro**:

- **`bg-background`**: Fundo geral da página.
- **`bg-surface`**: Fundo dos cartões e contêineres principais.
- **`bg-surface-variant`**: Fundo dos chips, selos e elementos secundários.
- **`text-on-surface`**: Cor primária de texto.
- **`text-on-surface-variant`**: Cor de texto secundária (rótulos e subtítulos).
- **`text-primary` / `bg-primary`**: Tom roxo psicopedagógico oficial da marca.
