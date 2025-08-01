"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Zap, Plus, Edit, Trash2, Play, Pause, CheckCircle, Clock, XCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface AICampaign {
  id: string;
  name: string;
  description?: string;
  providerId: string;
  agentId: string;
  message: string;
  status: "DRAFT" | "SCHEDULED" | "RUNNING" | "PAUSED" | "COMPLETED" | "FAILED";
  targetLeads: number;
  sentCount: number;
  deliveredCount: number;
  repliedCount: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  provider: {
    id: string;
    name: string;
  };
  agent: {
    id: string;
    name: string;
  };
}

interface AIProvider {
  id: string;
  name: string;
}

interface AIAgent {
  id: string;
  name: string;
  providerId: string;
}

export default function AICampaignsPage() {
  const [campaigns, setCampaigns] = useState<AICampaign[]>([]);
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<AICampaign | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    providerId: "",
    agentId: "",
    message: "",
    status: "DRAFT" as const,
    targetLeads: 0,
    scheduledAt: "",
  });

  useEffect(() => {
    fetchCampaigns();
    fetchProviders();
    fetchAgents();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/ai-campaigns");
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
      toast.error("Erro ao carregar campanhas de IA");
    } finally {
      setLoading(false);
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

  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/ai-agents");
      const data = await response.json();
      setAgents(data.filter(a => a.isActive));
    } catch (error) {
      console.error("Erro ao buscar agentes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCampaign ? `/api/ai-campaigns/${editingCampaign.id}` : "/api/ai-campaigns";
      const method = editingCampaign ? "PUT" : "POST";
      
      const payload = {
        ...formData,
        scheduledAt: formData.scheduledAt ? new Date(formData.scheduledAt) : null,
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(editingCampaign ? "Campanha atualizada!" : "Campanha criada!");
        fetchCampaigns();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error("Erro ao salvar campanha");
      }
    } catch (error) {
      console.error("Erro ao salvar campanha:", error);
      toast.error("Erro ao salvar campanha");
    }
  };

  const handleEdit = (campaign: AICampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || "",
      providerId: campaign.providerId,
      agentId: campaign.agentId,
      message: campaign.message,
      status: campaign.status,
      targetLeads: campaign.targetLeads,
      scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta campanha?")) return;

    try {
      const response = await fetch(`/api/ai-campaigns/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Campanha excluída!");
        fetchCampaigns();
      } else {
        toast.error("Erro ao excluir campanha");
      }
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
      toast.error("Erro ao excluir campanha");
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/ai-campaigns/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success("Status da campanha atualizado!");
        fetchCampaigns();
      } else {
        toast.error("Erro ao atualizar status");
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const resetForm = () => {
    setEditingCampaign(null);
    setFormData({
      name: "",
      description: "",
      providerId: "",
      agentId: "",
      message: "",
      status: "DRAFT",
      targetLeads: 0,
      scheduledAt: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { label: "Rascunho", variant: "secondary" as const, icon: Edit },
      SCHEDULED: { label: "Agendado", variant: "outline" as const, icon: Clock },
      RUNNING: { label: "Executando", variant: "default" as const, icon: Play },
      PAUSED: { label: "Pausado", variant: "secondary" as const, icon: Pause },
      COMPLETED: { label: "Concluído", variant: "default" as const, icon: CheckCircle },
      FAILED: { label: "Falhou", variant: "destructive" as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campanhas de IA</h1>
          <p className="text-muted-foreground">
            Crie e gerencie campanhas automatizadas com inteligência artificial
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Campanha
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? "Editar Campanha" : "Nova Campanha de IA"}
              </DialogTitle>
              <DialogDescription>
                Configure uma nova campanha automatizada com inteligência artificial
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Campanha</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Campanha de Vendas"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetLeads">Leads Alvo</Label>
                  <Input
                    id="targetLeads"
                    type="number"
                    min="0"
                    value={formData.targetLeads}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetLeads: parseInt(e.target.value) }))}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da campanha"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="providerId">Provedor de IA</Label>
                  <Select 
                    value={formData.providerId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, providerId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o provedor" />
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

                <div className="space-y-2">
                  <Label htmlFor="agentId">Agente de IA</Label>
                  <Select 
                    value={formData.agentId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, agentId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o agente" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents
                        .filter(agent => !formData.providerId || agent.providerId === formData.providerId)
                        .map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem Base</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Olá {nome}! Temos uma oferta especial para você..."
                  className="min-h-[100px]"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{nome}"} para personalizar com o nome do lead
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Agendar para (opcional)</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Rascunho</SelectItem>
                      <SelectItem value="SCHEDULED">Agendado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCampaign ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Campanhas</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">Campanhas criadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter(c => c.status === "RUNNING" || c.status === "SCHEDULED").length}
            </div>
            <p className="text-xs text-muted-foreground">Em execução</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Enviadas</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total de envios</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0) > 0
                ? Math.round((campaigns.reduce((sum, campaign) => sum + campaign.repliedCount, 0) / 
                   campaigns.reduce((sum, campaign) => sum + campaign.sentCount, 0)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Média de respostas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campanhas Configuradas</CardTitle>
          <CardDescription>
            Lista de todas as campanhas de IA configuradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campanha</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Agendamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        {campaign.name}
                      </div>
                      {campaign.description && (
                        <div className="text-sm text-muted-foreground">
                          {campaign.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.agent.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.provider.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(campaign.status)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{campaign.sentCount} enviados</span>
                        <span>{campaign.repliedCount} respostas</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ 
                            width: `${campaign.targetLeads > 0 ? (campaign.sentCount / campaign.targetLeads) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {campaign.scheduledAt ? (
                      <div className="text-sm">
                        {new Date(campaign.scheduledAt).toLocaleDateString("pt-BR")}
                        <div className="text-muted-foreground">
                          {new Date(campaign.scheduledAt).toLocaleTimeString("pt-BR", { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Não agendado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {campaign.status === "DRAFT" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(campaign.id, "SCHEDULED")}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {campaign.status === "SCHEDULED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(campaign.id, "RUNNING")}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {campaign.status === "RUNNING" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(campaign.id, "PAUSED")}
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      )}
                      {campaign.status === "PAUSED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(campaign.id, "RUNNING")}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}