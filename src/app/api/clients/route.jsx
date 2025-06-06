import { NextResponse } from 'next/server';

const clients = [
  { id: 1, name: 'João Silva', email: 'joao@example.com', status: 'Ativo', sales: 150000, realGrowth: 12.5, predictedGrowth: 15.0, lastCampaign: '2025-05-20' },
  { id: 2, name: 'Maria Oliveira', email: 'maria@example.com', status: 'Inativo', sales: 80000, realGrowth: -2.3, predictedGrowth: 5.0, lastCampaign: '2025-04-10' },
  { id: 3, name: 'Pedro Santos', email: 'pedro@example.com', status: 'Prospecção', sales: 20000, realGrowth: 8.0, predictedGrowth: 10.0, lastCampaign: '2025-06-01' },
  { id: 4, name: 'Peterson Brito', email: 'peterson@example.com', status: 'Ativo', sales: 350000, realGrowth: 15.0, predictedGrowth: 5.0, lastCampaign: '2025-05-05' },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  let filteredClients = [...clients];

  if (query) {
    filteredClients = clients.filter(client =>
      client.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  return NextResponse.json(filteredClients);
}