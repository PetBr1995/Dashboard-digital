import { NextResponse } from 'next/server';

const campaigns = [
  {
    name: 'Lançamento Produto A',
    startDate: '2025-01-15',
    revenue: 25000,
    conversionRate: 5.2,
    status: 'Active',
    revenueData: [
      { month: 'Jan', revenue: 3000 },
      { month: 'Feb', revenue: 5000 },
      { month: 'Mar', revenue: 4500 },
      { month: 'Apr', revenue: 6000 },
      { month: 'May', revenue: 5500 },
      { month: 'Jun', revenue: 7000 },
    ],
    conversionData: [
      { month: 'Jan', conversion: 4.0 },
      { month: 'Feb', conversion: 5.0 },
      { month: 'Mar', conversion: 4.8 },
      { month: 'Apr', conversion: 5.5 },
      { month: 'May', conversion: 5.3 },
      { month: 'Jun', conversion: 6.0 },
    ],
  },
  {
    name: 'Campanha Black Friday',
    startDate: '2024-11-25',
    revenue: 40000,
    conversionRate: 7.8,
    status: 'Completed',
    revenueData: [
      { month: 'Jan', revenue: 0 },
      { month: 'Feb', revenue: 0 },
      { month: 'Mar', revenue: 0 },
      { month: 'Apr', revenue: 0 },
      { month: 'May', revenue: 0 },
      { month: 'Jun', revenue: 40000 },
    ],
    conversionData: [
      { month: 'Jan', conversion: 0 },
      { month: 'Feb', conversion: 0 },
      { month: 'Mar', conversion: 0 },
      { month: 'Apr', conversion: 0 },
      { month: 'May', conversion: 0 },
      { month: 'Jun', conversion: 7.8 },
    ],
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  let filteredCampaigns = [...campaigns];

  if (query) {
    filteredCampaigns = campaigns.filter(campaign =>
      campaign.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  return NextResponse.json(filteredCampaigns);
}