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
import { Brain, Key, Plus, Edit, Trash2, Settings, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  baseUrl?: string;
  model: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const providerModels = {
  openai: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
  google: ["gemini-pro", "gemini-pro-vision"],
  deepseek: ["deepseek-chat", "deepseek-coder"],
  openrouter: ["openai/gpt-4", "anthropic/claude-3-opus", "google/gemini-pro"],
  custom: ["custom-model"]
};

export default function AIProvidersPage() {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    apiKey: "",
    baseUrl: "",
    model: "",
    isActive: true,
    providerType: "openai"
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/ai-providers");
      const data = await response.json();
      setProviders(data);
    } catch (error) {
      console.error("Erro ao buscar provedores:", error);
      toast.error("Erro ao carregar provedores de IA");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProvider ? `/api/ai-providers/${editingProvider.id}` : "/api/ai-providers";
      const method = editingProvider ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingProvider ? "Provedor atualizado!" : "Provedor criado!");
        fetchProviders();
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast.error("Erro ao salvar provedor");
      }
    } catch (error) {
      console.error("Erro ao salvar provedor:", error);
      toast.error("Erro ao salvar provedor");
    }
  };

  const handleEdit = (provider: AIProvider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      apiKey: provider.apiKey,
      baseUrl: provider.baseUrl || "",
      model: provider.model,
      isActive: provider.isActive,
      providerType: provider.name.toLowerCase().includes("openai") ? "openai" : 
                   provider.name.toLowerCase().includes("claude") ? "anthropic" :
                   provider.name.toLowerCase().includes("gemini") ? "google" :
                   provider.name.toLowerCase().includes("deepseek") ? "deepseek" : "custom"
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este provedor?")) return;

    try {
      const response = await fetch(`/api/ai-providers/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Provedor excluído!");
        fetchProviders();
      } else {
        toast.error("Erro ao excluir provedor");
      }
    } catch (error) {
      console.error("Erro ao excluir provedor:", error);
      toast.error("Erro ao excluir provedor");
    }
  };

  const resetForm = () => {
    setEditingProvider(null);
    setFormData({
      name: "",
      apiKey: "",
      baseUrl: "",
      model: "",
      isActive: true,
      providerType: "openai"
    });
  };

  const handleProviderTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      providerType: type,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      model: providerModels[type as keyof typeof providerModels]?.[0] || ""
    }));
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
          <h1 className="text-3xl font-bold tracking-tight">Provedores de IA</h1>
          <p className="text-muted-foreground">
            Gerencie seus provedores de inteligência artificial e chaves de API
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Provedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProvider ? "Editar Provedor" : "Novo Provedor de IA"}
              </DialogTitle>
              <DialogDescription>
                Configure um novo provedor de inteligência artificial
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="providerType">Tipo de Provedor</Label>
                <Select 
                  value={formData.providerType} 
                  onValueChange={handleProviderTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="deepseek">DeepSeek</SelectItem>
                    <SelectItem value="openrouter">OpenRouter</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do provedor"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">Chave da API</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="sk-..."
                  required
                />
              </div>

              {formData.providerType === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="baseUrl">URL Base (opcional)</Label>
                  <Input
                    id="baseUrl"
                    value={formData.baseUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                    placeholder="https://api.example.com/v1"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Select value={formData.model} onValueChange={(value) => setFormData(prev => ({ ...prev, model: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o modelo" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerModels[formData.providerType as keyof typeof providerModels]?.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Ativo</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingProvider ? "Atualizar" : "Criar"}
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
            <CardTitle className="text-sm font-medium">Total de Provedores</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
            <p className="text-xs text-muted-foreground">Provedores configurados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provedores Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.filter(p => p.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Disponíveis para uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OpenAI</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.filter(p => p.name.toLowerCase().includes("openai")).length}</div>
            <p className="text-xs text-muted-foreground">Provedores OpenAI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outros</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.filter(p => !p.name.toLowerCase().includes("openai")).length}</div>
            <p className="text-xs text-muted-foreground">Outros provedores</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Provedores Configurados</CardTitle>
          <CardDescription>
            Lista de todos os provedores de IA configurados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      <span className="font-medium">{provider.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {provider.model}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.isActive ? "default" : "secondary"}>
                      {provider.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(provider.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(provider)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(provider.id)}
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