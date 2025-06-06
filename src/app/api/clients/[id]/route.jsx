import { NextResponse } from 'next/server'

// Simulação de base de dados
const clients = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    status: 'Ativo',
    sales: 10000,
    lastCampaign: 'Maio/2024',
    realGrowth: 8,
    predictedGrowth: 10,
  },
  {
    id: 2,
    name: 'Maria Souza',
    email: 'maria@email.com',
    status: 'Inativo',
    sales: 7500,
    lastCampaign: 'Março/2024',
    realGrowth: 5,
    predictedGrowth: 9,
  },
  {
    id: 3,
    name: 'Pedro Santos',
    email: 'pedro@example.com',
    status: 'Prospecção',
    sales: 20000,
    realGrowth: 8.0,
    predictedGrowth: 10.0,
    lastCampaign: '2025-06-01',
  },
  {
    id: 4,
    name: 'Peterson Brito',
    email: 'peterson@example.com',
    status: 'Ativo',
    sales: 350000,
    realGrowth: 15.0,
    predictedGrowth: 5.0,
    lastCampaign: '2025-05-05',
  },
  // ... outros clientes
]

export async function GET(request, { params }) {
  const id = Number(params.id)

  const client = clients.find((c) => c.id === id)

  if (!client) {
    return NextResponse.json(
      { error: 'Cliente não encontrado' },
      { status: 404 }
    )
  }

  return NextResponse.json(client)
}
