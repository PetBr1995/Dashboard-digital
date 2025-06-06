'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function ClienteDetalhes() {
  const { id } = useParams()
  const router = useRouter()
  const [client, setClient] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${id}`)
        if (!res.ok) throw new Error('Erro ao carregar cliente')
        const data = await res.json()
        setClient(data)
      } catch (err) {
        setError('Não foi possível carregar os dados do cliente.')
      }
    }
    fetchClient()
  }, [id])

  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!client) return <div className="p-6">Carregando...</div>

  const chartData = [
    { name: 'Crescimento Real', value: client.realGrowth },
    { name: 'Crescimento Previsto', value: client.predictedGrowth },
  ]

  return (
    <div className="min-h-screen p-6 bg-white md:ml-14">
      <Button onClick={() => router.back()} variant="outline" className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes de {client.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Status:</strong> {client.status}</p>
          <p><strong>Vendas:</strong> R$ {client.sales.toLocaleString('pt-BR')}</p>
          <p><strong>Última campanha:</strong> {client.lastCampaign}</p>

          <div className="mt-6 h-64">
            <h3 className="font-semibold mb-2">Gráfico de Crescimento</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
