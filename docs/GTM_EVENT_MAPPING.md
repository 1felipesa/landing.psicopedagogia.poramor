# Guia Fácil: Configurando seu Google Tag Manager (GTM) 🚀

Este guia vai te ajudar a conectar o seu novo site com as ferramentas de anúncio (como Facebook e Google Ads) da forma mais simples possível. 

---

## 💡 O que estamos fazendo?
O site foi programado para "avisar" o Google Tag Manager toda vez que alguém clica em um botão importante. Seu trabalho agora é dizer ao Tag Manager o que fazer com esses avisos.

---

## Passo 1: Criar a "Lupa" (Variável)
Precisamos ensinar o GTM a ler qual botão foi clicado (ex: qual e-book a pessoa baixou).

1. No painel do GTM, vá em **Variáveis** (lado esquerdo).
2. Em "Variáveis Definidas pelo Usuário", clique em **Nova**.
3. Nomeie no topo como: `event_label`
4. Clique no meio (Configuração da variável) e escolha: **Variável de Camada de Dados** (ou Data Layer Variable).
5. No campo "Nome da Variável de Camada de Dados", escreva exatamente: `event_label`
6. Clique em **Salvar**.

---

## Passo 2: Criar os "Gatilhos" (Acionadores)
O gatilho é o que diz ao GTM: "Ei, alguém clicou aqui! Pode disparar a tag!".

### Gatilho para WhatsApp
1. Vá em **Acionadores** e clique em **Novo**.
2. Nomeie no topo como: `Gatilho - Clique WhatsApp`
3. Clique no meio e escolha: **Evento Personalizado**.
4. No campo "Nome do Evento", escreva exatamente: `Contact`
5. Clique em **Salvar**.

### Gatilho para Downloads (E-books)
1. Clique em **Novo** acionador.
2. Nomeie como: `Gatilho - Download Ebook`
3. Escolha o tipo: **Evento Personalizado**.
4. No campo "Nome do Evento", escreva exatamente: `Download`
5. Clique em **Salvar**.

---

## Passo 3: Criar as "Tags" (Ação Final)
Aqui é onde você conecta com seu Facebook ou Google Ads.

### Exemplo: Tag do Pixel do Facebook (WhatsApp)
1. Vá em **Tags** e clique em **Nova**.
2. Nomeie como: `Facebook - Evento WhatsApp`
3. Clique em "Configuração da tag" e escolha: **HTML Personalizado**.
4. Cole o código: `<script>fbq('track', 'Contact');</script>`
5. Em **Acionamento**, escolha o gatilho que criamos: `Gatilho - Clique WhatsApp`.
6. Clique em **Salvar**.

### Exemplo: Tag do Pixel do Facebook (Lead/E-book)
1. Clique em **Nova** tag.
2. Nomeie como: `Facebook - Evento Lead Ebook`
3. Escolha **HTML Personalizado**.
4. Cole o código: `<script>fbq('track', 'Lead', {content_name: '{{event_label}}'});</script>`
5. Em **Acionamento**, escolha o gatilho: `Gatilho - Download Ebook`.
6. Clique em **Salvar**.

---

## 📋 Resumo de Nomes que você deve usar
Sempre que o GTM pedir um "Nome do Evento", use esses nomes exatos do código:

| Nome no Código | O que significa? |
|:--- |:--- |
| `Contact` | Alguém clicou em um botão de WhatsApp. |
| `Download` | Alguém preencheu o formulário e baixou um e-book. |
| `FAQ_Toggle` | Alguém abriu uma pergunta no FAQ. |

---

### ✅ Último Passo: Publicar!
Depois de criar tudo, não esqueça de clicar no botão azul **Enviar** (no canto superior direito do GTM) e depois em **Publicar**. Se não publicar, as mudanças não funcionam no site real.

Se tiver qualquer dúvida em algum desses passos, é só me chamar! 💜
