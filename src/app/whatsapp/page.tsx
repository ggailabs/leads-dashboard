"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Wifi, WifiOff, RefreshCw, QrCode, MessageSquare } from "lucide-react";

interface ConnectionStatus {
  connected: boolean;
  phone?: string;
  battery?: number;
}

export default function WhatsAppConfig() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch("/api/baileys?action=status");
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    }
  };

  const connectToWhatsApp = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/baileys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "connect" }),
      });

      const data = await response.json();
      if (data.connected) {
        setConnectionStatus({ connected: true });
      }
    } catch (error) {
      console.error("Erro ao conectar:", error);
    } finally {
      setLoading(false);
    }
  };

  const getQRCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/baileys?action=qr");
      const data = await response.json();
      setQrCode(data.qrCode);
    } catch (error) {
      console.error("Erro ao obter QR Code:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestMessage = async () => {
    if (!testPhone || !testMessage) return;

    setLoading(true);
    try {
      const response = await fetch("/api/baileys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send",
          to: testPhone,
          message: testMessage,
        }),
      });

      const data = await response.json();
      if (data.sent) {
        alert("Mensagem enviada com sucesso!");
        setTestPhone("");
        setTestMessage("");
      } else {
        alert("Erro ao enviar mensagem");
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Smartphone className="h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuração WhatsApp</h1>
          <p className="text-muted-foreground">Gerencie sua conexão com o WhatsApp Business API</p>
        </div>
      </div>

      <Tabs defaultValue="connection" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="webhook">Webhook</TabsTrigger>
          <TabsTrigger value="test">Testar</TabsTrigger>
        </TabsList>

        <TabsContent value="connection">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {connectionStatus.connected ? (
                    <Wifi className="h-5 w-5 text-green-500" />
                  ) : (
                    <WifiOff className="h-5 w-5 text-red-500" />
                  )}
                  Status da Conexão
                </CardTitle>
                <CardDescription>
                  Verifique o status da sua conexão com o WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge variant={connectionStatus.connected ? "default" : "destructive"}>
                    {connectionStatus.connected ? "Conectado" : "Desconectado"}
                  </Badge>
                </div>
                
                {connectionStatus.connected && (
                  <>
                    {connectionStatus.phone && (
                      <div className="flex items-center justify-between">
                        <span>Número:</span>
                        <span className="font-mono">{connectionStatus.phone}</span>
                      </div>
                    )}
                    {connectionStatus.battery && (
                      <div className="flex items-center justify-between">
                        <span>Bateria:</span>
                        <span>{connectionStatus.battery}%</span>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={checkConnectionStatus} 
                    variant="outline"
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Verificar
                  </Button>
                  
                  {!connectionStatus.connected && (
                    <Button 
                      onClick={connectToWhatsApp} 
                      disabled={loading}
                    >
                      Conectar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code
                </CardTitle>
                <CardDescription>
                  Escaneie o QR Code para conectar seu WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {qrCode ? (
                  <div className="flex justify-center">
                    <img 
                      src={qrCode} 
                      alt="QR Code WhatsApp" 
                      className="border rounded-lg p-2"
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <QrCode className="h-12 w-12 mx-auto mb-2" />
                    <p>Clique em gerar QR Code</p>
                  </div>
                )}
                
                <Button 
                  onClick={getQRCode} 
                  className="w-full"
                  disabled={loading}
                >
                  {qrCode ? "Gerar Novo QR Code" : "Gerar QR Code"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Webhook</CardTitle>
              <CardDescription>
                Configure sua API Baileys para enviar mensagens para este dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  Você precisa configurar sua API Baileys na VPS para enviar webhooks para este endpoint.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label className="text-sm font-medium">URL do Webhook:</label>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  {typeof window !== 'undefined' ? `${window.location.origin}/api/webhook/whatsapp` : '/api/webhook/whatsapp'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Método:</label>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  POST
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Formato do JSON:</label>
                <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">
{`{
  "from": "5511999999999",
  "message": "Olá, tenho interesse!",
  "messageType": "text",
  "senderName": "João Silva",
  "timestamp": "2024-01-01T10:00:00Z"
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Variáveis de Ambiente:</label>
                <div className="bg-muted p-3 rounded-md text-sm space-y-1">
                  <div><code>BAILEYS_WEBHOOK_URL</code>: URL da sua API Baileys</div>
                  <div><code>BAILEYS_API_KEY</code>: Chave de API da sua instância</div>
                  <div><code>BAILEYS_SESSION_ID</code>: ID da sessão do WhatsApp</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Testar Envio de Mensagem</CardTitle>
              <CardDescription>
                Envie uma mensagem de teste para verificar se a conexão está funcionando
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Número (com DDD e +):</label>
                  <Input
                    placeholder="+5511999999999"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensagem:</label>
                  <Input
                    placeholder="Olá! Esta é uma mensagem de teste."
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={sendTestMessage} 
                disabled={!testPhone || !testMessage || loading}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Mensagem de Teste
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}