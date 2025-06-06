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
import { TrendingUp, DollarSign, BarChart } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useState, useEffect } from 'react'

export default function Campanhas() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        console.log('Attempting to fetch campaigns from /api/campaigns...')
        const response = await fetch('/api/campaigns', { cache: 'no-store' })
        console.log('Fetch response status:', response.status)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        console.log('Raw data from backend:', data)
        if (!Array.isArray(data)) {
          throw new Error('Data is not an array')
        }
        setCampaigns(data)
        setLoading(false)
      } catch (error) {
        console.error('Fetch error details:', error)
        setError(`Erro ao carregar as campanhas: ${error.message}. Verifique o console para mais detalhes.`)
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [])

  if (loading) {
    return <div className="min-h-screen bg-white p-4 md:ml-14 md:p-6">Carregando...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-white p-4 md:ml-14 md:p-6 text-red-500">{error}</div>
  }

  // Calculate summary metrics
  const totalCampaigns = campaigns.length
  const totalRevenue = campaigns.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0)
  const averageConversionRate = (
    campaigns.reduce((sum, campaign) => sum + (campaign.conversionRate || 0), 0) / (totalCampaigns || 1)
  ).toFixed(2)

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#2563eb',
    },
    conversion: {
      label: 'Conversion Rate',
      color: '#60a5fa',
    },
  }

  return (
    <div className="min-h-screen bg-white p-4 md:ml-14 md:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Campanhas</h1>
          <p className="mt-2 text-muted-foreground">
            Análise de desempenho das campanhas de marketing e vendas.
          </p>
        </header>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Total de Campanhas</CardTitle>
              <BarChart className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalCampaigns}</p>
              <p className="text-sm text-muted-foreground">Campanhas ativas e concluídas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Receita Total</CardTitle>
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${totalRevenue.toLocaleString('en-US')}</p>
              <p className="text-sm text-muted-foreground">Receita acumulada</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Taxa de Conversão Média</CardTitle>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{averageConversionRate}%</p>
              <p className="text-sm text-muted-foreground">Média das campanhas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Receita por Campanha</CardTitle>
              <p className="text-sm text-muted-foreground">
                Receita gerada por campanha nos últimos 6 meses
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={campaigns.flatMap((campaign) =>
                    campaign.revenueData.map((data) => ({
                      month: data.month,
                      [campaign.name]: data.revenue || 0,
                    }))
                  ).reduce((acc, curr) => {
                    const existing = acc.find((item) => item.month === curr.month)
                    if (existing) {
                      Object.assign(existing, curr)
                    } else {
                      acc.push(curr)
                    }
                    return acc
                  }, [])}
                  margin={{ left: 12, right: 12 }}
                  height={300}
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
                    {campaigns.map((campaign, index) => (
                      <linearGradient
                        key={campaign.name}
                        id={`fillRevenue${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartConfig.revenue.color}
                          stopOpacity={0.8 - index * 0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartConfig.revenue.color}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  {campaigns.map((campaign, index) => (
                    <Area
                      key={campaign.name}
                      dataKey={campaign.name}
                      type="natural"
                      fill={`url(#fillRevenue${index})`}
                      fillOpacity={0.4}
                      stroke={chartConfig.revenue.color}
                      stackId="a"
                    />
                  ))}
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Conversion Rate Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Taxa de Conversão por Campanha</CardTitle>
              <p className="text-sm text-muted-foreground">
                Taxa de conversão por campanha nos últimos 6 meses
              </p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={campaigns.flatMap((campaign) =>
                    campaign.conversionData.map((data) => ({
                      month: data.month,
                      [campaign.name]: data.conversion || 0,
                    }))
                  ).reduce((acc, curr) => {
                    const existing = acc.find((item) => item.month === curr.month)
                    if (existing) {
                      Object.assign(existing, curr)
                    } else {
                      acc.push(curr)
                    }
                    return acc
                  }, [])}
                  margin={{ left: 12, right: 12 }}
                  height={300}
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
                    {campaigns.map((campaign, index) => (
                      <linearGradient
                        key={campaign.name}
                        id={`fillConversion${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartConfig.conversion.color}
                          stopOpacity={0.8 - index * 0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartConfig.conversion.color}
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  {campaigns.map((campaign, index) => (
                    <Area
                      key={campaign.name}
                      dataKey={campaign.name}
                      type="natural"
                      fill={`url(#fillConversion${index})`}
                      fillOpacity={0.4}
                      stroke={chartConfig.conversion.color}
                      stackId="a"
                    />
                  ))}
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Nossas Campanhas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Início</TableHead>
                  <TableHead>Receita</TableHead>
                  <TableHead>Taxa de Conversão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign, index) => (
                  <TableRow key={`campaign-${index}`}>
                    <TableCell>{campaign.name}</TableCell>
                    <TableCell>{campaign.startDate}</TableCell>
                    <TableCell>${(campaign.revenue || 0).toLocaleString('en-US')}</TableCell>
                    <TableCell>{(campaign.conversionRate || 0).toFixed(1)}%</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                          campaign.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        )}
                      >
                        {campaign.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Ver Detalhes
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