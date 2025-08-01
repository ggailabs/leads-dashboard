# Exemplo de Integração com API Baileys

Este documento explica como integrar seu dashboard com sua API Baileys existente na VPS.

## 1. Configurar Variáveis de Ambiente

No arquivo `.env` do seu projeto:

```env
# URL da sua API Baileys na VPS
BAILEYS_WEBHOOK_URL=http://sua-vps:3000/api

# Chave de API da sua instância Baileys
BAILEYS_API_KEY=sua-chave-api-secreta

# ID da sessão do WhatsApp
BAILEYS_SESSION_ID=minha-sessao-whatsapp
```

## 2. Configurar Webhook na sua API Baileys

Você precisa configurar sua API Baileys para enviar webhooks para o dashboard sempre que receber uma nova mensagem.

### Exemplo de configuração no seu servidor Baileys:

```javascript
// No seu servidor Baileys (VPS)
const express = require('express');
const { makeWASocket, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');

const app = express();
app.use(express.json());

// Webhook para enviar mensagens para o dashboard
app.post('/webhook', async (req, res) => {
  try {
    const { from, message, messageType, senderName, timestamp } = req.body;
    
    // Enviar para o dashboard
    const response = await fetch('http://seu-dashboard:3000/api/webhook/whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        message,
        messageType,
        senderName,
        timestamp
      })
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
    res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

// Quando receber uma mensagem do WhatsApp
sock.ev.on('messages.upsert', async ({ messages }) => {
  const message = messages[0];
  if (!message.message) return;

  const from = message.key.remoteJid;
  const text = message.message.conversation || 
               message.message.extendedTextMessage?.text || 
               'Mídia recebida';

  // Enviar webhook para o dashboard
  await fetch('http://sua-vps:3000/webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      message: text,
      messageType: 'text',
      senderName: message.pushName,
      timestamp: new Date().toISOString()
    })
  });
});

app.listen(3000, () => {
  console.log('Servidor Baileys rodando na porta 3000');
});
```

## 3. Endpoints da API Baileys do Dashboard

Seu dashboard já possui endpoints para interagir com sua API Baileys:

### Verificar Status
```bash
GET /api/baileys?action=status
```

### Conectar ao WhatsApp
```bash
POST /api/baileys
{
  "action": "connect"
}
```

### Obter QR Code
```bash
GET /api/baileys?action=qr
```

### Enviar Mensagem
```bash
POST /api/baileys
{
  "action": "send",
  "to": "+5511999999999",
  "message": "Olá! Esta é uma mensagem automática."
}
```

## 4. Webhook para Receber Mensagens

Seu dashboard possui um endpoint para receber mensagens do WhatsApp:

```bash
POST /api/webhook/whatsapp
Content-Type: application/json

{
  "from": "5511999999999",
  "message": "Olá, tenho interesse no seu produto!",
  "messageType": "text",
  "senderName": "João Silva",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

## 5. Fluxo de Integração Completo

1. **Configurar Ambiente**:
   - Setar variáveis de ambiente no dashboard
   - Configurar sua API Baileys na VPS

2. **Conectar WhatsApp**:
   - Acessar `/whatsapp` no dashboard
   - Gerar QR Code e escanear com o WhatsApp
   - Verificar status da conexão

3. **Receber Mensagens**:
   - Sua API Baileys recebe mensagem do WhatsApp
   - Envia webhook para o dashboard
   - Dashboard cria/atualiza lead automaticamente
   - Interface atualiza em tempo real via WebSocket

4. **Gerenciar Leads**:
   - Visualizar leads no dashboard
   - Alterar status dos leads
   - Enviar respostas via WhatsApp

## 6. Testar a Integração

Use a página de configuração (`/whatsapp`) para:

- Verificar status da conexão
- Gerar QR Code para conexão
- Enviar mensagens de teste
- Visualizar informações do webhook

## 7. Segurança

Recomendações de segurança:

1. **Use HTTPS** em produção
2. **Proteja sua API Key** - não exponha em código cliente
3. **Valide origem dos webhooks** - verifique se as requisições vêm da sua VPS
4. **Limite taxa de requisições** para evitar abusos
5. **Use variáveis de ambiente** para dados sensíveis

## 8. Monitoramento

Monitore sua integração com:

- Logs do dashboard (ver logs do servidor Next.js)
- Logs da sua API Baileys na VPS
- Status da conexão WhatsApp na página de configuração
- Notificações de erro no dashboard

Com essa configuração, seu dashboard estará completamente integrado com sua API Baileys existente!