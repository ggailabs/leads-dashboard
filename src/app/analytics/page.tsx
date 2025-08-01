"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, MessageSquare, Phone, Target, CheckCircle } from "lucide-react";

interface AnalyticsData {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  closedWonLeads: number;
  totalMessages: number;
  responseRate: number;
  averageResponseTime: number;
  conversionRate: number;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    qualifiedLeads: 0,
    closedWonLeads: 0,
    totalMessages: 0,
    responseRate: 0,
    averageResponseTime: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Simulando dados - em produção, você buscaria de uma API real
      const mockData: AnalyticsData = {
        totalLeads: 156,
        newLeads: 23,
        contactedLeads: 45,
        qualifiedLeads: 34,
        closedWonLeads: 12,
        totalMessages: 892,
        responseRate: 78,
        averageResponseTime: 2.5,
        conversionRate: 8.5,
      };
      
      setAnalytics(mockData);
    } catch (error) {
      console.error("Erro ao buscar analytics:", error);
    } finally {
      setLoading(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Análise detalhada do desempenho do seu funil de vendas
        </p>
      </div>

      {/* Cards Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.newLeads} novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.closedWonLeads} negócios fechados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resposta</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.responseRate}%</div>
            <p className="text-xs text-muted-foreground">
              Média de respostas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageResponseTime}h</div>
            <p className="text-xs text-muted-foreground">
              Tempo médio de resposta
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funil de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Vendas</CardTitle>
          <CardDescription>
            Visualização do progresso dos leads pelo funil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Novos</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{analytics.newLeads}</span>
                <Badge variant="secondary">{Math.round((analytics.newLeads / analytics.totalLeads) * 100)}%</Badge>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${(analytics.newLeads / analytics.totalLeads) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Contactados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{analytics.contactedLeads}</span>
                <Badge variant="secondary">{Math.round((analytics.contactedLeads / analytics.totalLeads) * 100)}%</Badge>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${(analytics.contactedLeads / analytics.totalLeads) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Qualificados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{analytics.qualifiedLeads}</span>
                <Badge variant="secondary">{Math.round((analytics.qualifiedLeads / analytics.totalLeads) * 100)}%</Badge>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${(analytics.qualifiedLeads / analytics.totalLeads) * 100}%` }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium">Fechados</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{analytics.closedWonLeads}</span>
                <Badge variant="default">{Math.round((analytics.closedWonLeads / analytics.totalLeads) * 100)}%</Badge>
              </div>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${(analytics.closedWonLeads / analytics.totalLeads) * 100}%` }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Detalhadas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Engajamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total de Mensagens</span>
              <span className="font-medium">{analytics.totalMessages}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Mensagens por Lead</span>
              <span className="font-medium">
                {analytics.totalLeads > 0 ? (analytics.totalMessages / analytics.totalLeads).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taxa de Resposta</span>
              <Badge variant={analytics.responseRate > 70 ? "default" : "secondary"}>
                {analytics.responseRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Desempenho
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conversão Geral</span>
              <Badge variant={analytics.conversionRate > 5 ? "default" : "secondary"}>
                {analytics.conversionRate}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tempo Médio de Resposta</span>
              <span className="font-medium">{analytics.averageResponseTime} horas</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Leads Qualificados</span>
              <span className="font-medium">{analytics.qualifiedLeads}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Insights e Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium text-green-600">Pontos Fortes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {analytics.responseRate > 70 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Alta taxa de resposta ({analytics.responseRate}%)
                  </li>
                )}
                {analytics.conversionRate > 5 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Boa taxa de conversão ({analytics.conversionRate}%)
                  </li>
                )}
                {analytics.averageResponseTime < 3 && (
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    Tempo de resposta rápido ({analytics.averageResponseTime}h)
                  </li>
                )}
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-orange-600">Oportunidades</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {analytics.responseRate < 80 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Melhorar taxa de resposta
                  </li>
                )}
                {analytics.conversionRate < 10 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Otimizar qualificação de leads
                  </li>
                )}
                {analytics.averageResponseTime > 2 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Reduzir tempo de resposta
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}