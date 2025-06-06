import { NextResponse } from 'next/server';

const members = [
  { id: 1, name: 'Ana Ribeiro', role: 'Gerente de Projetos', email: 'ana@company.com', status: 'Active' },
  { id: 2, name: 'Carlos Mendes', role: 'Desenvolvedor Full Stack', email: 'carlos@company.com', status: 'Active' },
  { id: 3, name: 'Beatriz Lima', role: 'Designer UX/UI', email: 'beatriz@company.com', status: 'Inactive' },
  { id: 4, name: 'Eduardo Silva', role: 'Analista de Dados', email: 'eduardo@company.com', status: 'Active' },
  { id: 5, name: 'Fernanda Costa', role: 'Especialista em Marketing', email: 'fernanda@company.com', status: 'Active' },
  { id: 6, name: 'Gabriel Oliveira', role: 'Engenheiro de Software', email: 'gabriel@company.com', status: 'Active' },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const id = searchParams.get('id');

  let filteredMembers = [...members];

  if (id) {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const member = members.find((m) => m.id === parsedId);
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(member);
  }

  if (query) {
    filteredMembers = members.filter(member =>
      member.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  return NextResponse.json(filteredMembers);
}