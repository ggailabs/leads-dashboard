"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Save, RefreshCw, Database, Bell, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";

interface SettingsData {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  notifications: {
    email: boolean;
    whatsapp: boolean;
    browser: boolean;
  };
  whatsapp: {
    autoReply: boolean;
    welcomeMessage: string;
    businessHours: string;
  };
  ai: {
    defaultProvider: string;
    autoRespond: boolean;
    maxTokens: number;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    siteName: "Leads WhatsApp",
    siteUrl: "https://seu-dominio.com",
    adminEmail: "admin@seu-dominio.com",
    notifications: {
      email: true,
      whatsapp: false,
      browser: true,
    },
    whatsapp: {
      autoReply: false,
      welcomeMessage: "Olá! Como podemos ajudar?",
      businessHours: "09:00-18:00",
    },
    ai: {
      defaultProvider: "",
      autoRespond: false,
      maxTokens: 1000,
    },
  });
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchProviders();
  }, []);

  const fetchSettings = async () => {
    try {
      // Simulando busca de configurações
      // Em produção, você buscaria de uma API real
      const mockSettings: SettingsData = {
        siteName: "Leads WhatsApp",
        siteUrl: "https://seu-dominio.com",
        adminEmail: "admin@seu-dominio.com",
        notifications: {
          email: true,
          whatsapp: false,
          browser: true,
        },
        whatsapp: {
          autoReply: false,
          welcomeMessage: "Olá! Como podemos ajudar?",
          businessHours: "09:00-18:00",
        },
        ai: {
          defaultProvider: "",
          autoRespond: false,
          maxTokens: 1000,
        },
      };
      setSettings(mockSettings);
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/ai-providers");
      const data = await response.json();
      setProviders(data.filter(p => p.isActive));
    } catch (error) {
      console.error("Erro ao buscar provedores:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulando salvamento das configurações
      // Em produção, você enviaria para uma API real
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section] as any,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema
          </p>
        </div>
        
        <Button onClick={handleSubmit} disabled={loading} className="gap-2">
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar Configurações
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Configurações Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações Gerais
            </CardTitle>
            <CardDescription>
              Informações básicas do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteUrl">URL do Site</Label>
                <Input
                  id="siteUrl"
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email do Administrador</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações de Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure como você deseja receber notificações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações importantes no seu email
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateSettings("notifications", "email", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por WhatsApp</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas no WhatsApp
                </p>
              </div>
              <Switch
                checked={settings.notifications.whatsapp}
                onCheckedChange={(checked) => updateSettings("notifications", "whatsapp", checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações do Navegador</Label>
                <p className="text-sm text-muted-foreground">
                  Notificações push no navegador
                </p>
              </div>
              <Switch
                checked={settings.notifications.browser}
                onCheckedChange={(checked) => updateSettings("notifications", "browser", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurações do WhatsApp */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              WhatsApp
            </CardTitle>
            <CardDescription>
              Configure o comportamento do WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resposta Automática</Label>
                <p className="text-sm text-muted-foreground">
                  Ative respostas automáticas para novas mensagens
                </p>
              </div>
              <Switch
                checked={settings.whatsapp.autoReply}
                onCheckedChange={(checked) => updateSettings("whatsapp", "autoReply", checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Mensagem de Boas-vindas</Label>
              <Textarea
                id="welcomeMessage"
                value={settings.whatsapp.welcomeMessage}
                onChange={(e) => updateSettings("whatsapp", "welcomeMessage", e.target.value)}
                placeholder="Mensagem automática para novos contatos"
                className="min-h-[80px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessHours">Horário de Funcionamento</Label>
              <Input
                id="businessHours"
                value={settings.whatsapp.businessHours}
                onChange={(e) => updateSettings("whatsapp", "businessHours", e.target.value)}
                placeholder="09:00-18:00"
              />
              <p className="text-xs text-muted-foreground">
                Formato: HH:MM-HH:MM (ex: 09:00-18:00)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Configurações de IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Inteligência Artificial
            </CardTitle>
            <CardDescription>
              Configure as opções de inteligência artificial
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultProvider">Provedor Padrão</Label>
              <Select 
                value={settings.ai.defaultProvider} 
                onValueChange={(value) => updateSettings("ai", "defaultProvider", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o provedor padrão" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Resposta Automática com IA</Label>
                <p className="text-sm text-muted-foreground">
                  Use IA para responder mensagens automaticamente
                </p>
              </div>
              <Switch
                checked={settings.ai.autoRespond}
                onCheckedChange={(checked) => updateSettings("ai", "autoRespond", checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxTokens">Máximo de Tokens</Label>
              <Input
                id="maxTokens"
                type="number"
                min="100"
                max="8000"
                value={settings.ai.maxTokens}
                onChange={(e) => updateSettings("ai", "maxTokens", parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Limite máximo de tokens para respostas da IA
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}