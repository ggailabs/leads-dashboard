import { db } from "@/lib/db";

export interface WhatsAppMessage {
  from: string;
  message: string;
  messageType?: "text" | "image" | "video" | "audio" | "document";
  mediaUrl?: string;
  mediaType?: string;
  timestamp?: string;
  senderName?: string;
}

export interface BaileysConfig {
  webhookUrl?: string;
  apiKey?: string;
  sessionId?: string;
}

class BaileysService {
  private config: BaileysConfig;
  private isConnected: boolean = false;

  constructor(config: BaileysConfig = {}) {
    this.config = {
      webhookUrl: config.webhookUrl || process.env.BAILEYS_WEBHOOK_URL,
      apiKey: config.apiKey || process.env.BAILEYS_API_KEY,
      sessionId: config.sessionId || process.env.BAILEYS_SESSION_ID,
    };
  }

  async connect(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.webhookUrl}/connect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          sessionId: this.config.sessionId,
        }),
      });

      if (response.ok) {
        this.isConnected = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erro ao conectar com Baileys:", error);
      return false;
    }
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.webhookUrl}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          sessionId: this.config.sessionId,
          to,
          message,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      return false;
    }
  }

  async processIncomingMessage(messageData: WhatsAppMessage): Promise<void> {
    try {
      const cleanPhone = messageData.from.replace(/\D/g, "");
      
      let lead = await db.lead.findUnique({
        where: { phone: cleanPhone },
      });

      if (!lead) {
        lead = await db.lead.create({
          data: {
            phone: cleanPhone,
            name: messageData.senderName,
            source: "whatsapp",
            status: "NEW",
          },
        });
      }

      await db.whatsAppMessage.create({
        data: {
          leadId: lead.id,
          message: messageData.message,
          direction: "INCOMING",
          mediaUrl: messageData.mediaUrl,
          mediaType: messageData.mediaType,
          timestamp: messageData.timestamp ? new Date(messageData.timestamp) : new Date(),
        },
      });

      await db.lead.update({
        where: { id: lead.id },
        data: {
          lastContact: messageData.timestamp ? new Date(messageData.timestamp) : new Date(),
        },
      });
    } catch (error) {
      console.error("Erro ao processar mensagem recebida:", error);
      throw error;
    }
  }

  async getQRCode(): Promise<string | null> {
    try {
      const response = await fetch(`${this.config.webhookUrl}/qr`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.config.apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.qrCode;
      }

      return null;
    } catch (error) {
      console.error("Erro ao obter QR Code:", error);
      return null;
    }
  }

  async getConnectionStatus(): Promise<{
    connected: boolean;
    phone?: string;
    battery?: number;
  }> {
    try {
      const response = await fetch(`${this.config.webhookUrl}/status`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${this.config.apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          connected: data.connected,
          phone: data.phone,
          battery: data.battery,
        };
      }

      return { connected: false };
    } catch (error) {
      console.error("Erro ao verificar status da conexão:", error);
      return { connected: false };
    }
  }

  isConnectedToWhatsApp(): boolean {
    return this.isConnected;
  }
}

export const baileysService = new BaileysService();