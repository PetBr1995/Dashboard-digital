'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Dados recebidos não são um array');
        }
        setClients(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setError(`Erro ao carregar dados: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  if (loading) {
    return <div className="min-h-screen bg-white p-4 md:ml-14 md:p-6">Carregando dados...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 md:ml-14 md:p-6 text-red-500">
        {error}
        <Button onClick={() => window.location.reload()} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Cálculos de métricas
  const totalSales = clients.reduce((sum, client) => sum + (client.sales || 0), 0);
  const averageRealGrowth = (clients.reduce((sum, client) => sum + (client.realGrowth || 0), 0) / (clients.length || 1)).toFixed(1);
  const activeClients = clients.filter(client => client.status === 'Ativo').length;
  const activeCampaigns = clients.filter(client => client.lastCampaign).length;

  // Filtragem
  const filteredClients = clients
    .filter(client => 
      client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'todos' || client.status === statusFilter)
    )
    .slice(0, 5);

  // Dados para gráficos
  const chartData = filteredClients.map((client, index) => ({
    name: client.name || `Cliente-${index}`,
    sales: client.sales || 0,
    realGrowth: client.realGrowth || 0,
    predictedGrowth: client.predictedGrowth || 0,
  }));

  return (
    <div className="min-h-screen bg-white p-4 md:ml-14 md:p-6">
      <h1 className="text-3xl font-bold mb-6">Visão Geral</h1>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalSales.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Crescimento Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRealGrowth}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Campanhas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
            <SelectItem value="Prospecção">Prospecção</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="2 2" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Crescimento Real vs Previsto</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="realGrowth" stroke="#10b981" name="Crescimento Real" />
                <Line type="monotone" dataKey="predictedGrowth" stroke="#f97316" name="Crescimento Previsto" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela Resumida */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vendas (R$)</TableHead>
                <TableHead>Crescimento Real (%)</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client, index) => (
                <TableRow key={client.id || `client-${index}`}>
                  <TableCell>{client.name || 'Desconhecido'}</TableCell>
                  <TableCell>{client.status || 'N/A'}</TableCell>
                  <TableCell>{(client.sales || 0).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{(client.realGrowth || 0).toFixed(1)}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/clientes/${client.id}`}>Detalhes</a>
                    </Button>
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
