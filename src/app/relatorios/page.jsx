'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { TrendingUp, DollarSign, Users, BarChart } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useState, useEffect } from 'react'

export default function Relatorios() {
  const [clients, setClients] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Attempting to fetch clients from /api/clients...')
        const clientsResponse = await fetch('/api/clients', { cache: 'no-store' })
        console.log('Clients fetch response status:', clientsResponse.status)
        if (!clientsResponse.ok) {
          throw new Error(`Clients HTTP error! Status: ${clientsResponse.status}`)
        }
        const clientsData = await clientsResponse.json()
        console.log('Raw clients data from backend:', clientsData)
        if (!Array.isArray(clientsData)) {
          throw new Error('Clients data is not an array')
        }

        console.log('Attempting to fetch campaigns from /api/campaigns...')
        const campaignsResponse = await fetch('/api/campaigns', { cache: 'no-store' })
        console.log('Campaigns fetch response status:', campaignsResponse.status)
        if (!campaignsResponse.ok) {
          throw new Error(`Campaigns HTTP error! Status: ${campaignsResponse.status}`)
        }
        const campaignsData = await campaignsResponse.json()
        console.log('Raw campaigns data from backend:', campaignsData)
        if (!Array.isArray(campaignsData)) {
          throw new Error('Campaigns data is not an array')
        }

        setClients(clientsData)
        setCampaigns(campaignsData)
        setLoading(false)
      } catch (error) {
        console.error('Fetch error details:', error)
        setError(`Erro ao carregar os dados: ${error.message}. Verifique o console para mais detalhes.`)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="min-h-screen ml-14 p-4 md:p-6">Carregando...</div>
  }

  if (error) {
    return <div className="min-h-screen ml-14 p-4 md:p-6 text-red-500">{error}</div>
  }

  // Summary metrics
  const totalRevenue = clients.reduce((sum, client) => sum + (client.sales || 0), 0) +
                      campaigns.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0)
  const activeClients = clients.filter((client) => client.status === 'Ativo').length
  const activeCampaigns = campaigns.filter((campaign) => campaign.status === 'Active').length
  const teamSize = 6 // Placeholder; fetch from Members page if dynamic

  // Aggregate revenue data
  const revenueChartData = [
    { month: 'Jan', clientSales: 0, campaignRevenue: 0 },
    { month: 'Feb', clientSales: 0, campaignRevenue: 0 },
    { month: 'Mar', clientSales: 0, campaignRevenue: 0 },
    { month: 'Apr', clientSales: 0, campaignRevenue: 0 },
    { month: 'May', clientSales: 0, campaignRevenue: 0 },
    { month: 'Jun', clientSales: 0, campaignRevenue: 0 },
  ]

  clients.forEach((client) => {
    if (client.revenueData) {
      client.revenueData.forEach((data) => {
        const monthIndex = revenueChartData.findIndex((m) => m.month === data.month)
        if (monthIndex !== -1) {
          revenueChartData[monthIndex].clientSales += data.revenue || data.sales || 0
        }
      })
    }
  })

  campaigns.forEach((campaign) => {
    if (campaign.revenueData) {
      campaign.revenueData.forEach((data) => {
        const monthIndex = revenueChartData.findIndex((m) => m.month === data.month)
        if (monthIndex !== -1) {
          revenueChartData[monthIndex].campaignRevenue += data.revenue || 0
        }
      })
    }
  })

  // Aggregate performance data
  const performanceChartData = [
    { month: 'Jan', conversionRate: 0, growthRate: 0 },
    { month: 'Feb', conversionRate: 0, growthRate: 0 },
    { month: 'Mar', conversionRate: 0, growthRate: 0 },
    { month: 'Apr', conversionRate: 0, growthRate: 0 },
    { month: 'May', conversionRate: 0, growthRate: 0 },
    { month: 'Jun', conversionRate: 0, growthRate: 0 },
  ]

  campaigns.forEach((campaign) => {
    if (campaign.conversionData) {
      campaign.conversionData.forEach((data) => {
        const monthIndex = performanceChartData.findIndex((m) => m.month === data.month)
        if (monthIndex !== -1) {
          performanceChartData[monthIndex].conversionRate += (data.conversion || 0) / (campaigns.filter(c => c.conversionData).length || 1)
        }
      })
    }
  })

  clients.forEach((client) => {
    if (client.growthData) {
      client.growthData.forEach((data) => {
        const monthIndex = performanceChartData.findIndex((m) => m.month === data.month)
        if (monthIndex !== -1) {
          performanceChartData[monthIndex].growthRate += (data.growth || 0) / (clients.filter(c => c.growthData).length || 1)
        }
      })
    }
  })

  // Generate report data dynamically
  const reportData = clients.map((client, index) => ({
    client: client.name,
    campaign: campaigns[index]?.name || 'N/A',
    totalSales: client.totalSales || client.sales || 0,
    revenue: campaigns[index]?.revenue || 0,
    status: client.status || 'N/A',
  })).filter(report => report.campaign !== 'N/A') // Ensure valid pairings

  const chartConfig = {
    clientRevenue: {
      label: 'Client Sales',
      color: '#2563eb',
    },
    campaignRevenue: {
      label: 'Campaign Revenue',
      color: '#60a5fa',
    },
    conversionRate: {
      label: 'Conversion Rate',
      color: '#10b981',
    },
    growthRate: {
      label: 'Growth Rate',
      color: '#34d399',
    },
  }

  return (
    <div className="min-h-screen ml-14 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="mt-2 text-muted-foreground">
            Visão geral consolidada de clientes, campanhas e desempenho.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Receita Total</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString('en-US')}</p>
              <p className="text-sm text-muted-foreground">Clientes + Campanhas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Clientes Ativos</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeClients}</p>
              <p className="text-sm text-muted-foreground">Clientes ativos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campanhas Ativas</CardTitle>
              <BarChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{activeCampaigns}</p>
              <p className="text-sm text-muted-foreground">Campanhas em andamento</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tamanho da Equipe</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{teamSize}</p>
              <p className="text-sm text-muted-foreground">Membros da equipe</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6">
          {/* Revenue Overview Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Visão Geral da Receita</CardTitle>
              <p className="text-sm text-muted-foreground">
                Receita de clientes e campanhas nos últimos 6 meses
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={revenueChartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillClientSales" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig.clientRevenue.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.clientRevenue.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillCampaignRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig.campaignRevenue.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.campaignRevenue.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="clientSales"
                    type="natural"
                    fill="url(#fillClientSales)"
                    fillOpacity={0.4}
                    stroke={chartConfig.clientRevenue.color}
                    stackId="a"
                  />
                  <Area
                    dataKey="campaignRevenue"
                    type="natural"
                    fill="url(#fillCampaignRevenue)"
                    fillOpacity={0.4}
                    stroke={chartConfig.campaignRevenue.color}
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Métricas de Performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Taxas de conversão e crescimento nos últimos 6 meses
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={performanceChartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillConversionRate" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig.conversionRate.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.conversionRate.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillGrowthRate" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={chartConfig.growthRate.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={chartConfig.growthRate.color}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="conversionRate"
                    type="natural"
                    fill="url(#fillConversionRate)"
                    fillOpacity={0.4}
                    stroke={chartConfig.conversionRate.color}
                    stackId="a"
                  />
                  <Area
                    dataKey="growthRate"
                    type="natural"
                    fill="url(#fillGrowthRate)"
                    fillOpacity={0.4}
                    stroke={chartConfig.growthRate.color}
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Summary Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Resumo de Clientes e Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Vendas Totais</TableHead>
                  <TableHead>Receita da Campanha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map((report, index) => (
                  <TableRow key={`report-${index}`}>
                    <TableCell>{report.client}</TableCell>
                    <TableCell>{report.campaign}</TableCell>
                    <TableCell>${report.totalSales.toLocaleString('en-US')}</TableCell>
                    <TableCell>${report.revenue.toLocaleString('en-US')}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          report.status === 'Ativo' || report.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                        )}
                      >
                        {report.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Ver Detalhamento
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}